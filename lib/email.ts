import nodemailer from 'nodemailer'

// SMTP configuration for veebimajutus.ee
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.veebimajutus.ee',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'no-reply@theolivegroceoffice.eu',
    pass: process.env.SMTP_PASS || 'Minemunni1.'
  },
  tls: {
    // Do not fail on invalid certs for self-signed certificates
    rejectUnauthorized: false
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const mailOptions = {
      from: from || 'no-reply@theolivegroceoffice.eu',
      to,
      subject,
      html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendPurchaseEmail({
  customerEmail,
  productTitle,
  product,
  sessionId,
}: {
  customerEmail: string
  productTitle: string
  product: any
  sessionId: string
}) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/download/${sessionId}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #e91e63; text-align: center;">Thank you for your purchase! 🎉</h1>
      <p style="font-size: 16px;">You have successfully purchased: <strong>${productTitle}</strong></p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #333; margin-bottom: 15px;">Download your product:</h3>
        <a href="${downloadUrl}" 
           style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
           Download Now
        </a>
      </div>
      
      <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #2d5a2d;">
          <strong>Important Information:</strong><br>
          • This download link expires in 30 days<br>
          • You can download the product up to 5 times<br>
          • Please keep this email for future reference
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <div style="text-align: center;">
        <p style="font-size: 14px; color: #666;">
          If you have any questions, please don't hesitate to contact our support team.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          © ${new Date().getFullYear()} Kristlini Lehekulg. All rights reserved.
        </p>
      </div>
    </div>
  `

  return await sendEmail({
    to: customerEmail,
    subject: `Your purchase: ${productTitle}`,
    html
  })
} 