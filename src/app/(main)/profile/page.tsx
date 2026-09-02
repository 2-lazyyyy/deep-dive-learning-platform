'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Trophy,
  Medal,
  Award,
  Shield,
  Star,
  Gem,
  Crown,
  Edit3,
  UserPlus,
  UserCheck,
  Search,
  Calendar,
  Settings,
  CheckCircle2,
  X,
  Target,
  BookOpen,
  Sparkles,
  Swords,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { translations } from '@/lib/i18n';

const AVATAR_OPTIONS = [
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'owl', emoji: '🦉', label: 'Owl (Duo)' },
  { id: 'coder_m', emoji: '🧑‍💻', label: 'Coder Boy' },
  { id: 'coder_f', emoji: '👩‍💻', label: 'Coder Girl' },
  { id: 'robot', emoji: '🤖', label: 'Robo' },
  { id: 'sage', emoji: '🧙‍♂️', label: 'Sage' },
  { id: 'astronaut', emoji: '🚀', label: 'Astronaut' },
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'lion', emoji: '🦁', label: 'Lion' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'eagle', emoji: '🦅', label: 'Eagle' },
];

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  xp: number;
  streak: number;
  isFollowing: boolean;
}

const INITIAL_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Kyaw Zin', username: 'kyawzin_dev', avatar: '🧑‍💻', xp: 620, streak: 5, isFollowing: true },
  { id: 'f2', name: 'Su Su Hlaing', username: 'susu_code', avatar: '👩‍💻', xp: 480, streak: 3, isFollowing: true },
  { id: 'f3', name: 'Min Thu', username: 'minthu_py', avatar: '🤖', xp: 350, streak: 2, isFollowing: false },
  { id: 'f4', name: 'Hnin Yu', username: 'hnin_yu', avatar: '🐱', xp: 290, streak: 1, isFollowing: false },
  { id: 'f5', name: 'Alex Johnson', username: 'alex_python', avatar: '🚀', xp: 750, streak: 7, isFollowing: false },
];

export default function DuolingoProfilePage() {
  const { username, profilePicture, xp, gems, streak, completedLessonIds, completedChallenges, setUsername, setProfilePicture, fetchProgress, language } = useUserStore();
  const authUser = useAuthStore((state) => state.user);
  const t = translations.profile;

  const [isMounted, setIsMounted] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [socialTab, setSocialTab] = useState<'following' | 'followers'>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsList, setFriendsList] = useState<Friend[]>(INITIAL_FRIENDS);

  useEffect(() => {
    setIsMounted(true);
    if (authUser?.id) {
      fetchProgress(authUser.id);
    }
  }, [authUser?.id, fetchProgress]);

  if (!isMounted) return null;

  // Duolingo League Calculation
  const getLeagueDetails = (userXp: number) => {
    if (userXp < 1000) return { name: translations.leaderboard.tiers.bronze[language], color: '#CD7F32', icon: Award };
    if (userXp < 2500) return { name: translations.leaderboard.tiers.silver[language], color: '#C0C0C0', icon: Shield };
    if (userXp < 4500) return { name: translations.leaderboard.tiers.gold[language], color: '#FFC800', icon: Trophy };
    if (userXp < 7000) return { name: translations.leaderboard.tiers.platinum[language], color: '#8CC6D7', icon: Star };
    if (userXp < 10000) return { name: translations.leaderboard.tiers.diamond[language], color: '#00BCD4', icon: Gem };
    return { name: translations.leaderboard.tiers.ruby[language], color: '#E0115F', icon: Crown };
  };

  const currentLeague = getLeagueDetails(xp);
  const LeagueIcon = currentLeague.icon;

  // Multi-Tier Duolingo Achievements Data
  const achievements = [
    {
      id: 'wildfire',
      title: t.wildfire[language],
      desc: t.wildfireDesc[language],
      icon: Flame,
      iconColor: 'text-[#FF9600]',
      bgColor: 'bg-[#FF9600]/15',
      current: streak,
      max: 7,
      level: streak >= 7 ? 2 : streak >= 3 ? 1 : 0,
      reward: 20,
    },
    {
      id: 'sage',
      title: t.sage[language],
      desc: t.sageDesc[language],
      icon: Zap,
      iconColor: 'text-[#FFC800]',
      bgColor: 'bg-[#FFC800]/15',
      current: xp,
      max: 500,
      level: xp >= 1000 ? 3 : xp >= 500 ? 2 : xp >= 100 ? 1 : 0,
      reward: 50,
    },
    {
      id: 'scholar',
      title: t.scholar[language],
      desc: t.scholarDesc[language],
      icon: BookOpen,
      iconColor: 'text-[#0ba2b3]',
      bgColor: 'bg-[#0ba2b3]/15',
      current: completedLessonIds.length,
      max: 10,
      level: completedLessonIds.length >= 10 ? 2 : completedLessonIds.length >= 3 ? 1 : 0,
      reward: 30,
    },
    {
      id: 'challenger',
      title: t.challenger[language],
      desc: t.challengerDesc[language],
      icon: Swords,
      iconColor: 'text-[#E0115F]',
      bgColor: 'bg-[#E0115F]/15',
      current: completedChallenges.length,
      max: 5,
      level: completedChallenges.length >= 5 ? 2 : completedChallenges.length >= 1 ? 1 : 0,
      reward: 40,
    },
    {
      id: 'sharpshooter',
      title: t.sharpshooter[language],
      desc: t.sharpshooterDesc[language],
      icon: Target,
      iconColor: 'text-[#58CC02]',
      bgColor: 'bg-[#58CC02]/15',
      current: Math.min(completedLessonIds.length, 5),
      max: 5,
      level: completedLessonIds.length >= 5 ? 2 : completedLessonIds.length >= 1 ? 1 : 0,
      reward: 25,
    },
    {
      id: 'bigspender',
      title: t.bigspender[language],
      desc: t.bigspenderDesc[language],
      icon: Gem,
      iconColor: 'text-[#00BCD4]',
      bgColor: 'bg-[#00BCD4]/15',
      current: 350,
      max: 500,
      level: 1,
      reward: 35,
    },
  ];

  const handleToggleFollow = (id: string) => {
    setFriendsList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f))
    );
  };

  const filteredFriends = friendsList.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (socialTab === 'following') return matchesSearch && f.isFollowing;
    return matchesSearch;
  });

  const followingCount = friendsList.filter((f) => f.isFollowing).length;
  const followersCount = 12; // Social demo count

  const activeAvatarEmoji = AVATAR_OPTIONS.find((a) => a.emoji === profilePicture || a.id === profilePicture)?.emoji || '🦊';

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* 1. DUOLINGO PROFILE HEADER */}
      <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-6 md:p-8 mb-8 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Container with Edit Pen Button */}
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#F0F8FF] dark:bg-[#0a1128] border-4 border-[#84D8FF] flex items-center justify-center text-6xl md:text-7xl shadow-inner cursor-pointer select-none transition-transform hover:scale-105"
                 onClick={() => setShowAvatarModal(true)}>
              {activeAvatarEmoji}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-1 right-1 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white p-2.5 rounded-full shadow-md border-2 border-white transition-all hover:scale-110"
              title="Change Avatar"
            >
              <Edit3 size={16} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white flex items-center justify-center md:justify-start gap-2">
                  {username || authUser?.name || 'Demo Student'}
                  <button
                    onClick={() => {
                      setTempName(username);
                      setShowEditNameModal(true);
                    }}
                    className="text-gray-400 hover:text-[#0ba2b3] transition-colors p-1"
                    title="Edit Name"
                  >
                    <Edit3 size={18} />
                  </button>
                </h1>
                <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                  @{username.toLowerCase().replace(/\s+/g, '')}
                </p>
              </div>

              {/* Course Badge & Settings Shortcut */}
              <div className="flex items-center gap-2 self-center md:self-auto">
                <div className="inline-flex items-center gap-2 bg-[#F0F8FF] dark:bg-[#0a1128] border border-[#84D8FF] px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#0ba2b3]">
                  <span>🐍</span>
                  <span>Python Foundations</span>
                </div>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border-2 border-transparent px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-700 dark:text-gray-200 transition"
                  title="Account Settings"
                >
                  <Settings size={14} />
                  <span>{translations.nav.settings[language]}</span>
                </Link>
              </div>
            </div>

            {/* Joined Date & Social Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs font-bold text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-gray-400" />
                <span>{language === 'my' ? '၂၀၂၆ ခုနှစ် ဩဂုတ်လတွင် စတင်ခဲ့သည်' : 'Joined August 2026'}</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#0ba2b3]">
                <span className="font-extrabold text-[#000313] dark:text-white">{followingCount}</span> {t.following[language]}
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#0ba2b3]">
                <span className="font-extrabold text-[#000313] dark:text-white">{followersCount}</span> {t.followers[language]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUOLINGO 4-GRID STATISTICS */}
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-4">{t.statistics[language]}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Day Streak */}
          <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-500 shrink-0">
              <Flame size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#000313] dark:text-white leading-none mb-1">{streak}</p>
              <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">{t.streak[language]}</p>
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center text-yellow-500 shrink-0">
              <Zap size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#000313] dark:text-white leading-none mb-1">{xp}</p>
              <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">{t.totalXp[language]}</p>
            </div>
          </div>

          {/* Current League */}
          <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${currentLeague.color}20`, color: currentLeague.color }}>
              <LeagueIcon size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#000313] dark:text-white leading-none mb-1 truncate">{currentLeague.name}</p>
              <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">{t.currentLeague[language]}</p>
            </div>
          </div>

          {/* Top 3 Finishes */}
          <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center text-[#FFC800] shrink-0">
              <Medal size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#000313] dark:text-white leading-none mb-1">1</p>
              <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider">{t.topFinishes[language]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DUOLINGO ACHIEVEMENTS / BADGES (MULTI-TIERED) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">{t.achievements[language]}</h2>
          <span className="text-xs font-extrabold uppercase text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-3 py-1 rounded-full">
            {achievements.filter((a) => a.current >= a.max).length} / {achievements.length} {language === 'my' ? 'ပြီးမြောက်ပြီး' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            const progressPercent = Math.min(100, Math.round((ach.current / ach.max) * 100));
            const isCompleted = ach.current >= ach.max;

            return (
              <div
                key={ach.id}
                className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-[#0ba2b3] transition-all"
              >
                {/* Badge Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative ${ach.bgColor} ${ach.iconColor}`}>
                  <Icon size={32} />
                  {ach.level > 0 && (
                    <span className="absolute -bottom-1 -right-1 bg-[#FFC800] text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                      LV {ach.level}
                    </span>
                  )}
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-base text-[#000313] dark:text-white truncate">
                      {ach.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#00BCD4]">
                      <Gem size={13} fill="currentColor" />
                      <span>+{ach.reward}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 truncate">
                    {ach.desc}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#E5E5E5] dark:bg-gray-800 rounded-full h-3.5 overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-full ${isCompleted ? 'bg-[#58CC02]' : 'bg-[#0ba2b3]'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#000313] dark:text-white">
                      {ach.current} / {ach.max}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DUOLINGO FRIENDS / SOCIAL WIDGET */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white">{t.friends[language]}</h2>
        </div>

        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-6 shadow-sm">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex p-1 bg-[#F8F8F8] dark:bg-[#060a1d] rounded-2xl border border-[#00031333] dark:border-white/20 w-full sm:w-auto">
              <button
                onClick={() => setSocialTab('following')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  socialTab === 'following'
                    ? 'bg-white dark:bg-[#000313] text-[#0ba2b3] shadow-sm'
                    : 'text-gray-500 hover:text-[#000313] dark:text-gray-400'
                }`}
              >
                {t.following[language]} ({followingCount})
              </button>
              <button
                onClick={() => setSocialTab('followers')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  socialTab === 'followers'
                    ? 'bg-white dark:bg-[#000313] text-[#0ba2b3] shadow-sm'
                    : 'text-gray-500 hover:text-[#000313] dark:text-gray-400'
                }`}
              >
                {language === 'my' ? 'သူငယ်ချင်း ရှာဖွေပါ' : 'Find Friends'}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchFriends[language]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F8F8] dark:bg-[#060a1d] border border-[#00031333] dark:border-white/20 rounded-xl pl-9 pr-3.5 py-2 text-xs font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition-colors"
              />
            </div>
          </div>

          {/* Friends List */}
          <div className="divide-y-2 divide-[#00031333] dark:divide-white/20">
            {filteredFriends.length === 0 ? (
              <div className="py-8 text-center text-gray-400 font-bold text-sm">
                {language === 'my' ? `"${searchQuery}" နှင့် ကိုက်ညီသော ကျောင်းသား မရှိပါ` : `No students found matching "${searchQuery}".`}
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <div key={friend.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] flex items-center justify-center text-2xl shrink-0">
                      {friend.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#000313] dark:text-white">{friend.name}</h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                        <span>@{friend.username}</span>
                        <span>•</span>
                        <span className="text-[#FFC800]">{friend.xp} XP</span>
                        <span>•</span>
                        <span className="text-[#FF9600]">🔥 {friend.streak}</span>
                      </div>
                    </div>
                  </div>

                  {/* Follow / Unfollow Button */}
                  <button
                    onClick={() => handleToggleFollow(friend.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all shadow-[0_3px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-0.5 ${
                      friend.isFollowing
                        ? 'bg-[#F8F8F8] dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600'
                        : 'bg-[#0ba2b3] hover:bg-[#1e91a3] text-white shadow-[#157a87]'
                    }`}
                  >
                    {friend.isFollowing ? (
                      <>
                        <UserCheck size={14} /> {t.unfollow[language]}
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} /> {t.follow[language]}
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AVATAR PICKER MODAL */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-[#000313] dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-[#0ba2b3]" /> {t.changeAvatar[language]}
                </h3>
                <button onClick={() => setShowAvatarModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3.5 py-4">
                {AVATAR_OPTIONS.map((av) => {
                  const isSelected = activeAvatarEmoji === av.emoji;
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        setProfilePicture(av.emoji);
                        setShowAvatarModal(false);
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? 'border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] shadow-md'
                          : 'border-[#00031333] dark:border-white/20 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-3xl">{av.emoji}</span>
                      <span className="text-[10px] font-extrabold text-gray-500 truncate w-full text-center">{av.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT NAME MODAL */}
      <AnimatePresence>
        {showEditNameModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-extrabold text-[#000313] dark:text-white mb-3">{t.editName[language]}</h3>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={language === 'my' ? 'သင့်အမည် ရိုက်ထည့်ပါ' : 'Enter your name'}
                className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] mb-4 bg-[#F8F8F8] dark:bg-[#060a1d]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowEditNameModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {t.cancel[language]}
                </button>
                <button
                  onClick={() => {
                    if (tempName.trim()) {
                      setUsername(tempName.trim());
                    }
                    setShowEditNameModal(false);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#0ba2b3] hover:bg-[#1e91a3] text-white shadow-[0_3px_0_#157a87]"
                >
                  {t.saveChanges[language]}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
