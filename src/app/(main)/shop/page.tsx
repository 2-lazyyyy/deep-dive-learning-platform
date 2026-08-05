'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gem, Zap, Snowflake, ShieldCheck, Store } from 'lucide-react';
import { useState } from 'react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  action: () => void;
}

export default function ShopPage() {
  const { gems, hearts, spendGems, refillHearts, addXp } = useUserStore();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handlePurchase = (item: ShopItem) => {
    if (gems < item.price) {
      showToast('💎 Gems မလုံလောက်ပါ!');
      return;
    }

    const success = spendGems(item.price);
    if (success) {
      item.action();
      showToast(`✅ ${item.name} ဝယ်ယူပြီးပါပြီ!`);
    }
  };

  const shopItems: ShopItem[] = [
    {
      id: 'heart-refill',
      name: 'Heart Refill',
      description: 'Hearts ပြန်ဖြည့်ပါ (5 hearts)',
      price: 350,
      icon: <Heart size={32} className="text-[#FF4B4B]" fill="currentColor" />,
      color: 'bg-red-50',
      borderColor: 'border-red-200',
      action: () => refillHearts(),
    },
    {
      id: 'streak-freeze',
      name: 'Streak Freeze',
      description: 'တစ်ရက်မလေ့ကျင့်ရင်တောင် streak မကျပါ',
      price: 200,
      icon: <Snowflake size={32} className="text-[#1CB0F6]" />,
      color: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: () => {},
    },
    {
      id: 'xp-boost',
      name: 'Double XP (15 min)',
      description: '၁၅ မိနစ်အတွင်း XP ၂ ဆ ရပါမယ်',
      price: 300,
      icon: <Zap size={32} className="text-[#FFC800]" fill="currentColor" />,
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      action: () => addXp(50),
    },
    {
      id: 'shield',
      name: 'Heart Shield',
      description: 'နောက်တစ်ခေါက် မှားရင် heart မနုတ်ပါ',
      price: 450,
      icon: <ShieldCheck size={32} className="text-[#58CC02]" />,
      color: 'bg-green-50',
      borderColor: 'border-green-200',
      action: () => {},
    },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Store size={32} className="text-[#FF9600]" />
          <h1 className="text-2xl font-extrabold text-[#4B4B4B]">Shop</h1>
        </div>

        {/* Gem Balance */}
        <div className="flex items-center gap-2 bg-white border-2 border-[#E5E5E5] px-4 py-2 rounded-xl">
          <Gem size={20} className="text-[#1CB0F6]" fill="currentColor" />
          <span className="font-extrabold text-[#1CB0F6]">{gems}</span>
        </div>
      </div>

      {/* Current Hearts Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 mb-8"
      >
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#AFAFAF] mb-3">
          CURRENT HEARTS
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              size={28}
              className={i < hearts ? 'text-[#FF4B4B]' : 'text-[#E5E5E5]'}
              fill="currentColor"
            />
          ))}
        </div>
      </motion.div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shopItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={`${item.color} border-2 ${item.borderColor} rounded-2xl p-5 flex flex-col items-center text-center`}
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              {item.icon}
            </div>

            {/* Info */}
            <h3 className="font-extrabold text-[#4B4B4B] text-base mb-1">{item.name}</h3>
            <p className="text-sm text-[#777777] font-semibold mb-4 leading-snug">
              {item.description}
            </p>

            {/* Buy Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97, y: 2 }}
              onClick={() => handlePurchase(item)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide transition-all ${
                gems >= item.price
                  ? 'bg-[#1CB0F6] hover:bg-[#1899D6] text-white border-b-4 border-[#1784BA] active:border-b-0 active:translate-y-1'
                  : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed'
              }`}
              disabled={gems < item.price}
            >
              <Gem size={16} fill="currentColor" />
              {item.price}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#4B4B4B] text-white font-bold px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
