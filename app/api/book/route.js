import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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
      message
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
      notes: verified && crdNumber ? `Verified RIA - CRD #${crdNumber}` : null
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
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
