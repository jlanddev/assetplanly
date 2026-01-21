import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Convert portfolio size string to number for comparison
function parseAssetValue(value) {
  const mapping = {
    'under-100k': 50000,
    '100k-250k': 175000,
    '250k-500k': 375000,
    '500k-1m': 750000,
    '1m-5m': 3000000,
    '5m+': 10000000
  };
  return mapping[value] || 0;
}

// Convert age range to number
function parseAge(value) {
  const mapping = {
    '18-34': 26,
    '35-44': 40,
    '45-54': 50,
    '55-64': 60,
    '65+': 70
  };
  return mapping[value] || 40;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      income,
      retireTimeline,
      ownsHome,
      ownsBusiness,
      portfolioSize,
      hasAdvisor,
      localPreference,
      zipCode,
      goals,
      age,
      state
    } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all active advisors with their targeting criteria
    const { data: advisors, error } = await supabase
      .from('advisors')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching advisors:', error);
      return NextResponse.json({ advisor: null });
    }

    if (!advisors || advisors.length === 0) {
      return NextResponse.json({ advisor: null });
    }

    // Parse lead's values
    const leadAssets = parseAssetValue(portfolioSize);
    const leadAge = age ? parseAge(age) : 50;

    // Score each advisor based on match criteria
    const scoredAdvisors = advisors.map(advisor => {
      let score = 0;

      // Asset range match
      if (advisor.min_assets || advisor.max_assets) {
        const minAssets = advisor.min_assets ? parseInt(advisor.min_assets) : 0;
        const maxAssets = advisor.max_assets ? parseInt(advisor.max_assets) : Infinity;
        if (leadAssets >= minAssets && leadAssets <= maxAssets) {
          score += 30;
        }
      } else {
        score += 15; // No restriction, partial match
      }

      // Age range match
      if (advisor.min_age || advisor.max_age) {
        const minAge = advisor.min_age ? parseInt(advisor.min_age) : 0;
        const maxAge = advisor.max_age ? parseInt(advisor.max_age) : 100;
        if (leadAge >= minAge && leadAge <= maxAge) {
          score += 20;
        }
      } else {
        score += 10; // No restriction, partial match
      }

      // State match
      if (state && advisor.target_states && advisor.target_states.length > 0) {
        if (advisor.target_states.includes(state)) {
          score += 25;
        }
      } else {
        score += 12; // No state restriction
      }

      // Goals match
      if (goals && goals.length > 0 && advisor.target_goals && advisor.target_goals.length > 0) {
        const matchingGoals = goals.filter(g => advisor.target_goals.includes(g));
        score += matchingGoals.length * 5;
      } else {
        score += 10; // No goals restriction
      }

      // Prefer advisors with complete profiles (branding)
      if (advisor.logo_url) score += 5;
      if (advisor.photo_url) score += 5;
      if (advisor.bio) score += 3;

      // Factor in current lead load (prefer advisors with fewer leads)
      const leadCount = advisor.leads_assigned_count || 0;
      score -= Math.min(leadCount, 20); // Subtract up to 20 points based on lead count

      return { advisor, score };
    });

    // Sort by score (highest first)
    scoredAdvisors.sort((a, b) => b.score - a.score);

    // Get the best match
    const bestMatch = scoredAdvisors[0]?.advisor;

    if (bestMatch) {
      // Return advisor info (without sensitive data)
      const { password_hash, ...safeAdvisor } = bestMatch;
      return NextResponse.json({ advisor: safeAdvisor });
    }

    return NextResponse.json({ advisor: null });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ advisor: null });
  }
}
