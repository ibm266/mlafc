import { latestTrip } from './trips';
import type { GalleryPhoto } from './types';

/**
 * Photographs from the Indo-UK proctoring programme, ordered deliberately:
 * the strongest frame first. Files are web derivatives (1600px long edge,
 * WebP) built from the untracked originals in "Website Photos/".
 *
 * The latest visit's photographs lead, straight from data/trips.ts, so the
 * album and the visit section never drift apart.
 */
export const galleryPhotos: GalleryPhoto[] = [
  ...latestTrip.photos,
  {
    id: 'jayadeva-lab-2025',
    src: '/images/gallery/jayadeva-lab-2025.webp',
    width: 1600,
    height: 900,
    alt: 'Wide view of a busy cardiac catheterisation laboratory. A draped patient lies on the table while a dozen gowned and lead-aproned staff stand around it, and a colour 3D cardiac map fills the monitor on the right.',
    title: 'In the lab, Bengaluru',
    caption:
      'Mid-procedure at Sri Jayadeva Institute, Bengaluru, with the 3D electroanatomic map on screen guiding the ablation catheter.',
    meta: 'October 2025',
  },
  {
    id: 'aig-team-2025',
    src: '/images/gallery/aig-team-2025.webp',
    width: 1600,
    height: 1200,
    alt: 'Around twenty hospital staff in blue and maroon scrubs line both sides of a corridor. Professor Gupta stands in the centre in a dark suit beside a senior colleague in a white coat.',
    title: 'The full team, Hyderabad',
    caption: 'With the electrophysiology team at AIG Hospitals, Hyderabad.',
    meta: 'October 2025',
  },
  {
    id: 'ahmedabad-2026',
    src: '/images/gallery/ahmedabad-2026.webp',
    width: 1280,
    height: 960,
    alt: 'Eight operators in surgical gowns, caps and lead aprons stand behind a draped instrument trolley in a cath lab, with the X-ray C-arm and a live fluoroscopy screen behind them.',
    title: 'Scrubbed in, Ahmedabad',
    caption: 'Gowned at the table with the cath lab team in Ahmedabad.',
    meta: 'March 2026',
  },
  {
    id: 'jayadeva-team-2025',
    src: '/images/gallery/jayadeva-team-2025.webp',
    width: 1600,
    height: 1065,
    alt: 'A long line of about twenty doctors, nurses and technicians in scrubs and theatre caps outside the cath lab doors of a public hospital, under a sign reading "please enter cath lab without ego and arrogance".',
    title: 'Cath lab, Bengaluru',
    caption: 'The cath lab team at Sri Jayadeva Institute of Cardiovascular Sciences, Bengaluru.',
    meta: 'October 2025',
  },
  {
    id: 'af-summit-2026',
    src: '/images/gallery/af-summit-2026.webp',
    width: 1225,
    height: 745,
    alt: 'Three cardiologists sit at a podcast desk with studio microphones and an "on air" sign. Professor Gupta is in the middle, mid-sentence, in front of a backdrop reading #AFIB2026.',
    title: 'On air, AF Ablation Summit',
    caption:
      'Recording a panel discussion on atrial fibrillation ablation technique with fellow faculty.',
    meta: '2026',
  },
  {
    id: 'safdarjung-2025',
    src: '/images/gallery/safdarjung-2025.webp',
    width: 1200,
    height: 1600,
    alt: 'Two younger doctors in scrubs present a bouquet of pink flowers to Professor Gupta in a hospital side room, with more of the team watching from behind.',
    title: 'Safdarjung Hospital, Delhi',
    caption:
      'Thanked by the electrophysiology team after a day of cases at Safdarjung Hospital, New Delhi.',
    meta: 'October 2025',
  },
  {
    id: 'pgimer-faculty-2026',
    src: '/images/gallery/pgimer-faculty-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'A senior professor hands Professor Gupta an engraved plaque in a hospital office lined with framed photographs, trophies and an Indian flag, watched by a colleague in scrubs.',
    title: 'Visiting faculty, PGIMER',
    caption:
      'Receiving the visiting faculty plaque at PGIMER Chandigarh, the institute where he trained.',
    meta: 'March 2026',
  },
  {
    id: 'blk-max-2025',
    src: '/images/gallery/blk-max-2025.webp',
    width: 1121,
    height: 841,
    alt: 'Nine members of a cardiology team stand shoulder to shoulder in a cath lab, some in theatre gowns and lead aprons, with Professor Gupta in dark scrubs in the middle.',
    title: 'BLK Max Hospital, Delhi',
    caption: 'With the team at BLK Max Hospital, New Delhi.',
    meta: 'October 2025',
  },
  {
    id: 'escorts-2026',
    src: '/images/gallery/escorts-2026.webp',
    width: 1280,
    height: 960,
    alt: 'Seven staff in navy scrubs stand together in a cath lab control room, monitors and reporting workstations behind them and the lead-glass window through to the lab.',
    title: 'Control room, Delhi',
    caption: 'In the cath lab control room at Escorts Hospital, New Delhi.',
    meta: 'March 2026',
  },
  {
    id: 'pgimer-team-2026',
    src: '/images/gallery/pgimer-team-2026.webp',
    width: 1280,
    height: 960,
    alt: 'Six cardiologists and trainees in scrubs and theatre caps in front of the lead-glass control window of the PGIMER cath lab, the procedure room visible through the glass behind them.',
    title: 'PGIMER Chandigarh',
    caption: 'With the electrophysiology team at PGIMER Chandigarh.',
    meta: 'March 2026',
  },
  {
    id: 'dnm-pune-2026',
    src: '/images/gallery/dnm-pune-2026.webp',
    width: 1600,
    height: 1200,
    alt: 'Five doctors stand together in a bright cath lab recovery bay, name badges reading cardiology, with Professor Gupta in the centre out of scrubs.',
    title: 'Deenanath Mangeshkar, Pune',
    caption: 'With the cardiology team at DNM Hospital, Pune.',
    meta: 'April 2026',
  },
];

/**
 * The teaching and lecturing side of the academic post: invited faculty at the
 * European and international meetings, the China lecture tour, and the live
 * cases broadcast out of Liverpool. Shown on the journey page against the 2019
 * professorship. Same build recipe as the photographs above.
 */
export const academicPhotos: GalleryPhoto[] = [
  {
    id: 'ehra-vienna-2025',
    src: '/images/journey/academic/ehra-vienna-2025.webp',
    width: 1600,
    height: 1184,
    alt: 'Professor Gupta speaks from a lectern marked EHRA 2025, Vienna, beside a panel of four seated faculty. The screen above shows a table of pulsed field ablation trials and their reporting years.',
    title: 'EHRA, Vienna',
    caption:
      'Invited faculty at the European Heart Rhythm Association congress, presenting the state of the evidence on pulsed field ablation.',
    meta: 'March 2025',
  },
  {
    id: 'nhaf-madrid-2024',
    src: '/images/journey/academic/nhaf-madrid-2024.webp',
    width: 1600,
    height: 1068,
    alt: 'A lit stage in front of a full auditorium. Three faculty sit in armchairs while a fourth speaks at a lectern, under a wide screen showing a colour 3D voltage map of the left atrium alongside live electrograms.',
    title: 'New Horizons in Atrial Fibrillation, Madrid',
    caption:
      'On the faculty panel at New Horizons in Atrial Fibrillation, working through a case from the live map on screen.',
    meta: '2024',
  },
  {
    id: 'nhaf-advisors-madrid-2024',
    src: '/images/journey/academic/nhaf-advisors-madrid-2024.webp',
    width: 1600,
    height: 1106,
    alt: 'Four faculty stand on stage as the screen behind them introduces the course advisors: Prof Kyoung-Ryul Julian Chun, Dr Melanie Gunawardene and Prof Dhiraj Gupta.',
    title: 'Course advisor, Madrid',
    caption:
      'Named one of three course advisors for New Horizons in Atrial Fibrillation, setting the teaching programme for the meeting.',
    meta: '2024',
  },
  {
    id: 'rio-broadcast-2021',
    src: '/images/journey/academic/rio-broadcast-2021.webp',
    width: 1600,
    height: 875,
    alt: 'A broadcast console showing four live panels at once: two 3D reconstructions of the left atrium studded with red ablation points, a bank of intracardiac electrograms, a fluoroscopy image, and two camera feeds of the operating team. The banner reads LIVE, Liverpool.',
    title: 'Broadcast live from Liverpool',
    caption:
      'A case transmitted live to the Rhythm Interventions Online meeting, with the 3D map, electrograms and theatre cameras running side by side.',
    meta: 'December 2021',
  },
  {
    id: 'rio-live-case-2021',
    src: '/images/journey/academic/rio-live-case-2021.webp',
    width: 1600,
    height: 801,
    alt: 'Two operators in blue gowns and lead collars work at a draped table beside the X-ray C-arm, watching a large mapping screen. A LIVE, Liverpool banner sits in the corner of the transmitted picture.',
    title: 'At the table, live case',
    caption:
      'Operating at Liverpool Heart and Chest Hospital while the case is broadcast to the meeting audience.',
    meta: 'December 2021',
  },
  {
    id: 'af-symposium-2020',
    src: '/images/journey/academic/af-symposium-2020.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta lectures from a lectern on a red-lit stage. The screen behind carries his slide on the acute efficacy and long-term outcomes of second-generation cryoballoon pulmonary vein isolation in patients with a left common pulmonary vein.',
    title: 'Cryoballoon outcomes',
    caption:
      'Presenting multicentre outcome data on cryoballoon pulmonary vein isolation to an atrial fibrillation symposium.',
    meta: '2020',
  },
  {
    id: 'af-symposium-2019',
    src: '/images/journey/academic/af-symposium-2019.webp',
    width: 1200,
    height: 1600,
    alt: 'A five-person faculty panel sits in a row on a red-curtained stage, while the screen above shows Professor Gupta in close-up, speaking into a headset microphone.',
    title: 'On the panel',
    caption: 'Speaking from the faculty panel at an atrial fibrillation symposium.',
    meta: '2019',
  },
  {
    id: 'china-shanghai-2019',
    src: '/images/journey/academic/china-shanghai-2019.webp',
    width: 1600,
    height: 1165,
    alt: 'Professor Gupta lectures with a headset microphone and a presenter remote, in front of a painted backdrop of pagodas and willows, beside a lectern carrying Chinese anticoagulation conference branding.',
    title: 'Shanghai',
    caption: 'Lecturing on anticoagulation and ablation on the China lecture tour.',
    meta: '2019',
  },
  {
    id: 'china-beijing-2019',
    src: '/images/journey/academic/china-beijing-2019.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta stands teaching at the head of a hospital meeting room, laptop open in front of him, addressing about fifteen clinicians in white coats and scrubs seated around a long table.',
    title: 'Teaching round, Beijing',
    caption:
      'A departmental teaching session with the cardiology staff of a Beijing hospital.',
    meta: '2019',
  },
  {
    id: 'china-shenyang-lecture-2019',
    src: '/images/journey/academic/china-shenyang-lecture-2019.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta speaks from a lectern beside a host holding a microphone, to a seated audience of Chinese clinicians. The slide reads "Uninterrupted NOAC use during catheter ablation" over the RE-CIRCUIT, VENTURE-AF, AXAFA-AFNET 5 and ELIMINATE-AF trials.',
    title: 'Shenyang',
    caption:
      'Taking a Chinese audience through the trial evidence for uninterrupted anticoagulation during catheter ablation.',
    meta: '2019',
  },
  {
    id: 'china-shenyang-2019',
    src: '/images/journey/academic/china-shenyang-2019.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta at the lectern in a conference room hung with chandeliers, presenting a slide on the international expert consensus recommendations for anticoagulation in patients undergoing atrial fibrillation ablation.',
    title: 'Consensus guidance, Shenyang',
    caption:
      'On the international consensus recommendations for anticoagulating patients through an ablation.',
    meta: '2019',
  },
  {
    id: 'japan-hrs-2019',
    src: '/images/journey/academic/japan-hrs-2019.webp',
    width: 1600,
    height: 1202,
    alt: 'Professor Gupta and a Japanese colleague lean in for a close photograph at a conference dinner, other delegates and banqueting tables behind them.',
    title: 'Japan Heart Rhythm Society',
    caption: 'With a fellow electrophysiologist at the Japanese Heart Rhythm Society meeting.',
    meta: '2019',
  },
  {
    id: 'korea-hrs-seoul-2019',
    src: '/images/journey/academic/korea-hrs-seoul-2019.webp',
    width: 1600,
    height: 1200,
    alt: 'Professor Gupta sits between two Korean colleagues in a conference lounge, all three wearing delegate badges, bookshelves and meeting seating behind them.',
    title: 'Seoul',
    caption:
      'With colleagues at the Korean Heart Rhythm Society meeting in Seoul, one of the invited faculty.',
    meta: '2019',
  },
];

/**
 * The Indo-UK programme on the journey page: the 2022 photograph that opened
 * the milestone, followed by the full set from the home page. One list, so the
 * two pages never drift apart.
 */
export const proctoringPhotos: GalleryPhoto[] = [
  {
    id: 'indo-uk-aig-2022',
    src: '/images/journey/indo-uk-aig-2022.webp',
    width: 1400,
    height: 1050,
    alt: 'Professor Gupta with a fellow cardiologist at AIG Hospitals Hyderabad in 2022, beneath a screen welcoming him to the hospital.',
    title: 'Where the programme started',
    caption:
      'At AIG Hospitals, Hyderabad, in the year the formal mentoring programme began.',
    meta: '2022',
  },
  ...galleryPhotos,
];
