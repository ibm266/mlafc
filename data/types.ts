export type LocationRole = 'operated' | 'taught' | 'proctored';

export type MapRegion = 'India' | 'United Kingdom' | 'Europe' | 'United States' | 'Asia';

export type Location = {
  id: string;
  name: string;
  city: string;
  country: string;
  region: MapRegion;
  lat: number;
  lng: number;
  role: LocationRole;
  years: string;
  blurb: string;
  url: string;
  images: string[];
  readMore?: string;
};

export type Visit = {
  id: string;
  month: string; // e.g. "[March] 2026" until client confirms
  status: 'open' | 'waitlist' | 'tbc';
  note: string;
};

export type TestimonialLetter = {
  tag: string;
  org: string;
  subtitle: string;
  date: string;
  body: string[];
  sigName: string;
  sigRole: string;
};

export type Testimonial = {
  id: string;
  category: 'hospital' | 'patient' | 'peer' | 'news';
  quote: string;
  attribution: string;
  detail?: string;
  masthead?: string; // news only
  date?: string; // news only
  headline?: string; // news only
  letter?: TestimonialLetter; // hospital only
};

export type MilestoneAward = {
  title: string;
  body: string;
  highlight?: boolean;
};

export type Milestone = {
  markerYear: string;
  markerSub: string;
  yearLabel: string;
  tag: string;
  title: string;
  body: string;
  meta?: string;
  photoTitle: string;
  photoCaption: string;
  variant?: 'awards-band' | 'finale';
  awards?: MilestoneAward[];
  photoFirst?: boolean;
};

export type CertificationCategory = 'india' | 'uk' | 'fellowships' | 'recognition';

export type CertificationImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type CertificationVerify = {
  label: string;
  url: string;
};

export type Certification = {
  id: string;
  /** Short label shown under the frame and used for the seal initial, e.g. "MD", "FRCP". */
  postnominal: string;
  /** Full credential name shown as the frame and dialog title. */
  title: string;
  awardingBody: string;
  location?: string;
  /** Display year or short year phrase, e.g. "1997". */
  year: string;
  category: CertificationCategory;
  /** 'scan' renders the restored photograph; 'plate' renders a typeset certificate. */
  kind: 'scan' | 'plate';
  image?: CertificationImage;
  /** Dialog body paragraphs, in the site voice. */
  story: string[];
  /** Small factual line shown in the dialog. */
  meta?: string;
  verify?: CertificationVerify;
};

export type CertificationSection = {
  id: CertificationCategory;
  label: string;
  blurb: string;
};

export type Faq = { question: string; answer: string };

export type Citation = { id: number; text: string };

export type PublicationCategory = 'original' | 'review' | 'trial' | 'guideline';

export type Publication = {
  id: string;
  category: PublicationCategory;
  title: string;
  journal: string;
  year: string;
  authors: string;
  summary: string;
  url?: string;
  featured?: boolean;
};

export type Condition = {
  id: string;
  title: string;
  feelsLike: string[];
  happening: string;
  help: string;
  videoSrc?: string;
  posterSrc?: string;
  ecgVariant?: 'af' | 'atrial-flutter' | 'svt' | 'palpitations' | 'blackouts' | 'bradycardia';
  videoAlt: string;
  isSymptom?: boolean;
};

export type ProfileLink = {
  label: string;
  sublabel: string;
  featured: boolean;
  url: string;
};

export type InterviewLink = {
  title: string;
  duration: string;
  url: string;
};

export type PressLink = {
  outlet: string;
  date: string;
  headline: string;
  note?: string;
  credit?: string;
  featured: boolean;
  url: string;
};

export type SiteLinks = {
  profiles: ProfileLink[];
  interview: InterviewLink;
  press: PressLink[];
};
