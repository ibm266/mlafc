export type PhoneCountry = {
  code: string;
  dialCode: string;
  label: string;
};

/** Curated for patients enquiring about Mumbai / London cardiac care. */
export const phoneCountries: PhoneCountry[] = [
  { code: 'IN', dialCode: '+91', label: 'India (+91)' },
  { code: 'GB', dialCode: '+44', label: 'United Kingdom (+44)' },
  { code: 'AE', dialCode: '+971', label: 'United Arab Emirates (+971)' },
  { code: 'US', dialCode: '+1', label: 'United States (+1)' },
  { code: 'SG', dialCode: '+65', label: 'Singapore (+65)' },
  { code: 'AU', dialCode: '+61', label: 'Australia (+61)' },
  { code: 'CA', dialCode: '+1', label: 'Canada (+1)' },
  { code: 'SA', dialCode: '+966', label: 'Saudi Arabia (+966)' },
  { code: 'QA', dialCode: '+974', label: 'Qatar (+974)' },
  { code: 'KW', dialCode: '+965', label: 'Kuwait (+965)' },
  { code: 'OM', dialCode: '+968', label: 'Oman (+968)' },
  { code: 'BH', dialCode: '+973', label: 'Bahrain (+973)' },
  { code: 'NP', dialCode: '+977', label: 'Nepal (+977)' },
  { code: 'BD', dialCode: '+880', label: 'Bangladesh (+880)' },
  { code: 'PK', dialCode: '+92', label: 'Pakistan (+92)' },
  { code: 'LK', dialCode: '+94', label: 'Sri Lanka (+94)' },
  { code: 'DE', dialCode: '+49', label: 'Germany (+49)' },
  { code: 'FR', dialCode: '+33', label: 'France (+33)' },
  { code: 'IE', dialCode: '+353', label: 'Ireland (+353)' },
  { code: 'NL', dialCode: '+31', label: 'Netherlands (+31)' },
  { code: 'CH', dialCode: '+41', label: 'Switzerland (+41)' },
  { code: 'IT', dialCode: '+39', label: 'Italy (+39)' },
  { code: 'ES', dialCode: '+34', label: 'Spain (+34)' },
  { code: 'ZA', dialCode: '+27', label: 'South Africa (+27)' },
  { code: 'NZ', dialCode: '+64', label: 'New Zealand (+64)' },
  { code: 'MY', dialCode: '+60', label: 'Malaysia (+60)' },
  { code: 'HK', dialCode: '+852', label: 'Hong Kong (+852)' },
  { code: 'JP', dialCode: '+81', label: 'Japan (+81)' },
  { code: 'KE', dialCode: '+254', label: 'Kenya (+254)' },
  { code: 'NG', dialCode: '+234', label: 'Nigeria (+234)' },
];

export const defaultPhoneCountry = 'IN';

export const phoneCountryCodes = new Set(phoneCountries.map((country) => country.code));
