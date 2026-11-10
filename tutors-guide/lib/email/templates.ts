// lib/email/templates.ts

const baseEmailWrapper = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 32px 16px;
      background-color: #f7f7f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1a1a1a;
    }
    .wrapper {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      overflow: hidden;
    }
    .header-band {
      padding: 28px 36px 20px 36px;
      border-bottom: 1px solid #f0f0f0;
    }
    .brand-name {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #111111;
      margin: 0;
    }
    .content-area {
      padding: 36px;
    }
    .headline {
      font-size: 18px;
      font-weight: 600;
      color: #111111;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }
    .copy {
      font-size: 14px;
      line-height: 1.6;
      color: #444444;
      margin: 0 0 24px 0;
    }
    .btn-wrap {
      padding: 8px 0 24px 0;
    }
    .btn-primary {
      display: inline-block;
      background-color: #111111;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 4px;
    }
    .footer {
      padding: 20px 36px;
      border-top: 1px solid #f0f0f0;
      font-size: 11px;
      line-height: 1.5;
      color: #777777;
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-band">
      <div class="brand-name">The Tutor's Guide</div>
    </div>
    
    <div class="content-area">
      ${bodyContent}
    </div>

    <div class="footer">
      <p style="margin: 0 0 8px 0;">
        This email was sent by The Tutor's Guide. If you did not make this request, you can safely disregard this email.
      </p>
      <p style="margin: 0; color: #999999;">
        Boulder, CO &bull; support@thetutorsguide.com
      </p>
    </div>
  </div>
</body>
</html>
`;

export function getPasswordResetEmail(resetUrl: string) {
  const htmlBody = baseEmailWrapper(
    "Reset Your Password",
    `
      <h1 class="headline">Reset your password</h1>
      
      <p class="copy">
        We received a request to reset your password for The Tutor's Guide. Click the button below to choose a new one:
      </p>
      
      <div class="btn-wrap">
        <a href="${resetUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
          Reset Password
        </a>
      </div>

      <p class="copy" style="font-size: 12px; color: #666666; margin-bottom: 0;">
        This link is valid for 60 minutes. If you didn't ask to reset your password, no changes have been made to your account.
      </p>
    `
  );

  const textBody = `
The Tutor's Guide

Reset your password

We received a request to reset your password for The Tutor's Guide. Use the link below to choose a new one (valid for 60 minutes):

${resetUrl}

If you did not request this change, you can safely ignore this email.

The Tutor's Guide
support@thetutorsguide.com
  `.trim();

  return {
    htmlBody,
    textBody,
    subject: "Reset your password for The Tutor's Guide",
  };
}