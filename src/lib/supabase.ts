import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Live2DModel {
  id: string;
  title: string;
  client: string;
  type: string;
  image_url: string;
  video_url: string;
  features: string[];
  rating: number;
  year: string;
  created_at: string;
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  image_url: string;
  tech: string[];
  status: string;
  year: string;
  players: string;
  is_enabled: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
