'use server';

import { toE164, formatPhoneDisplay } from '@/lib/phone';
import { sendEnquiryEmail } from '@/lib/sendEnquiryEmail';
import { normalizeEnquiryFields, validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';
import { verifyRecaptchaToken } from '@/lib/verifyRecaptcha';

export type EnquiryResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
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
      errors: { message: 'We could not send your enquiry just now. Please try WhatsApp or phone instead.' },
    };
  }

  console.log('[enquiry]', { ...submission, message: submission.message.slice(0, 1000) });
  return { ok: true };
}
