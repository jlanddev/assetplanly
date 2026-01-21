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
      .from('campaigns')
      .select('*')
      .eq('advisor_id', advisorId)
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { advisorId, name, description, budget } = body;

    if (!advisorId || !name) {
      return NextResponse.json(
        { error: 'Advisor ID and name are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        advisor_id: advisorId,
        name,
        description: description || null,
        budget: budget ? parseFloat(budget) : null,
        is_active: true
      }])
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

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, advisorId, name, description, budget, is_active } = body;

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

    // Verify the campaign belongs to this advisor
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('advisor_id')
      .eq('id', id)
      .single();

    if (!campaign || campaign.advisor_id !== advisorId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this campaign' },
        { status: 403 }
      );
    }

    // Build update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (budget !== undefined) updates.budget = budget ? parseFloat(budget) : null;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('campaigns')
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const advisorId = searchParams.get('advisorId');

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

    // Verify the campaign belongs to this advisor
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('advisor_id')
      .eq('id', id)
      .single();

    if (!campaign || campaign.advisor_id !== advisorId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this campaign' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
