'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { Loader2, GraduationCap } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isInitialized, isLoading } = useAuthStore();

  const isAuthPage = pathname === '/auth';
  const isTeacherRoute = pathname.startsWith('/teacher');

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!user) {
      // User is NOT logged in
      if (!isAuthPage) {
        router.replace('/auth');
      }
    } else {
      // User IS logged in
      if (isAuthPage) {
        if (user.role === 'teacher') {
          router.replace('/teacher');
        } else {
          router.replace('/');
        }
      } else if (isTeacherRoute && user.role !== 'teacher') {
        // Non-teacher trying to access /teacher
        router.replace('/');
      }
    }
  }, [user, isInitialized, isLoading, isAuthPage, isTeacherRoute, router]);

  // If still checking auth session on a protected route, show smooth loading screen
  if (!isInitialized || isLoading) {
    if (isAuthPage) {
      return <>{children}</>;
    }

    return (
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#060a1d] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-[#0ba2b3] flex items-center justify-center text-white shadow-lg animate-pulse">
          <GraduationCap size={36} />
        </div>
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#0ba2b3]">
          <Loader2 size={20} className="animate-spin" />
          <span>Authenticating DeepDive session...</span>
        </div>
      </div>
    );
  }

  // If not logged in and not on /auth, don't render protected children while redirecting
  if (!user && !isAuthPage) {
    return null;
  }

  // If student trying to view /teacher, don't render while redirecting
  if (user && isTeacherRoute && user.role !== 'teacher') {
    return null;
  }

  return <>{children}</>;
};
