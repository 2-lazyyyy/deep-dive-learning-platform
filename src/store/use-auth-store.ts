import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: 'student' | 'teacher' }>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        set({ user: null, token: null, session: null, isLoading: false, isInitialized: true });
        return;
      }

      const authUser = session.user;
      const userMeta = authUser.user_metadata || {};

      // Check public.users table for profile & role
      const { data: userProfile } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', authUser.id)
        .single();

      const role = (userProfile?.role || userMeta.role || 'student') as 'student' | 'teacher';
      const name = userProfile?.name || userMeta.name || authUser.email?.split('@')[0] || 'User';

      set({
        session,
        token: session.access_token,
        user: {
          id: authUser.id,
          email: authUser.email || '',
          name,
          role,
        },
        isLoading: false,
        isInitialized: true,
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!newSession) {
          set({ user: null, token: null, session: null, isLoading: false });
        } else {
          const u = newSession.user;
          const meta = u.user_metadata || {};
          set({
            session: newSession,
            token: newSession.access_token,
            user: {
              id: u.id,
              email: u.email || '',
              name: meta.name || u.email?.split('@')[0] || 'User',
              role: (meta.role || 'student') as 'student' | 'teacher',
            },
            isLoading: false,
          });
        }
      });
    } catch (e) {
      console.error('Failed to initialize auth:', e);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Handle unconfirmed email gracefully by auto-confirming via backend admin
      if (error && error.message.toLowerCase().includes('not confirmed')) {
        try {
          await fetch('http://localhost:8000/api/v1/auth/auto-confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          // Retry sign in after auto-confirmation
          const retry = await supabase.auth.signInWithPassword({ email, password });
          data = retry.data;
          error = retry.error;
        } catch (confirmErr) {
          console.error('Auto-confirm attempt failed:', confirmErr);
        }
      }

      if (error || !data.user || !data.session) {
        const errorMsg = error?.message || 'Invalid email or password.';
        set({ error: errorMsg, isLoading: false });
        return { success: false, error: errorMsg };
      }

      const authUser = data.user;
      const userMeta = authUser.user_metadata || {};

      // Fetch or sync public.users record
      let role: 'student' | 'teacher' = (userMeta.role || 'student') as 'student' | 'teacher';
      let name = userMeta.name || authUser.email?.split('@')[0] || 'User';

      const { data: profile } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        role = profile.role as 'student' | 'teacher';
        name = profile.name;
      } else {
        // Fallback insert if trigger hasn't fired
        await supabase.from('users').insert({
          id: authUser.id,
          email: authUser.email,
          name,
          role,
          xp: 0,
          hearts: 5,
          gems: 500,
        });
      }

      const activeUser: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        name,
        role,
      };

      set({
        user: activeUser,
        token: data.session.access_token,
        session: data.session,
        isLoading: false,
        error: null,
      });

      return { success: true, role };
    } catch (e: any) {
      const msg = e.message || 'An unexpected error occurred during sign in.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signUp: async (email: string, password: string, name: string, role: 'student' | 'teacher') => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Auto-confirm user in background so email confirmation is never required
        try {
          await fetch('http://localhost:8000/api/v1/auth/auto-confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
        } catch (e) {
          console.error('Auto-confirm on signup failed:', e);
        }

        // Directly insert or ensure user exists in public.users
        await supabase.from('users').upsert({
          id: data.user.id,
          email,
          name,
          role,
          xp: 0,
          hearts: 5,
          gems: 500,
        });

        if (data.session) {
          set({
            user: { id: data.user.id, email, name, role },
            token: data.session.access_token,
            session: data.session,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      }

      return { success: true };
    } catch (e: any) {
      const msg = e.message || 'An unexpected error occurred during sign up.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, token: null, session: null, isLoading: false });
    } catch (e) {
      console.error('Sign out error:', e);
      set({ user: null, token: null, session: null, isLoading: false });
    }
  },
}));
