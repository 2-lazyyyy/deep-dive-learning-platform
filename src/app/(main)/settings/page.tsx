'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Volume2, VolumeX, Save, User, Bell, Sliders, CreditCard, Trash2, Camera, LogOut, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { translations } from '@/lib/i18n';

type Tab = 'account' | 'preferences' | 'notifications' | 'subscription';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const router = useRouter();

  // User stores
  const authUser = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { 
    isDarkMode, 
    toggleDarkMode, 
    username: storeUsername, 
    profilePicture, 
    setUsername: setStoreUsername,
    language,
    setLanguage 
  } = useUserStore();

  const t = translations;

  // Account State
  const [name, setName] = useState(authUser?.name || 'Student');
  const [username, setUsername] = useState(storeUsername || authUser?.email?.split('@')[0] || 'student');
  const [email, setEmail] = useState(authUser?.email || 'student@deepdive.edu');
  const [password, setPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authUser?.name) setName(authUser.name);
    if (authUser?.email) setEmail(authUser.email);
  }, [authUser]);

  // Preferences State
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Notifications State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const handleSaveAccount = async () => {
    setIsSaving(true);
    setStoreUsername(username);

    try {
      if (authUser?.id) {
        await supabase.from('users').update({ name }).eq('id', authUser.id);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error("Failed to save profile:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-1">
                {t.settings.accountTitle[language]}
              </h2>
              <p className="text-sm font-semibold text-[#6B7280] dark:text-gray-400">
                {t.settings.accountDesc[language]}
              </p>
            </div>
            
            {/* Avatar & Profile Card Link */}
            <div className="flex items-center justify-between p-4 bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] dark:border-blue-900/50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#000313] border-2 border-[#0ba2b3] flex items-center justify-center text-3xl shadow-sm">
                  {profilePicture || '🦊'}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#000313] dark:text-white text-base flex items-center gap-2">
                    {t.profile.profileShowcase[language]}
                  </h3>
                  <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400">
                    {language === 'my' 
                      ? 'Avatar ရုပ်ပုံ၊ XP ဆုတံဆိပ်များနှင့် ရက်ဆက်မှတ်တမ်းများကို Profile Page တွင် ကြည့်ရှုပါ' 
                      : 'Avatars, XP achievements, and streaks are on your Profile Page'}
                  </p>
                </div>
              </div>
              <Link 
                href="/profile" 
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#0ba2b3] hover:underline bg-white dark:bg-[#000313] px-3.5 py-2 rounded-xl border border-[#0ba2b3]/30 shadow-sm shrink-0"
              >
                <span>{language === 'my' ? 'Profile ကြည့်မည်' : 'View Profile'}</span>
                <ExternalLink size={14} />
              </Link>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-1" />

            {/* Profile Form */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">
                    {t.settings.fullName[language]}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">
                    {t.settings.username[language]}
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition bg-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">
                  {t.settings.emailAddress[language]}
                </label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full border-2 border-[#00031320] dark:border-white/10 rounded-xl px-4 py-3 font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 outline-none cursor-not-allowed"
                />
                <span className="text-[11px] text-gray-400 font-semibold">
                  {language === 'my' 
                    ? 'မှတ်ပုံတင်ထားသော Email ပြောင်းလဲရန် Administrator ထံ ဆက်သွယ်ပါ။' 
                    : 'Contact administrator to modify registered email.'}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">
                  {t.settings.changePassword[language]}
                </label>
                <input 
                  type="password" 
                  placeholder={t.settings.passwordPlaceholder[language]}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={handleSaveAccount}
                disabled={isSaving}
                className="bg-[#0ba2b3] hover:bg-[#088a99] active:translate-y-0.5 text-white font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_4px_0_#157a87] transition disabled:opacity-50"
              >
                <Save size={18} />
                <span>{isSaving ? t.settings.saving[language] : t.settings.saveAccount[language]}</span>
              </button>

              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800"
                >
                  <CheckCircle size={18} />
                  <span>{t.settings.savedSuccess[language]}</span>
                </motion.div>
              )}
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-2" />

            {/* Danger Zone */}
            <div className="border-2 border-red-200 dark:border-red-950/40 bg-red-50/50 dark:bg-red-950/10 rounded-2xl p-5 flex flex-col gap-3">
              <div>
                <h3 className="text-base font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>{t.settings.dangerZone[language]}</span>
                </h3>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                  {t.settings.dangerDesc[language]}
                </p>
              </div>
              <button 
                onClick={() => {
                  if (confirm(language === 'my' ? 'အကောင့်ကို အပြီးတိုင် ဖျက်သိမ်းရန် သေချာပါသလား?' : 'Are you sure you want to permanently delete your account?')) {
                    alert(language === 'my' ? 'အကောင့် ဖျက်သိမ်းမှု လျှောက်ထားပြီးပါပြီ' : 'Account deletion requested.');
                  }
                }}
                className="self-start text-xs font-extrabold text-red-600 hover:text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>{t.settings.deleteAccount[language]}</span>
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-1">
                {t.settings.preferencesTitle[language]}
              </h2>
              <p className="text-sm font-semibold text-[#6B7280] dark:text-gray-400">
                {t.settings.preferencesDesc[language]}
              </p>
            </div>

            {/* Language Selection with Flag Icons */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center text-2xl shadow-sm border border-[#84D8FF]">
                  🌐
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">
                    {t.settings.languageSelection[language]}
                  </h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                    {t.settings.languageDesc[language]}
                  </p>
                </div>
              </div>

              {/* Flag Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* English Flag Card */}
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group ${
                    language === 'en'
                      ? 'border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] shadow-[0_4px_0_#0ba2b3]'
                      : 'border-[#00031320] dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-[#000313]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                      🇬🇧
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-[#000313] dark:text-white flex items-center gap-1.5">
                        English
                        <span className="text-[11px] font-bold text-gray-400">(US/UK)</span>
                      </h4>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Global Standard Interface
                      </p>
                    </div>
                  </div>
                  {language === 'en' && (
                    <div className="w-6 h-6 rounded-full bg-[#0ba2b3] text-white flex items-center justify-center shrink-0">
                      <CheckCircle size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Myanmar Flag Card */}
                <button
                  type="button"
                  onClick={() => setLanguage('my')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group ${
                    language === 'my'
                      ? 'border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] shadow-[0_4px_0_#0ba2b3]'
                      : 'border-[#00031320] dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-[#000313]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                      🇲🇲
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-[#000313] dark:text-white flex items-center gap-1.5">
                        မြန်မာစာ
                        <span className="text-[11px] font-bold text-gray-400">(Myanmar)</span>
                      </h4>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        မြန်မာဘာသာဖြင့် အသုံးပြုမည်
                      </p>
                    </div>
                  </div>
                  {language === 'my' && (
                    <div className="w-6 h-6 rounded-full bg-[#0ba2b3] text-white flex items-center justify-center shrink-0">
                      <CheckCircle size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-1" />
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0ba2b3] text-white' : 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3]'}`}>
                  {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">
                    {t.settings.themeMode[language]}
                  </h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                    {t.settings.themeDesc[language]}
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${isDarkMode ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full" />

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSoundOn ? 'bg-[#0ba2b3] text-white' : 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3]'}`}>
                  {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">
                    {t.settings.soundEffects[language]}
                  </h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                    {t.settings.soundDesc[language]}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSoundOn(!isSoundOn)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${isSoundOn ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: isSoundOn ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">
              {t.settings.notificationsTab[language]}
            </h2>
            
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">
                    {language === 'my' ? 'အီးမေးလ် အသိပေးချက်များ' : 'Email Notifications'}
                  </h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                    {language === 'my' ? 'အပတ်စဉ် အစီရင်ခံစာများနှင့် လေ့လာမှု သတိပေးချက်များ လက်ခံမည်' : 'Receive weekly reports and updates'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${emailNotifs ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: emailNotifs ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full" />

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">
                    {language === 'my' ? 'စနစ်တွင်း အသိပေးချက်များ' : 'Push Notifications'}
                  </h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">
                    {language === 'my' ? 'ရက်ဆက် လေ့လာမှု (Streak) မပျက်စေရန် နေ့စဉ် သတိပေးမည်' : 'Reminders to maintain your daily streak'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${pushNotifs ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: pushNotifs ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">
              {t.settings.subscriptionTab[language]}
            </h2>
            
            {/* Current Plan */}
            <div className="border-2 border-[#84D8FF] dark:border-blue-900 bg-[#F0F8FF] dark:bg-[#0a1128] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0ba2b3] bg-white dark:bg-[#000313] px-3 py-1 rounded-full border border-[#0ba2b3]/30">
                    {language === 'my' ? 'လက်ရှိ အစီအစဉ်' : 'Current Plan'}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#000313] dark:text-white mt-2">
                    DeepDive Super
                  </h3>
                </div>
                <CreditCard size={32} className="text-[#0ba2b3]" />
              </div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6">
                {language === 'my' 
                  ? 'အကန့်အသတ်မဲ့ အသက်များ (Unlimited Hearts)၊ ကြော်ငြာမပါခြင်းနှင့် AI ဆရာ အပြည့်အစုံ ရရှိထားပါသည်။' 
                  : 'Unlimited hearts, no ads, and personalized AI practice.'}
              </p>
              <button className="bg-[#0ba2b3] hover:bg-[#088a99] active:translate-y-0.5 text-white font-extrabold px-6 py-3 rounded-xl shadow-[0_4px_0_#157a87] transition">
                {language === 'my' ? 'အစီအစဉ် စီမံမည်' : 'Manage Subscription'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">
          {t.settings.title[language]}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row-reverse gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-4 lg:top-24 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex flex-row overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-4 scrollbar-hide">
              <h3 className="font-extrabold text-sm text-[#6B7280] dark:text-gray-400 uppercase tracking-wider mb-2 lg:px-4 hidden lg:block">
                {t.settings.title[language]}
              </h3>
            
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'account' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
              >
                <User size={20} />
                <span>{t.settings.accountTab[language]}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'preferences' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
              >
                <Sliders size={20} />
                <span>{t.settings.preferencesTab[language]}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'notifications' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
              >
                <Bell size={20} />
                <span>{t.settings.notificationsTab[language]}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'subscription' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
              >
                <CreditCard size={20} />
                <span>{t.settings.subscriptionTab[language]}</span>
              </button>
            </div>
            
            <div className="hidden lg:flex bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex-col gap-2">
              <button 
                onClick={async () => {
                  await signOut();
                  window.location.href = '/auth';
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left text-[#FC4B0B] border-2 border-transparent hover:bg-[#FC4B0B]/10 w-full"
              >
                <LogOut size={20} />
                <span>{t.nav.logout[language]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-6 lg:p-8">
          {renderContent()}
        </div>
        
        {/* Mobile Log Out */}
        <div className="lg:hidden bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex flex-col gap-2">
          <button 
            onClick={async () => {
              await signOut();
              window.location.href = '/auth';
            }}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-extrabold transition text-center text-[#FC4B0B] border-2 border-transparent hover:bg-[#FC4B0B]/10 w-full"
          >
            <LogOut size={20} />
            <span>{t.nav.logout[language]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
