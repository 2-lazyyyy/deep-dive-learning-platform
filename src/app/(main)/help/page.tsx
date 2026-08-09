'use client';

import { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const FAQS = [
  {
    question: 'How do I earn XP and Gems?',
    answer: 'You earn XP and Gems by completing lessons and challenges. Daily quests also provide bonus rewards!'
  },
  {
    question: 'What happens if I run out of hearts?',
    answer: 'If you lose all your hearts, you cannot start new lessons. Hearts regenerate over time, or you can refill them in the Shop using Gems.'
  },
  {
    question: 'How do I change my avatar?',
    answer: 'Go to your Profile page and click on your current avatar to open the avatar selection menu. Some avatars may require unlocking.'
  },
  {
    question: 'Are there leaderboards?',
    answer: 'Yes! Compete with other learners in weekly leagues. The top users in each league are promoted to higher tiers.'
  }
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">Help & Support</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* FAQs Section */}
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="border-2 border-[#00031333] dark:border-white/20 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-extrabold text-[#000313] dark:text-white">{faq.question}</span>
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
                        {faq.answer}
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
                <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">Send Feedback</h2>
                <p className="font-bold text-[#6B7280] dark:text-gray-400 text-sm mt-1">Have a suggestion or found a bug? Let us know!</p>
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
