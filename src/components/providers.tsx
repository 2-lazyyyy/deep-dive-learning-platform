'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useUserStore } from '@/store/use-user-store';
import { AuthGuard } from './auth-guard';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const fetchProgress = useUserStore((state) => state.fetchProgress);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user?.id) {
      fetchProgress(user.id);
    }
  }, [user?.id, fetchProgress]);

  return <AuthGuard>{children}</AuthGuard>;
};
