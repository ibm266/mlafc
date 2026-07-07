import { conditions } from '@/data/conditions';

export const enquiryConditions = [
  ...conditions.map((condition) => ({ id: condition.id, label: condition.title })),
  { id: 'not-sure', label: 'Not sure yet' },
  { id: 'other', label: 'Something else' },
] as const;

export const enquiryReferralSources = [
  { id: 'google', label: 'Google or online search' },
  { id: 'social', label: 'Social media' },
  { id: 'doctor', label: 'Referral from my doctor' },
  { id: 'friend', label: 'Friend or family recommendation' },
  { id: 'article', label: 'Article or publication' },
  { id: 'previous-patient', label: 'Previously seen Professor Gupta' },
  { id: 'other', label: 'Other' },
] as const;

export const enquiryContactPreferences = [
  { id: 'phone', label: 'Phone call' },
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const;

export const enquiryConditionIds = new Set<string>(enquiryConditions.map((option) => option.id));
export const enquiryReferralSourceIds = new Set<string>(enquiryReferralSources.map((option) => option.id));
export const enquiryContactPreferenceIds = new Set<string>(enquiryContactPreferences.map((option) => option.id));
