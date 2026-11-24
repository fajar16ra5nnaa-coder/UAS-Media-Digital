export type UserRole = "guru" | "siswa";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  class_name: string;
  is_demo: boolean;
  created_at: string;
}

export interface LkpdSubmissionRow {
  id: string;
  user_id: string;
  stage_number: number;
  answers: Record<string, unknown>;
  scaffolding_used: { level1: number; level2: number; level3: number };
  score: number;
  is_completed: boolean;
  updated_at: string;
}

export interface DiagnosticAttemptRow {
  id: string;
  user_id: string;
  answers: Record<string, unknown>;
  score: number;
  correct_count: number;
  total_questions: number;
  misconception_summary: {
    mode?: string;
    klasifikasional: number;
    korelasional: number;
    teoritikal: number;
    confidentWrong?: number;
    answeredProblems?: number;
    dominantType?: string | null;
  };
  duration_seconds: number;
  created_at: string;
}

export interface QuizAttemptRow {
  id: string;
  user_id: string;
  mode: "kompetitif" | "latihan";
  score: number;
  correct_count: number;
  total_questions: number;
  max_streak: number;
  duration_seconds: number;
  created_at: string;
}

export interface ChatMessageRow {
  id: string;
  channel: "umum" | "sandbox" | "lkpd" | "evaluasi";
  user_id: string;
  content: string;
  is_verified: boolean;
  is_pinned: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    role: UserRole;
    class_name: string;
  } | null;
}
