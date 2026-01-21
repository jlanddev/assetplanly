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
      .select('*')
      .eq('id', advisorId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove sensitive data
    const { password_hash, ...safeData } = data;
    return NextResponse.json(safeData);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const {
      advisorId,
      name,
      email,
      phone,
      firm_name,
      bio,
      logo_url,
      photo_url,
      video_url,
      primary_color,
      secondary_color,
      min_age,
      max_age,
      min_assets,
      max_assets,
      target_states,
      target_goals
    } = body;

    if (!advisorId) {
      return NextResponse.json({ error: 'Advisor ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Build update object with only provided fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (firm_name !== undefined) updates.firm_name = firm_name;
    if (bio !== undefined) updates.bio = bio;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (photo_url !== undefined) updates.photo_url = photo_url;
    if (video_url !== undefined) updates.video_url = video_url;
    if (primary_color !== undefined) updates.primary_color = primary_color;
    if (secondary_color !== undefined) updates.secondary_color = secondary_color;
    if (min_age !== undefined) updates.min_age = min_age || null;
    if (max_age !== undefined) updates.max_age = max_age || null;
    if (min_assets !== undefined) updates.min_assets = min_assets || null;
    if (max_assets !== undefined) updates.max_assets = max_assets || null;
    if (target_states !== undefined) updates.target_states = target_states;
    if (target_goals !== undefined) updates.target_goals = target_goals;

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
