export interface InterviewData {
  messages: Array<{ role: string; content: string }>;
  company: string;
  jobTitle: string;
  specialization: string;
  interviewType: string;
  duration: number;
  createdAt?: unknown;
  analysis?: unknown;
}

export interface QuizData {
  score: number;
  total: number;
  company: string;
  jobTitle: string;
  difficulty: string;
  createdAt?: unknown;
}

export interface AnalysisData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: {
    topic: string;
    reason: string;
  }[];
  toneAnalysis?: {
    confidenceLevel: string;
    professionalism: string;
    feedback: string;
  };
  starMethodFeedback?: string;
  idealAnswers?: {
    question: string;
    userAnswerSummary: string;
    idealAnswer: string;
  }[];
}
