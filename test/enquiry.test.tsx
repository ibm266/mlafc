import { validateEnquiry } from '@/lib/validateEnquiry';
import { submitEnquiry } from '@/app/book/actions';

const valid = {
  name: 'A. Patient',
  phoneCountry: 'IN',
  phone: '9876543210',
  email: 'a@example.com',
  condition: 'af',
  message: 'I have had palpitations for two years.',
  referralSource: 'google',
  location: 'Mumbai, India',
  contactPreference: 'phone',
  month: '[March] 2026',
};

test('validateEnquiry passes a valid submission', () => {
  expect(validateEnquiry(valid)).toEqual({});
});

test('validateEnquiry returns friendly messages for bad fields', () => {
  const errors = validateEnquiry({
    name: '',
    phoneCountry: '',
    phone: '123',
    email: 'nope',
    condition: '',
    message: 'hi',
    referralSource: '',
    location: '',
    contactPreference: '',
    month: '',
  });
  expect(errors.name).toMatch(/name/i);
  expect(errors.phone).toBeTruthy();
  expect(errors.email).toMatch(/email/i);
  expect(errors.condition).toBeTruthy();
  expect(errors.message).toBeTruthy();
  expect(errors.referralSource).toBeTruthy();
  expect(errors.month).toBeTruthy();
});

test('submitEnquiry returns ok for valid form data', async () => {
  const fd = new FormData();
  Object.entries(valid).forEach(([k, v]) => fd.set(k, v));
  await expect(submitEnquiry(fd)).resolves.toEqual({ ok: true });
});

test('submitEnquiry rejects invalid form data', async () => {
  const fd = new FormData();
  fd.set('name', '');
  const res = await submitEnquiry(fd);
  expect(res.ok).toBe(false);
});
