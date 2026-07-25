import {
  enquiryConditions,
  enquiryContactPreferences,
  enquiryReferralSources,
} from '@/data/enquiry-options';
import { site } from '@/data/site';
import type { EnquiryFields } from '@/lib/validateEnquiry';

function labelFor(
  options: ReadonlyArray<{ id: string; label: string }>,
  id: string,
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

function buildEnquiryEmailBody(fields: EnquiryFields): string {
  const lines = [
    'New enquiry from the Mumbai London AF Clinic website',
    '',
    `Name: ${fields.name}`,
    `Phone: ${fields.phone}`,
    `Email: ${fields.email}`,
    `Condition: ${labelFor(enquiryConditions, fields.condition)}`,
    `How they heard about us: ${labelFor(enquiryReferralSources, fields.referralSource)}`,
    fields.location ? `Based in: ${fields.location}` : null,
    fields.contactPreference
      ? `Preferred contact: ${labelFor(enquiryContactPreferences, fields.contactPreference)}`
      : null,
    `Preferred visit month: ${fields.month}`,
    '',
    'Message:',
    fields.message.slice(0, 5000),
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Emails the enquiry to the clinic inbox through the clinic's own Microsoft 365
 * mailbox over SMTP. Sending is off until SMTP_USER and SMTP_PASS are set, so
 * local and test runs accept the submission and log it without sending.
 *
 * Exchange Online requires the From address to be the authenticated mailbox,
 * so the enquirer goes on Reply-To instead.
 */
export async function sendEnquiryEmail(fields: EnquiryFields): Promise<void> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return;
  }

  const { createTransport } = await import('nodemailer');

  const transport = createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.office365.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: { name: `${site.name} website`, address: user },
    to: process.env.ENQUIRY_NOTIFY_EMAIL ?? site.email,
    replyTo: fields.email,
    subject: `New enquiry: ${fields.name} (${labelFor(enquiryConditions, fields.condition)})`,
    text: buildEnquiryEmailBody(fields),
  });
}
