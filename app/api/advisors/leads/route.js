import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('advisorId');

    if (!advisorId) {
      return NextResponse.json(
        { error: 'Advisor ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('advisor_leads')
      .select('*')
      .eq('assigned_advisor_id', advisorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, advisorId, status, is_qualified, advisor_notes, campaign_id } = body;

    if (!id || !advisorId) {
      return NextResponse.json(
        { error: 'ID and advisor ID are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the lead is assigned to this advisor
    const { data: lead } = await supabase
      .from('advisor_leads')
      .select('assigned_advisor_id')
      .eq('id', id)
      .single();

    if (!lead || lead.assigned_advisor_id !== advisorId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this lead' },
        { status: 403 }
      );
    }

    // Build update object with only provided fields
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (is_qualified !== undefined) updates.is_qualified = is_qualified;
    if (advisor_notes !== undefined) updates.advisor_notes = advisor_notes;
    if (campaign_id !== undefined) updates.campaign_id = campaign_id;

    // Update the lead
    const { data, error } = await supabase
      .from('advisor_leads')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
