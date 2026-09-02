-- ============================================================
-- DeepDive Learn: University Platform - Database Schema
-- Run this in Supabase SQL Editor (once, in order)
-- ============================================================

-- 1. USERS TABLE (Students & Teachers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    xp INTEGER NOT NULL DEFAULT 0,
    hearts INTEGER NOT NULL DEFAULT 5,
    gems INTEGER NOT NULL DEFAULT 500,
    last_heart_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. UNITS TABLE (Highest syllabus level)
CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MODULES TABLE (Sub-topics under a unit)
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LESSONS TABLE (Actual coding challenges)
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lesson_type TEXT NOT NULL DEFAULT 'code_fix' CHECK (lesson_type IN ('code_fix', 'fill_blanks', 'multiple_choice')),
    content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    exercise_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    xp_reward INTEGER NOT NULL DEFAULT 15,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SUBMISSIONS TABLE (All code execution history)
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    submitted_code TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'python',
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'error')),
    passed BOOLEAN,
    output TEXT,
    error TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES (For faster queries on Teacher Dashboard)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_lesson_id ON submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_modules_unit_id ON modules(unit_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);

-- ============================================================
-- SEED DATA: Teacher Account (Phase 1 Demo)
-- ============================================================
INSERT INTO users (id, name, email, role, xp, hearts, gems, last_heart_update)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Teacher',
    'teacher@deepdive.edu',
    'teacher',
    0,
    5,
    500,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SEED DATA: Sample Student Account (For Demo)
-- ============================================================
INSERT INTO users (id, name, email, role, xp, hearts, gems, last_heart_update)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Demo Student',
    'student@deepdive.edu',
    'student',
    45,
    5,
    500,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SEED DATA: 1 Unit
-- ============================================================
INSERT INTO units (id, title, order_index)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Unit 1: Python Basics',
    1
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: 1 Module
-- ============================================================
INSERT INTO modules (id, unit_id, title, order_index)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Module 1: Variables & Output',
    1
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: 5 Sample Lessons (Python Basics)
-- ============================================================
INSERT INTO lessons (id, module_id, title, lesson_type, content_blocks, exercise_data, xp_reward, order_index)
VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 1: Hello World ထုတ်ခြင်း',
    'code_fix',
    '[{"type":"text","content":"## Hello World\nPython မှာ screen ပေါ်သို့ text ထုတ်ရန် `print()` function ကို သုံးသည်။"}]'::jsonb,
    '{"initialCode":"print(\"___\")","expectedOutput":"Hello, World!","testCode":"import sys"}',
    15,
    1
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFY: Check all tables created successfully
-- ============================================================
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'units', COUNT(*) FROM units
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions;

-- ============================================================
-- MIGRATIONS (Run if updating an existing database)
-- ============================================================
-- ALTER TABLE lessons ADD COLUMN IF NOT EXISTS lesson_type TEXT NOT NULL DEFAULT 'code_fix';
-- ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb;
-- ALTER TABLE lessons ADD COLUMN IF NOT EXISTS exercise_data JSONB NOT NULL DEFAULT '{}'::jsonb;
-- ALTER TABLE lessons DROP COLUMN IF EXISTS theory_content;
-- ALTER TABLE lessons DROP COLUMN IF EXISTS starter_code;
-- ALTER TABLE lessons DROP COLUMN IF EXISTS expected_output;
-- ALTER TABLE lessons DROP COLUMN IF EXISTS test_code;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS gems INTEGER NOT NULL DEFAULT 500;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS last_heart_update TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ============================================================
-- 6. AUTH SYNC TRIGGER (Sync auth.users -> public.users)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, xp, hearts, gems, last_heart_update)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        0,
        5,
        500,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it already exists to allow re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. USER FOLLOWS TABLE (Social Network: Following & Followers)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

