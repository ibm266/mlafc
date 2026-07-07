import { toE164, validatePhone } from '@/lib/phone';
import { validateEmail } from '@/lib/validateEmail';

test('validatePhone accepts a valid Indian mobile number', () => {
  expect(validatePhone('IN', '9876543210')).toBeNull();
  expect(toE164('IN', '9876543210')).toBe('+919876543210');
});

test('validatePhone rejects an invalid number for the selected country', () => {
  expect(validatePhone('IN', '123')).toMatch(/valid phone/i);
  expect(validatePhone('GB', '12345')).toMatch(/valid phone/i);
});

test('validateEmail accepts a normal address and rejects malformed input', () => {
  expect(validateEmail('patient@example.com')).toBeNull();
  expect(validateEmail('not-an-email')).toMatch(/valid email/i);
  expect(validateEmail('')).toMatch(/enter your email/i);
});
