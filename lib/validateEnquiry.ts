export type EnquiryFields = {
  name: string;
  phone: string;
  email: string;
  message: string;
  month: string;
};

export function validateEnquiry(f: EnquiryFields): Partial<Record<keyof EnquiryFields, string>> {
  const errors: Partial<Record<keyof EnquiryFields, string>> = {};

  if (!f.name.trim()) {
    errors.name = 'Please tell us your name.';
  }

  if (!/^\+?[0-9\s\-()]{7,17}$/.test(f.phone.trim())) {
    errors.phone = 'Please enter a phone number with country code, for example +91 98765 43210.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (f.message.trim().length < 10) {
    errors.message = 'Please tell us a little about the problem - a sentence or two is perfect.';
  }

  if (!f.month) {
    errors.month = 'Please choose a preferred month.';
  }

  return errors;
}
