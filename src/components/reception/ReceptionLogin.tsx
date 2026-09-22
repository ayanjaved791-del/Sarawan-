import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { SarawanLogo } from '../SarawanLogo';

interface ReceptionLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  onBackToWebsite: () => void;
}

export const ReceptionLogin: React.FC<ReceptionLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sarwan_reception_secure_password');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Invalid username or password.');
      }

      if (data.token) {
        onLoginSuccess(data.token, data.username || username);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to login service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={onBackToWebsite}
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sarawan Website</span>
        </button>

        <div className="text-center">
          <SarawanLogo size="lg" rounded="2xl" className="mx-auto" />
          <h2 className="mt-4 text-2xl sm:text-3xl font-sans font-semibold text-stone-100">
            Receptionist Dashboard
          </h2>
          <p className="mt-2 text-xs text-stone-400 max-w-xs mx-auto">
            Authorized staff login for real-time kitchen dispatch, order management, and menu administration.
          </p>
        </div>

        <div className="mt-8 bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1.5">
                Staff Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-12 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Quick credentials hint for evaluation & staff onboarding */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <span className="font-medium text-amber-400 block">Default Reception Credentials:</span>
              <p>Username: <code className="text-stone-200 font-mono">admin</code></p>
              <p>Password: <code className="text-stone-200 font-mono">sarwan_reception_secure_password</code></p>
              <p className="text-[10px] text-stone-500 mt-1">Configurable in server environment variables.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-semibold rounded-xl text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enter Reception Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
