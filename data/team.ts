import type { TeamMember } from './types';

/**
 * The Mumbai consultants who hold the clinic between Professor Gupta's visits.
 * Facts here come from the consultants' own CVs; keep it that way, and keep the
 * ordering senior first, as it reads on the page.
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'darshan-jhala',
    name: 'Dr Darshan Jhala',
    postnominals: 'MB BS, MD (General Medicine), DM (Cardiology)',
    role: 'Consultant Cardiologist, Mumbai',
    photo: {
      src: '/images/team/darshan-jhala.webp',
      width: 1000,
      height: 1250,
      alt: 'Dr Darshan Jhala, consultant cardiologist, photographed at Lilavati Hospital in Mumbai.',
    },
    excerpt:
      'Four decades of Mumbai cardiology. He took the first rank in his DM cardiology cohort at KEM Hospital in 1983, has consulted at Lilavati Hospital since 1996, and was presenting on cardiac pacing at the second Asian Pacific symposium on pacing and electrophysiology in 1982.',
    bio: [
      'Dr Darshan Jhala trained at Seth GS Medical College and KEM Hospital in Mumbai, passing every examination at the first attempt, and took the DM in cardiology in 1983 with the first rank among the candidates in his year.',
      'Both of his dissertations were about the electrical behaviour of the heart: the first on the rhythm abnormalities found in iron deficiency anaemia and what iron therapy does to them, the second on Holter monitoring and what a day of recorded beats can be made to tell you. He has been reading rhythms for a long time.',
      'He has been attached to the department of cardiology at Jaslok Hospital and Research Centre since 1989 and to Lilavati Hospital as consultant cardiologist since 1996, which is where the Mumbai clinic sees its patients. He is separately trained in cardiac electrophysiology: EP studies, radiofrequency ablation, and defibrillator implantation.',
      'He was working on atrial fibrillation before most of the tools we now use for it existed. In 1985 he presented on intraoperative verapamil for atrial fibrillation with a fast ventricular rate at the Cardiological Society of India. He is still publishing forty years later, latterly alongside his son, Dr Malav Jhala, who took the electrophysiology route his father had trained in. They have co-authored papers together every few years since 2019.',
    ],
    appointments: [
      'Consultant Cardiologist, Lilavati Hospital, Mumbai, since 1996',
      'Department of Cardiology, Jaslok Hospital and Research Centre, Mumbai, since 1989',
      'Consultant Cardiologist, Nanavati Hospital, Mumbai',
    ],
    training: [
      {
        period: '1983',
        qualification: 'DM, Cardiology',
        institution: 'Seth GS Medical College and KEM Hospital, Mumbai',
        note: 'First rank among the candidates',
      },
      {
        period: '1981',
        qualification: 'MD, General Medicine',
        institution: 'Seth GS Medical College and KEM Hospital, Mumbai',
      },
      {
        period: '1977',
        qualification: 'MB BS',
        institution: 'Seth GS Medical College and KEM Hospital, Mumbai',
        note: 'Distinction in human anatomy; Dr Shirvalkar Gold Medal in Surgery',
      },
    ],
    afFocus: [
      'Most of what atrial fibrillation asks of a clinic is not the procedure. It is the anticoagulation decision, the rate that will not settle, the drug that has stopped agreeing with you, the monitor that needs reading. That is general cardiology done carefully, week after week, and Dr Darshan Jhala has done it in Mumbai for four decades.',
      'His electrophysiology training matters here too. He knows what an ablation can and cannot fix, so the question of whether a rhythm needs a procedure or another look at the tablets reaches Professor Gupta already thought about.',
    ],
    selectedWork: [
      {
        title: 'Management of sensing failure in demand inhibited pacemakers',
        detail: 'Second Asian Pacific Symposium on Cardiac Pacing and Electrophysiology, Manila, 1982',
      },
      {
        title: 'Holter monitoring, its clinical applications',
        detail: 'DM cardiology dissertation, 1983',
      },
      {
        title: 'Electrophysiologic abnormalities of the heart in iron deficiency anaemia',
        detail: 'Acta Haematologica, 1984',
      },
      {
        title: 'Intraoperative verapamil in patients of atrial fibrillation with a fast ventricular rate',
        detail: 'Joint Annual Conference, Cardiological Society of India, 1985',
      },
      {
        title: 'Dihydrallazine in sick sinus syndrome',
        detail: 'Indian Heart Journal, 1987',
      },
      {
        title: 'Malignant cough syncope palliation on a shoestring budget',
        detail: 'Indian Heart Journal Cardiovascular Case Reports, 2019',
      },
      {
        title: 'Predicting the future for amyloid light chain amyloidosis in patients with cardiac involvement',
        detail: 'Cardiological Society of India Update, 2025',
      },
    ],
  },
  {
    id: 'malav-jhala',
    name: 'Dr Malav Jhala',
    postnominals: 'MB BS, MD (Internal Medicine), DM (Cardiology)',
    role: 'Consultant Electrophysiologist and Interventional Cardiologist, Mumbai',
    photo: {
      src: '/images/team/malav-jhala.webp',
      width: 1000,
      height: 1250,
      alt: 'Dr Malav Jhala, consultant electrophysiologist and interventional cardiologist, photographed at Lilavati Hospital in Mumbai.',
    },
    excerpt:
      'A rhythm specialist by training and by choice. After the DM in cardiology at KEM Hospital he took a full fellowship in cardiac electrophysiology at AIG Hospitals in Hyderabad, one of the Indian centres where Professor Gupta teaches, and gave the faculty talk on AF suppression algorithms at the Indian Heart Rhythm Society in 2025.',
    bio: [
      'Dr Malav Jhala read medicine at K J Somaiya Medical College, where he stood first in the college in the final MBBS examinations and was named best undergraduate of his year. He trained in internal medicine at INHS Asvini, the Indian Navy hospital in Mumbai, and took the DM in cardiology at Seth GS Medical College and KEM Hospital, staying on there as assistant professor in the department of cardiology.',
      'He then did the thing that decides what kind of cardiologist you become: a dedicated fellowship in cardiac electrophysiology at AIG Hospitals in Hyderabad, under Dr C Narasimhan. AIG is one of the Indian centres Professor Gupta has taught at under the Indo-UK proctoring programme.',
      'He consults at Lilavati Hospital and Research Centre, Criticare Asia Hospitals and BSES Global Hospital in Mumbai, and is an associate of The Arrhythmia Associates. His practice covers both halves of the specialty: catheter ablation, pacing and defibrillators on one side, coronary intervention on the other.',
      'He has presented at APHRS in Singapore, EHRA in Barcelona, and the Indian Heart Rhythm Society in Delhi and Vishakhapatnam. He took first prize for his case on refractory VT storm at the Cardiological Society of India Telangana meeting in 2023, and the best case award at the Vitatron pacing masterclass in Istanbul in 2024.',
      'He is the son of Dr Darshan Jhala. They have been putting their names on the same papers since 2019, most recently on conduction system pacing in heart failure. Between them, the family has been looking after Mumbai hearts since 1979.',
    ],
    appointments: [
      'Consultant Electrophysiologist and Interventional Cardiologist, Lilavati Hospital and Research Centre, Mumbai',
      'Consultant Electrophysiologist and Interventional Cardiologist, Criticare Asia Hospitals, Mumbai',
      'Consultant Electrophysiologist and Interventional Cardiologist, BSES Global Hospital, Mumbai',
      'Associate, The Arrhythmia Associates, Mumbai',
    ],
    training: [
      {
        period: '2022 to 2023',
        qualification: 'Fellowship in Cardiac Electrophysiology',
        institution: 'AIG Hospitals, Hyderabad',
        note: 'Under Dr C Narasimhan',
      },
      {
        period: '2017 to 2020',
        qualification: 'DM, Cardiology',
        institution: 'Seth GS Medical College and KEM Hospital, Mumbai',
      },
      {
        period: '2013 to 2016',
        qualification: 'MD, Internal Medicine',
        institution: 'INHS Asvini, Mumbai',
      },
      {
        period: '2007 to 2013',
        qualification: 'MB BS',
        institution: 'K J Somaiya Medical College and Research Centre, Mumbai',
        note: 'First in college, final MBBS; Best Undergraduate Student, 2013',
      },
    ],
    afFocus: [
      'Atrial fibrillation is a rhythm problem, and Dr Malav Jhala is a rhythm doctor. The fellowship at AIG was in exactly the work an AF procedure is built on: mapping the left atrium, understanding why a circuit keeps restarting, and ablating it.',
      'That shows in what he chooses to talk about. His 2025 faculty talk to the Indian Heart Rhythm Society asked when AF suppression algorithms in a pacemaker actually help, which is the sort of question you only ask if you spend your weeks interrogating devices and reading what they recorded.',
      'Practically, it means that between visits your device checks, your monitor downloads and your medication are being read by someone who does this every day, and who knows when to put a case in front of Professor Gupta rather than wait.',
    ],
    selectedWork: [
      {
        title: 'AF suppression algorithms, when are they helpful?',
        detail: 'Faculty talk, Indian Heart Rhythm Society, Vishakhapatnam, 2025',
      },
      {
        title: 'Epicardial scar VT ablation in a difficult pericardial access',
        detail: 'Asia Pacific Heart Rhythm Society, Singapore, 2022',
      },
      {
        title: 'Refractory VT storm management, the eye of the storm',
        detail: 'First prize, interesting case award, CSI Telangana, Hyderabad, 2023',
      },
      {
        title: 'Role of RA-LV pacing in patients with symptomatic left bundle branch block on CRT',
        detail: 'European Heart Rhythm Association, Barcelona, 2023',
      },
      {
        title: "Conduction system pacing in structural heart disease, the Noah's Ark",
        detail: 'Best case award, Vitatron Pacing World Series Masterclass, Istanbul, 2024',
      },
      {
        title: 'Conduction system pacing in heart failure',
        detail: 'Indian Society of Electrocardiography Journal, 2026',
      },
    ],
    interests: 'First degree black belt in Shotokan karate. An avid reader, a photographer, and hard to keep still.',
  },
];
