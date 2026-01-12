
import React from 'react';
import { MarketProduct, Language } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: MarketProduct[];
  setCart: React.Dispatch<React.SetStateAction<MarketProduct[]>>;
  onPlaceOrder: () => void;
  lang: Language;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, setCart, onPlaceOrder, lang }) => {
  const t = {
    en: {
      title: "Your Bag",
      empty: "Your bag is empty.",
      total: "Subtotal",
      checkout: "Confirm Order",
      remove: "Remove",
      currency: "JOD"
    },
    ar: {
      title: "سلة التسوق",
      empty: "السلة فارغة حالياً.",
      total: "المجموع",
      checkout: "إتمام الطلب",
      remove: "حذف",
      currency: "دينار"
    }
  }[lang];

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white shadow-2xl animate-in ${lang === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-500 flex flex-col`}>
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="text-3xl font-display">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-6">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 group">
                <div className="w-20 h-24 bg-gray-50 overflow-hidden shrink-0">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-sm font-bold uppercase">{lang === 'ar' ? item.nameAr : item.name}</h4>
                    <p className="text-amber-700 font-display text-lg font-bold">{item.price} {t.currency}</p>
                  </div>
                  <button 
                    onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                    className="text-[10px] uppercase font-bold text-red-400 hover:text-red-700 w-fit"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1}/></svg>
              <p>{t.empty}</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t bg-gray-50 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.total}</span>
              <span className="text-3xl font-display text-gray-900 font-bold">{total} {t.currency}</span>
            </div>
            <button 
              onClick={onPlaceOrder}
              className="w-full py-6 bg-gray-900 text-white uppercase tracking-[0.3em] text-xs font-bold hover:bg-amber-600 transition-all shadow-xl rounded"
            >
              {t.checkout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
