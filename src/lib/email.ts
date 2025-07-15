import sgMail from '@sendgrid/mail'

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