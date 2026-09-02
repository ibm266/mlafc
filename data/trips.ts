import type { Trip, TripPhoto } from './types';

/**
 * Visits, newest first. The home page shows `latestTrip`; every trip keeps
 * its route, its photographs and, when there was one, its headline moment.
 *
 * Photographs are web derivatives (1600px long edge, WebP) built from the
 * untracked originals in "Website Photos/" with
 * scripts/build-photo-derivatives.mjs. A photograph without a `cityId` has
 * not yet been matched to a stop and shows only in the carousel.
 */
const indiaAugust2026Photos: TripPhoto[] = [
  {
    id: 'narayana-kolkata-team-2026',
    cityId: 'kolkata',
    src: '/images/visits/india-aug-2026/narayana-kolkata-team-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'Six clinicians in navy, maroon and green scrubs and theatre caps stand arm in arm in front of a bank of cath lab monitors showing live electrograms, Professor Gupta in the centre with his arms folded.',
    title: 'Narayana Health, Kolkata',
    caption: 'With the electrophysiology team at Narayana Health, Kolkata, between cases.',
    meta: 'August 2026',
  },
  {
    id: 'apollo-trichy-team-2026',
    cityId: 'trichy',
    src: '/images/visits/india-aug-2026/apollo-trichy-team-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'A dozen staff in pale blue scrubs and theatre caps, and one in a green sari, gather round Professor Gupta, in a dark suit, as he holds a gilt plaque outside a door marked Procedure Room.',
    title: 'Apollo Hospitals, Trichy',
    caption: 'The whole cath lab team at Apollo Hospitals, Trichy, after a day of cases, with the plaque they presented.',
    meta: 'August 2026',
  },
  {
    id: 'chennai-cme-lecture-2026',
    cityId: 'chennai',
    src: '/images/visits/india-aug-2026/chennai-cme-lecture-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta speaks into a microphone beside a screen carrying his title slide, Interventional management of Atrial Fibrillation, in front of a seated audience of cardiologists.',
    title: 'Tamil Nadu EPIC meeting, Chennai',
    caption:
      'Lecturing on the interventional management of atrial fibrillation to cardiologists at the Tamil Nadu EPIC meeting in Chennai.',
    meta: 'August 2026',
  },
  {
    id: 'live-case-2026',
    src: '/images/visits/india-aug-2026/live-case-2026.webp',
    width: 1280,
    height: 960,
    alt: 'Gowned operators in blue crowd round a draped patient under a theatre light, two of them wearing headsets with microphones, a Philips X-ray unit to the right.',
    title: 'A live case',
    caption: 'At the table with the local team, headsets carrying the commentary to the cardiologists watching the case.',
    meta: 'August 2026',
  },
  {
    id: 'apollo-trichy-plaque-2026',
    cityId: 'trichy',
    src: '/images/visits/india-aug-2026/apollo-trichy-plaque-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta, in a dark suit, holds a gilt plaque with a star trophy between three cardiologists in scrubs and a lead gown, in the corridor outside a procedure room.',
    title: 'A plaque from Trichy',
    caption: 'Presented with a plaque of appreciation by the cardiologists at Apollo Hospitals, Trichy.',
    meta: 'August 2026',
  },
  {
    id: 'cath-lab-team-2026',
    src: '/images/visits/india-aug-2026/cath-lab-team-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'Eight staff in blue, purple, navy and green scrubs stand in a line across a cath lab, the Philips C-arm and a draped table behind them and a 3D map on the monitor.',
    title: 'The cath lab team',
    caption: "With the cath lab team after the day's pulsed field ablation cases.",
    meta: 'August 2026',
  },
  {
    id: 'chennai-cme-felicitation-2026',
    cityId: 'chennai',
    src: '/images/visits/india-aug-2026/chennai-cme-felicitation-2026.webp',
    width: 1200,
    height: 1600,
    alt: 'Professor Gupta is draped in a pink shawl and handed a wrapped gift by the meeting organisers on a carpeted stage, three colleagues looking on.',
    title: 'Felicitated in Chennai',
    caption: 'Honoured with a shawl by the organisers of the Tamil Nadu EPIC meeting, Chennai.',
    meta: 'August 2026',
  },
  {
    id: 'first-pfa-case-cake-2026',
    src: '/images/visits/india-aug-2026/first-pfa-case-cake-2026.webp',
    width: 1600,
    height: 900,
    alt: 'Professor Gupta in blue scrubs cuts a large iced cake on a boardroom table, a colleague in grey scrubs beside him and eight staff applauding behind.',
    title: "A hospital's first",
    caption: "Cutting the cake after a hospital's first pulsed field ablation case, with the team that did it.",
    meta: 'August 2026',
  },
];

export const trips: Trip[] = [
  {
    id: 'india-aug-2026',
    label: 'August 2026 India visit',
    dates: '12 to 27 August 2026',
    title: 'Sixteen days, six cities, nine hospitals. And a first for India.',
    summary:
      'Proctoring pulsed field ablation cases alongside local cardiologists from Mumbai to Kolkata, Hyderabad, Chennai, Trichy and Bengaluru, and lecturing in between.',
    stats: [
      { value: 16, label: 'days' },
      { value: 6, label: 'cities' },
      { value: 9, label: 'hospitals' },
      { value: 1, label: 'first for India' },
    ],
    cities: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        lat: 19.076,
        lng: 72.8777,
        dates: '12 to 14 August, and 27 August',
        hospitals: ['Lilavati Hospital and Research Centre'],
        note:
          "Three days of pulsed field ablation cases with the Lilavati team, among them India's first combined PFA and LAAO on 14 August, then a final day of cases before flying home.",
        labelSide: 'left',
      },
      {
        id: 'kolkata',
        name: 'Kolkata',
        lat: 22.5726,
        lng: 88.3639,
        dates: '17 and 18 August',
        hospitals: ['Narayana Health'],
        note: 'Two days proctoring pulsed field ablation cases with the electrophysiology team at Narayana Health.',
        labelSide: 'right',
      },
      {
        id: 'hyderabad',
        name: 'Hyderabad',
        lat: 17.385,
        lng: 78.4867,
        dates: '19 to 21 August',
        hospitals: ['AIG Hospitals', 'Apollo Hospitals', 'KIMS Hospitals'],
        note: 'Three hospitals in three days: cases with the teams at AIG, Apollo and KIMS.',
        labelSide: 'left',
      },
      {
        id: 'chennai',
        name: 'Chennai',
        lat: 13.0827,
        lng: 80.2707,
        dates: '22, 23 and 26 August',
        hospitals: ['Kauvery Hospital', 'Apollo Hospitals'],
        note:
          'Cases at Kauvery Hospital, a lecture on the interventional management of atrial fibrillation at the Tamil Nadu EPIC meeting, then back on the 26th for a day at Apollo.',
        labelSide: 'right',
      },
      {
        id: 'trichy',
        name: 'Trichy',
        lat: 10.7905,
        lng: 78.7047,
        dates: '24 August',
        hospitals: ['Apollo Hospitals'],
        note: 'A day of cases with the Apollo team, who marked the visit with a plaque of appreciation.',
        labelSide: 'bottom',
      },
      {
        id: 'bengaluru',
        name: 'Bengaluru',
        lat: 12.9716,
        lng: 77.5946,
        dates: '25 August',
        hospitals: ['Sri Jayadeva Institute of Cardiovascular Sciences and Research'],
        note: 'A return to the public-sector Jayadeva Institute, where the programme also ran cases in October 2025.',
        labelSide: 'left',
      },
    ],
    route: ['mumbai', 'kolkata', 'hyderabad', 'chennai', 'trichy', 'bengaluru', 'chennai', 'mumbai'],
    feature: {
      id: 'india-first',
      stamp: 'First in India',
      eyebrow: '14 August 2026 · Lilavati Hospital, Mumbai',
      title: "India's first combined pulsed field ablation and left atrial appendage occlusion.",
      body: [
        'A 77-year-old man from Juhu had lived for years with heart failure after bypass surgery, and then with recurrent atrial fibrillation. AF raised his risk of a stroke, but every attempt at blood thinners ended in serious bleeding from stomach ulcers, sometimes needing transfusions. Stop the tablets and risk a stroke. Continue them and risk a bleed.',
        'On 14 August Professor Gupta and the Lilavati team answered both problems in one sitting. Pulsed field ablation treated the rhythm. Left atrial appendage occlusion sealed the pouch where the clots behind AF strokes form, so he no longer depends on blood thinners. Start to finish, the procedure took an hour and a half. At his review two weeks later the device was well seated and his heart was in normal rhythm.',
        'The hospital reported it as the first time the two procedures had been combined in India. The Indian Express, Sakal and the ANI wire carried the story.',
      ],
      quote: {
        text: 'Our objective was to address both the issues in a single procedure. During the procedure, we eliminated the primary source of clot formation with LAAO and treated the abnormal heart rhythm with PFA.',
        attribution: 'Professor Dhiraj Gupta',
        detail: 'quoted by ANI, 1 September 2026',
      },
      patientQuote: {
        text: 'Simple activities became a source of everyday worry. Since undergoing the procedure, he has regained his confidence to get back to his routine and enjoy life without the same constant fear. It has given him and all of us a new sense of hope.',
        short:
          'Since undergoing the procedure, he has regained his confidence to get back to his routine and enjoy life without the same constant fear. It has given him and all of us a new sense of hope.',
        attribution: 'Kaushal Shah',
        detail: "the patient's son, in the hospital's statement",
      },
      facts: [
        { value: '77', label: 'years old' },
        { value: '90', label: 'minutes, start to finish' },
        { value: '2', label: 'weeks to a normal-rhythm review' },
      ],
      steps: [
        { label: 'Pulsed field ablation', detail: 'Treats the rhythm' },
        { label: 'Appendage occlusion', detail: 'Seals the clot source' },
      ],
      duration: '1 h 30 min',
      storyId: 'india-first-pfa-laao',
      summary:
        'A 77-year-old who could not take blood thinners had his rhythm treated and his appendage sealed in one 90-minute procedure at Lilavati Hospital. Two weeks on, the device was well seated and he was in normal rhythm.',
      href: '/conditions#india-first',
      conditionId: 'laao',
    },
    photos: indiaAugust2026Photos,
  },
];

export const latestTrip: Trip = trips[0];
