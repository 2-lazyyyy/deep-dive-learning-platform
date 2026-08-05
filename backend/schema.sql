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
    theory_content TEXT,
    starter_code TEXT NOT NULL DEFAULT '',
    expected_output TEXT NOT NULL DEFAULT '',
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
INSERT INTO users (id, name, email, role, xp, hearts)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Teacher',
    'teacher@deepdive.edu',
    'teacher',
    0,
    5
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SEED DATA: Sample Student Account (For Demo)
-- ============================================================
INSERT INTO users (id, name, email, role, xp, hearts)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Demo Student',
    'student@deepdive.edu',
    'student',
    45,
    5
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
INSERT INTO lessons (id, module_id, title, theory_content, starter_code, expected_output, xp_reward, order_index)
VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 1: Hello World ထုတ်ခြင်း',
    '## Hello World\nPython မှာ screen ပေါ်သို့ text ထုတ်ရန် `print()` function ကို သုံးသည်။\n\nprint() function သည် parentheses ထဲ ထည့်သော text ကို screen ပေါ်တွင် ပြသည်။',
    'print("___")',
    'Hello, World!',
    15,
    1
),
(
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 2: Variable သတ်မှတ်ခြင်း',
    '## Variables\nVariable ဆိုသည်မှာ data ကို သိမ်းဆည်းသော နေရာတစ်ခုဖြစ်သည်။\n\nname = "Alice"\nprint(name)',
    'name = "___"\nprint(name)',
    'Alice',
    15,
    2
),
(
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 3: Number ထုတ်ခြင်း',
    '## Numbers\nPython မှာ Integer နဲ့ Float ဆိုသော number types ၂ မျိုးရှိသည်။\n\nage = 20\nprint(age)',
    'age = ___\nprint(age)',
    '20',
    15,
    3
),
(
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 4: String Concatenation',
    '## String တွေ ပေါင်းခြင်း\n+ operator ဖြင့် string နှစ်ခု ပေါင်းနိုင်သည်။\n\nfirst = "Hello"\nsecond = "World"\nprint(first + " " + second)',
    'first = "Hello"\nsecond = "___"\nprint(first + " " + second)',
    'Hello Myanmar',
    20,
    4
),
(
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000001',
    'Lesson 5: User Input ယူခြင်း',
    '## Input ယူခြင်း\ninput() function ဖြင့် user ထံမှ data ယူနိုင်သည်။\n\nname = input("Enter your name: ")\nprint("Welcome, " + name)',
    'name = "DeepDive"\nprint("Welcome, " + name)',
    'Welcome, DeepDive',
    20,
    5
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
