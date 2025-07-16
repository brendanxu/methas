/**
 * 邮件模板管理系统
 * 提供可定制的HTML邮件模板
 */

export interface EmailTemplateData {
  // 通用字段
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  
  // 联系表单特定字段
  inquiryType?: string
  message?: string
  submissionId?: string
  phone?: string
  country?: string
  position?: string
  
  // 系统字段
  timestamp?: string
  supportEmail?: string
  websiteUrl?: string
}

/**
 * 基础邮件模板布局
 */
export function createEmailTemplate(content: string, title: string = 'South Pole'): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background-color: #f4f4f4;
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background: white; 
      border-radius: 10px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #002145 0%, #004080 100%); 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      font-size: 24px; 
      margin-bottom: 8px; 
      font-weight: 600;
    }
    .header p { 
      font-size: 14px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 30px; 
    }
    .footer { 
      background: #f8f9fa; 
      padding: 20px; 
      text-align: center; 
      font-size: 12px; 
      color: #666; 
      border-top: 1px solid #e9ecef;
    }
    .field { 
      margin-bottom: 20px; 
    }
    .field-label { 
      font-weight: 600; 
      color: #002145; 
      margin-bottom: 8px; 
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field-value { 
      background: #f8f9fa; 
      padding: 12px 15px; 
      border-radius: 6px; 
      border-left: 4px solid #00A651; 
    }
    .message-box { 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      border: 1px solid #e9ecef; 
      margin-top: 10px;
      white-space: pre-wrap;
      font-size: 15px;
      line-height: 1.6;
    }
    .badge { 
      display: inline-block; 
      background: #00A651; 
      color: white; 
      padding: 4px 12px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    @media (max-width: 480px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      .container {
        margin: 10px;
        border-radius: 8px;
      }
      .content {
        padding: 20px;
      }
    }
    .btn {
      display: inline-block;
      background: #00A651;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 10px 0;
    }
    .btn:hover {
      background: #008a44;
    }
    .highlight {
      background: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ffc107;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p><strong>South Pole</strong> | Leading Climate Solutions Provider</p>
      <p>This email was sent from the South Pole website contact form.</p>
      <p>For support, please contact: 
        <a href="mailto:${process.env.CONTACT_EMAIL || 'contact@southpole.com'}" style="color: #002145;">
          ${process.env.CONTACT_EMAIL || 'contact@southpole.com'}
        </a>
      </p>
    </div>
  </div>
</body>
</html>`
}

/**
 * 联系表单通知邮件模板（发送给内部团队）
 */
export function generateContactNotificationTemplate(data: EmailTemplateData): string {
  const content = `
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p>A new inquiry has been received through the website</p>
    </div>
    
    <div class="content">
      <div class="highlight">
        <strong>🚨 Action Required:</strong> A potential customer has reached out. Please respond within 24 hours.
      </div>

      <div class="field">
        <div class="field-label">👤 Contact Information</div>
        <div class="field-value">
          <strong>${data.firstName} ${data.lastName}</strong><br>
          📧 <a href="mailto:${data.email}" style="color: #002145;">${data.email}</a><br>
          ${data.phone ? `📞 <a href="tel:${data.phone}" style="color: #002145;">${data.phone}</a><br>` : ''}
          ${data.company ? `🏢 ${data.company}<br>` : ''}
          ${data.position ? `💼 ${data.position}<br>` : ''}
          ${data.country ? `🌍 ${data.country}` : ''}
        </div>
      </div>

      <div class="field">
        <div class="field-label">📋 Inquiry Details</div>
        <div class="field-value">
          <strong>Type:</strong> <span class="badge">${data.inquiryType}</span><br>
          <strong>Submitted:</strong> ${data.timestamp ? new Date(data.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          }) : 'Recently'}<br>
          ${data.submissionId ? `<strong>Reference:</strong> ${data.submissionId}` : ''}
        </div>
      </div>

      ${data.message ? `
      <div class="field">
        <div class="field-label">💬 Message</div>
        <div class="message-box">${data.message}</div>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:${data.email}?subject=RE: Your inquiry about ${data.inquiryType}" class="btn">
          📧 Reply to Customer
        </a>
      </div>

      <div class="highlight">
        <strong>📊 Quick Actions:</strong><br>
        • Add to CRM system<br>
        • Schedule follow-up call<br>
        • Send relevant case studies<br>
        • Update lead status
      </div>
    </div>
  `
  
  return createEmailTemplate(content, 'New Contact Form Submission - South Pole')
}

/**
 * 客户确认邮件模板
 */
export function generateCustomerConfirmationTemplate(data: EmailTemplateData): string {
  const content = `
    <div class="header">
      <h1>✅ Thank You for Contacting South Pole</h1>
      <p>Your message has been received</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.firstName},</p>
      
      <p>Thank you for reaching out to South Pole regarding <strong>${data.inquiryType}</strong>. We have received your message and our team will review it carefully.</p>
      
      <div class="highlight">
        <strong>📋 What Happens Next:</strong><br>
        • Our experts will review your inquiry<br>
        • You'll receive a personalized response within 24 hours<br>
        • We may schedule a call to discuss your needs in detail
      </div>

      <div class="field">
        <div class="field-label">📝 Your Inquiry Summary</div>
        <div class="field-value">
          <strong>Type:</strong> <span class="badge">${data.inquiryType}</span><br>
          <strong>Submitted:</strong> ${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Just now'}<br>
          ${data.company ? `<strong>Company:</strong> ${data.company}<br>` : ''}
          ${data.country ? `<strong>Location:</strong> ${data.country}` : ''}
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpole.com'}" class="btn">
          🌐 Visit Our Website
        </a>
      </div>

      <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/news" style="color: #002145;">latest insights</a> and <a href="${process.env.NEXT_PUBLIC_SITE_URL}/services" style="color: #002145;">climate solutions</a>.</p>

      <p>If you have any urgent questions, please don't hesitate to contact us directly at <a href="mailto:${process.env.CONTACT_EMAIL || 'contact@southpole.com'}" style="color: #002145;">${process.env.CONTACT_EMAIL || 'contact@southpole.com'}</a>.</p>

      <p>Best regards,<br>
      <strong>The South Pole Team</strong></p>
    </div>
  `
  
  return createEmailTemplate(content, 'Thank You for Contacting South Pole')
}

/**
 * Newsletter欢迎邮件模板
 */
export function generateNewsletterWelcomeTemplate(data: EmailTemplateData): string {
  const content = `
    <div class="header">
      <h1>🌱 Welcome to South Pole Insights</h1>
      <p>Stay updated with the latest climate solutions</p>
    </div>
    
    <div class="content">
      <p>Hello ${data.firstName},</p>
      
      <p>Welcome to South Pole's newsletter! You've joined a community of climate action leaders who are making a real difference in the fight against climate change.</p>
      
      <div class="highlight">
        <strong>🔥 What You'll Receive:</strong><br>
        • Latest climate market insights<br>
        • Success stories from our projects<br>
        • Expert analysis and trend reports<br>
        • Exclusive invitations to webinars and events
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/news" class="btn">
          📰 Browse Latest Articles
        </a>
      </div>

      <p>We're committed to sending you valuable, relevant content. You can update your preferences or unsubscribe at any time using the links in our emails.</p>

      <p>Thank you for joining us in our mission to create a sustainable future!</p>

      <p>Best regards,<br>
      <strong>The South Pole Team</strong></p>
    </div>
  `
  
  return createEmailTemplate(content, 'Welcome to South Pole Newsletter')
}

/**
 * 密码重置邮件模板
 */
export function generatePasswordResetTemplate(data: EmailTemplateData & { resetToken: string, resetUrl: string }): string {
  const content = `
    <div class="header">
      <h1>🔒 Password Reset Request</h1>
      <p>Reset your South Pole account password</p>
    </div>
    
    <div class="content">
      <p>Hello ${data.firstName},</p>
      
      <p>We received a request to reset the password for your South Pole account. If you made this request, click the button below to reset your password:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetUrl}" class="btn">
          🔒 Reset My Password
        </a>
      </div>

      <p><strong>This link will expire in 1 hour</strong> for security reasons.</p>

      <div class="highlight">
        <strong>🛡️ Security Notice:</strong><br>
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </div>

      <p>For security reasons, this link can only be used once. If you need to reset your password again, please visit our website and request a new reset link.</p>

      <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; color: #666; font-size: 12px;">${data.resetUrl}</p>

      <p>Best regards,<br>
      <strong>The South Pole Security Team</strong></p>
    </div>
  `
  
  return createEmailTemplate(content, 'Password Reset - South Pole')
}

/**
 * 邮件模板类型定义
 */
export enum EmailTemplateType {
  CONTACT_NOTIFICATION = 'contact_notification',
  CUSTOMER_CONFIRMATION = 'customer_confirmation',
  NEWSLETTER_WELCOME = 'newsletter_welcome',
  PASSWORD_RESET = 'password_reset'
}

/**
 * 根据模板类型生成邮件HTML
 */
export function generateEmailByTemplate(type: EmailTemplateType, data: EmailTemplateData & any): string {
  switch (type) {
    case EmailTemplateType.CONTACT_NOTIFICATION:
      return generateContactNotificationTemplate(data)
    case EmailTemplateType.CUSTOMER_CONFIRMATION:
      return generateCustomerConfirmationTemplate(data)
    case EmailTemplateType.NEWSLETTER_WELCOME:
      return generateNewsletterWelcomeTemplate(data)
    case EmailTemplateType.PASSWORD_RESET:
      return generatePasswordResetTemplate(data)
    default:
      throw new Error(`Unknown email template type: ${type}`)
  }
}