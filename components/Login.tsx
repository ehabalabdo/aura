import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/auth';
import { Language } from '../types';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = {
    en: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue',
      email: 'Email',
      password: 'Password',
      login: 'Sign In',
      noAccount: "Don't have an account?",
      register: 'Register',
      logging: 'Signing in...',
      invalid: 'Invalid email or password'
    },
    ar: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجل دخولك للمتابعة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      noAccount: 'ليس لديك حساب؟',
      register: 'إنشاء حساب',
      logging: 'جاري تسجيل الدخول...',
      invalid: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t.invalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-md w-full p-8 shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-gray-900 mb-2">{t.title}</h2>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            {loading ? t.logging : t.login}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t.noAccount}{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              {t.register}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
