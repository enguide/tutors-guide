// lib/email/templates.ts

const baseEmailWrapper = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & Base */
    body {
      margin: 0;
      padding: 48px 16px;
      background-color: #fcfcfc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #171717;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
    }
    .header-band {
      padding: 32px 40px 24px 40px;
      border-bottom: 1px solid #f0f0f0;
    }
    .brand-name {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #171717;
      margin: 0;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #737373;
      margin-top: 4px;
    }
    .content-area {
      padding: 40px;
    }
    .headline {
      font-size: 19px;
      font-weight: 600;
      letter-spacing: -0.015em;
      color: #0a0a0a;
      margin: 0 0 20px 0;
      line-height: 1.35;
    }
    .copy {
      font-size: 14px;
      line-height: 1.7;
      color: #404040;
      margin: 0 0 20px 0;
    }
    .btn-wrap {
      padding: 8px 0 28px 0;
    }
    .btn-primary {
      display: inline-block;
      background-color: #0a0a0a;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 14px 28px;
      border-radius: 0px;
    }
    .url-fallback-box {
      border-top: 1px solid #f0f0f0;
      padding-top: 24px;
      margin-top: 8px;
    }
    .url-meta {
      font-size: 11px;
      color: #737373;
      margin: 0 0 8px 0;
    }
    .url-link {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      line-height: 1.5;
      color: #525252;
      word-break: break-all;
      background-color: #f9f9f9;
      border: 1px solid #eeeeee;
      padding: 10px 12px;
      display: block;
    }
    .footer {
      padding: 24px 40px 32px 40px;
      border-top: 1px solid #f0f0f0;
      font-size: 11px;
      line-height: 1.6;
      color: #a3a3a3;
    }
    .footer-security {
      margin: 0;
    }
    .footer-brand {
      margin-top: 12px;
      font-size: 10px;
      color: #c4c4c4;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-band">
      <div class="brand-name">The Tutor's Guide</div>
      <div class="brand-sub">Candidate Portal</div>
    </div>
    
    <div class="content-area">
      ${bodyContent}
    </div>

    <div class="footer">
      <p class="footer-security">
        This is an automated security transmission. If you did not initiate this request, no action is required; existing credentials remain secure.
      </p>
      <div class="footer-brand">
        Private Academic & Diagnostic Telemetry
      </div>
    </div>
  </div>
</body>
</html>
`;

export function getPasswordResetEmail(resetUrl: string) {
  const htmlBody = baseEmailWrapper(
    "Reset Your Credentials",
    `
      <h1 class="headline">Set your portal access credentials</h1>
      
      <p class="copy">
        A security request was initiated to establish or update the access credentials for your workstation account.
      </p>
      
      <div class="btn-wrap">
        <a href="${resetUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
          Establish Password &rarr;
        </a>
      </div>

      <p class="copy" style="font-size: 12px; color: #737373; margin-bottom: 0;">
        For account safety, this access link is strictly single-use and expires in <strong>60 minutes</strong>.
      </p>

      <div class="url-fallback-box">
        <p class="url-meta">Direct browser URL:</p>
        <span class="url-link">${resetUrl}</span>
      </div>
    `
  );

  const textBody = `
THE TUTOR'S GUIDE
Candidate Portal

Set Your Portal Access Credentials

A security request was initiated to establish or update the access credentials for your workstation account.

Visit the secure link below to set your password (valid for 60 minutes):
${resetUrl}

If you did not request this update, no action is required; your credentials remain secure.

This is an automated transmission from The Tutor's Guide.
  `.trim();

  return {
    htmlBody,
    textBody,
    subject: "Reset your portal access credentials",
  };
}