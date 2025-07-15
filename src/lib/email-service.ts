/**
 * Email Service
 * 
 * Handles email sending using SendGrid
 */

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: {
    email: string;
    name: string;
  };
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
  }>;
}

export interface EmailTemplate {
  templateId: string;
  dynamicTemplateData: Record<string, any>;
}

// Email templates
export const EMAIL_TEMPLATES = {
  CONTACT_NOTIFICATION: 'contact-notification',
  NEWSLETTER_WELCOME: 'newsletter-welcome',
  DOWNLOAD_CONFIRMATION: 'download-confirmation',
  CONTACT_CONFIRMATION: 'contact-confirmation',
} as const;

// Environment configuration
const getEmailConfig = () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@southpole.com',
  fromName: process.env.SENDGRID_FROM_NAME || 'South Pole',
  contactEmail: process.env.CONTACT_EMAIL || 'contact@southpole.com',
  newsletterEmail: process.env.NEWSLETTER_EMAIL || 'newsletter@southpole.com',
  downloadEmail: process.env.DOWNLOAD_EMAIL || 'downloads@southpole.com',
});

/**
 * Send email using SendGrid
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  const config = getEmailConfig();
  
  // If no API key is configured, log to console (development mode)
  if (!config.apiKey) {
    // Debug log removed for production
    return true;
  }

  try {
    // Dynamically import SendGrid to avoid issues if not installed
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(config.apiKey);

    const message = {
      to: emailData.to,
      from: emailData.from || { email: config.fromEmail, name: config.fromName },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
      attachments: emailData.attachments,
    };

    await sgMail.default.send(message);
    // Debug log removed for production
    return true;
  } catch (error) {
    logError('❌ Failed to send email:', error);
    return false;
  }
}

/**
 * Send email using template
 */
export async function sendTemplateEmail(
  to: string | string[],
  templateData: EmailTemplate & { subject: string }
): Promise<boolean> {
  const config = getEmailConfig();
  
  if (!config.apiKey) {
    // Debug log removed for production
    return true;
  }

  try {
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(config.apiKey);

    const message = {
      to,
      from: { email: config.fromEmail, name: config.fromName },
      subject: templateData.subject,
      templateId: templateData.templateId,
      dynamicTemplateData: templateData.dynamicTemplateData,
    };

    await sgMail.default.send(message);
    // Debug log removed for production
    return true;
  } catch (error) {
    logError('❌ Failed to send template email:', error);
    return false;
  }
}

/**
 * Generate contact notification email HTML
 */
export function generateContactNotificationHTML(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  position?: string;
  phone?: string;
  country: string;
  inquiryType: string;
  message: string;
  subscribeNewsletter: boolean;
  submissionId: string;
  timestamp: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #002145; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #002145; }
    .value { margin-top: 5px; padding: 8px; background: white; border-left: 3px solid #00875A; }
    .message-box { background: white; padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #ddd; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    .badge { display: inline-block; background: #00875A; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📧 New Contact Form Submission</h1>
    <p>South Pole Website</p>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="label">👤 Contact Information</div>
      <div class="value">
        <strong>${data.firstName} ${data.lastName}</strong><br>
        📧 <a href="mailto:${data.email}">${data.email}</a><br>
        ${data.phone ? `📞 ${data.phone}<br>` : ''}
        🏢 ${data.company || 'Not specified'}<br>
        ${data.position ? `💼 ${data.position}<br>` : ''}
        🌍 ${data.country}
      </div>
    </div>

    <div class="field">
      <div class="label">📝 Inquiry Details</div>
      <div class="value">
        <strong>Type:</strong> <span class="badge">${data.inquiryType}</span><br>
        <strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}
      </div>
    </div>

    <div class="field">
      <div class="label">💬 Message</div>
      <div class="message-box">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
    </div>

    <div class="field">
      <div class="label">📬 Newsletter Subscription</div>
      <div class="value">
        ${data.subscribeNewsletter ? 
          '✅ Customer opted in for newsletter subscription' : 
          '❌ Customer did not opt in for newsletter'
        }
      </div>
    </div>

    <div class="footer">
      <strong>Submission ID:</strong> ${data.submissionId}<br>
      <strong>Timestamp:</strong> ${data.timestamp}<br>
      <em>This email was automatically generated by the South Pole website contact form.</em>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate contact confirmation email HTML
 */
export function generateContactConfirmationHTML(data: {
  firstName: string;
  inquiryType: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Thank you for contacting South Pole</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #002145; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .cta { background: #00875A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌍 Thank You for Contacting South Pole</h1>
    <p>We've received your inquiry and will respond soon</p>
  </div>
  
  <div class="content">
    <p>Dear ${data.firstName},</p>
    
    <p>Thank you for your interest in South Pole's climate solutions. We have successfully received your inquiry regarding <strong>${data.inquiryType}</strong>.</p>
    
    <p>Our team of climate experts will review your message and respond within 24-48 hours during business days. We're committed to helping organizations like yours achieve their sustainability goals.</p>
    
    <p>In the meantime, feel free to explore our resources:</p>
    
    <a href="https://southpole.com/services" class="cta">Explore Our Services</a>
    
    <p>If you have any urgent questions, please don't hesitate to reach out to us directly at <a href="mailto:contact@southpole.com">contact@southpole.com</a>.</p>
    
    <p>Best regards,<br>
    <strong>The South Pole Team</strong></p>
    
    <div class="footer">
      <p><strong>South Pole</strong><br>
      Leading provider of climate solutions<br>
      <a href="https://southpole.com">southpole.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Contact notification email
 */
export async function sendContactNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  position?: string;
  phone?: string;
  country: string;
  inquiryType: string;
  message: string;
  subscribeNewsletter: boolean;
  submissionId: string;
}): Promise<boolean> {
  const config = getEmailConfig();
  const timestamp = new Date().toISOString();
  
  const html = generateContactNotificationHTML({
    ...data,
    timestamp,
  });

  return sendEmail({
    to: config.contactEmail,
    subject: `New Contact Form Submission - ${data.inquiryType}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Contact confirmation email
 */
export async function sendContactConfirmation(data: {
  email: string;
  firstName: string;
  inquiryType: string;
}): Promise<boolean> {
  const html = generateContactConfirmationHTML(data);

  return sendEmail({
    to: data.email,
    subject: 'Thank you for contacting South Pole',
    html,
  });
}

/**
 * Newsletter welcome email
 */
export async function sendNewsletterWelcome(data: {
  email: string;
  firstName?: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to South Pole Newsletter</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #002145; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .cta { background: #00875A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌍 Welcome to South Pole</h1>
    <p>Stay updated on climate solutions and sustainability insights</p>
  </div>
  
  <div class="content">
    <p>Dear ${data.firstName || 'Valued Subscriber'},</p>
    
    <p>Welcome to the South Pole newsletter! You'll now receive regular updates on:</p>
    
    <ul>
      <li>Latest climate solutions and innovations</li>
      <li>Sustainability insights and best practices</li>
      <li>Carbon market trends and opportunities</li>
      <li>Success stories from our global projects</li>
    </ul>
    
    <a href="https://southpole.com" class="cta">Explore South Pole</a>
    
    <p>Thank you for joining our community of climate action leaders.</p>
    
    <p>Best regards,<br>
    <strong>The South Pole Team</strong></p>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: data.email,
    subject: 'Welcome to South Pole Newsletter',
    html,
  });
}

/**
 * Send newsletter confirmation email
 */
export async function sendConfirmationEmail(data: { email: string; firstName?: string; preferences?: string[] }, confirmationToken: string): Promise<boolean> {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/confirm?token=${confirmationToken}`;
  
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>确认您的Newsletter订阅</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { color: #002145; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .title { color: #002145; font-size: 28px; margin: 0 0 10px 0; }
    .subtitle { color: #666; font-size: 16px; margin: 0; }
    .content { margin: 30px 0; }
    .button { display: inline-block; background: #002145; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .button:hover { background: #003366; }
    .preferences { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
    .link { color: #002145; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌍 South Pole</div>
      <h1 class="title">确认您的Newsletter订阅</h1>
      <p class="subtitle">感谢您订阅South Pole Newsletter！</p>
    </div>
    
    <div class="content">
      ${data.firstName ? `<p>您好 ${data.firstName}，</p>` : '<p>您好，</p>'}
      
      <p>感谢您订阅我们的Newsletter。为了确保您能收到我们的最新资讯，请点击下面的按钮确认您的订阅：</p>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="button">确认订阅</a>
      </div>
      
      <p>或者，您也可以复制以下链接到浏览器中打开：</p>
      <p class="link">${confirmationUrl}</p>
      
      ${data.preferences && data.preferences.length > 0 ? `
        <div class="preferences">
          <strong>您选择的订阅内容：</strong>
          <ul>
            ${data.preferences.map(pref => {
              const labels: Record<string, string> = {
                'climate-news': '气候新闻',
                'industry-insights': '行业洞察',
                'product-updates': '产品更新',
                'events': '活动邀请',
                'research': '研究报告'
              };
              return `<li>${labels[pref] || pref}</li>`;
            }).join('')}
          </ul>
        </div>
      ` : ''}
      
      <p>确认订阅后，您将开始收到我们精选的气候解决方案和行业洞察资讯。</p>
    </div>
    
    <div class="footer">
      <p>如果您没有订阅我们的Newsletter，请忽略此邮件。</p>
      <p>
        <strong>South Pole</strong> - 专业的碳中和解决方案提供商<br>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #666;">取消订阅</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: data.email,
    subject: '确认您的Newsletter订阅 - South Pole',
    html,
  });
}

const emailService = {
  sendEmail,
  sendTemplateEmail,
  sendContactNotification,
  sendContactConfirmation,
  sendNewsletterWelcome,
  sendConfirmationEmail,
};

export default emailService;