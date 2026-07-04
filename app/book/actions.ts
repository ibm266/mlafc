'use server';

import { validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';

export type EnquiryResult = { ok: true } | { ok: false; errors: Record<string, string> };

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const fields: EnquiryFields = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    month: String(formData.get('month') ?? ''),
  };
  const errors = validateEnquiry(fields);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors: errors as Record<string, string> };
  }

  // Stub: swap this log for an email, CRM, or form-service call. One-file change.
  console.log('[enquiry]', { ...fields, message: fields.message.slice(0, 1000) });
  return { ok: true };
}
