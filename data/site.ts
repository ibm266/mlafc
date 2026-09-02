export const site = {
  name: 'Mumbai London AF Clinic',
  /** Canonical production URL: keep in sync across sitemap, metadata, JSON-LD, and robots. */
  url: 'https://www.mumbai-london-af.clinic',
  tagline: 'London expertise. Mumbai care. Continuous follow-up.',
  phone: '+91 81695 23196',
  /** Dialable form with no spaces, so a tel: link works on every handset. */
  phoneHref: 'tel:+918169523196',
  /** The same line answers WhatsApp, so patients only ever learn one number. */
  whatsappNumber: '+91 81695 23196',
  /** wa.me takes the digits alone: no plus sign, no spaces. */
  whatsappHref: 'https://wa.me/918169523196',
  email: 'contact@mumbai-london-af.clinic',
  address: 'Lilavati Hospital, A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
  gmcLine: 'Professor Dhiraj Gupta is registered with the UK General Medical Council (GMC no. 5205561).',
  disclaimer:
    'Information on this site is for general education and is not a substitute for individual medical advice. Always consult a doctor about your own condition.',
  responseDays: '2',
} as const;
