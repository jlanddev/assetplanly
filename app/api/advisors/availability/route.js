import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('advisorId');

    if (!advisorId) {
      return NextResponse.json({ error: 'Advisor ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('advisors')
      .select('working_hours, working_days, blocked_slots')
      .eq('id', advisorId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      working_hours: data?.working_hours || { start: '09:00', end: '17:00' },
      working_days: data?.working_days || [1, 2, 3, 4, 5],
      blocked_slots: data?.blocked_slots || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { advisorId, working_hours, working_days, blocked_slots } = body;

    if (!advisorId) {
      return NextResponse.json({ error: 'Advisor ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const updates = {};
    if (working_hours !== undefined) updates.working_hours = working_hours;
    if (working_days !== undefined) updates.working_days = working_days;
    if (blocked_slots !== undefined) updates.blocked_slots = blocked_slots;

    const { data, error } = await supabase
      .from('advisors')
      .update(updates)
      .eq('id', advisorId)
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

// Public endpoint to get available slots for booking (used by consumer form)
export async function OPTIONS(request) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
