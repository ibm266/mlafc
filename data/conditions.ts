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
    videoSrc: '/videos/conditions/af.mp4',
    posterSrc: '/images/conditions/af-poster.png',
    videoAlt:
      'Schematic animation showing disorganised electrical activity in the upper heart chambers and an irregular ECG rhythm strip.',
  },
];
