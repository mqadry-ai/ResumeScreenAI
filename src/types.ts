export interface JobProfile {
  id: string;
  name: string;
  field: string;
  experience: string;
  weightExperience: number;
  skills: string;
  weightSkills: number;
  otherRequirements: string;
}

export interface CandidateResult {
  id: string;
  profileId: string;
  fileName: string;
  name: string;
  score: number;
  scoreBreakdown: {
    experience: number;
    skills: number;
    other: number;
  };
  strengths: string[];
  summary: string;
  status: 'pending' | 'analyzing' | 'success' | 'error';
  errorMessage?: string;
  file?: File;
}
