import sgMail from '@sendgrid/mail'

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, email not sent')
    return
  }

  const msg = {
    to,
    from: from || process.env.SENDGRID_FROM_EMAIL || 'noreply@southpole.com',
    subject,
    html,
  }

  try {
    await sgMail.send(msg)
    // Debug log removed for production
  } catch (error) {
    logError('SendGrid error:', error)
    throw error
  }
}