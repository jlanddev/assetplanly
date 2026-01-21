// Script to set up Leon Financial Services branding
// Run this with: node scripts/setup-leon-branding.js

const SUPABASE_URL = 'https://aocymicygxsoncuajwhu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvY3ltaWN5Z3hzb25jdWFqd2h1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0NDcyNCwiZXhwIjoyMDgzODIwNzI0fQ.ASpDov2tR4a1oLHjESGswPBU8_3tKgWaAvxbBdI9PYA';

async function makeRequest(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'PATCH' ? 'return=representation' : 'return=minimal',
      ...options.headers
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// First run this SQL in Supabase to add the branding columns:
/*
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#1e3a5f';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#f97316';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS min_age INTEGER;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS max_age INTEGER;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS min_assets TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS max_assets TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS target_states JSONB DEFAULT '[]';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS target_goals JSONB DEFAULT '[]';
*/

const LEON_BRANDING = {
  firm_name: 'Leon Financial Services',
  // Only include fields that exist in database for now
  // After running the SQL above, uncomment all fields:
  // bio: 'Whether you\'re an early investor or a seasoned wealth-builder...',
  // primary_color: '#6B5B4F',
  // secondary_color: '#A0522D',
  // min_assets: '100000',
  // target_goals: ['Retirement Planning', 'Investment Management', 'Estate Planning', 'Wealth Building'],
  // target_states: []
};

async function setupLeonBranding() {
  console.log('Looking for Leon Financial advisor...');

  try {
    // Find Leon Financial advisor (search by name or firm)
    const advisors = await makeRequest('advisors?select=*&or=(name.ilike.%25leon%25,firm_name.ilike.%25leon%25,email.ilike.%25leon%25)');

    if (!advisors || advisors.length === 0) {
      console.log('No Leon Financial advisor found. Listing all advisors...');
      const allAdvisors = await makeRequest('advisors?select=id,name,email,firm_name&limit=10');
      console.log('Available advisors:', allAdvisors);
      console.log('\nTo update a specific advisor, modify this script with their ID');
      return;
    }

    const leonAdvisor = advisors[0];
    console.log('Found advisor:', leonAdvisor.name, '(ID:', leonAdvisor.id, ')');

    // Update with branding
    const updated = await makeRequest(`advisors?id=eq.${leonAdvisor.id}`, {
      method: 'PATCH',
      body: JSON.stringify(LEON_BRANDING)
    });

    console.log('Successfully updated Leon Financial branding!');
    console.log('Updated fields:', Object.keys(LEON_BRANDING).join(', '));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupLeonBranding();
