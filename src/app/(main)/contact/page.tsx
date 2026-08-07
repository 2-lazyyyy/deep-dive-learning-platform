'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

export default function ContactPage() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    // Mock submit
    setIsSubmitted(true);
    setFeedback('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="pb-20 max-w-3xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">Contact Us</h1>
      </div>
      
      <div className="bg-white border-2 border-[#1C1D2033] rounded-2xl p-6 md:p-8 space-y-6">
        <p className="text-[#1C1D20] font-bold leading-relaxed">
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>
        


        <h2 className="text-2xl font-extrabold text-[#1C1D20] mb-4">Send a Message</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full border-2 border-[#1C1D2033] rounded-xl p-4 font-bold text-[#1C1D20] min-h-[120px] outline-none focus:border-[#0ba2b3] resize-y transition"
            placeholder="Tell us what you think..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-[#34C759] transition-opacity duration-300" style={{ opacity: isSubmitted ? 1 : 0 }}>
              Thanks for your message!
            </span>
            <button 
              type="submit"
              disabled={!feedback.trim()}
              className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] disabled:bg-[#1C1D2033] disabled:text-[#6B7280] disabled:shadow-none disabled:translate-y-1 disabled:cursor-not-allowed text-white font-extrabold uppercase px-6 py-3 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </form>

        <div className="h-[2px] bg-[#1C1D2033] w-full my-6" />

        <div className="bg-[#F0F8FF] p-6 rounded-2xl flex flex-col gap-4">
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <div className="font-extrabold text-[#0ba2b3]">Email</div>
            <div className="font-bold text-[#1C1D20]">support@deepdive.edu</div>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <div className="font-extrabold text-[#0ba2b3]">Phone</div>
            <div className="font-bold text-[#1C1D20]">+95 9 123 456 789</div>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <div className="font-extrabold text-[#0ba2b3]">Address</div>
            <div className="font-bold text-[#1C1D20] leading-relaxed">123 Learning Street, Tech Park, Yangon</div>
          </div>
        </div>

      </div>
    </div>
  );
}
