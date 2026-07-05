import type { Condition } from './types';

export const conditions: Condition[] = [
  {
    id: 'af',
    title: 'Atrial fibrillation (AF)',
    feelsLike: [
      'An irregular, often fast heartbeat',
      'Some people feel nothing at all',
      'Tiredness, breathlessness, or anxiety',
    ],
    happening:
      'The upper chambers of your heart, the atria, beat in a disorganised way instead of a steady rhythm. Blood does not move through as smoothly, which is why AF raises stroke risk if left unmanaged.',
    help:
      'Professor Gupta has treated atrial fibrillation for more than thirty years and performs over 200 ablation procedures a year. At your consultation he will explain what is happening in your heart, whether a procedure is right for you, and which technology suits your situation, in plain language.',
    ecgVariant: 'af',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside atrial fibrillation, with an irregular fibrillatory baseline between unevenly spaced beats.',
  },
  {
    id: 'atrial-flutter',
    title: 'Atrial flutter',
    feelsLike: [
      'A fast but usually very regular heartbeat, often 130-150 beats per minute',
      'A fluttering, pounding, or racing sensation in the chest',
      'Breathlessness, tiredness, or lightheadedness, especially on exertion',
    ],
    happening:
      'In atrial flutter, the upper chambers of your heart do not beat chaotically as they do in AF. Instead, one electrical signal races round a fixed circuit, usually in the right atrium, in a fast, regular loop. This is why the pulse in atrial flutter often feels very steady, just very fast. Like AF, it can allow blood to pool and clot in the heart, so it carries a similar stroke risk and is assessed the same careful way.',
    help:
      'Because the electrical circuit follows a predictable, mappable path, atrial flutter often responds very well to catheter ablation, a small procedure that interrupts the loop at one precise point. Professor Gupta will confirm the diagnosis with an ECG, explain how likely ablation is to work for your specific type of flutter, and discuss whether blood-thinning treatment is also needed.',
    ecgVariant: 'atrial-flutter',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside atrial flutter, with regular sawtooth flutter waves and evenly spaced QRS complexes.',
  },
  {
    id: 'svt',
    title: 'Supraventricular tachycardia (SVT)',
    feelsLike: [
      'Sudden episodes of a very fast heartbeat, sometimes over 150 beats per minute',
      'A racing heart that starts and stops abruptly, sometimes without warning',
      'Chest discomfort, breathlessness, or lightheadedness while an episode lasts',
    ],
    happening:
      'SVT is a general term for fast rhythms that start above the heart\u2019s main pumping chambers. Most often, it is caused by an extra electrical pathway, present since birth, that lets signals loop back on themselves and briefly take over the heartbeat. Episodes tend to begin and end suddenly, lasting anywhere from seconds to hours, and can happen at any age.',
    help:
      'Most types of SVT can be located precisely with a heart rhythm test called an electrophysiology study, and treated in the same sitting with catheter ablation, often ending the problem for good. Professor Gupta will explain which type of SVT you have, how likely ablation is to succeed for it, and what the day of the procedure involves.',
    ecgVariant: 'svt',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside supraventricular tachycardia, with fast regular narrow QRS complexes and no visible P waves.',
  },
  {
    id: 'palpitations',
    title: 'Palpitations & unexplained heart racing',
    feelsLike: [
      'A sudden awareness of your own heartbeat, fluttering, pounding, or thumping',
      'A sense that your heart has skipped a beat or added an extra one',
      'Racing that appears with no obvious trigger, or lingers after exercise or stress has passed',
    ],
    happening:
      'Palpitations describe a noticeable heartbeat, they are a symptom, not a diagnosis in themselves. Often the cause is entirely harmless, caffeine, alcohol, anxiety, or hormonal changes can all bring them on. Sometimes, though, they are the first sign of an underlying rhythm problem such as AF, atrial flutter, SVT, or extra "ectopic" beats. Working out which it is starts with recording what your heart is actually doing while you feel the symptom.',
    help:
      'Professor Gupta will take a careful history, then usually arrange an ECG and a period of heart rhythm monitoring, sometimes a few days, sometimes longer, to capture an episode as it happens. Once there is a clear diagnosis, he will explain in plain language exactly what is going on and which treatment, if any, fits your situation.',
    ecgVariant: 'palpitations',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside palpitations, with mostly normal beats interrupted by an early ectopic beat and a brief compensatory pause.',
    isSymptom: true,
  },
  {
    id: 'blackouts-dizziness',
    title: 'Unexplained blackouts & dizziness',
    feelsLike: [
      'Sudden loss of consciousness (syncope), with or without any warning',
      'Lightheadedness, dizziness, or a feeling that the room is spinning',
      'A near-blackout that passes after a few seconds, sometimes with pale skin or sweating',
    ],
    happening:
      'A blackout happens when blood flow to the brain briefly falls, often because the heart beats too slowly, pauses, or occasionally too fast, to keep up with demand. Not every blackout is heart-related, simple faints and low blood pressure are common and usually harmless, but some are caused by significant rhythm problems that carry a real risk if they go unrecognised, which is why unexplained blackouts deserve a proper cardiac assessment.',
    help:
      'Professor Gupta will look for a rhythm problem around the time your blackouts happen, using ECG monitoring and, where needed, a small implantable loop recorder that watches your heart continuously for months at a time. If a cause such as bradycardia or heart block is found, he will explain clearly whether a pacemaker or another treatment is the right next step.',
    ecgVariant: 'blackouts',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside a prolonged pause, when blood flow to the brain can briefly fall during a blackout.',
    isSymptom: true,
  },
  {
    id: 'bradycardia',
    title: 'Bradycardia (slow heart rhythms)',
    feelsLike: [
      'A resting heart rate that stays persistently below 60 beats per minute',
      'Tiredness, breathlessness, or a reduced ability to exercise',
      'Dizziness, lightheadedness, or blackouts if the rhythm slows further',
    ],
    happening:
      'Bradycardia means the heart\u2019s natural pacemaker, or the electrical wiring that carries its signal onward, is firing too slowly or being partly blocked along the way. A slow heart rate is completely normal in fit, healthy people and during sleep, but a persistently slow or pausing rhythm can mean the heart is no longer pumping enough blood to meet the body\u2019s needs.',
    help:
      'Professor Gupta will establish whether your slow rhythm is a normal variant or something that needs treatment, usually with an ECG and a period of heart rate monitoring. Where a pacemaker is the right answer, he will explain in plain language how it works, what the procedure to fit one involves, and what daily life with one is like afterwards.',
    ecgVariant: 'bradycardia',
    videoAlt:
      'ECG comparison showing a regular heartbeat rhythm alongside bradycardia, with the same beat shape at a slower, wider-spaced rate.',
  },
];
