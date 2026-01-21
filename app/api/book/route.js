import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Determine lead source from UTM params
function determineSource(utmSource, utmMedium) {
  if (!utmSource) return 'direct';

  const src = utmSource.toLowerCase();
  const med = (utmMedium || '').toLowerCase();

  if (src.includes('facebook') || src.includes('fb') || src.includes('instagram') || src.includes('meta')) {
    return 'facebook';
  }
  if (src.includes('google') || src.includes('bing') || med.includes('cpc') || med.includes('ppc')) {
    return 'ppc';
  }
  if (src.includes('organic') || med.includes('organic')) {
    return 'organic';
  }
  return 'direct';
}

// Round-robin assignment
async function assignToNextAdvisor(supabase, leadId) {
  try {
    // Get current round-robin state
    const { data: state } = await supabase
      .from('round_robin_state')
      .select('last_advisor_id')
      .eq('id', 1)
      .single();

    // Get active advisors ordered by ID
    const { data: advisors } = await supabase
      .from('advisors')
      .select('id')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (!advisors || advisors.length === 0) {
      console.log('No active advisors for round-robin');
      return null;
    }

    // Find next advisor in rotation
    let nextAdvisorId;
    if (!state?.last_advisor_id) {
      nextAdvisorId = advisors[0].id;
    } else {
      const lastIndex = advisors.findIndex(a => a.id === state.last_advisor_id);
      const nextIndex = (lastIndex + 1) % advisors.length;
      nextAdvisorId = advisors[nextIndex].id;
    }

    // Update lead with assigned advisor
    await supabase
      .from('advisor_leads')
      .update({ assigned_advisor_id: nextAdvisorId })
      .eq('id', leadId);

    // Update round-robin state
    await supabase
      .from('round_robin_state')
      .upsert({ id: 1, last_advisor_id: nextAdvisorId, updated_at: new Date().toISOString() });

    // Increment advisor's lead count
    await supabase.rpc('increment_advisor_leads', { advisor_id: nextAdvisorId }).catch(() => {
      // If RPC doesn't exist, do it manually
      supabase
        .from('advisors')
        .update({
          leads_assigned_count: supabase.raw('leads_assigned_count + 1'),
          last_assigned_at: new Date().toISOString()
        })
        .eq('id', nextAdvisorId);
    });

    console.log('Assigned lead to advisor:', nextAdvisorId);
    return nextAdvisorId;
  } catch (err) {
    console.error('Round-robin assignment error:', err);
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received booking data:', JSON.stringify(body, null, 2));

    const {
      // Basic info
      name,
      email,
      phone,
      zipCode,
      // Advisor flow fields
      firmName,
      crdNumber,
      verified,
      leadsPerMonth,
      scheduledAt,
      message,
      // Consumer match flow fields
      income,
      retireTimeline,
      ownsHome,
      ownsBusiness,
      portfolioSize,
      hasAdvisor,
      localPreference,
      matchedAdvisorId,
      // Tracking
      utmSource,
      utmMedium,
      utmCampaign,
      source: providedSource
    } = body;

    // Validate required fields
    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      );
    }

    // Use name or fallback
    const leadName = name || 'Unknown';

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Determine lead source
    const source = providedSource || determineSource(utmSource, utmMedium);

    // Build notes from consumer flow data
    let notesArray = [];
    if (verified && crdNumber) notesArray.push(`Verified RIA - CRD #${crdNumber}`);
    if (income) notesArray.push(`Income: ${income}`);
    if (retireTimeline) notesArray.push(`Retire timeline: ${retireTimeline}`);
    if (ownsHome) notesArray.push(`Owns home: ${ownsHome}`);
    if (ownsBusiness) notesArray.push(`Owns business: ${ownsBusiness}`);
    if (portfolioSize) notesArray.push(`Portfolio: ${portfolioSize}`);
    if (hasAdvisor) notesArray.push(`Has advisor: ${hasAdvisor}`);
    if (localPreference) notesArray.push(`Local pref: ${localPreference}`);
    if (zipCode) notesArray.push(`ZIP: ${zipCode}`);

    // Build insert data
    const insertData = {
      name: leadName,
      email,
      phone,
      company: firmName || null,
      leads_per_month: leadsPerMonth || null,
      scheduled_at: scheduledAt || null,
      message: message || null,
      status: scheduledAt ? 'scheduled' : 'new',
      notes: notesArray.length > 0 ? notesArray.join(' | ') : null,
      source,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      // If matched to a specific advisor, assign directly
      assigned_advisor_id: matchedAdvisorId || null
    };

    console.log('Inserting data:', JSON.stringify(insertData, null, 2));

    // Insert into database
    const { data, error } = await supabase
      .from('advisor_leads')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Insert successful:', data);

    // If no matched advisor, use round-robin assignment
    if (data && data[0] && !matchedAdvisorId) {
      await assignToNextAdvisor(supabase, data[0].id);
    } else if (matchedAdvisorId) {
      // Increment lead count for matched advisor
      const { data: advisor } = await supabase
        .from('advisors')
        .select('leads_assigned_count')
        .eq('id', matchedAdvisorId)
        .single();

      if (advisor) {
        await supabase
          .from('advisors')
          .update({
            leads_assigned_count: (advisor.leads_assigned_count || 0) + 1,
            last_assigned_at: new Date().toISOString()
          })
          .eq('id', matchedAdvisorId);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
