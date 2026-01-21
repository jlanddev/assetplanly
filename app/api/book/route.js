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
      name,
      email,
      phone,
      firmName,
      crdNumber,
      verified,
      leadsPerMonth,
      scheduledAt,
      message,
      utmSource,
      utmMedium,
      utmCampaign
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

    // Determine lead source from UTM params
    const source = determineSource(utmSource, utmMedium);

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
      notes: verified && crdNumber ? `Verified RIA - CRD #${crdNumber}` : null,
      source,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null
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

    // Auto-assign to next advisor via round-robin
    if (data && data[0]) {
      await assignToNextAdvisor(supabase, data[0].id);
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
