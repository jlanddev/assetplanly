import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); // Format: YYYY-MM-DD

  try {
    // Get all scheduled appointments for the given date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const { data: appointments, error } = await supabase
      .from('advisor_leads')
      .select('scheduled_at')
      .gte('scheduled_at', startOfDay.toISOString())
      .lte('scheduled_at', endOfDay.toISOString())
      .not('scheduled_at', 'is', null);

    if (error) {
      console.error('Supabase error:', error);
    }

    // Define available time slots (9am - 5pm, 30-minute intervals)
    const timeSlots = [];
    const slotDuration = 30; // minutes

    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDateTime = new Date(`${date}T${time}:00`);

        // Check if this slot is taken
        const isTaken = appointments?.some(apt => {
          const aptTime = new Date(apt.scheduled_at);
          return Math.abs(aptTime.getTime() - slotDateTime.getTime()) < slotDuration * 60 * 1000;
        });

        // Don't show past time slots for today
        const now = new Date();
        const isPast = slotDateTime < now;

        if (!isPast) {
          timeSlots.push({
            time,
            display: formatTime(hour, minute),
            available: !isTaken,
            datetime: slotDateTime.toISOString()
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      date,
      slots: timeSlots
    });

  } catch (error) {
    console.error('Availability error:', error);
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}

function formatTime(hour, minute) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
}
