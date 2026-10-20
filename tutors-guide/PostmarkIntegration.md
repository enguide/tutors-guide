To implement **Epic 11: Production Transactional Email Infrastructure** with **Postmark**, we will build the email transport pipeline in three clean steps:

1. **Client Setup & Environment Config:** Install `postmark` and create an isolated, robust sending client with development logging fallbacks.


2. **Branded Multipart Templates:** Clean HTML and plaintext fallbacks that match your platform's architectural styling (sharp lines, modern typography, zero fluff).


3. **Dispatch Hooks & Integration:** Update `actions/passwordReset.ts` to replace the console output with verified Postmark delivery, plus dispatch handlers for institutional claim and order confirmations.



---

### Step 1: Install Postmark & Configure Environment

Install the official Postmark client:

```bash
npm install postmark

```

Add the following environment variables to your `.env` (or `.env.local`):

```env
# Postmark Transactional Credentials
POSTMARK_SERVER_TOKEN="your-postmark-server-api-token"
POSTMARK_FROM_EMAIL="support@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

---

### Step 2: Postmark Client Abstraction (`lib/email/client.ts`)

Create `lib/email/client.ts`. This module safely handles the Postmark client lifecycle and falls back cleanly in local testing environments if a token isn't configured yet.

```typescript
// lib/email/client.ts
import { ServerClient } from "postmark";

const serverToken = process.env.POSTMARK_SERVER_TOKEN;

// Lazily instantiate the Postmark client
export const postmarkClient = serverToken
  ? new ServerClient(serverToken)
  : null;

export const DEFAULT_FROM_EMAIL =
  process.env.POSTMARK_FROM_EMAIL || "support@testplatform.com";

export interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  tag?: string;
}

export async function sendTransactionalEmail({
  to,
  subject,
  htmlBody,
  textBody,
  tag = "transactional",
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
  if (!postmarkClient) {
    console.warn(
      `[POSTMARK WARNING] POSTMARK_SERVER_TOKEN not configured. Emulating dispatch to ${to}:`
    );
    console.log(`Subject: ${subject}`);
    console.log(`Text: \n${textBody}`);
    return { success: true, messageId: "mock-message-id" };
  }

  try {
    const response = await postmarkClient.sendEmail({
      From: DEFAULT_FROM_EMAIL,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
      Tag: tag,
      TrackOpens: false,
    });

    return { success: true, messageId: response.MessageID };
  } catch (error: any) {
    console.error("[POSTMARK ERROR] Failed to deliver transactional email:", error);
    throw new Error(error.message || "Failed to dispatch transactional email");
  }
}

```

---

### Step 3: Transactional HTML & Plaintext Templates (`lib/email/templates.ts`)

Create `lib/email/templates.ts` containing the three core templates required by Epic 11:

1. **Password Setup / Reset Token**

2. **Student Institutional Seat Claim Confirmation**

3. **B2B Purchaser Order Confirmation & Join Code**


```typescript
// lib/email/templates.ts

const baseEmailWrapper = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; padding: 32px; border-radius: 0px; }
    .header { font-size: 18px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .content { font-size: 14px; line-height: 1.6; color: #334155; }
    .code-box { background: #f1f5f9; border: 1px solid #cbd5e1; font-family: monospace; font-size: 16px; font-weight: 700; padding: 12px 16px; margin: 20px 0; letter-spacing: 0.05em; display: inline-block; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 24px; margin: 20px 0; border-radius: 0px; }
    .footer { margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">TEST PLATFORM</div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      If you did not request this email, no action is needed. Your account remains secure.
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. Password Reset & Initial Credential Setup
 */
export function getPasswordResetEmail(resetUrl: string) {
  const htmlBody = baseEmailWrapper(
    "Set Your Password",
    `
      <p>Hello,</p>
      <p>We received a request to configure or reset the password for your diagnostic test account.</p>
      <p>Click the link below to set your credentials. This secure link expires in <strong>1 hour</strong>:</p>
      <p><a href="${resetUrl}" class="btn">Set Account Password</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #64748b;">${resetUrl}</p>
    `
  );

  const textBody = `
Hello,

We received a request to configure or reset the password for your diagnostic test account.

Visit the link below within the next hour to set your password:
${resetUrl}

If you did not request this email, please disregard it.
  `.trim();

  return { htmlBody, textBody, subject: "Configure your account credentials" };
}

/**
 * 2. Student Institutional Seat Claim Confirmation
 */
export function getStudentClaimConfirmationEmail(
  studentName: string,
  orgName: string,
  categories: string[]
) {
  const htmlBody = baseEmailWrapper(
    "Enrollment Confirmed",
    `
      <p>Hello ${studentName},</p>
      <p>Your enrollment with <strong>${orgName}</strong> has been successfully confirmed.</p>
      <p>Your account now has active access to the following diagnostic testing categories:</p>
      <div class="code-box">${categories.join(", ")}</div>
      <p>You can sign in anytime to start testing, review pacing charts, and check your diagnostic telemetry.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="btn">Go to Dashboard</a></p>
    `
  );

  const textBody = `
Hello ${studentName},

Your enrollment with ${orgName} has been confirmed.
Your account now has access to: ${categories.join(", ")}

Sign in here to launch your exams:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard
  `.trim();

  return { htmlBody, textBody, subject: `Enrollment confirmed: ${orgName}` };
}

/**
 * 3. B2B Purchaser Order Confirmation & Join Code
 */
export function getB2BPurchaseReceiptEmail(
  purchaserName: string,
  orgName: string,
  seatLimit: number,
  inviteCode: string,
  categories: string[]
) {
  const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?joinCode=${inviteCode}`;

  const htmlBody = baseEmailWrapper(
    "Order Confirmation",
    `
      <p>Hello ${purchaserName},</p>
      <p>Thank you for your order. Your seat allocation for <strong>${orgName}</strong> is now live.</p>
      
      <p><strong>Order Summary:</strong></p>
      <ul>
        <li><strong>Total Seats:</strong> ${seatLimit}</li>
        <li><strong>Categories:</strong> ${categories.join(", ")}</li>
        <li><strong>Valid For:</strong> 365 Days</li>
      </ul>

      <p>Share this unique join code or direct registration link with your students to claim their seats:</p>
      <div class="code-box">${inviteCode}</div>
      <p><a href="${claimUrl}" class="btn">Student Registration Link</a></p>
      
      <p>You can manage and monitor your roster in real time from the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tgadmin">Institutional Portal</a>.</p>
    `
  );

  const textBody = `
Hello ${purchaserName},

Your license pool for ${orgName} is now active.

Summary:
- Total Seats: ${seatLimit}
- Categories: ${categories.join(", ")}
- Join Code: ${inviteCode}

Direct Student Registration Link:
${claimUrl}

Monitor your roster in the Institutional Portal:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tgadmin
  `.trim();

  return { htmlBody, textBody, subject: `Order Confirmation: ${orgName} (${seatLimit} Seats)` };
}

```

---

### Step 4: Dispatch Integration in `actions/passwordReset.ts`

Replace the console logs in `actions/passwordReset.ts` with Postmark dispatch:

```typescript
// actions/passwordReset.ts
"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendTransactionalEmail } from "@/lib/email/client";
import { getPasswordResetEmail } from "@/lib/email/templates";

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const profile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  // Always return success to prevent email enumeration[cite: 11]
  if (!profile) {
    return { success: true };
  }

  // Token valid for 1 hour[cite: 11]
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Invalidate previous tokens for this profile[cite: 11]
  await prisma.passwordResetToken.deleteMany({
    where: { profileId: profile.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      profileId: profile.id,
      token,
      tokenExpiry,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Build branded multipart template[cite: 1]
  const { htmlBody, textBody, subject } = getPasswordResetEmail(resetUrl);

  // Asynchronously dispatch through Postmark[cite: 1]
  await sendTransactionalEmail({
    to: normalizedEmail,
    subject,
    htmlBody,
    textBody,
    tag: "password-reset",
  });

  return { success: true };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!token || !newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.tokenExpiry < new Date()) {
    throw new Error("This reset link is invalid or has expired.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [updatedProfile] = await prisma.$transaction([
    prisma.profile.update({
      where: { id: record.profileId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: record.id },
    }),
  ]);

  return { success: true, email: updatedProfile.email };
}

```

---

### Step 5: Webhook & Claim Dispatch Integration

Whenever an institutional code is redeemed or a Stripe checkout finishes, call the other template dispatch functions:

* When a student redeems an `ORG-` join code:
```typescript
import { sendTransactionalEmail } from "@/lib/email/client";
import { getStudentClaimConfirmationEmail } from "@/lib/email/templates";

const { htmlBody, textBody, subject } = getStudentClaimConfirmationEmail(
  `${profile.firstName} ${profile.lastName}`,
  licensePool.org?.name || "Your Institution",
  licensePool.categories
);

await sendTransactionalEmail({
  to: profile.email,
  subject,
  htmlBody,
  textBody,
  tag: "seat-claim-confirmation",
});

```


* In `app/api/stripe-webhook/route.ts` upon B2B purchase fulfillment:
```typescript
import { sendTransactionalEmail } from "@/lib/email/client";
import { getB2BPurchaseReceiptEmail } from "@/lib/email/templates";

const { htmlBody, textBody, subject } = getB2BPurchaseReceiptEmail(
  purchaserProfile.firstName,
  org.name,
  seatLimit,
  licensePool.inviteCode,
  categories
);

await sendTransactionalEmail({
  to: purchaserProfile.email,
  subject,
  htmlBody,
  textBody,
  tag: "b2b-order-receipt",
});

```



If your Stripe webhook handler is structured differently or you want to wire up the claim confirmation route directly, share the relevant file and we can plug in the calls.