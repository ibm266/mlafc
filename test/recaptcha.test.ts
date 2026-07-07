import { verifyRecaptchaToken } from '@/lib/verifyRecaptcha';

test('verifyRecaptchaToken skips verification when secret is not configured', async () => {
  const original = process.env.RECAPTCHA_SECRET_KEY;
  delete process.env.RECAPTCHA_SECRET_KEY;

  await expect(verifyRecaptchaToken(null)).resolves.toBeNull();

  if (original) {
    process.env.RECAPTCHA_SECRET_KEY = original;
  }
});
