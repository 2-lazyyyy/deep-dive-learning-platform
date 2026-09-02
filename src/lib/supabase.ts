import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const client = createClient(supabaseUrl, supabaseAnonKey);

// Compatibility alias for code transitioning from python/custom APIs
(client as any).table = (tableName: string) => client.from(tableName);

export const supabase = client;
