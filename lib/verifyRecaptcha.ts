type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
};

const MIN_SCORE = 0.5;

export async function verifyRecaptchaToken(token: string | null | undefined): Promise<string | null> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return null;
  }

  if (!token) {
    return 'Security check failed. Please refresh the page and try again.';
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  if (!response.ok) {
    return 'Security check failed. Please try again in a moment.';
  }

  const data = (await response.json()) as RecaptchaVerifyResponse;
  if (!data.success) {
    return 'Security check failed. Please try again.';
  }

  if (typeof data.score === 'number' && data.score < MIN_SCORE) {
    return 'We could not verify this submission. Please try again or contact us on WhatsApp.';
  }

  return null;
}
