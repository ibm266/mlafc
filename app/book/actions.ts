'use server';

import { headers } from 'next/headers';
import { toE164, formatPhoneDisplay } from '@/lib/phone';
import { rateLimit } from '@/lib/rateLimit';
import { sendEnquiryEmail } from '@/lib/sendEnquiryEmail';
import { normalizeEnquiryFields, validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';
import { verifyRecaptchaToken } from '@/lib/verifyRecaptcha';

const MINUTE = 60_000;

/** A genuine enquirer needs one go, or a few if something went wrong. */
const PER_IP = { limit: 5, windowMs: 15 * MINUTE };

/** Backstop for the clinic inbox when submissions arrive from many addresses. */
const OVERALL = { limit: 40, windowMs: 60 * MINUTE };

const TOO_MANY =
  'We have already received several enquiries from you. Please give the clinic team a little time to reply, or message us on WhatsApp if it is urgent.';

/**
 * The proxy address of the sender, or null when no proxy header is present.
 * Falls back to null rather than a shared key so a missing header cannot make
 * every visitor share one bucket; the overall limit still applies.
 */
async function clientIp(): Promise<string | null> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();
    return forwarded || headerList.get('x-real-ip')?.trim() || null;
  } catch {
    // Called outside a request (tests, scripts).
    return null;
  }
}

export type EnquiryResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const ip = await clientIp();
  const withinPerIp = ip ? rateLimit(`enquiry:${ip}`, PER_IP.limit, PER_IP.windowMs).ok : true;
  if (!withinPerIp || !rateLimit('enquiry:all', OVERALL.limit, OVERALL.windowMs).ok) {
    return { ok: false, errors: { form: TOO_MANY } };
  }

  const recaptchaError = await verifyRecaptchaToken(String(formData.get('recaptchaToken') ?? ''));
  if (recaptchaError) {
    return { ok: false, errors: { recaptcha: recaptchaError } };
  }

  const fields: EnquiryFields = normalizeEnquiryFields({
    name: String(formData.get('name') ?? ''),
    phoneCountry: String(formData.get('phoneCountry') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    condition: String(formData.get('condition') ?? ''),
    message: String(formData.get('message') ?? ''),
    referralSource: String(formData.get('referralSource') ?? ''),
    location: String(formData.get('location') ?? ''),
    contactPreference: String(formData.get('contactPreference') ?? ''),
    month: String(formData.get('month') ?? ''),
  });

  const errors = validateEnquiry(fields);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors: errors as Record<string, string> };
  }

  const phoneE164 = toE164(fields.phoneCountry, fields.phone) ?? fields.phone;
  const submission = {
    ...fields,
    phone: formatPhoneDisplay(phoneE164),
  };

  try {
    await sendEnquiryEmail(submission);
  } catch (error) {
    console.error('[enquiry] email failed', error);
    return {
      ok: false,
      errors: { form: 'We could not send your enquiry just now. Please try WhatsApp or phone instead.' },
    };
  }

  console.log('[enquiry]', { ...submission, message: submission.message.slice(0, 1000) });
  return { ok: true };
}
