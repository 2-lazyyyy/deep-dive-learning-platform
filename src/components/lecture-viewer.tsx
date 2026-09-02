'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Zap, 
  Sparkles, 
  Lightbulb, 
  Copy, 
  Check, 
  Terminal, 
  ChevronRight, 
  Code2, 
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Layers,
  Bookmark
} from 'lucide-react';
import { Lesson, ContentBlock } from '@/types';
import { 
  Language, 
  getLocalizedLessonTitle, 
  getLocalizedModuleTitle, 
  getLocalizedUnitTitle, 
  getLocalizedContentText 
} from '@/lib/i18n';

interface LectureViewerProps {
  lesson: Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string };
  language: Language;
  isPractice?: boolean;
}

export const LectureViewer: React.FC<LectureViewerProps> = ({
  lesson,
  language,
  isPractice = false,
}) => {
  const localizedTitle = getLocalizedLessonTitle(lesson.title, language);
  const localizedUnit = getLocalizedUnitTitle(lesson.unitTitle || '', language).replace(/^Unit \d+:\s*/, '');
  const localizedModule = getLocalizedModuleTitle(lesson.moduleTitle || '', language);

  const getExerciseTypeLabel = () => {
    switch (lesson.lessonType) {
      case 'code_fix':
        return language === 'my' ? 'ကုဒ်ရေးသားလေ့ကျင့်ခန်း' : 'Interactive Code Editor';
      case 'fill_blanks':
        return language === 'my' ? 'ကွက်လပ်ဖြည့်လေ့ကျင့်ခန်း' : 'Fill-in-the-Blanks';
      case 'multiple_choice':
        return language === 'my' ? 'ရွေးချယ်စရာ မေးခွန်း' : 'Multiple Choice Quiz';
      default:
        return language === 'my' ? 'အပြန်အလှန် သင်ခန်းစာ' : 'Interactive Lesson';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card (Hero Banner) */}
      <div className="rounded-2xl border-2 border-[#00031315] dark:border-white/15 bg-gradient-to-br from-white via-[#F8FBFC] to-[#F0F8FF] dark:from-[#060a1d] dark:via-[#09112e] dark:to-[#040817] p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#0ba2b3]/10 dark:bg-[#0ba2b3]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Breadcrumb pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 relative z-10">
          {localizedUnit && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0ba2b3]/10 dark:bg-[#0ba2b3]/20 text-[#0ba2b3] dark:text-[#38bdf8] border border-[#0ba2b3]/25">
              <Layers size={13} strokeWidth={2.5} />
              <span>{localizedUnit}</span>
            </div>
          )}
          {localizedModule && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              <BookOpen size={13} strokeWidth={2.2} />
              <span>{localizedModule}</span>
            </div>
          )}
        </div>

        {/* Lesson Title */}
        <h1 className="text-2xl sm:text-[27px] font-black text-[#000313] dark:text-white leading-[1.35] tracking-tight mb-4 relative z-10">
          {localizedTitle}
        </h1>

        {/* Meta Pills: XP & Exercise Mode */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200/80 dark:border-white/10 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            <Zap size={13} className="fill-amber-500 text-amber-500" />
            <span>{isPractice ? '+5 XP (Practice)' : `+${lesson.xpReward || 15} XP`}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0ba2b3]/10 text-[#0ba2b3] dark:text-[#38bdf8] border border-[#0ba2b3]/20">
            <Code2 size={13} strokeWidth={2.2} />
            <span>{getExerciseTypeLabel()}</span>
          </div>
        </div>
      </div>

      {/* 2. Structured Content Blocks */}
      <div className="space-y-6">
        {lesson.contentBlocks && lesson.contentBlocks.length > 0 ? (
          lesson.contentBlocks.map((block, idx) => (
            <EnhancedContentBlockRenderer 
              key={idx} 
              block={block} 
              language={language} 
            />
          ))
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-white/20 text-center text-sm font-bold text-slate-500">
            {language === 'my' ? 'သင်ခန်းစာ အချက်အလက်များ မရှိသေးပါ။' : 'No content available for this lesson.'}
          </div>
        )}
      </div>

      {/* 3. Helpful Bottom Tip Card */}
      <div className="rounded-xl p-4 bg-[#F0F8FF]/80 dark:bg-[#07132b]/80 border border-[#84D8FF]/50 dark:border-[#0284c7]/30 flex items-start gap-3 mt-8">
        <div className="w-7 h-7 rounded-lg bg-[#0ba2b3]/15 text-[#0ba2b3] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={16} />
        </div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'my'
            ? '💡 အကြံပြုချက်: ညာဘက်ရှိ Editor တွင် ကုဒ်ကို လေ့ကျင့်ရေးသားပြီး "Run Code" နှိပ်၍ အဖြေမှန်စစ်ဆေးနိုင်ပါသည်။ အခက်အခဲရှိပါက AI Tutor ကို မေးမြန်းနိုင်ပါသည်။'
            : '💡 Pro-Tip: Write your code in the editor on the right and click "Run Code" to check your solution. If stuck, feel free to ask the AI Tutor for hints!'}
        </p>
      </div>
    </div>
  );
};

// Render each block with smart markdown & card formatting
function EnhancedContentBlockRenderer({ 
  block, 
  language 
}: { 
  block: ContentBlock; 
  language: Language;
}) {
  switch (block.type) {
    case 'text': {
      const rawText = getLocalizedContentText(block.content, language);
      return <SmartMarkdownText content={rawText} language={language} />;
    }

    case 'code': {
      return (
        <CodeSnippetCard 
          code={block.content} 
          language="python" 
        />
      );
    }

    case 'image': {
      return (
        <div className="rounded-2xl overflow-hidden border-2 border-[#00031315] dark:border-white/15 shadow-sm bg-white dark:bg-[#060a1d]">
          {block.content ? (
            <img 
              src={block.content} 
              alt={block.caption || 'Lesson visual explanation'} 
              className="w-full object-cover max-h-[360px]" 
            />
          ) : (
            <div className="bg-slate-100 dark:bg-white/5 h-[180px] flex flex-col items-center justify-center text-slate-400">
              <ImageIcon size={36} className="mb-2" />
              <p className="text-xs font-bold">Image Preview</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#09112e] border-t border-slate-200/80 dark:border-white/10">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center leading-normal">
                {block.caption}
              </p>
            </div>
          )}
        </div>
      );
    }

    case 'video': {
      const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (ytMatch && ytMatch[1]) {
          return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }
        return url;
      };

      return (
        <div className="rounded-2xl overflow-hidden border-2 border-[#00031315] dark:border-white/15 shadow-sm bg-[#000313]">
          {block.content ? (
            <div className="relative pt-[56.25%]">
              <iframe 
                src={getEmbedUrl(block.content)} 
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
              <Video size={40} className="text-[#0ba2b3] mb-2" />
              <p className="text-xs font-bold">Video not specified</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2.5 bg-white dark:bg-[#060a1d] border-t border-slate-200 dark:border-white/10">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">
                {block.caption}
              </p>
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

// Smart Markdown Parser separating Headers, Missions, Tips, Lists, and Paragraphs
function SmartMarkdownText({ content, language }: { content: string; language: Language }) {
  if (!content) return null;

  // Split by code blocks first
  const sections = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        if (!section.trim()) return null;

        // Fenced code block
        if (section.startsWith('```')) {
          const match = section.match(/```(?:python|py)?\s*([\s\S]*?)```/);
          const rawCode = match ? match[1].trim() : section.replace(/```/g, '').trim();
          return <CodeSnippetCard key={idx} code={rawCode} language="python" />;
        }

        // Parse lines of markdown text
        const lines = section.split('\n');
        const elements: React.ReactNode[] = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // 1. Headings (## or ###)
          if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('# ')) {
            const headingText = line.replace(/^#{1,3}\s+/, '');
            elements.push(
              <div key={i} className="pt-3 pb-1 border-b border-slate-200/80 dark:border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#0ba2b3] to-[#157a87] shrink-0" />
                  <h3 className="text-lg sm:text-[19px] font-black text-[#000313] dark:text-white tracking-wide">
                    <FormattedInlineText text={headingText} />
                  </h3>
                </div>
              </div>
            );
            continue;
          }

          // 2. Mission Goal Card (**မစ်ရှင်:** or **Mission:** or မစ်ရှင်:)
          const isMission = 
            line.includes('**မစ်ရှင်:**') || 
            line.includes('**Mission:**') || 
            line.startsWith('မစ်ရှင်:') || 
            line.startsWith('Mission:');

          if (isMission) {
            const cleanMission = line
              .replace(/\*\*မစ်ရှင်:\*\*/g, '')
              .replace(/\*\*Mission:\*\*/g, '')
              .replace(/^မစ်ရှင်:\s*/, '')
              .replace(/^Mission:\s*/, '')
              .trim();

            elements.push(
              <div 
                key={i} 
                className="rounded-2xl border-2 border-[#0ba2b3]/35 dark:border-[#38bdf8]/35 bg-gradient-to-r from-[#0ba2b3]/10 via-[#0ba2b3]/5 to-transparent dark:from-[#0ba2b3]/20 dark:via-[#0ba2b3]/5 p-4 sm:p-5 my-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2 text-[#0ba2b3] dark:text-[#38bdf8] font-black text-xs uppercase tracking-wider">
                  <div className="w-6 h-6 rounded-full bg-[#0ba2b3] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Target size={14} strokeWidth={2.5} />
                  </div>
                  <span>{language === 'my' ? 'သင်၏ မစ်ရှင်ပန်းတိုင် (YOUR MISSION)' : 'MISSION OBJECTIVE'}</span>
                </div>
                <div className="text-[15.5px] sm:text-base font-bold text-[#000313] dark:text-white leading-[1.85] pl-8">
                  <FormattedInlineText text={cleanMission} />
                </div>
              </div>
            );
            continue;
          }

          // 3. Tip / Callout (💡 or Tip: or သတိပြုရန်:)
          const isTip = 
            line.startsWith('💡') || 
            line.toLowerCase().startsWith('tip:') || 
            line.startsWith('သတိပြုရန်:') || 
            line.startsWith('အကြံပြုချက်:');

          if (isTip) {
            elements.push(
              <div 
                key={i} 
                className="rounded-xl border border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/20 p-3.5 my-3 flex items-start gap-3 text-amber-900 dark:text-amber-200"
              >
                <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[14.5px] font-bold leading-relaxed">
                  <FormattedInlineText text={line.replace(/^[💡\s]*/, '')} />
                </div>
              </div>
            );
            continue;
          }

          // 4. Bullet list (- or * or •)
          if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
            const bulletText = line.replace(/^[-*•]\s+/, '');
            elements.push(
              <div key={i} className="flex items-start gap-2.5 my-1.5 pl-2">
                <div className="w-2 h-2 rounded-full bg-[#0ba2b3] shrink-0 mt-2" />
                <div className="text-[15px] sm:text-[15.5px] text-slate-800 dark:text-slate-100 font-medium leading-[1.9]">
                  <FormattedInlineText text={bulletText} />
                </div>
              </div>
            );
            continue;
          }

          // 5. Standard Explanatory Paragraph
          elements.push(
            <p 
              key={i} 
              className="text-[15.5px] sm:text-[16px] text-slate-800 dark:text-slate-100 font-medium leading-[1.9] my-2 tracking-normal"
            >
              <FormattedInlineText text={line} />
            </p>
          );
        }

        return <div key={idx}>{elements}</div>;
      })}
    </div>
  );
}

// Inline token formatter for Bold and Code chips
function FormattedInlineText({ text }: { text: string }) {
  if (!text) return null;

  // Split by bold (**...**) and inline code (`...`)
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        // Bold match
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const inner = part.slice(2, -2);
          return (
            <strong key={idx} className="font-black text-[#000313] dark:text-white">
              {inner}
            </strong>
          );
        }

        // Inline code match
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const codeText = part.slice(1, -1);
          return (
            <code 
              key={idx} 
              className="inline-block px-2 py-0.5 mx-1 rounded-md text-[13.5px] font-mono font-bold bg-[#EBF8FA] dark:bg-[#071c29] text-[#087f8d] dark:text-[#38bdf8] border border-[#a5e4ec] dark:border-[#0284c7]/40 shadow-xs align-baseline"
            >
              {codeText}
            </code>
          );
        }

        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

// Mac-Style Terminal Code Preview Card
function CodeSnippetCard({ code, language = 'python' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#00031320] dark:border-white/15 bg-[#050B1A] shadow-md my-4">
      {/* Terminal Titlebar */}
      <div className="bg-[#0A1224] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-[11px] font-bold text-slate-400 font-mono tracking-wider uppercase">
            {language}
          </span>
        </div>

        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 text-[14px] font-mono font-medium text-[#84D8FF] overflow-x-auto leading-relaxed selection:bg-[#0ba2b3]/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}
