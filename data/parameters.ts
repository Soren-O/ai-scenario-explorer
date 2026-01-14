import { Parameter } from '@/types';

export const parameters: Parameter[] = [
  {
    id: 'codingTimeHorizonDoubling',
    name: 'Coding Time Horizon Doubling Rate',
    description: 'How long it takes for AI coding time horizon to double',
    options: [
      { label: 'Unspecified', value: -1 },
      { label: '4 months', value: 4 },
      { label: '5 months', value: 5 },
      { label: '6 months', value: 6 },
      { label: '7 months', value: 7 },
      { label: '8 months', value: 8 },
    ],
  },
  {
    id: 'codingTimeHorizonForAC',
    name: 'Time Horizon for Automated Coder (AC)',
    description: 'Coding time horizon required to achieve Automated Coder capabilities',
    options: [
      { label: 'Unspecified', value: -1 },
      { label: '2 work days', value: 2 },
      { label: '20 work days', value: 20 },
      { label: '200 work days', value: 200 },
      { label: '2000 work days', value: 2000 },
      { label: '20000 work days', value: 20000 },
    ],
  },
  {
    id: 'doublingDifficulty',
    name: 'Difficulty Scaling per Doubling',
    description: 'How much easier or harder each subsequent time horizon doubling becomes',
    options: [
      { label: 'Unspecified', value: -1 },
      { label: '0.7', value: 0.7 },
      { label: '0.85', value: 0.85 },
      { label: '1.0', value: 1.0 },
      { label: '1.15', value: 1.15 },
      { label: '1.3', value: 1.3 },
    ],
  },
  {
    id: 'topToMedianRatio',
    name: 'Top to Median Researcher Value Ratio',
    description: 'How much more valuable are top researchers compared to median ones per experiment',
    options: [
      { label: 'Unspecified', value: -1 },
      { label: '1.1x', value: 1.1 },
      { label: '2.5x', value: 2.5 },
      { label: '4x', value: 4 },
      { label: '10x', value: 10 },
      { label: '50x', value: 50 },
    ],
  },
  {
    id: 'researchTasteSpeed',
    name: 'AI Research Taste Improvement Speed',
    description: 'How quickly AIs improve at research taste and direction-setting (in standard deviations)',
    options: [
      { label: 'Unspecified', value: -1 },
      { label: '0.2 SD', value: 0.2 },
      { label: '1 SD', value: 1 },
      { label: '2 SD', value: 2 },
      { label: '5 SD', value: 5 },
      { label: '10 SD', value: 10 },
    ],
  },
];

export const companies = ['Google', 'Anthropic', 'OpenAI', 'xAI', 'Meta'] as const;
