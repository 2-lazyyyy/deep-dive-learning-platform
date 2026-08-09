'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Hello! I am DeepDive AI. How can I help you with your learning today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'That is a great question! However, I am currently a mock AI. In the future, I will be able to answer this perfectly.',
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[100px] lg:bottom-8 right-4 lg:right-8 w-16 h-16 rounded-full bg-[#0ba2b3] text-white flex items-center justify-center shadow-lg shadow-[#0ba2b3]/30 hover:bg-[#1e91a3] hover:scale-110 transition-all border-2 border-[#00031333] dark:border-white/20 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={32} />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-[100px] lg:bottom-8 right-4 lg:right-8 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-[#000313] rounded-2xl shadow-2xl border-2 border-[#00031333] dark:border-white/20 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0ba2b3] text-white p-4 flex items-center justify-between border-b-2 border-[#00031333] dark:border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-[#000313] rounded-full flex items-center justify-center border-2 border-[#00031333] dark:border-white/20 overflow-hidden">
                  <img src="/mascot1.svg" alt="Mascot" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">DeepDive AI</h3>
                  <p className="text-xs font-bold opacity-80">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:bg-[#000313]/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#F7F7F8]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 border-2 border-[#00031333] dark:border-white/20 ${
                    msg.sender === 'user' 
                      ? 'bg-[#1CB0F6] text-white rounded-br-sm' 
                      : 'bg-white dark:bg-[#000313] text-[#000313] dark:text-white rounded-bl-sm'
                  }`}>
                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    <motion.div className="w-2 h-2 bg-[#AFAFAF] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-[#AFAFAF] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-[#AFAFAF] rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#000313] border-t-2 border-[#00031333] dark:border-white/20">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[#F7F7F8] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 text-sm font-bold text-[#000313] dark:text-white focus:outline-none focus:border-[#1CB0F6] transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1CB0F6] text-white rounded-xl border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
