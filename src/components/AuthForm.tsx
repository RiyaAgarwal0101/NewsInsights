import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Mail, Lock } from 'lucide-react';
import { useSignUpEmailPassword, useSignInEmailPassword, useAuthenticationStatus } from '@nhost/react';
import { useAuthStore } from '../store/authStore';
import { nhost } from '../lib/nhost';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { signUpEmailPassword } = useSignUpEmailPassword();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { isAuthenticated } = useAuthenticationStatus();

  useEffect(() => {
    
    const checkAuth = async () => {
      const user = await nhost.auth.getUser();
      
      if (user) {
        setUser(user);
        navigate('/dashboard', { replace: true });
      }
    };
    checkAuth();
  }, [navigate, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAuthenticated) {
        setError('You are already signed in.');
       
        navigate('/dashboard', { replace: true });
        return;
      }

      let result;
      if (isLogin) {
        result = await signInEmailPassword(email, password);
      } else {
        result = await signUpEmailPassword(email, password);
      }

      if (result.isError) {
        console.log(result.error);
        setError(result.error?.message || 'Authentication failed');
        return;
      }

      setUser(await nhost.auth.getUser());

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Newspaper className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
