import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendAdvisorWelcome } from '../../../lib/postmark';

// Simple password hashing (for production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('advisors')
      .select('*')
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
    const { name, email, phone, firmName, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('advisors')
      .insert([{
        name,
        email,
        phone: phone || null,
        firm_name: firmName || null,
        password_hash: hashPassword(password),
        is_active: true,
        leads_assigned_count: 0
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send welcome email (don't block on failure)
    const firstName = name.split(' ')[0];
    sendAdvisorWelcome({ email, firstName }).catch(err =>
      console.error('Welcome email failed:', err)
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, firmName, password, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (firmName !== undefined) updates.firm_name = firmName;
    if (password) updates.password_hash = hashPassword(password);
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('advisors')
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
