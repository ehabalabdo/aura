import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../src/firebase/auth';
import { db } from '../src/firebase/db';
import { Language } from '../types';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  lang: Language;
}

const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin, lang }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = {
    en: {
      title: 'Create Account',
      subtitle: 'Join FitFusion today',
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      register: 'Register',
      haveAccount: 'Already have an account?',
      login: 'Sign In',
      registering: 'Creating account...',
      passwordMismatch: 'Passwords do not match',
      weakPassword: 'Password must be at least 6 characters'
    },
    ar: {
      title: 'إنشاء حساب',
      subtitle: 'انضم إلى فيت فيوجن اليوم',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      register: 'إنشاء حساب',
      haveAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      registering: 'جاري إنشاء الحساب...',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      weakPassword: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.weakPassword);
      return;
    }

    setLoading(true);

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Create Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
        role: 'user',
        createdAt: serverTimestamp()
      });

      // useAuth hook in App.tsx will handle redirect
      onClose();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
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
              {t.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            {loading ? t.registering : t.register}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t.haveAccount}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              {t.login}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
