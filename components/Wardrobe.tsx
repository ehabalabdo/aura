
import React, { useState } from 'react';
import { ClosetItem, Language, StylingResult, Category } from '../types';
import { getStylingRecommendation, analyzeClothingImage } from '../geminiService';

interface WardrobeProps {
  items: ClosetItem[];
  setItems: React.Dispatch<React.SetStateAction<ClosetItem[]>>;
  lang: Language;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const Wardrobe: React.FC<WardrobeProps> = ({ items, setItems, lang }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [stylingResult, setStylingResult] = useState<StylingResult | null>(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const t = {
    en: {
      title: "The Digital Closet",
      sub: "Aura analyzes every pixel to match your colors perfectly.",
      askTitle: "Style Consultant",
      occLabel: "Occasion or Vibe",
      occPlace: "e.g., Casual brunch, formal gala, street style...",
      btn: "Curate My Look",
      note: "Expert Stylist Note",
      pickedTitle: "The Curated Look",
      categories: {
        Top: "Tops & Blouses",
        Bottom: "Trousers & Skirts",
        Outerwear: "Jackets & Layers",
        Shoes: "Footwear",
        Accessory: "Accessories"
      },
      upload: "Upload",
      analyzing: "Analyzing...",
      empty: "Category is empty."
    },
    ar: {
      title: "الخزانة الرقمية",
      sub: "أورا تحلل كل بكسل لتنسيق ألوانك بشكل مثالي.",
      askTitle: "مستشار المظهر",
      occLabel: "المناسبة أو الطابع",
      occPlace: "مثال: عشاء عمل، سهرة فاخرة، نمط الشارع...",
      btn: "تنسيق إطلالتي",
      note: "ملاحظة المنسق الخبير",
      pickedTitle: "الإطلالة المنسقة",
      categories: {
        Top: "بلايز وقمصان",
        Bottom: "بناطيل وتنانير",
        Outerwear: "جاكيتات ومعاطف",
        Shoes: "أحذية",
        Accessory: "إكسسوارات"
      },
      upload: "تحميل",
      analyzing: "جاري التحليل...",
      empty: "هذا القسم فارغ."
    }
  }[lang];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: Category) => {
    const files = e.target.files;
    setError(null);
    if (files && files.length > 0) {
      setUploading(category);
      const fileArray = Array.from(files) as File[];
      for (const file of fileArray) {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          setError(lang === 'en' ? 'File size must be less than 5MB' : 'حجم الملف يجب أن يكون أقل من 5MB');
          setUploading(null);
          continue;
        }
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          setError(lang === 'en' ? 'Please upload a valid image file (JPEG, PNG, WebP, GIF)' : 'يرجى تحميل صورة صالحة');
          setUploading(null);
          continue;
        }
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onloadend = async () => {
            const result = reader.result;
            if (typeof result !== 'string') {
              resolve();
              return;
            }
            try {
              const base64 = result;
              const analysis = await analyzeClothingImage(base64);
              
              const newItem: ClosetItem = {
                id: Math.random().toString(36).substring(2, 11),
                imageUrl: base64,
                category: category,
                color: analysis.color,
                style: analysis.style,
                addedAt: new Date(),
              };
              setItems(prev => [newItem, ...prev]);
            } catch (err) {
              console.error('Error analyzing image:', err);
              setError(lang === 'en' ? 'Failed to analyze image' : 'فشل تحليل الصورة');
            }
            resolve();
          };
          reader.onerror = () => {
            setError(lang === 'en' ? 'Failed to read file' : 'فشل قراءة الملف');
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      setUploading(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const askStylist = async () => {
    if (items.length === 0) {
      setError(lang === 'en' ? "Add items first!" : "أضف قطعاً أولاً!");
      return;
    }
    if (prompt.trim().length === 0) {
      setError(lang === 'en' ? "Describe the occasion first!" : "صف المناسبة أولاً!");
      return;
    }
    setLoading(true);
    setError(null);
    setStylingResult(null);
    try {
      const result = await getStylingRecommendation(items, prompt, lang);
      setStylingResult(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      console.error('Styling error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (cat: Category) => {
    const sectionItems = items.filter(i => i.category === cat);
    const isThisUploading = uploading === cat;

    return (
      <div key={cat} className="mb-12 border-b border-gray-50 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-display font-semibold text-gray-800 tracking-wide">{(t.categories as any)[cat]}</h3>
            <span className="text-[9px] text-gray-400 font-bold uppercase">({sectionItems.length})</span>
          </div>
          <label className={`cursor-pointer bg-gray-900 text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-600 transition-all ${isThisUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isThisUploading ? t.analyzing : t.upload}
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, cat)} accept="image/*" multiple disabled={isThisUploading} />
          </label>
        </div>
        
        {sectionItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectionItems.map((item) => (
              <div key={item.id} className="relative aspect-[3/4] overflow-hidden bg-white shadow-sm border border-gray-100 group animate-in zoom-in-95 duration-300">
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[8px] font-bold uppercase text-amber-800 line-clamp-1">{item.color}</p>
                  <p className="text-[8px] text-gray-500 line-clamp-1">{item.style}</p>
                </div>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:text-red-600 shadow-md hover:scale-110 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-300 italic py-4">{isThisUploading ? t.analyzing : t.empty}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-16">
        <h1 className="text-5xl font-display text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-500 font-light">{t.sub}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div className="flex-1">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          {(['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'] as Category[]).map(renderSection)}
        </div>

        <div className="space-y-10">
          <div className="bg-white border border-amber-50 p-8 shadow-2xl sticky top-28 rounded-sm">
            <h2 className="text-3xl font-display mb-8 text-gray-900 border-b border-amber-50 pb-4">{t.askTitle}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{t.occLabel}</label>
                <textarea 
                  placeholder={t.occPlace}
                  className="w-full p-4 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-amber-200 min-h-[100px] leading-relaxed rounded"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <button 
                onClick={askStylist} disabled={loading || !!uploading}
                className="w-full py-4 bg-amber-600 text-white uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? t.analyzing : t.btn}
              </button>

              {stylingResult && stylingResult.picks.length > 0 && (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h4 className="text-[10px] uppercase tracking-widest text-amber-800 font-bold mb-6 border-b border-amber-50 pb-2">{t.pickedTitle}</h4>
                  <div className="space-y-6 mb-8">
                    {stylingResult.picks.map((pick, idx) => {
                      const item = items.find(i => i.id === pick.itemId);
                      if (!item) return null;
                      return (
                        <div key={idx} className="flex gap-4 items-center p-2 hover:bg-gray-50 rounded-sm transition-colors">
                          <img src={item.imageUrl} className="w-16 h-20 object-cover shadow-sm border border-gray-100" alt="" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[9px] uppercase font-bold text-amber-700">{(t.categories as any)[pick.role]}</p>
                              <span className="text-[8px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold">{item.color}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-tight italic">{pick.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-amber-50 rounded border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-800 uppercase mb-2">{t.note}</p>
                    <p className="text-xs text-gray-800 italic leading-relaxed">{stylingResult.overallDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
