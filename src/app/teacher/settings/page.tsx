'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Globe } from 'lucide-react';

export default function TeacherSettingsPage() {
  return (
    <div className="pb-20 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#4B4B4B]">Settings</h1>
        <p className="text-sm font-semibold text-[#AFAFAF] mt-1">
          Account နဲ့ platform settings တွေကို ပြောင်းလဲပါ
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 mb-6"
      >
        <h2 className="font-extrabold text-[#4B4B4B] flex items-center gap-2 mb-5">
          <User size={18} className="text-[#CE82FF]" />
          Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="Teacher Demo"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-semibold text-[#4B4B4B] outline-none focus:border-[#CE82FF] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] mb-1.5">
              Email
            </label>
            <input
              type="email"
              defaultValue="teacher@deepdive.edu"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-semibold text-[#4B4B4B] outline-none focus:border-[#CE82FF] transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 mb-6"
      >
        <h2 className="font-extrabold text-[#4B4B4B] flex items-center gap-2 mb-5">
          <Bell size={18} className="text-[#FFC800]" />
          Notifications
        </h2>
        <div className="space-y-4">
          <ToggleRow label="New submission alerts" description="Student submit လုပ်တိုင်း notification ပို့မယ်" defaultOn />
          <ToggleRow label="Daily summary email" description="နေ့စဉ် summary email ပို့မယ်" defaultOn={false} />
          <ToggleRow label="Low pass-rate warnings" description="Pass rate ၅၀% အောက်ဆင်းရင် alert ပို့မယ်" defaultOn />
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 mb-6"
      >
        <h2 className="font-extrabold text-[#4B4B4B] flex items-center gap-2 mb-5">
          <Globe size={18} className="text-[#1CB0F6]" />
          Language
        </h2>
        <select className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-semibold text-[#4B4B4B] outline-none focus:border-[#CE82FF] bg-white">
          <option value="my">မြန်မာ (Myanmar)</option>
          <option value="en">English</option>
        </select>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98, y: 2 }}
        className="w-full bg-[#CE82FF] hover:bg-[#B86EE6] text-white font-extrabold py-3.5 rounded-xl border-b-4 border-[#A86BD8] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
      >
        Save Changes
      </motion.button>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-[#4B4B4B] text-sm">{label}</p>
        <p className="text-xs font-semibold text-[#AFAFAF]">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
        <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:bg-[#CE82FF]" />
      </label>
    </div>
  );
}
