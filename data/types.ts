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
  month: string; // display label, e.g. "August 2026" or "27 Sep to 4 Oct 2026"
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

export type MilestonePhoto = {
  src: string;
  /** Intrinsic pixel size of the derivative in public/, needed by next/image. */
  width: number;
  height: number;
  /** Descriptive alt text. Not a repeat of photoCaption. */
  alt: string;
};

export type MilestoneVideo = {
  src: string;
  /** Still frame shown until the viewer presses play. Nothing loads before that. */
  posterSrc: string;
  /** Intrinsic pixel size of the video, so the window reserves the right shape. */
  width: number;
  height: number;
  /** What the film shows, for the play control and the video's accessible name. */
  label: string;
  /** Duration as minutes and seconds, e.g. "0:46". Shown on the play control. */
  duration: string;
  /** Who produced it, shown under the frame. */
  credit?: string;
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
  /** A real photograph. Milestones without one fall back to the ECG placeholder. */
  photo?: MilestonePhoto;
  /** A film, shown in place of the photograph. Takes precedence over `photo`. */
  video?: MilestoneVideo;
  /**
   * A set of photographs. A milestone with one runs full width, with the
   * carousel below the prose rather than in the narrow photo column.
   */
  gallery?: GalleryPhoto[];
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

export type GalleryPhoto = {
  /** Slug, also the filename stem under public/images/gallery. */
  id: string;
  src: string;
  /** Intrinsic pixel size of the derivative in public/, needed by next/image. */
  width: number;
  height: number;
  /** Descriptive alt text: what is happening and where. Not the caption. */
  alt: string;
  /** Short label shown as the heading beneath the carousel stage. */
  title: string;
  /** One factual sentence shown beneath the carousel stage. */
  caption: string;
  /** When the photograph was taken, e.g. "October 2025". */
  meta: string;
};

export type TeamPhoto = {
  src: string;
  /** Intrinsic pixel size of the derivative in public/, needed by next/image. */
  width: number;
  height: number;
  /** Descriptive alt text. Not a repeat of the name and role beside it. */
  alt: string;
};

export type TeamTraining = {
  /** Years as shown, e.g. "2022 to 2023" or "1983". */
  period: string;
  qualification: string;
  institution: string;
  /** Optional distinction earned, e.g. "First rank in the cohort". */
  note?: string;
};

export type TeamWork = {
  title: string;
  /** Where and when it was published or presented. */
  detail: string;
};

export type TeamMember = {
  id: string;
  name: string;
  /** Letters after the name, as they should read on the page. */
  postnominals: string;
  /** One-line role, e.g. "Consultant Cardiologist, Mumbai". */
  role: string;
  photo: TeamPhoto;
  /** One or two sentences, used on the home page card. */
  excerpt: string;
  /** Full profile paragraphs for the team page. */
  bio: string[];
  /** Where they see patients. */
  appointments: string[];
  /** Training, most recent first. */
  training: TeamTraining[];
  /** Why this consultant is the right person to have on an AF case. */
  afFocus: string[];
  /** A short, checkable selection of published or presented work. */
  selectedWork: TeamWork[];
  /** Optional line about the person away from the clinic. */
  interests?: string;
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
  ecgVariant?:
    | 'af'
    | 'atrial-flutter'
    | 'svt'
    | 'palpitations'
    | 'blackouts'
    | 'bradycardia'
    | 'laao'
    | 'cardioneuroablation';
  videoAlt: string;
  isSymptom?: boolean;
  isProcedure?: boolean;
  /** Show the India-rarity note next to this item on the home page. */
  indiaExpertise?: boolean;
  /** IDs from data/publications.json, shown as papers on this condition. */
  publicationIds?: string[];
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
