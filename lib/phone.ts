import { phoneCountryCodes } from '@/data/phone-countries';
import { isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

export function toE164(phoneCountry: string, phoneLocal: string): string | null {
  const local = phoneLocal.trim();
  if (!local || !phoneCountryCodes.has(phoneCountry)) {
    return null;
  }

  const parsed = parsePhoneNumberFromString(local, phoneCountry as CountryCode);
  if (!parsed?.isValid()) {
    return null;
  }

  return parsed.format('E.164');
}

export function validatePhone(phoneCountry: string, phoneLocal: string): string | null {
  const local = phoneLocal.trim();

  if (!local) {
    return 'Please enter your phone number.';
  }

  if (!phoneCountry || !phoneCountryCodes.has(phoneCountry)) {
    return 'Please choose your country code.';
  }

  if (!isValidPhoneNumber(local, phoneCountry as CountryCode)) {
    return 'Please enter a valid phone number for the country you selected.';
  }

  return null;
}

export function formatPhoneDisplay(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164);
  return parsed?.formatInternational() ?? e164;
}
