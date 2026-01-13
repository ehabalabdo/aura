
import React, { useState } from 'react';
import { User, Language } from '../types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/auth';

interface AuthModalProps {
  onLogin: (user: User) => void;
  lang: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, lang }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "Welcome to FitFusion",
      sub: isAdminMode ? "Admin Secure Access" : "Sign in to start your styling journey",
      userGoogle: "Continue with Google",
      adminToggle: "Admin Login",
      userToggle: "Back",
      email: "Email",
      password: "Password",
      login: "Login",
      invalid: "Invalid credentials",
      brand: "FITFUSION AI",
      logging: "Logging in..."
    },
    ar: {
      title: "مرحباً بك في فيت فيوجن",
      sub: isAdminMode ? "دخول المدير الآمن" : "سجل دخولك لتبدأ رحلة الأناقة",
      userGoogle: "المتابعة باستخدام جوجل",
      adminToggle: "دخول المدير",
      userToggle: "رجوع",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      invalid: "بيانات غير صحيحة",
      brand: "فيت فيوجن الذكية",
      logging: "جاري تسجيل الدخول..."
    }
  }[lang];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
      const credential = await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
      
      // Check if email matches admin email
      if (ADMIN_EMAIL && credential.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        setError(lang === 'en' ? 'Not authorized as admin' : 'غير مصرح كمدير');
        await auth.signOut();
        setLoading(false);
        return;
      }
      
      onLogin({ 
        id: credential.user.uid, 
        name: credential.user.email?.split('@')[0] || 'Admin', 
        role: 'admin' 
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t.invalid);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Simulated Google login for easier testing and development
    onLogin({
      id: 'google-user-' + Date.now(),
      name: 'Google User',
      role: 'user'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/60 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-700">
      <div className="bg-white max-w-md w-full p-10 shadow-2xl relative overflow-hidden rounded-lg">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.4em] text-amber-600 font-bold uppercase mb-4 block">
              {t.brand}
            </span>
            <h2 className="text-4xl font-display text-gray-900 mb-2">{t.title}</h2>
            <p className="text-xs text-gray-400 font-light italic">{t.sub}</p>
          </div>

          {!isAdminMode ? (
            <div className="space-y-6 flex flex-col items-center">
              {/* Mock Google Button */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-4 py-4 border border-gray-100 hover:bg-gray-50 transition-all group rounded"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-700">{t.userGoogle}</span>
              </button>

              <div className="relative py-4 w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[8px] uppercase font-bold text-gray-300 bg-white px-2">OR</div>
              </div>

              <button 
                onClick={() => setIsAdminMode(true)}
                className="w-full text-center text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-amber-600 transition-colors"
              >
                {t.adminToggle}
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              {error && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 text-center uppercase tracking-tighter">{error}</p>}
              
              <input 
                type="email" 
                placeholder={t.email}
                className="w-full p-4 bg-gray-50 border-none text-xs rounded focus:ring-1 focus:ring-amber-200"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              
              <input 
                type="password" 
                placeholder={t.password}
                className="w-full p-4 bg-gray-50 border-none text-xs rounded focus:ring-1 focus:ring-amber-200"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.logging : t.login}
              </button>

              <button 
                type="button"
                onClick={() => { setIsAdminMode(false); setError(''); }}
                className="w-full text-center text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-4"
              >
                {t.userToggle}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
