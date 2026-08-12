import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { site } from '@/data/site';
import { whatsappLink } from '@/lib/contact';

/**
 * Sits in the bottom right corner of every page. The floating booking pill,
 * where it appears, is offset above it so the two never overlap.
 */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp: ${site.whatsappNumber}`}
      className="interactive fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-night shadow-lg hover:shadow-xl focus-visible:shadow-xl"
    >
      <WhatsAppIcon />
    </a>
  );
}
