import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pb-20 max-w-3xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">Privacy Policy</h1>
      </div>
      <div className="space-y-6 mt-4">
        <p className="text-sm font-bold text-[#6B7280]">Last Updated: August 2026</p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-[#1C1D20]">1. Information We Collect</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            We collect information you provide directly to us, such as your name, email address, and learning progress data.
          </p>
          
          <h2 className="text-xl font-extrabold text-[#1C1D20] pt-4">2. How We Use Information</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, and to personalize your learning experience.
          </p>
          
          <h2 className="text-xl font-extrabold text-[#1C1D20] pt-4">3. Data Security</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}
