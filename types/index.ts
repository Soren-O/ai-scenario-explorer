export interface ParameterOption {
  label: string;
  value: number;
  description?: string;
}

export interface Parameter {
  id: string;
  name: string;
  description: string;
  options: ParameterOption[];
}

export type Company = 'Google' | 'Anthropic' | 'OpenAI' | 'xAI' | 'Meta';

export interface Configuration {
  parameters: {
    codingTimeHorizonDoubling: number;
    codingTimeHorizonForAC: number;
    doublingDifficulty: number;
    topToMedianRatio: number;
    researchTasteSpeed: number;
  };
  companyRanking: (Company | null)[]; // Ordered from 1st to last, null in a position = that position unspecified
}

export interface ScenarioBranch {
  id: string;
  title: string;
  description: string;
  consequences: string;
  nextBranches?: ScenarioBranch[];
}

export interface Scenario {
  id: string;
  date: string;
  title: string;
  description: string;
  sourceUrl?: string;
  configuration: Configuration;
  branches: ScenarioBranch[];
  createdBy?: string;
  votes?: number;
  probability?: number;
}
