'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { Moon, Sun, Volume2, VolumeX, Save, User, Bell, Sliders, Trash2, Camera } from 'lucide-react';

type Tab = 'preferences' | 'profile' | 'notifications';

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Preferences State
  const { isDarkMode, toggleDarkMode } = useUserStore();
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Profile State
  const [name, setName] = useState('Teacher Alex');
  const [username, setUsername] = useState('teacheralex');
  const [email, setEmail] = useState('alex@deepdive.edu');
  const [password, setPassword] = useState('');

  // Notifications State
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [passRateWarnings, setPassRateWarnings] = useState(true);

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
            
            {/* Submission Alerts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">New Submission Alerts</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Receive alerts for new student submissions</p>
                </div>
              </div>
              <button 
                onClick={() => setSubmissionAlerts(!submissionAlerts)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${submissionAlerts ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: submissionAlerts ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full" />

            {/* Daily Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Daily Summary Email</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Receive daily summary reports</p>
                </div>
              </div>
              <button 
                onClick={() => setDailySummary(!dailySummary)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${dailySummary ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: dailySummary ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full" />

            {/* Pass Rate Warnings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#000313] dark:text-white">Low Pass-Rate Warnings</h3>
                  <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400">Receive warnings when pass rates drop below 50%</p>
                </div>
              </div>
              <button 
                onClick={() => setPassRateWarnings(!passRateWarnings)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${passRateWarnings ? 'bg-[#0ba2b3]' : 'bg-[#00031333] dark:bg-white/20'}`}
              >
                <motion.div 
                  className="bg-white dark:bg-[#000313] w-6 h-6 rounded-full shadow-md"
                  animate={{ x: passRateWarnings ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">Settings</h1>
      </div>
      <div className="flex flex-col lg:flex-row-reverse gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-4 flex flex-col gap-2 sticky top-24">
            <h3 className="font-extrabold text-sm text-[#6B7280] dark:text-gray-400 uppercase tracking-wider mb-2 px-4">Account</h3>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left ${activeTab === 'profile' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:bg-[#060a1d]'}`}
            >
              <User size={20} />
              Profile
            </button>
            
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left ${activeTab === 'preferences' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:bg-[#060a1d]'}`}
            >
              <Sliders size={20} />
              Preferences
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition text-left ${activeTab === 'notifications' ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-2 border-[#84D8FF]' : 'text-[#000313] dark:text-white border-2 border-transparent hover:bg-[#F8F8F8] dark:bg-[#060a1d]'}`}
            >
              <Bell size={20} />
              Notifications
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
