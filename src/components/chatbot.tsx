'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, HelpCircle, Code2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatbotProps {
  lessonTitle?: string;
  studentCode?: string;
  errorMessage?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  lessonTitle,
  studentCode,
  errorMessage,
}) => {
  const language = useUserStore((state) => state.language);
  const [isOpen, setIsOpen] = useState(false);

  const welcomeText = language === 'my'
    ? 'မင်္ဂလာပါ! DeepDive AI Coding Tutor ဖြစ်ပါတယ်။ Python သင်ခန်းစာနှင့် ပတ်သက်ပြီး မေးလိုသည်များကို မေးမြန်းနိုင်ပါသည်ခင်ဗျာ။ (အဆင့်ဆင့် လမ်းညွှန်ပေးပါမည်)'
    : 'Hello! I am DeepDive AI Coding Tutor. Feel free to ask me anything about your Python lesson or errors! (I guide you step-by-step)';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: welcomeText,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${apiUrl}/api/v1/ai/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          lesson_title: lessonTitle || undefined,
          student_code: studentCode || undefined,
          error_message: errorMessage || undefined,
          chat_history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: language === 'my'
              ? 'ခေတ္တစောင့်ဆိုင်းပြီး ပြန်လည်မေးမြန်းပေးပါခင်ဗျာ။ AI Tutor ဆာဗာ ချိတ်ဆက်မှု အခက်အခဲ ဖြစ်ပေါ်နေပါသည်။'
              : 'Please wait a moment and try again. The AI Tutor service encountered a connection issue.',
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: language === 'my'
            ? 'AI Tutor Backend အား ချိတ်ဆက်၍ မရပါ (http://127.0.0.1:8000)။ ဆာဗာ ဖွင့်ထားခြင်း ရှိမရှိ စစ်ဆေးပေးပါ။'
            : 'Cannot connect to AI Tutor Backend (http://127.0.0.1:8000). Please verify the server is running.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendQuery(inputValue);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[100px] lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full bg-[#0ba2b3] text-white flex items-center justify-center shadow-lg shadow-[#0ba2b3]/30 hover:bg-[#1e91a3] hover:scale-110 transition-all border-2 border-[#00031333] dark:border-white/20 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        title="AI Tutor"
      >
        <Sparkles size={26} />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed bottom-[90px] lg:bottom-8 right-4 lg:right-8 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-7rem)] bg-white dark:bg-[#000313] rounded-3xl shadow-2xl border-2 border-[#00031333] dark:border-white/20 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0ba2b3] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#00031333] dark:border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">DeepDive AI Tutor</h3>
                  <p className="text-[11px] font-bold opacity-90">Python & Debugging Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#F8F8F8] dark:bg-[#060a1d]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 border-2 text-xs font-bold leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-[#0ba2b3] text-white border-[#1e91a3] rounded-br-none shadow-sm' 
                      : 'bg-white dark:bg-[#000313] text-[#000313] dark:text-white border-[#00031333] dark:border-white/20 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 items-center">
                    <motion.div className="w-2 h-2 bg-[#0ba2b3] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-[#0ba2b3] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-[#0ba2b3] rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-white dark:bg-[#000313] border-t border-[#00031333] dark:border-white/20 flex gap-1.5 overflow-x-auto no-scrollbar">
              {(language === 'my' ? [
                { label: 'ဒီ code မှာ ဘာမှားနေလဲ?', text: 'ဒီ code မှာ ဘာမှားနေလဲ? စစ်ဆေးပေးပါ (အဆင့်ဆင့် လမ်းညွှန်ပေးပါ)', icon: Code2 },
                { label: 'Hint ပေးပါ', text: 'ဒီ lesson အတွက် hint လမ်းညွှန်ပေးပါ', icon: Lightbulb },
                { label: 'Explain print()', text: 'Python print() function အကြောင်း ရှင်းပြပေးပါ', icon: HelpCircle },
              ] : [
                { label: "What's wrong in my code?", text: "Can you analyze what is wrong in my current code? Guide me step by step.", icon: Code2 },
                { label: 'Give me a hint', text: 'Please give me a hint for this exercise.', icon: Lightbulb },
                { label: 'Explain print()', text: 'Explain how Python print() function works.', icon: HelpCircle },
              ]).map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(qp.text)}
                  disabled={isTyping}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0F8FF] dark:bg-[#0a1128] border border-[#84D8FF] text-[#0ba2b3] text-[11px] font-extrabold whitespace-nowrap hover:bg-[#84D8FF]/20 transition-all shrink-0 disabled:opacity-50"
                >
                  <qp.icon size={12} />
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#000313] border-t-2 border-[#00031333] dark:border-white/20">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'my' ? "မေးလိုသည်ကို ရေးသားပါ..." : "Ask your Python question..."}
                  disabled={isTyping}
                  className="flex-1 bg-[#F8F8F8] dark:bg-[#060a1d] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#000313] dark:text-white focus:outline-none focus:border-[#0ba2b3] transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#0ba2b3] hover:bg-[#1e91a3] text-white rounded-xl shadow-[0_3px_0_#157a87] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
