
import React, { useState } from 'react';
import { MarketProduct, Language } from '../types';

interface BoutiqueProps {
  products: MarketProduct[];
  lang: Language;
  onAddToCart: (p: MarketProduct) => void;
}

const Boutique: React.FC<BoutiqueProps> = ({ products, lang, onAddToCart }) => {
  const [filter, setFilter] = useState<number>(2000);
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);

  const t = {
    en: {
      title: "The Artisan Boutique",
      sub: "Exclusive pieces priced in JOD.",
      budget: "Budget Limit",
      details: "View Details",
      storyLabel: "Designer's Note",
      order: "Add to Bag",
      noProds: "No products in this price range.",
      currency: "JOD"
    },
    ar: {
      title: "متجر الحرفيين",
      sub: "قطع حصرية مسعّرة بالدينار الأردني.",
      budget: "حد الميزانية",
      details: "عرض التفاصيل",
      storyLabel: "وصف المصمم",
      order: "إضافة للسلة",
      noProds: "لا توجد قطع ضمن هذا السعر حالياً.",
      currency: "دينار"
    }
  }[lang];

  const filteredProducts = products.filter(p => p.price <= filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8 border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-5xl font-display text-gray-900 mb-3">{t.title}</h1>
          <p className="text-gray-500 font-light italic">{t.sub}</p>
        </div>
        <div className="flex items-center gap-8 bg-white p-6 border border-amber-50 shadow-sm min-w-[320px] rounded-lg">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t.budget}</span>
          <input 
            type="range" min="10" max="2000" step="10"
            value={filter}
            onChange={(e) => setFilter(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-100 appearance-none cursor-pointer accent-amber-600"
          />
          <span className="text-gray-900 font-display text-2xl whitespace-nowrap">{filter} {t.currency}</span>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div onClick={() => setSelectedProduct(product)} className="aspect-[3/4] overflow-hidden bg-gray-50 mb-6 relative shadow-sm rounded-sm">
                <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <span className="px-6 py-3 bg-white text-gray-900 text-[10px] tracking-widest uppercase font-bold shadow-xl">{t.details}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{lang === 'en' ? product.name : product.nameAr}</h3>
                  <span className="text-amber-800 font-display text-xl font-bold">{product.price} <span className="text-[10px]">{t.currency}</span></span>
                </div>
                <p className="text-[11px] text-gray-400 font-light line-clamp-2 italic">{lang === 'en' ? product.description : product.descriptionAr}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="w-full mt-4 py-2 border border-gray-900 text-gray-900 text-[9px] uppercase font-bold tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                >
                  {t.order}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-300 italic font-display text-2xl">
          {t.noProds}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="bg-white max-w-5xl w-full max-h-[95vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl rounded-sm">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 z-10 p-3 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="md:w-1/2 bg-gray-50">
              <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="md:w-1/2 p-12 flex flex-col justify-center">
              <div className="mb-10">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-5xl font-display text-gray-900">{lang === 'en' ? selectedProduct.name : selectedProduct.nameAr}</h2>
                  <div className="text-4xl font-display text-amber-700 font-bold">{selectedProduct.price} <span className="text-xs">{t.currency}</span></div>
                </div>
                <div className="h-px w-20 bg-amber-100 mb-6"></div>
                <p className="text-gray-500 font-light leading-relaxed text-lg italic mb-4">
                    {lang === 'en' ? selectedProduct.description : selectedProduct.descriptionAr}
                </p>
              </div>

              {(selectedProduct.story || selectedProduct.storyAr) && (
                <div className="mb-12 p-8 bg-amber-50/50 border-r-4 border-amber-600 border-l-0 rtl:border-l-4 rtl:border-r-0">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-amber-800">{t.storyLabel}</h4>
                  <p className="text-sm text-gray-700 font-light italic leading-relaxed">"{lang === 'en' ? selectedProduct.story : selectedProduct.storyAr}"</p>
                </div>
              )}

              <button 
                onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full py-6 bg-gray-900 text-white uppercase tracking-[0.3em] text-xs font-bold hover:bg-amber-600 transition-all shadow-xl"
              >
                {t.order}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boutique;
