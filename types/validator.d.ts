declare module 'validator' {
  export interface IsEmailOptions {
    allow_display_name?: boolean;
    require_display_name?: boolean;
    allow_utf8_local_part?: boolean;
    require_tld?: boolean;
    allow_ip_domain?: boolean;
    domain_specific_validation?: boolean;
  }

  export interface NormalizeEmailOptions {
    gmail_remove_dots?: boolean;
  }

  export function isEmail(str: string, options?: IsEmailOptions): boolean;
  export function normalizeEmail(email: string, options?: NormalizeEmailOptions): string | false;
}
