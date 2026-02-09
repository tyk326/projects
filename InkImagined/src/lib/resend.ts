// BACKEND UTILITY: Resend Email Service

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  imageUrl: string,
  productName: string,
  amount: number
): Promise<void> {
  try {
    await resend.emails.send({
      from: 'tylerkb2004@gmail.com',
      to: email,
      subject: 'Your Canvas Print Order Confirmed! 🎨',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f0700d 0%, #e15608 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 40px 20px; border: 1px solid #e1e3e5; border-top: none; }
              .image { text-align: center; margin: 30px 0; }
              .image img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .details { background: #f6f6f7; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #787f89; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order! 🎨</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Your AI-generated canvas is being prepared</p>
              </div>
              <div class="content">
                <p>Hi there!</p>
                <p>We've received your order and we're excited to bring your AI-generated artwork to life on canvas!</p>
                
                <div class="image">
                  <img src="${imageUrl}" alt="Your AI Generated Artwork" />
                </div>
                
                <div class="details">
                  <h3 style="margin-top: 0;">Order Details</h3>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Product:</strong> ${productName}</p>
                  <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
                </div>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                  <li>Your canvas is being printed (2-3 business days)</li>
                  <li>Quality check and packaging (1 business day)</li>
                  <li>Shipping to your address (3-7 business days)</li>
                </ul>
                
                <p>You'll receive a shipping confirmation email with tracking information once your order ships.</p>
                
                <p>If you have any questions, just reply to this email!</p>
                
                <p>Best regards,<br>The InkImagined Team</p>
              </div>
              <div class="footer">
                <p>© 2025 InkImagined. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't throw - email failure shouldn't break the order flow
  }
}

export async function sendShippingNotificationEmail(
  email: string,
  orderId: string,
  trackingNumber: string,
  trackingUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: 'tylerbk2004@gmail.com',
      to: email,
      subject: 'Your Canvas Print Has Shipped! 📦',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f0700d 0%, #e15608 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 40px 20px; border: 1px solid #e1e3e5; border-top: none; }
              .tracking { background: #f6f6f7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .button { display: inline-block; background: #f0700d; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 10px; }
              .footer { text-align: center; padding: 20px; color: #787f89; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Your Canvas is On Its Way! 📦</h1>
              </div>
              <div class="content">
                <p>Great news! Your AI-generated canvas print has shipped and is heading your way.</p>
                
                <div class="tracking">
                  <h3 style="margin-top: 0;">Tracking Information</h3>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                  <a href="${trackingUrl}" class="button">Track Your Package</a>
                </div>
                
                <p>Your canvas should arrive within 3-7 business days depending on your location.</p>
                
                <p><strong>Tips for receiving your canvas:</strong></p>
                <ul>
                  <li>Keep the packaging until you've inspected your canvas</li>
                  <li>Allow it to acclimate to room temperature before unwrapping</li>
                  <li>Handle by the edges to avoid fingerprints</li>
                </ul>
                
                <p>We hope you love your new artwork!</p>
                
                <p>Best regards,<br>The InkImagined Team</p>
              </div>
              <div class="footer">
                <p>© 2025 InkImagined. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Shipping email error:', error);
  }
}
