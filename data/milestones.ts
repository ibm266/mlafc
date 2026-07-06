import type { Milestone } from './types';

export const milestones: Milestone[] = [
  {
    markerYear: '1988',
    markerSub: 'Foundation',
    yearLabel: '1988',
    tag: 'Foundation · to 1994',
    title: 'A medical student with a destination in mind.',
    body: 'Professor Gupta begins his MB BS in India in 1988. He set his sights on a career in cardiology early, long before specialisation was supposed to be on his mind, and qualified six years later as a doctor with a clear chosen path.',
    meta: 'MB BS qualified, 1994',
    photoTitle: 'Medical school',
    photoCaption:
      'A young student in India, beginning a six-year MB BS programme with cardiology already in mind.',
  },
  {
    markerYear: '2000',
    markerSub: 'London',
    yearLabel: '2000',
    tag: 'London calling',
    title: 'The Commonwealth Fellowship in Cardiac Electrophysiology.',
    body: 'One of the small handful of awards each year that brings exceptional young doctors from across the Commonwealth to the United Kingdom for advanced training. The Fellowship marks the formal beginning of his electrophysiology career, the discipline of treating the heart\'s electrical system. He completes specialist training in the UK, including MD and DM higher degrees, MRCP membership, and the years of supervised practice required before consultant appointment.',
    meta: 'MD · DM · MRCP',
    photoTitle: 'Commonwealth Fellow',
    photoCaption:
      'Awarded the Commonwealth Fellowship in Cardiac Electrophysiology. Training in the UK begins.',
    photoFirst: true,
  },
  {
    markerYear: '2007',
    markerSub: 'Liverpool',
    yearLabel: '2007',
    tag: 'Consultant',
    title: 'Appointed at Liverpool Heart and Chest Hospital.',
    body: 'LHCH is the United Kingdom\'s largest specialist cardiothoracic centre. It provides a regional electrophysiology service to a population of 2.8 million people across the North West of England, a referral catchment larger than Greater Mumbai. Professor Gupta has been in continuous full-time practice there since.',
    meta: '18+ years and counting',
    photoTitle: 'LHCH',
    photoCaption:
      'Appointed consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital.',
  },
  {
    markerYear: '2009',
    markerSub: 'High-volume',
    yearLabel: '2009',
    tag: 'High-volume practice',
    title: '200 ablations a year. Every year.',
    body: 'From 2009 onwards, Professor Gupta consistently performs over 200 catheter ablation procedures for atrial fibrillation each year, placing him among the highest-volume operators in the United Kingdom. Volume matters in electrophysiology. The literature is clear: outcomes are tightly correlated with operator experience, and centres performing under 50 ablations a year have measurably worse complication rates than those above 200.',
    meta: '10,000+ AF ablations · <1% complication rate',
    photoTitle: 'In theatre',
    photoCaption:
      'Begins performing 200+ AF ablation cases every year, a pace he has maintained since.',
    photoFirst: true,
  },
  {
    markerYear: '2012',
    markerSub: 'FRCP',
    yearLabel: '2012',
    tag: 'Royal College',
    title: 'Elected FRCP, London.',
    body: 'The Fellowship of the Royal College of Physicians is conferred on senior physicians who have practised as substantive consultants for over five years and who have made a recognised contribution to medicine. It is, in British medicine, the post-nominal that matters, and the one that Mumbai families will recognise from generations of Indian doctors who trained in London.',
    meta: 'Fellow since 2012',
    photoTitle: 'FRCP, London',
    photoCaption:
      'Elected Fellow of the Royal College of Physicians, one of British medicine\'s senior distinctions.',
  },
  {
    markerYear: '2014',
    markerSub: 'National award',
    yearLabel: '2014',
    tag: 'National recognition',
    title: 'The Arrhythmia Alliance Excellence in Practice Award.',
    body: 'Awarded annually for "Outstanding Individual who has contributed to Arrhythmia Services" in the UK. The same year, the Primary Care Atrial Fibrillation pathway he helped develop won "Anticoagulation Innovation of the Year" from the British Medical Association, and he was invited to speak at the All-Party Parliamentary Group on Atrial Fibrillation in Westminster.',
    meta: 'National practice award · BMA innovation award · Westminster invited speaker',
    photoTitle: 'Excellence in Practice',
    photoCaption:
      'Receives the Arrhythmia Alliance Excellence in Practice Award for outstanding contribution to UK arrhythmia services.',
    photoFirst: true,
  },
  {
    markerYear: '2017',
    markerSub: 'NHS awards',
    yearLabel: '2017 & 2022',
    tag: 'NHS Clinical Excellence',
    title: 'Bronze, then Silver. Recognised nationally, twice.',
    body: '',
    variant: 'awards-band',
    awards: [
      {
        title: 'NHS Bronze, 2017',
        body: 'The NHS Clinical Excellence Awards recognise consultants who deliver work over and above the standard expected of their role, assessed nationally against a competitive field of senior doctors. The Bronze level is itself uncommon.',
      },
      {
        title: 'NHS Silver, 2022',
        body: 'Five years after Bronze, only a small fraction of NHS consultants are recognised at this level. Silver reflects sustained national-level contribution: to clinical practice, research, teaching and the wider profession.',
        highlight: true,
      },
    ],
    photoTitle: 'NHS recognition',
    photoCaption: 'National Bronze and Silver Clinical Excellence Awards.',
  },
  {
    markerYear: '2024',
    markerSub: 'Professor',
    yearLabel: '2024',
    tag: 'Academic',
    title: 'Honorary Professor of Cardiology.',
    body: 'Appointed honorary Professor of Cardiology at the University of Liverpool, alongside an existing Senior Lectureship at Imperial College London held since 2011. By this point, Professor Gupta has authored more than 350 peer-reviewed publications, cited over 13,000 times, and has secured around £5 million in competitive research grants from the NIHR, British Heart Foundation and industry. He serves as Chief Investigator for five multicentre clinical trials: PRESSURE, SMAAN-PAF, PRAISE, VISTAX and CRAFT.',
    meta: '350+ publications · 13,000+ citations · £5M in research grants',
    photoTitle: 'Professorship',
    photoCaption: 'Appointed honorary Professor of Cardiology at the University of Liverpool.',
  },
];

export const finaleMilestone: Milestone = {
  markerYear: '2026',
  markerSub: 'Mumbai',
  yearLabel: '2026',
  tag: 'Mumbai London AF Clinic',
  title: 'And now, home.',
  body: 'Mumbai London AF Clinic opens, bringing more than thirty years of UK electrophysiology practice back to the city where the journey began. Professor Gupta visits Mumbai for in-person consultations and procedures during scheduled clinic dates. Trusted local cardiologists provide continuity of care between visits, with his ongoing supervision. The same standard of arrhythmia care he provides at Liverpool, with the dignity of being treated close to home.',
  meta: 'Specialist atrial fibrillation care · Mumbai',
  photoTitle: 'Mumbai',
  photoCaption:
    'Mumbai London AF Clinic opens, bringing thirty years of UK practice back to the city where the journey began.',
  variant: 'finale',
};
