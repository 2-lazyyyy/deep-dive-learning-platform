// ============================================
// DeepDive Learn — Core Type Definitions
// Hierarchy: Unit → Module → Lesson
// 3 Lesson Types: code_fix, fill_blanks, multiple_choice
// ============================================

export type LessonType = 'code_fix' | 'fill_blanks' | 'multiple_choice';

// Content block for the left side (theory panel)
export interface ContentBlock {
  type: 'text' | 'code' | 'image' | 'video';
  content: string; // markdown text, code string, or URL
  language?: string; // for code blocks
  caption?: string; // for images/videos
}

// Base lesson fields shared by all types
interface BaseLessonFields {
  id: string;
  moduleId: string;
  title: string;
  xpReward: number;
  orderIndex: number;
  // Rich left-side content (replaces the old "theory" string)
  contentBlocks: ContentBlock[];
}

// Type 1: Code Fix — write/fix code and match expected output
export interface CodeFixLesson extends BaseLessonFields {
  lessonType: 'code_fix';
  initialCode: string;
  expectedOutput: string;
}

// Type 2: Fill in the Blanks — code template with blanks, pick tokens
export interface FillBlanksLesson extends BaseLessonFields {
  lessonType: 'fill_blanks';
  // Code lines with _BLANK_ placeholders
  codeTemplate: string[];
  // Correct token for each blank (in order)
  correctTokens: string[];
  // Available token pool (includes correct + distractors)
  tokenPool: string[];
}

// Type 3: Multiple Choice — pick the correct answer
export interface MultipleChoiceLesson extends BaseLessonFields {
  lessonType: 'multiple_choice';
  question: string;
  options: string[];
  correctIndex: number;
}

// Union type
export type Lesson = CodeFixLesson | FillBlanksLesson | MultipleChoiceLesson;

// Legacy compatibility: extract theory string from contentBlocks
export function getLessonTheory(lesson: Lesson): string {
  return lesson.contentBlocks
    .filter((b) => b.type === 'text')
    .map((b) => b.content)
    .join('\n\n');
}

export interface Module {
  id: string;
  unitId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  modules: Module[];
}

export interface UserProgress {
  completedLessonIds: string[];
  currentLessonId: string | null;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  title: string;
  date: string;
  difficulty: Difficulty;
  xpReward: number;
  goal: number; // e.g., complete 5 lessons
  contentBlocks: ContentBlock[];
  constraints: string[];
  initialCode: string;
  expectedOutput: string;
}
