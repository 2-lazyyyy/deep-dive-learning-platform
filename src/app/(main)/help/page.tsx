'use client';

import { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/store/use-user-store';
import { translations } from '@/lib/i18n';

export default function HelpPage() {
  const { language } = useUserStore();
  const t = translations.help;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">{t.title[language]}</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* FAQs Section */}
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">{t.faqTitle[language]}</h2>
          </div>

          <div className="flex flex-col gap-3">
            {t.faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-2 border-[#00031333] dark:border-white/20 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-extrabold text-[#000313] dark:text-white">{faq.question[language]}</span>
                  {openFaq === index ? (
                    <ChevronUp size={20} className="text-[#0ba2b3]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#6B7280] dark:text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full mb-4" />
                      <p className="text-[#000313] dark:text-white font-bold text-sm leading-relaxed">
                        {faq.answer[language]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <Link href="/contact" className="block bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-6 hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">
                  {language === 'my' ? 'အကြံပြုချက် ပေးပို့မည်' : 'Send Feedback'}
                </h2>
                <p className="font-bold text-[#6B7280] dark:text-gray-400 text-sm mt-1">
                  {language === 'my' ? 'အကြံပြုလိုသည်များ သို့မဟုတ် ချို့ယွင်းချက်များ တွေ့ရှိပါက ကျွန်ုပ်တို့ထံ ဆက်သွယ်ပါ!' : 'Have a suggestion or found a bug? Let us know!'}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] group-hover:scale-110 transition-transform">
              <ArrowRight size={20} strokeWidth={3} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
