export type TrackYear = '2022' | '2023' | '2024';

export interface DayMeta {
  id: string; // e.g. "2022-1"
  year: TrackYear;
  day: number;
  slug: string; // e.g. "day-01"
  rawTitle: string;
  title: string;
  description: string;
  tags: string[];
  moduleNumber: number;
  moduleTitle: string;
  moduleIcon: string;
  moduleColor: string;
  estimatedMinutes: number;
  filePath: string;
}

export interface DayDetail extends DayMeta {
  content: string;
}

export interface ModuleInfo {
  number: number;
  title: string;
  description: string;
  daysRange: [number, number];
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  topics: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleNumber: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface CheatSheetCommand {
  id: string;
  category: 'Linux' | 'Docker' | 'Kubernetes' | 'Git' | 'Terraform' | 'Ansible' | 'Networking' | 'CI/CD' | 'Monitoring';
  command: string;
  description: string;
  example?: string;
  tags: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
  unlockedAt?: string;
  requiredDays?: number[];
  requiredCount?: number;
}

export interface UserProgress {
  completedDays: Record<string, boolean>; // key: "2022-1" or "2022-day-01"
  bookmarkedDays: Record<string, boolean>;
  notes: Record<string, string>;
  quizScores: Record<number, { score: number; total: number; percentage: number; completedAt: string }>;
  userName: string;
  lastActiveDate: string;
  currentStreak: number;
  bestStreak: number;
}
