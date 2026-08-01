import Link from 'next/link';
import { Home, Trophy, Store } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="h-full w-[256px] lg:flex flex-col hidden left-0 top-0 border-r-2 border-gray-200 px-4 fixed bg-white">
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <h1 className="text-2xl font-extrabold text-green-500 tracking-wide">
            DeepDive Learn
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <Link href="/" className="flex items-center gap-x-4 p-4 rounded-xl hover:bg-gray-100 text-gray-700 font-bold uppercase cursor-pointer">
          <Home size={32} className="text-blue-500" />
          Learn
        </Link>
        <Link href="/leaderboard" className="flex items-center gap-x-4 p-4 rounded-xl hover:bg-gray-100 text-gray-700 font-bold uppercase cursor-pointer">
          <Trophy size={32} className="text-yellow-500" />
          Leaderboard
        </Link>
        <Link href="/shop" className="flex items-center gap-x-4 p-4 rounded-xl hover:bg-gray-100 text-gray-700 font-bold uppercase cursor-pointer">
          <Store size={32} className="text-orange-500" />
          Shop
        </Link>
      </div>
    </div>
  );
};
