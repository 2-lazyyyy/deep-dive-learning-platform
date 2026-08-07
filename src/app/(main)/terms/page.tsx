import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pb-20 max-w-3xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">Terms of Service</h1>
      </div>
      <div className="space-y-6 mt-4">
        <p className="text-sm font-bold text-[#6B7280]">Last Updated: August 2026</p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-[#1C1D20]">1. Acceptance of Terms</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            By accessing and using DeepDive, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
          
          <h2 className="text-xl font-extrabold text-[#1C1D20] pt-4">2. User Accounts</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password.
          </p>
          
          <h2 className="text-xl font-extrabold text-[#1C1D20] pt-4">3. Acceptable Use</h2>
          <p className="text-[#1C1D20] font-bold leading-relaxed">
            You agree not to use the platform in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of DeepDive.
          </p>
        </div>
      </div>
    </div>
  );
}
