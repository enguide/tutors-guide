/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/email/client.ts
import { ServerClient, Models } from "postmark";

const serverToken = process.env.POSTMARK_SERVER_TOKEN;

export const postmarkClient = serverToken
  ? new ServerClient(serverToken)
  : null;

export const DEFAULT_FROM_EMAIL =
  process.env.POSTMARK_FROM_EMAIL || "support@thetutorsguide.com";

export interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  tag?: string;
  replyTo?: string;
}

export async function sendTransactionalEmail({
  to,
  subject,
  htmlBody,
  textBody,
  tag = "transactional",
  replyTo = DEFAULT_FROM_EMAIL,
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
  if (!postmarkClient) {
    console.warn(
      `[POSTMARK NOTICE] POSTMARK_SERVER_TOKEN is not configured. Emulating email dispatch to: ${to}`
    );
    console.log(`[Subject]: ${subject}`);
    console.log(`[Text Content]:\n${textBody}\n`);
    return { success: true, messageId: "emulated-local-id" };
  }

  try {
    const response = await postmarkClient.sendEmail({
      From: DEFAULT_FROM_EMAIL,
      To: to,
      ReplyTo: replyTo,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
      Tag: tag,
      TrackOpens: false,
      TrackLinks: Models.LinkTrackingOptions.None,
      MessageStream: "outbound",
    });

    return { success: true, messageId: response.MessageID };
  } catch (error: any) {
    console.error("[POSTMARK ERROR] Failed to dispatch transactional email:", error);
    throw new Error(error.message || "Failed to dispatch transactional email");
  }
}