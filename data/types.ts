export type LocationRole = 'operated' | 'taught' | 'proctored';

export type Location = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  role: LocationRole;
  years: string;
  blurb: string;
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

export type Milestone = {
  markerYear: string; // "1988"
  markerSub: string; // "The beginning"
  yearLabel: string; // "1988 - 1994"
  tag: string; // "Foundation"
  title: string;
  body: string;
  meta?: string;
  photoTitle: string;
  photoCaption: string;
};

export type Faq = { question: string; answer: string };

export type Citation = { id: number; text: string };
