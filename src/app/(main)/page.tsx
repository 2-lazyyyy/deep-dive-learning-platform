'use client';
import { useUserStore } from "@/store/use-user-store";
import { Heart, Flame, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { hearts, xp, streak } = useUserStore();

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Right Sidebar (Stats) */}
      <div className="w-[368px] sticky top-6 flex-col gap-y-4 hidden lg:flex">
        <div className="flex items-center justify-between w-full border-2 border-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-x-2 text-red-500 font-bold">
            <Heart fill="currentColor" /> {hearts}
          </div>
          <div className="flex items-center gap-x-2 text-yellow-500 font-bold">
            <Zap fill="currentColor" /> {xp}
          </div>
          <div className="flex items-center gap-x-2 text-orange-500 font-bold">
            <Flame fill="currentColor" /> {streak}
          </div>
        </div>
      </div>

      {/* Main Learning Tree */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full bg-green-500 p-6 rounded-xl text-white font-bold text-2xl mb-8 flex justify-between items-center shadow-sm">
          <span>Unit 1: Python Basics</span>
        </div>

        {/* Tree Nodes */}
        <div className="flex flex-col items-center gap-y-[40px] relative mt-4">
          
          <Link href="/lesson/1">
            <div className="relative h-[90px] w-[90px] rounded-full bg-[#58CC02] shadow-[0_8px_0_0_#46A302,inset_0_5px_0_0_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:brightness-110 active:shadow-[inset_0_5px_0_0_rgba(255,255,255,0.2)] active:translate-y-[8px] transition-all">
              <span className="text-white font-extrabold text-4xl">1</span>
            </div>
          </Link>

          <Link href="/lesson/2">
            <div className="relative h-[90px] w-[90px] rounded-full bg-[#1CB0F6] shadow-[0_8px_0_0_#1899D6,inset_0_5px_0_0_rgba(255,255,255,0.2)] flex items-center justify-center cursor-pointer hover:brightness-110 active:shadow-[inset_0_5px_0_0_rgba(255,255,255,0.2)] active:translate-y-[8px] transition-all ml-16">
              <span className="text-white font-extrabold text-4xl">2</span>
            </div>
          </Link>

          <div className="relative h-[90px] w-[90px] rounded-full bg-[#E5E5E5] shadow-[0_8px_0_0_#CECECE,inset_0_5px_0_0_rgba(255,255,255,0.7)] flex items-center justify-center cursor-not-allowed mr-16">
            <span className="text-[#AFAFAF] font-extrabold text-4xl">3</span>
          </div>

        </div>
      </div>
    </div>
  );
}
