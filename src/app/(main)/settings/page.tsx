'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { Moon, Sun, Volume2, VolumeX, Save, User, Bell, Sliders, CreditCard, Trash2, Camera, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Tab = 'preferences' | 'profile' | 'notifications' | 'subscription';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const router = useRouter();

  // Preferences State
  const { isDarkMode, toggleDarkMode } = useUserStore();
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Profile State
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('johndoe123');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('');

  // Notifications State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Profile</h2>
            
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#00031333] dark:border-white/20 flex items-center justify-center overflow-hidden">
                  <User size={48} className="text-[#0ba2b3]" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0ba2b3] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-[#1e91a3] transition">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-[#000313] dark:text-white">Profile Picture</h3>
                <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-2" />

            {/* Profile Form */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-sm text-[#000313] dark:text-white uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl px-4 py-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold uppercase px-6 py-3 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1">
                Save Profile
              </button>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-4" />

            {/* Danger Zone */}
            <div>
              <h3 className="font-extrabold text-xl text-[#FC4B0B] mb-2">Danger Zone</h3>
              <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="flex items-center gap-2 border-2 border-[#FC4B0B] text-[#FC4B0B] hover:bg-[#FC4B0B] hover:text-white font-extrabold uppercase px-6 py-3 rounded-xl transition shadow-[0_4px_0_#FC4B0B] active:shadow-none active:translate-y-1">
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Preferences</h2>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0ba2b3] text-white' : 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3]'}`}>
                  {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Theme</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Toggle dark and light mode</p>
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
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Sound Effects</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Play sound effects in lessons</p>
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
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Notifications</h2>
            
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Email Notifications</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Receive weekly reports and updates</p>
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
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Push Notifications</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Daily reminders and streak alerts</p>
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
            <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Subscription</h2>
            
            <div className="bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-white dark:bg-[#000313] px-3 py-1 rounded-full font-extrabold text-[#0ba2b3] text-sm shadow-sm border-2 border-[#00031333] dark:border-white/20">Free Plan</div>
              </div>
              <h3 className="text-xl font-extrabold text-[#0ba2b3] mb-2">DeepDive Free</h3>
              <p className="text-[#000313] dark:text-white font-bold mb-6 max-w-sm">You are currently on the free plan. Upgrade to unlock premium avatars, unlimited hearts, and detailed progress insights.</p>
              
              <button className="bg-white dark:bg-[#000313] text-[#0ba2b3] font-extrabold uppercase px-6 py-3 rounded-xl border-2 border-[#00031333] dark:border-white/20 transition shadow-[0_4px_0_#00031333] hover:bg-[#F8F8F8] dark:bg-[#060a1d] active:shadow-none active:translate-y-1">
                Upgrade to Pro
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row-reverse gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-4 lg:top-24 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex flex-row overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-4 scrollbar-hide">
              <h3 className="font-extrabold text-sm text-[#6B7280] dark:text-gray-400 uppercase tracking-wider mb-2 lg:px-4 hidden lg:block">Account</h3>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'profile' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
            >
              <User size={20} />
              Profile
            </button>
            
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'preferences' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
            >
              <Sliders size={20} />
              Preferences
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'notifications' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
            >
              <Bell size={20} />
              Notifications
            </button>
            
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left flex-shrink-0 ${activeTab === 'subscription' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'}`}
            >
              <CreditCard size={20} />
              Subscription
            </button>
            </div>
            
            <div className="hidden lg:flex bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex-col gap-2">
              <button 
                onClick={() => router.push('/auth')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left text-[#FC4B0B] border-2 border-transparent hover:bg-[#FC4B0B]/10 w-full"
              >
                <LogOut size={20} />
                Log Out
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
            onClick={() => router.push('/auth')}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-extrabold transition text-center text-[#FC4B0B] border-2 border-transparent hover:bg-[#FC4B0B]/10 w-full"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
