
import React, { useState } from 'react';
import { AppView, Language, User } from '../types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/auth';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
  onLogin: (user: User) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, lang, setLang, user, onLogout, onLogin, cartCount, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();

  const navLinks = [
    { label: 'Home', labelAr: 'الرئيسية', view: AppView.Home, roles: ['admin', 'user', null] },
    { label: 'Wardrobe', labelAr: 'خزانتي', view: AppView.Wardrobe, roles: ['user'] },
    { label: 'Design', labelAr: 'تصميم', view: AppView.Atelier, roles: ['admin', 'user'] },
    { label: 'Boutique', labelAr: 'المتجر', view: AppView.Boutique, roles: ['admin', 'user'] },
    { label: 'Dashboard', labelAr: 'لوحتي', view: AppView.Dashboard, roles: ['user'] },
    { label: 'Admin Panel', labelAr: 'بوابة المدير', view: AppView.AdminPortal, roles: ['admin'] },
  ];

  const visibleLinks = navLinks.filter(link => !user ? link.roles.includes(null) : link.roles.includes(user.role));

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <span 
              onClick={() => setView(AppView.Home)}
              className="text-3xl font-display font-semibold tracking-[0.3em] cursor-pointer text-gray-900"
            >
              FITFUSION
            </span>
            {user && (
              <span className="ml-4 rtl:mr-4 text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-widest">
                {user.role}
              </span>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {visibleLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-amber-600 ${
                  currentView === link.view ? 'text-amber-600 border-b border-amber-600' : 'text-gray-500'
                }`}
              >
                {lang === 'en' ? link.label : link.labelAr}
              </button>
            ))}
            
            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <button 
                    onClick={() => onLogin({ id: 'user-' + Date.now(), name: 'Guest', role: 'user' })}
                    className="text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-amber-600 transition-colors"
                  >
                    {lang === 'en' ? 'Login' : 'تسجيل دخول'}
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => { setAdminPanelOpen(!adminPanelOpen); setAdminError(''); }}
                      className="text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      {lang === 'en' ? 'Admin' : 'مدير'}
                    </button>
                    {adminPanelOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded shadow-lg p-4 z-50">
                        {adminError && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 text-center uppercase tracking-tighter mb-2">{adminError}</p>}
                        <input
                          type="email"
                          placeholder={lang === 'en' ? 'Email' : 'البريد الإلكتروني'}
                          className="w-full p-2 bg-gray-50 border border-gray-200 text-xs rounded mb-2"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder={lang === 'en' ? 'Password' : 'كلمة المرور'}
                          className="w-full p-2 bg-gray-50 border border-gray-200 text-xs rounded mb-2"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <button
                          onClick={async () => {
                            setAdminError('');
                            setAdminLoading(true);
                            try {
                              const credential = await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
                              const email = credential.user.email?.toLowerCase();
                              if (ADMIN_EMAIL && email !== ADMIN_EMAIL) {
                                setAdminError(lang === 'en' ? 'Not authorized as admin' : 'غير مصرح كمدير');
                                await auth.signOut();
                                setAdminLoading(false);
                                return;
                              }
                              onLogin({ id: credential.user.uid, name: credential.user.email?.split('@')[0] || 'Admin', role: 'admin' });
                              setAdminPanelOpen(false);
                            } catch (err: any) {
                              setAdminError(err?.message || (lang === 'en' ? 'Invalid credentials' : 'بيانات غير صحيحة'));
                            } finally {
                              setAdminLoading(false);
                            }
                          }}
                          disabled={adminLoading}
                          className="w-full py-2 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] rounded hover:bg-amber-600 transition-all disabled:opacity-50"
                        >
                          {adminLoading ? (lang === 'en' ? 'Signing in…' : 'جاري الدخول…') : (lang === 'en' ? 'Admin Login' : 'دخول المدير')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {user?.role === 'user' && (
                <button 
                  onClick={onOpenCart}
                  className="relative p-2 text-gray-700 hover:text-amber-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="px-3 py-1 border border-gray-200 text-[10px] font-bold tracking-widest hover:bg-gray-50 transition-all rounded uppercase"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </button>
              {user && (
                <button 
                  onClick={onLogout}
                  className="text-[9px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors"
                >
                  {lang === 'en' ? 'Logout' : 'خروج'}
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
             {user?.role === 'user' && (
                <button onClick={onOpenCart} className="relative p-2">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1.5}/></svg>
                   {cartCount > 0 && <span className="absolute top-0 right-0 bg-amber-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </button>
             )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {visibleLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => { setView(link.view); setIsOpen(false); }}
                className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-50 last:border-0"
              >
                {lang === 'en' ? link.label : link.labelAr}
              </button>
            ))}
            {user && (
              <button onClick={onLogout} className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-red-500">
                {lang === 'en' ? 'Logout' : 'تسجيل خروج'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
