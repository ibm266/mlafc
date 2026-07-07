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
 * Sends a clinic notification when RESEND_API_KEY and ENQUIRY_NOTIFY_EMAIL are set.
 * Until then, submissions are accepted and logged from the server action only.
 */
export async function sendEnquiryEmail(fields: EnquiryFields): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;

  if (!apiKey || !to) {
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL ?? `enquiries@${new URL(site.url).hostname}`,
      to: [to],
      reply_to: fields.email,
      subject: `New enquiry: ${fields.name} (${labelFor(enquiryConditions, fields.condition)})`,
      text: buildEnquiryEmailBody(fields),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Enquiry email failed (${response.status}): ${detail}`);
  }
}
