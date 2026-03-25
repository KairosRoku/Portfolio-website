import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Provide dummy environment variables for Supabase to prevent initialization errors during tests
if (typeof process !== 'undefined') {
  process.env.VITE_SUPABASE_URL = 'https://dummy.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'dummy-key';
}

// For Vite's import.meta.env support in Vitest
vi.stubEnv('VITE_SUPABASE_URL', 'https://dummy.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'dummy-key');
