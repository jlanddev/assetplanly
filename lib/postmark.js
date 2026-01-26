// Postmark email service for AssetPlanly

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const FROM_EMAIL = 'team@assetplanly.com';
const ADMIN_EMAIL = 'jordan@assetplanly.com';
const DASHBOARD_URL = 'https://assetplanly.com/admin';

async function sendEmail({ to, subject, textBody, htmlBody }) {
  if (!POSTMARK_API_TOKEN) {
    console.error('POSTMARK_API_TOKEN not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
      },
      body: JSON.stringify({
        From: FROM_EMAIL,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
        MessageStream: 'lead-notifications',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Postmark error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Email 1: Welcome email when advisor completes account signup
export async function sendAdvisorWelcome({ email, firstName }) {
  const loginLink = 'https://assetplanly.com/login';

  const textBody = `Hey ${firstName},

Your AssetPlanly account is live.

Log in here: ${loginLink}

Leads will hit your inbox based on your campaign settings. Make sure your profile is complete so we can serve you the highest quality leads.

Questions? Reply to this email.

- The AssetPlanly Team`;

  return sendEmail({
    to: email,
    subject: "You're in",
    textBody,
  });
}

// Email 2: Advisor lead notification when lead is assigned
export async function sendAdvisorLeadNotification({ advisorEmail, advisorFirstName, leadName, leadPhone, leadEmail }) {
  const dashboardLink = `${DASHBOARD_URL}/leads`;

  const textBody = `${advisorFirstName},

You've been assigned a new lead.

Name: ${leadName}
Phone: ${leadPhone}
Email: ${leadEmail}

Move fast - first call wins.

Log in to view full details: ${dashboardLink}`;

  return sendEmail({
    to: advisorEmail,
    subject: 'New lead assigned to you',
    textBody,
  });
}

// Email 3: Admin notification when any new lead comes in
export async function sendAdminLeadNotification({ leadName, leadPhone, leadEmail, advisorName, campaignName }) {
  const adminLink = `${DASHBOARD_URL}/leads`;

  const textBody = `New lead came in.

Name: ${leadName}
Phone: ${leadPhone}
Email: ${leadEmail}
Assigned to: ${advisorName || 'Unassigned'}
Campaign: ${campaignName || 'Consumer Flow'}

View in dashboard: ${adminLink}`;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New lead - ${leadName}`,
    textBody,
  });
}
