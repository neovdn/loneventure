import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../UI/LoadingSpinner';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      } else {
        if (!displayName.trim()) {
          setError('Display name is required');
          setLoading(false);
          return;
        }
        const result = await signUp(email, password, displayName);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans p-4 relative overflow-hidden">
      {/* Dynamic Background Effect (Optional) */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="w-96 h-96 bg-[#4A236E] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow absolute top-1/4 left-1/4"></div>
        <div className="w-96 h-96 bg-[#6F42C1] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow absolute bottom-1/4 right-1/4 animation-delay-5000"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center p-4">
        {/* Left Column (Form) */}
        <div className="w-full max-w-lg lg:w-1/2 p-8 lg:p-12 backdrop-blur-sm bg-black/30 rounded-lg shadow-2xl transition-transform transform hover:scale-[1.01] duration-500">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
              Welcome, Adventurer
            </h1>
            <p className="text-gray-400 font-medium">
              {isLogin ? 'Sign in to continue your epic journey' : 'Forge your legend and create an account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-gray-200 transition-colors"
                  placeholder="Your Adventurer Name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-gray-200 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-gray-200 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6F42C1] hover:bg-[#A855F7] text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Preparing Spells...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              {isLogin
                ? "New here? Begin your quest by signing up"
                : "Already an adventurer? Sign in"
              }
            </button>
          </div>
        </div>

        {/* Right Column (Illustration) */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
          {/* Ganti dengan gambar ilustrasi atau komponen visual lainnya */}
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-extrabold text-white mb-4">Unleash Your Imagination</h2>
            <p className="text-gray-400 text-lg">
              Join a world of epic quests, mythical creatures, and endless adventures. Your story begins now.
            </p>
            <div className="mt-8">
                          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;