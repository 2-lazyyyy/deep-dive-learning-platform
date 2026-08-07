import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pb-20 max-w-3xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">About DeepDive</h1>
      </div>
      <div className="space-y-6 mt-4">
        <p className="text-[#1C1D20] font-bold leading-relaxed">
          DeepDive is a next-generation learning platform designed to make education engaging, effective, and accessible for everyone.
        </p>
        <p className="text-[#1C1D20] font-bold leading-relaxed">
          Our mission is to empower both students and teachers by providing interactive tools, gamified learning experiences, and comprehensive progress tracking. We believe that learning should feel less like a chore and more like an adventure.
        </p>
        <h2 className="text-xl font-extrabold text-[#0ba2b3] mt-8">Our Vision</h2>
        <p className="text-[#1C1D20] font-bold leading-relaxed">
          To build a world where anyone, anywhere can master new skills through structured, enjoyable, and rewarding pathways.
        </p>
      </div>
    </div>
  );
}
