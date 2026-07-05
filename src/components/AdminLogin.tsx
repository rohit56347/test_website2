import React, { useState } from 'react';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  isDemoMode: boolean;
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminLogin({ isDemoMode, onBack, onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onLogin(email, password);
      if (!res.success) {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-[#050505] text-[#E0D8D0] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Back to store shortcut */}
      <button
        onClick={onBack}
        disabled={isSubmitting}
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E0D8D0]/60 hover:text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-50 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Storefront
      </button>

      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl font-serif font-light text-white tracking-tight">Operations Hub</h2>
          <p className="text-xs uppercase tracking-widest text-[#E0D8D0]/60 mt-2">
            Secure panel for store administrators
          </p>
        </div>

        {/* Demo Mode credentials warning */}
        {isDemoMode && (
          <div className="bg-white/5 border border-white/5 rounded-none p-5 text-sm space-y-3">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs flex items-center gap-1.5">
              <span>💡</span> Demo Mode Active
            </h4>
            <p className="text-xs text-[#E0D8D0]/80 leading-relaxed">
              Use these pre-approved credentials to unlock the high-fidelity operations panel:
            </p>
            <div className="bg-[#050505] p-3 rounded-none border border-white/5 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-[#E0D8D0]/40 uppercase tracking-widest text-[9px]">Email:</span>
                <span className="text-[#D4AF37] font-semibold select-all">admin@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E0D8D0]/40 uppercase tracking-widest text-[9px]">Password:</span>
                <span className="text-[#D4AF37] font-semibold select-all">admin123</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#111111] border border-white/5 p-8 rounded-none shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-wider p-4 rounded mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E0D8D0]/40">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E0D8D0]/40">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] text-black font-bold py-3.5 px-6 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#D4AF37]/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

