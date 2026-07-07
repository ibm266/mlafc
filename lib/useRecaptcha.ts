'use client';

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

export const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!recaptchaSiteKey || !window.grecaptcha) {
    return null;
  }

  return new Promise((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        resolve(await window.grecaptcha!.execute(recaptchaSiteKey, { action }));
      } catch {
        resolve(null);
      }
    });
  });
}
