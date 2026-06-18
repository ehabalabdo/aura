
import React, { useState, useEffect } from 'react';
import { AppView, Language, User } from '../types';
import Login from './Login';
import Register from './Register';

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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Auto-close modals when user logs in
  useEffect(() => {
    if (user) {
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [user]);

  const navLinks = [
    { label: 'Home', labelAr: 'الرئيسية', view: AppView.Home, roles: ['admin', 'user', null] },
    { label: 'Wardrobe', labelAr: 'خزانتي', view: AppView.Wardrobe, roles: ['user'] },
    { label: 'Design', labelAr: 'تصميم', view: AppView.Atelier, roles: ['admin', 'user'] },
    { label: 'Boutique', labelAr: 'المتجر', view: AppView.Boutique, roles: ['admin', 'user', null] },
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
                    onClick={() => setShowLogin(true)}
                    className="text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-amber-600 transition-colors"
                  >
                    {lang === 'en' ? 'Login' : 'تسجيل دخول'}
                  </button>
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="text-[9px] uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    {lang === 'en' ? 'Register' : 'إنشاء حساب'}
                  </button>
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
            {!user && (
              <>
                <button 
                  onClick={() => { setShowLogin(true); setIsOpen(false); }}
                  className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-amber-600 border-b border-gray-50"
                >
                  {lang === 'en' ? 'Login' : 'تسجيل دخول'}
                </button>
                <button 
                  onClick={() => { setShowRegister(true); setIsOpen(false); }}
                  className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-amber-600 border-b border-gray-50"
                >
                  {lang === 'en' ? 'Register' : 'إنشاء حساب'}
                </button>
              </>
            )}
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-gray-600 border-b border-gray-50"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            {user && (
              <button onClick={onLogout} className="block w-full text-left rtl:text-right px-3 py-4 text-sm font-medium text-red-500">
                {lang === 'en' ? 'Logout' : 'تسجيل خروج'}
              </button>
            )}
          </div>
        </div>
      )}
      
      {showLogin && (
        <div className="fixed inset-0 z-[200] bg-black/50">
          <div className="relative">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-[201]"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Login 
              onClose={() => setShowLogin(false)} 
              onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
              lang={lang}
            />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="fixed inset-0 z-[200] bg-black/50">
          <div className="relative">
            <button 
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-[201]"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Register 
              onClose={() => setShowRegister(false)}
              onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
              lang={lang}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
