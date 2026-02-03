import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get available booking slots for a specific date or multiple days
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); // Format: YYYY-MM-DD (optional)
  const days = parseInt(searchParams.get('days') || '7'); // Number of days to look ahead
  const advisorId = searchParams.get('advisorId'); // Optional specific advisor

  try {
    // Get advisor availability settings
    let advisorData;
    if (advisorId) {
      const { data, error } = await supabase
        .from('advisors')
        .select('id, working_hours, working_days, blocked_slots')
        .eq('id', advisorId)
        .single();

      if (!error) advisorData = data;
    } else {
      // Get first active advisor as default
      const { data, error } = await supabase
        .from('advisors')
        .select('id, working_hours, working_days, blocked_slots')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!error) advisorData = data;
    }

    // Default availability if no advisor data found
    const workingHours = advisorData?.working_hours || { start: '09:00', end: '17:00' };
    const workingDays = advisorData?.working_days || [1, 2, 3, 4, 5]; // Mon-Fri default
    const blockedSlots = advisorData?.blocked_slots || [];

    // If single date requested, return slots for that day
    if (date) {
      const dateObj = new Date(`${date}T00:00:00`);
      const dayOfWeek = dateObj.getDay();

      // Check if working day
      if (!workingDays.includes(dayOfWeek)) {
        return NextResponse.json({
          success: true,
          date,
          slots: [],
          message: 'Not a working day'
        });
      }

      // Get blocked times for this date
      const blockedEntry = blockedSlots.find(s => s.date === date);
      const blockedTimes = blockedEntry?.slots || [];

      // Get existing appointments
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      const { data: appointments } = await supabase
        .from('leads')
        .select('scheduled_at')
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
        .not('scheduled_at', 'is', null);

      // Generate time slots
      const [startHour] = workingHours.start.split(':').map(Number);
      const [endHour] = workingHours.end.split(':').map(Number);
      const timeSlots = [];

      for (let hour = startHour; hour < endHour; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const slotDateTime = new Date(`${date}T${time}:00`);

        // Skip blocked times
        if (blockedTimes.includes(time)) continue;

        // Check if taken
        const isTaken = appointments?.some(apt => {
          const aptTime = new Date(apt.scheduled_at);
          return aptTime.getHours() === hour;
        });

        // Don't show past slots for today
        const isPast = slotDateTime < new Date();
        if (isPast) continue;

        timeSlots.push({
          time,
          display: formatTime(hour, 0),
          available: !isTaken,
          datetime: slotDateTime.toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        date,
        slots: timeSlots,
        advisorId: advisorData?.id
      });
    }

    // Return multiple days of availability
    const availableSlots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all existing appointments for the date range
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    const { data: allAppointments } = await supabase
      .from('leads')
      .select('scheduled_at')
      .gte('scheduled_at', today.toISOString())
      .lte('scheduled_at', endDate.toISOString())
      .not('scheduled_at', 'is', null);

    for (let dayOffset = 0; dayOffset < days; dayOffset++) {
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() + dayOffset);

      const dayOfWeek = dateObj.getDay();
      if (!workingDays.includes(dayOfWeek)) continue;

      const dateStr = dateObj.toISOString().split('T')[0];
      const blockedEntry = blockedSlots.find(s => s.date === dateStr);
      const blockedTimes = blockedEntry?.slots || [];

      const [startHour] = workingHours.start.split(':').map(Number);
      const [endHour] = workingHours.end.split(':').map(Number);
      const daySlots = [];

      for (let hour = startHour; hour < endHour; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;

        if (blockedTimes.includes(timeStr)) continue;

        const slotDateTime = new Date(dateObj);
        slotDateTime.setHours(hour, 0, 0, 0);

        // Skip past times for today
        if (dayOffset === 0 && slotDateTime <= new Date()) continue;

        const isBooked = allAppointments?.some(apt => {
          const aptTime = new Date(apt.scheduled_at);
          return aptTime.getTime() === slotDateTime.getTime();
        });

        if (isBooked) continue;

        daySlots.push({
          time: timeStr,
          datetime: slotDateTime.toISOString(),
          display: formatTime(hour, 0)
        });
      }

      if (daySlots.length > 0) {
        availableSlots.push({
          date: dateStr,
          dayName: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
          displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isToday: dayOffset === 0,
          isTomorrow: dayOffset === 1,
          slots: daySlots
        });
      }
    }

    return NextResponse.json({
      success: true,
      advisorId: advisorData?.id,
      workingHours,
      workingDays,
      availableSlots
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
