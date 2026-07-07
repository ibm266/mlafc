import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const EMAIL_OPTIONS = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: false,
  require_tld: true,
  allow_ip_domain: false,
  domain_specific_validation: true,
} as const;

export function normalizeEnquiryEmail(email: string): string {
  return normalizeEmail(email.trim(), { gmail_remove_dots: false }) ?? email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return 'Please enter your email address.';
  }

  if (!isEmail(trimmed, EMAIL_OPTIONS)) {
    return 'Please enter a valid email address.';
  }

  return null;
}
