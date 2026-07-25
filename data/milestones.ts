import { academicPhotos, proctoringPhotos } from './gallery';
import type { Milestone } from './types';

export const milestones: Milestone[] = [
  {
    markerYear: '1988',
    markerSub: 'The beginning',
    yearLabel: '1988',
    tag: 'Foundation',
    title: 'A medical student with a destination in mind.',
    body: 'Professor Gupta begins his MB BS in India in 1988. He set his sights on a career in cardiology early, long before specialisation was supposed to be on his mind, and qualified six years later as a doctor with a clear chosen path. He is a Gold Medallist in each of the three professional examinations, and tops his batch in his final MBBS examinations, being awarded the Kamla Nehru Medal.',
    meta: 'MB BS qualified, 1994',
    photoTitle: 'Medical school',
    photoCaption:
      'A young student in India, beginning a six-year MB BS programme with cardiology already in mind. 1988 to 1994.',
    photo: {
      src: '/images/journey/mbbs-convocation-1994.webp',
      width: 1019,
      height: 1400,
      alt: 'Dhiraj Gupta in academic cap and gown at his MB BS convocation in India, 1994.',
    },
  },
  {
    markerYear: '1994',
    markerSub: 'India',
    yearLabel: '1994-2000',
    tag: 'Post graduation',
    title: "Post graduation at India's premier institutes.",
    body: 'Dr Gupta gets the All India 2nd Rank amongst the 125,000 doctors who take the National Post Graduate Medical Entrance Examination in 1994. He successfully completes a 3 years residency in Internal Medicine (MD) at the Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh in 1997, followed by 3 years senior residency in Cardiology (DM) at the All India Institute of Medical Sciences (AIIMS), New Delhi in 2000. Dr Gupta presents 4 original research papers at the Annual Scientific Congress of the American College of Cardiology in Anaheim, USA 2000, and gets awarded the Young Investigator Award by the American College of Cardiologists of Indian Origin.',
    photoTitle: 'Post graduation',
    photoCaption:
      'MD at PGIMER Chandigarh and DM at AIIMS New Delhi, after All India 2nd rank in the national entrance examination.',
    photo: {
      src: '/images/journey/dm-aiims-convocation-2000.webp',
      width: 1400,
      height: 1050,
      alt: 'Dhiraj Gupta in scarlet doctoral robes receiving his DM in Cardiology on stage at the AIIMS New Delhi convocation, 2000.',
    },
  },
  {
    markerYear: '2000',
    markerSub: 'London',
    yearLabel: '2000-2006',
    tag: 'London calling',
    title: 'The Commonwealth Fellowship in Cardiac Electrophysiology.',
    body: "One of the small handful of awards each year that brings exceptional doctors from across the Commonwealth to the United Kingdom for advanced training, the Fellowship marks the formal beginning of Dr Gupta's electrophysiology career, the discipline of treating the heart's electrical system. He completes 6 years super-specialist training in EP in some of the most well known hospitals in London, including St. George's Hospital, St. Bartholomew's Hospital, Royal London Hospital and the London Chest Hospital, being awarded the Completion of Certificate of Specialist Training (CCST) in 2006. During this period, Dr Gupta trains with some of the biggest names in cardiology globally, including Prof John Camm and Prof Richard Schilling, and develops a special interest in the management of Atrial Fibrillation (AF), the most common Heart Rhythm disorder.",
    meta: 'MD · DM · MRCP',
    photoTitle: 'Commonwealth Fellow',
    photoCaption:
      'Awarded the Commonwealth Fellowship in Cardiac Electrophysiology. Six years of super-specialist EP training in London.',
    photoFirst: true,
    photo: {
      src: '/images/journey/commonwealth-fellowship-2000.webp',
      width: 1294,
      height: 1140,
      alt: 'Dr Dhiraj Gupta, wearing a delegate badge reading New Delhi, India, with a senior cardiologist at a scientific meeting in 2000.',
    },
  },
  {
    markerYear: '2006',
    markerSub: 'Liverpool',
    yearLabel: '2006-date',
    tag: 'Consultant',
    title: 'Appointed at Liverpool Heart and Chest Hospital (LHCH).',
    body: "LHCH, earlier known as the Cardiothoracic Center (CTC), is the United Kingdom's largest stand alone specialist cardiothoracic centre. It provides a regional electrophysiology service to a population of 2.8 million people across the North West of England and North Wales. Professor Gupta is appointed as Consultant Electrophysiologist here in 2006, with a remit to develop the complex arrhythmia service, especially AF ablation.",
    meta: '18+ years and counting',
    photoTitle: 'LHCH',
    photoCaption:
      'Appointed Consultant Electrophysiologist at Liverpool Heart and Chest Hospital in 2006.',
    video: {
      src: '/videos/lhch-overview.mp4',
      posterSrc: '/videos/lhch-overview-poster.webp',
      width: 848,
      height: 480,
      label:
        "A short film on Liverpool Heart and Chest Hospital, the regional electrophysiology service it runs for 2.8 million people, and Professor Gupta's work there.",
      duration: '0:46',
      credit: 'Film: Liverpool Heart and Chest Hospital NHS Foundation Trust.',
    },
  },
  {
    markerYear: '2009',
    markerSub: 'High-volume',
    yearLabel: '2009',
    tag: 'High-volume practice',
    title: 'More than 300 ablations a year. Every year.',
    body: 'Professor Gupta consistently performs over 300 catheter ablation procedures for atrial fibrillation each year, placing him among the highest-volume operators in the United Kingdom. Volume matters in electrophysiology. The literature is clear: outcomes are tightly correlated with operator experience, and centres performing over 200 ablations a year have measurably better outcomes than those below 50.',
    meta: '10,000+ AF ablations · <1% complication rate',
    photoTitle: 'In theatre',
    photoCaption:
      'Begins performing more than 300 AF ablation cases every year, a pace he has maintained since.',
    photoFirst: true,
    photo: {
      src: '/images/journey/in-theatre.webp',
      width: 1600,
      height: 900,
      alt: 'Professor Gupta, gowned and masked at the ablation table, points to the mapping screen while a colleague beside him follows the direction. The X-ray C-arm and the draped patient are in view.',
    },
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
      "Elected Fellow of the Royal College of Physicians, one of British medicine's senior distinctions.",
    photo: {
      src: '/images/journey/frcp-london-2012.webp',
      width: 1165,
      height: 1400,
      alt: 'Dr Dhiraj Gupta in the purple and gold gown of the Royal College of Physicians, holding his fellowship scroll, London 2012.',
    },
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
    photo: {
      src: '/images/journey/arrhythmia-alliance-2014.webp',
      width: 1400,
      height: 989,
      alt: 'Arrhythmia Alliance award certificate to Prof Dhiraj Gupta, October 2014, for outstanding individual contribution to arrhythmia services in the UK, signed by Trudie Lobban and Prof A John Camm.',
    },
  },
  {
    markerYear: '2019',
    markerSub: 'Professor',
    yearLabel: '2019',
    tag: 'Academic',
    title: 'Honorary Professor of Cardiology, University of Liverpool.',
    body: 'Appointed honorary Professor of Cardiology at the University of Liverpool, alongside an existing Senior Lectureship at Imperial College London held since 2011. Professor Gupta has authored more than 350 peer-reviewed scientific publications, cited over 13,000 times, and has secured around £5 million in competitive research grants from the NIHR, British Heart Foundation and industry. He serves as Chief Investigator for five multicentre clinical trials: PRESSURE, SMAAN-PAF, PRAISE, VISTAX and CRAFT.',
    meta: '350+ publications · 13,000+ citations · £5M in research grants',
    photoTitle: 'Professorship',
    photoCaption: 'Appointed honorary Professor of Cardiology at the University of Liverpool.',
    photoFirst: true,
    gallery: academicPhotos,
  },
  {
    markerYear: '2022',
    markerSub: 'NHS Silver',
    // Anchored to the Silver, which is the 2022 event. The Bronze it supersedes
    // is carried in the body and the meta line rather than in its own milestone.
    yearLabel: '2022',
    tag: 'NHS Clinical Excellence',
    title: 'NHS National Clinical Excellence Awards, Bronze then Silver.',
    body: 'The NHS Clinical Excellence Awards recognise consultants who deliver work over and above the standard expected of their role, assessed nationally against a competitive field of senior doctors. The Bronze level is itself uncommon, and Professor Gupta receives it in 2017. Five years later he is awarded the highly coveted National Silver, confirmed by the Advisory Committee on Clinical Excellence Awards in January 2022. Only a small fraction of NHS consultants (<1%) are recognised at this level. The Silver award reflects sustained national-level contribution, not just to clinical practice, but to research, teaching and the wider profession.',
    meta: 'National Bronze 2017 · National Silver 2022',
    photoTitle: 'NHS Silver',
    photoCaption:
      'The Silver award letter from the Advisory Committee on Clinical Excellence Awards, January 2022.',
    photo: {
      src: '/images/journey/nhs-silver-letter-2022.webp',
      width: 630,
      height: 683,
      alt: 'Letter from the Advisory Committee on Clinical Excellence Awards and the Department of Health and Social Care to Dr Dhiraj Gupta at Liverpool Heart and Chest Hospital, dated 10 January 2022, confirming a Silver award under the Clinical Excellence Awards 2021.',
    },
  },
  {
    markerYear: '2022-india',
    markerSub: 'Indo-UK',
    yearLabel: '2022-date',
    tag: 'Indo-UK programme',
    title: 'Indo-UK health proctoring programme.',
    body: "During Dr Gupta's regular visits to India over the years, he observes the real need for advanced EP services in India. For several years, he performs procedures adhoc in many hospitals as and when called for. He also trains many Indian cardiologists at LHCH in Liverpool who return to lead on EP programs in many Indian cities such as Chennai, Kolkata, Hyderabad and Delhi. In 2022, Dr Gupta starts a formal mentoring program for cardiologists in India, where he takes several weeks a year out of his busy schedule in the UK to travel the length and breadth of India and train local cardiologists. These workshops involve performing complex cases with the local cardiologists with an aim to share best practice developed over two decades and tens of thousands of procedures performed in the UK. This program takes Dr Gupta to all corners of India, including Chandigarh, New Delhi, Ahmedabad, Mumbai, Pune, Hyderabad, Bangalore, Kolkata, Bhubaneswar and Guwahati. Furthermore, all these workshops are free for patients, hospitals and doctors, with Dr Gupta not charging them for his time and expertise.",
    photoTitle: 'Indo-UK mentoring',
    photoCaption:
      'Formal mentoring programme training cardiologists across India, with free workshops for patients, hospitals and doctors.',
    photoFirst: true,
    gallery: proctoringPhotos,
  },
];

export const finaleMilestone: Milestone = {
  markerYear: '2025',
  markerSub: 'Mumbai',
  yearLabel: '2025',
  tag: 'Mumbai London AF Clinic',
  title: 'And now, Mumbai.',
  body: 'For years, Mumbai families flew to the United Kingdom to be treated by Professor Gupta, because the ablation they needed was not available at home. Cardiologists at Lilavati Hospital asked him to bring the service to Mumbai instead. Mumbai London AF Clinic opened there in December 2025, with Drs Malav Jhala and Darshan Jhala. He returns every few weeks for consultations and procedures, and between visits Drs Jhala look after continuity of care with his input and supervision throughout. Twenty five years of UK electrophysiology practice, back where it started, and no longer a flight away.',
  meta: 'Specialist atrial fibrillation care · Mumbai',
  photoTitle: 'Mumbai',
  photoCaption:
    'Mumbai London AF Clinic opens in December 2025 with Drs Malav Jhala and Darshan Jhala.',
  variant: 'finale',
  photo: {
    src: '/images/journey/lilavati-mumbai-2026.webp',
    width: 1400,
    height: 1050,
    alt: 'Professor Gupta scrubbed in with the cardiology team in the catheter laboratory at Lilavati Hospital, Mumbai.',
  },
};
