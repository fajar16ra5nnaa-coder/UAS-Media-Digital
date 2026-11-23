-- RuasSetara PLSV — Initial Schema with Strict RLS & Realtime
-- Follows Supabase Security Checklist:
-- 1. RLS enabled on all public tables
-- 2. Uses TO authenticated / TO anon (never deprecated auth.role())
-- 3. Never trusts user_metadata for authorization; uses profiles.role guarded by DB trigger
-- 4. UPDATE policies always have both USING and WITH CHECK

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) BETWEEN 1 AND 120),
  role TEXT NOT NULL CHECK (role IN ('guru', 'siswa')),
  class_name TEXT DEFAULT '',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lkpd_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage_number INT NOT NULL CHECK (stage_number BETWEEN 1 AND 4),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  scaffolding_used JSONB NOT NULL DEFAULT '{"level1":0,"level2":0,"level3":0}'::jsonb,
  score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, stage_number)
);

CREATE TABLE IF NOT EXISTS public.diagnostic_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  correct_count INT NOT NULL CHECK (correct_count >= 0),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  misconception_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  duration_seconds INT NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('kompetitif', 'latihan')),
  score INT NOT NULL CHECK (score >= 0),
  correct_count INT NOT NULL CHECK (correct_count >= 0),
  total_questions INT NOT NULL CHECK (total_questions > 0),
  max_streak INT NOT NULL DEFAULT 0 CHECK (max_streak >= 0),
  duration_seconds INT NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('umum', 'sandbox', 'lkpd', 'evaluasi')),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 1000),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lkpd_user ON public.lkpd_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_user_created ON public.diagnostic_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_mode_score ON public.quiz_attempts(mode, score DESC);
CREATE INDEX IF NOT EXISTS idx_chat_channel_created ON public.chat_messages(channel, created_at ASC);

-- Trigger to prevent role self-escalation on profiles (Review Focus #2)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_setting('role', true) NOT IN ('service_role', 'postgres', 'supabase_admin')
       AND current_user NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Peran akun tidak dapat diubah secara langsung.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Explicit schema & table grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles, public.quiz_attempts TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lkpd_submissions, public.diagnostic_attempts, public.quiz_attempts, public.chat_messages TO authenticated;

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own_siswa" ON public.profiles;
CREATE POLICY "profiles_insert_own_siswa"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id AND role = 'siswa');

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- LKPD_SUBMISSIONS policies (student owns rows; guru reads all)
DROP POLICY IF EXISTS "lkpd_select_own_or_guru" ON public.lkpd_submissions;
CREATE POLICY "lkpd_select_own_or_guru"
  ON public.lkpd_submissions FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'guru'
    )
  );

DROP POLICY IF EXISTS "lkpd_insert_own" ON public.lkpd_submissions;
CREATE POLICY "lkpd_insert_own"
  ON public.lkpd_submissions FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lkpd_update_own" ON public.lkpd_submissions;
CREATE POLICY "lkpd_update_own"
  ON public.lkpd_submissions FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- DIAGNOSTIC_ATTEMPTS policies (student owns rows; guru reads all)
DROP POLICY IF EXISTS "diagnostic_select_own_or_guru" ON public.diagnostic_attempts;
CREATE POLICY "diagnostic_select_own_or_guru"
  ON public.diagnostic_attempts FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'guru'
    )
  );

DROP POLICY IF EXISTS "diagnostic_insert_own" ON public.diagnostic_attempts;
CREATE POLICY "diagnostic_insert_own"
  ON public.diagnostic_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- QUIZ_ATTEMPTS policies (competitive scores readable for leaderboard; own rows readable/insertable)
DROP POLICY IF EXISTS "quiz_select_leaderboard_or_own" ON public.quiz_attempts;
CREATE POLICY "quiz_select_leaderboard_or_own"
  ON public.quiz_attempts FOR SELECT
  TO anon, authenticated
  USING (
    mode = 'kompetitif'
    OR (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'guru'
    )
  );

DROP POLICY IF EXISTS "quiz_insert_own" ON public.quiz_attempts;
CREATE POLICY "quiz_insert_own"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- CHAT_MESSAGES policies (authenticated read & insert; guru-only verify/pin update)
DROP POLICY IF EXISTS "chat_select_authenticated" ON public.chat_messages;
CREATE POLICY "chat_select_authenticated"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "chat_insert_own" ON public.chat_messages;
CREATE POLICY "chat_insert_own"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND is_verified = false
    AND is_pinned = false
  );

DROP POLICY IF EXISTS "chat_update_guru_only" ON public.chat_messages;
CREATE POLICY "chat_update_guru_only"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'guru'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'guru'
    )
  );

-- Enable Realtime on chat_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END
$$;
