import {
  enquiryConditionIds,
  enquiryContactPreferenceIds,
  enquiryReferralSourceIds,
} from '@/data/enquiry-options';
import { validatePhone } from '@/lib/phone';
import { normalizeEnquiryEmail, validateEmail } from '@/lib/validateEmail';

export type EnquiryFields = {
  name: string;
  phoneCountry: string;
  phone: string;
  email: string;
  condition: string;
  message: string;
  referralSource: string;
  location: string;
  contactPreference: string;
  month: string;
};

export function validateEnquiry(f: EnquiryFields): Partial<Record<keyof EnquiryFields, string>> {
  const errors: Partial<Record<keyof EnquiryFields, string>> = {};

  if (!f.name.trim()) {
    errors.name = 'Please tell us your name.';
  }

  const phoneError = validatePhone(f.phoneCountry, f.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  const emailError = validateEmail(f.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!f.condition || !enquiryConditionIds.has(f.condition)) {
    errors.condition = 'Please choose the condition or topic you would like to ask about.';
  }

  if (f.message.trim().length < 10) {
    errors.message = 'Please tell us a little about the problem - a sentence or two is perfect.';
  }

  if (!f.referralSource || !enquiryReferralSourceIds.has(f.referralSource)) {
    errors.referralSource = 'Please tell us how you heard about Professor Gupta.';
  }

  if (f.contactPreference && !enquiryContactPreferenceIds.has(f.contactPreference)) {
    errors.contactPreference = 'Please choose a contact preference from the list.';
  }

  if (!f.month) {
    errors.month = 'Please choose a preferred month.';
  }

  return errors;
}

export function normalizeEnquiryFields(f: EnquiryFields): EnquiryFields {
  return {
    ...f,
    name: f.name.trim(),
    phone: f.phone.trim(),
    email: normalizeEnquiryEmail(f.email),
    message: f.message.trim(),
    location: f.location.trim(),
  };
}
