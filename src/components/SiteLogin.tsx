import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SiteLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // App.tsx auth listener will automatically handle the redirect upon session creation
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-peach-500/10 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sakura-500/10 rounded-full blur-3xl mix-blend-overlay" />
      </div>

      <div className="relative w-full max-w-md bg-brown-800/80 backdrop-blur-xl border border-brown-700/50 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brown-900 rounded-2xl flex items-center justify-center mb-4 border border-brown-700 shadow-inner">
            <Lock className="w-8 h-8 text-peach-400" />
          </div>
          <h1 className="text-2xl font-bold text-peach-100 tracking-tight">Access Restricted</h1>
          <p className="text-brown-300 text-sm mt-2 text-center">
            This portfolio site is secured. Please sign in to view confidential assets and models.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brown-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brown-900/50 border border-brown-600 rounded-xl px-4 py-3 text-peach-100 placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-peach-500 transition-all font-medium"
              placeholder="portfolio@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brown-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brown-900/50 border border-brown-600 rounded-xl px-4 py-3 text-peach-100 placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-peach-500 transition-all font-medium pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-400 hover:text-peach-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-peach-500 to-sakura-500 hover:from-peach-400 hover:to-sakura-400 text-brown-900 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
