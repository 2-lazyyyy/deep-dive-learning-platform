'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { User, Zap, Gem, Trophy, Flame, Settings, Medal, Crown } from 'lucide-react';
import { useState } from 'react';

const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🐱', '🦄', '🐲', '🐙', '🦖', '🦉'];

const ACHIEVEMENTS = [
  { id: 1, title: 'Wildfire', desc: 'Reach a 7-day streak', icon: Flame, color: 'text-[#FF9600]', bg: 'bg-[#FF9600]/20' },
  { id: 2, title: 'Sage', desc: 'Earn 1,000 Total XP', icon: Zap, color: 'text-[#1CB0F6]', bg: 'bg-[#1CB0F6]/20' },
  { id: 3, title: 'Scholar', desc: 'Learn 50 new words (Tokens)', icon: Medal, color: 'text-[#CE82FF]', bg: 'bg-[#CE82FF]/20' },
  { id: 4, title: 'Champion', desc: 'Reach #1 in Bronze League', icon: Crown, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/20' },
];

export default function ProfilePage() {
  const { username, profilePicture, level, xp, gems, streak, setUsername, setProfilePicture } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="pb-20 max-w-2xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex flex-col items-center mb-8 border-b-2 border-[#E5E5E5] pb-8">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-[#58CC02] flex items-center justify-center text-6xl shadow-inner cursor-pointer hover:opacity-90 transition border-4 border-white">
            {profilePicture}
          </div>
          <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-2 border-[#E5E5E5] text-[#AFAFAF] hover:text-[#4B4B4B] cursor-pointer">
            <Settings size={20} />
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-3 mb-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-[#E5E5E5] font-extrabold text-[#4B4B4B] text-xl text-center focus:border-[#1CB0F6] outline-none w-48"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="bg-[#1CB0F6] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#1899D6] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition"
            >
              SAVE
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setIsEditing(true)}>
            <h1 className="text-3xl font-extrabold text-[#4B4B4B] hover:text-[#1CB0F6] transition">
              {username}
            </h1>
          </div>
        )}
        <p className="text-[#AFAFAF] font-bold">Joined August 2026</p>
      </div>

      {/* Avatar Customization */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-[#4B4B4B] mb-4">Choose Avatar</h2>
        <div className="flex flex-wrap gap-4">
          {AVATARS.map((avatar) => (
            <motion.button
              key={avatar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setProfilePicture(avatar)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${
                profilePicture === avatar
                  ? 'bg-[#E8F5E9] border-[#58CC02] shadow-sm'
                  : 'bg-white border-[#E5E5E5] hover:bg-[#F7F7F7]'
              }`}
            >
              {avatar}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-[#4B4B4B] mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-4 bg-white">
            <Zap size={32} className="text-[#FFC800]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#4B4B4B]">{xp}</p>
              <p className="text-sm font-bold text-[#AFAFAF]">Total XP</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-4 bg-white">
            <Trophy size={32} className="text-[#FFC800]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#4B4B4B]">Bronze</p>
              <p className="text-sm font-bold text-[#AFAFAF]">Current League</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-4 bg-white">
            <Flame size={32} className="text-[#FF9600]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#4B4B4B]">{streak}</p>
              <p className="text-sm font-bold text-[#AFAFAF]">Day Streak</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-4 bg-white">
            <Gem size={32} className="text-[#1CB0F6]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#4B4B4B]">{gems}</p>
              <p className="text-sm font-bold text-[#AFAFAF]">Gems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-extrabold text-[#4B4B4B] mb-4">Achievements</h2>
        <div className="space-y-4">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl border-2 border-[#E5E5E5] flex items-center gap-4 bg-white">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${ach.bg}`}>
                <ach.icon size={28} className={ach.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg text-[#4B4B4B]">{ach.title}</h3>
                <p className="text-sm font-bold text-[#AFAFAF]">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
