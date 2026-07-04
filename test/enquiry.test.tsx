import { validateEnquiry } from '@/lib/validateEnquiry';
import { submitEnquiry } from '@/app/book/actions';

const valid = {
  name: 'A. Patient',
  phone: '+91 98765 43210',
  email: 'a@example.com',
  message: 'I have had palpitations for two years.',
  month: '[March] 2026',
};

test('validateEnquiry passes a valid submission', () => {
  expect(validateEnquiry(valid)).toEqual({});
});

test('validateEnquiry returns friendly messages for bad fields', () => {
  const errors = validateEnquiry({ name: '', phone: '123', email: 'nope', message: 'hi', month: '' });
  expect(errors.name).toMatch(/name/i);
  expect(errors.phone).toMatch(/country code/i);
  expect(errors.email).toMatch(/email/i);
  expect(errors.message).toBeTruthy();
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
