import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { advisorId, currentPassword, newPassword } = body;

    if (!advisorId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get current advisor to verify password
    const { data: advisor, error: fetchError } = await supabase
      .from('advisors')
      .select('password_hash')
      .eq('id', advisorId)
      .single();

    if (fetchError || !advisor) {
      return NextResponse.json(
        { error: 'Advisor not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const currentHash = hashPassword(currentPassword);
    if (currentHash !== advisor.password_hash) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update to new password
    const newHash = hashPassword(newPassword);
    const { error: updateError } = await supabase
      .from('advisors')
      .update({ password_hash: newHash })
      .eq('id', advisorId);

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
