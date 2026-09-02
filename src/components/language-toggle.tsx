'use client';

import { useUserStore } from '@/store/use-user-store';
import { Globe2 } from 'lucide-react';

interface LanguageToggleProps {
  compact?: boolean;
  className?: string;
}

export const LanguageToggle = ({ compact = false, className = '' }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useUserStore();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#00031320] dark:border-white/20 bg-white dark:bg-[#000313] hover:border-[#0ba2b3] dark:hover:border-[#0ba2b3] font-black uppercase text-xs tracking-wider transition-all shadow-sm active:translate-y-0.5 select-none ${className}`}
      title="Switch Language / ဘာသာစကားပြောင်းရန်"
    >
      <Globe2 size={16} className="text-[#0ba2b3] shrink-0" />
      {compact ? (
        <span className="text-[#0ba2b3]">{language === 'en' ? 'EN' : 'မြန်မာ'}</span>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className={language === 'en' ? 'text-[#0ba2b3]' : 'text-gray-400'}>EN</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className={language === 'my' ? 'text-[#0ba2b3]' : 'text-gray-400'}>မြန်မာ</span>
        </div>
      )}
    </button>
  );
};
