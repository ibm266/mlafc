import { site } from '@/data/site';

/**
 * The first line of the chat, written for the patient. Somebody who taps a
 * WhatsApp link is usually anxious and staring at an empty box, so the message
 * is already there, and the clinic can see at a glance where it came from.
 */
export const whatsappOpener =
  'Hello, I would like to ask about a consultation at the Mumbai London AF Clinic.';

/** A wa.me link that opens the chat with the opener already typed. */
export function whatsappLink(message: string = whatsappOpener): string {
  return `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
}
