# Production Email Deliverability Architecture

A reference guide for configuring transactional email delivery (password resets, invitations, payment receipts) to bypass institutional spam filters, Microsoft Defender/Exchange filters, and Gmail strict quarantines.

---

## 1. Provider Selection

Transactional messages must never share sending IP pools with marketing or newsletter traffic.

* **Primary Recommendation: Postmark**
* Maintains physically isolated IP pools reserved exclusively for transactional mail.
* Manually approves accounts and strictly prohibits bulk marketing on transactional streams.
* Highest historical inbox placement rates for corporate and `.edu` school domains.


* **Secondary Recommendation: Resend**
* Built natively for modern Next.js/React server actions.
* Native integration with `@react-email/components` for clean component-based markup.
* Clean, low-latency API with webhooks for bounces and drops.


* **Avoid for Transactional Auth:**
* Shared-pool basic marketing accounts (Mailchimp, entry-level SendGrid, low-tier Mailgun), which frequently share reputation with flagged bulk senders.



---

## 2. Infrastructure & Subdomain Strategy

Never send automated application mail directly from your root/apex domain (`highmountainprep.com`).

* **Dedicated Subdomain:** Provision a dedicated subdomain specifically for auth and transactional alerts:
* `mail.highmountainprep.com` or `auth.highmountainprep.com`


* **Reputation Isolation:** If a high school or university IT department aggressively flags automated password reset bursts or invite emails, the reputation hit affects only the subdomain, insulating everyday personal and business email (`tutors@highmountainprep.com`).

---

## 3. Mandatory DNS Records

Modern inbox providers automatically reject or quarantine mail failing strict authentication alignment.

| Record | Type | Standard Configuration | Purpose |
| --- | --- | --- | --- |
| **SPF** | `TXT` | `v=spf1 include:spf.yourprovider.com ~all` | Declares authorized sender IP ranges for the subdomain. |
| **DKIM** | `CNAME` / `TXT` | Provider-generated public keys (e.g., `pm._domainkey...`) | Cryptographically signs email headers to prevent tampering and spoofing. |
| **DMARC** | `TXT` | `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@yourdomain.com` | Instructs destination servers how to treat messages that fail SPF/DKIM verification. |
| **MX** | `MX` | Provider feedback endpoint (e.g., `inbound.postmarkapp.com`) | Allows the sending subdomain to handle inbound bounce notifications. |

---

## 4. Message Content & Template Hygiene

* **Multipart MIME (Plaintext Alternative):** Always send a clean plain-text version alongside the HTML body. Single-part HTML emails receive heavier heuristic penalties from spam scanners.
* **Strict Link Anchor Alignment:** Never use third-party link shorteners (`bit.ly`, `tinyurl.com`). The displayed link text should either match the root URL destination or use clear semantic actions (e.g., `"Set Your Password"` instead of raw query strings).
* **Static Headers:**
* **From:** `High Mountain Prep <auth@mail.highmountainprep.com>`
* **Reply-To:** An actively monitored inbox (e.g., `support@highmountainprep.com`). Destination mail filters score addresses with unmonitored `noreply@` configurations lower.