import { site } from '@/data/site';

function getWhatsAppHref() {
  if (site.whatsappHref.startsWith('https://wa.me/')) {
    return site.whatsappHref;
  }

  const digits = site.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export function WhatsAppFab() {
  return (
    <a
      href={getWhatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="interactive fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-night shadow-lg hover:shadow-xl focus-visible:shadow-xl"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.7 1.6.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.2Z" />
      </svg>
    </a>
  );
}
