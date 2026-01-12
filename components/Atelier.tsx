
import React, { useState } from 'react';
import { generateFashionDesign } from '../geminiService';
import { AIDesignResult, Language } from '../types';

interface AtelierProps {
  lang: Language;
}

const Atelier: React.FC<AtelierProps> = ({ lang }) => {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(250);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIDesignResult | null>(null);

  const t = {
    en: {
      title: "The Atelier",
      sub: "Co-create unique garments with AI. Budget in JOD.",
      vision: "Design Vision",
      place: "Describe your garment... e.g. A silk midi dress with heritage patterns.",
      budget: "Budget Limit",
      val: "Standard",
      lux: "Premium",
      btn: "Generate Design",
      loading: "Crafting Concept...",
      materials: "Materials",
      cost: "Estimate",
      prod: "Production Cost (JOD)",
      descLabel: "Design Concept",
      wait: "Awaiting Inspiration",
      waitSub: "Fill the form to visualize your piece",
      currency: "JOD"
    },
    ar: {
      title: "الأتيليه",
      sub: "شارك الذكاء الاصطناعي في ابتكار تصاميمك. الميزانية بالدينار.",
      vision: "رؤية التصميم",
      place: "صف القطعة المرادة... مثال: فستان حريري بألوان الصحراء.",
      budget: "حد الميزانية",
      val: "اقتصادي",
      lux: "فاخر",
      btn: "ابتكر التصميم",
      loading: "جاري التصميم...",
      materials: "الخامات",
      cost: "التكلفة التقديرية",
      prod: "تكلفة الإنتاج (دينار)",
      descLabel: "مفهوم التصميم",
      wait: "بانتظار إلهامك",
      waitSub: "املأ البيانات لتشاهد تصميمك الأول",
      currency: "دينار"
    }
  }[lang];

  const handleGenerate = async () => {
    if (!description) return alert(lang === 'en' ? "Describe your vision!" : "صف رؤيتك أولاً!");
    setLoading(true);
    try {
      const design = await generateFashionDesign(description, budget, lang);
      setResult(design);
    } catch (err) {
      alert(lang === 'en' ? "Failed to design." : "فشل ابتكار التصميم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-display text-gray-900 mb-4">{t.title}</h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="bg-white p-12 border border-gray-100 shadow-sm rounded-lg">
          <div className="space-y-10">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-bold">{t.vision}</label>
              <textarea 
                placeholder={t.place}
                className="w-full p-8 bg-gray-50 border-none text-lg font-light focus:ring-1 focus:ring-amber-200 min-h-[220px] leading-relaxed rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between mb-5 items-center">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t.budget}</label>
                <span className="text-amber-600 font-display text-3xl">{budget} {t.currency}</span>
              </div>
              <input 
                type="range" min="50" max="1500" step="50"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-3 uppercase tracking-tighter">
                <span>{t.val}</span>
                <span>{t.lux}</span>
              </div>
            </div>

            <button 
              onClick={handleGenerate} disabled={loading}
              className="w-full py-6 bg-gray-900 text-white uppercase tracking-[0.3em] text-xs font-bold hover:bg-amber-600 transition-all shadow-xl flex justify-center items-center gap-3 rounded"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {t.loading}
                </>
              ) : t.btn}
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {result ? (
            <div className="animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="aspect-square bg-white border border-gray-100 overflow-hidden mb-10 shadow-2xl rounded-lg">
                <img src={result.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-4">{t.materials}</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {result.materials.map((m, i) => <li key={i} className="flex items-center gap-3 font-light"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>{m}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-4">{t.cost}</h4>
                  <p className="text-4xl font-display text-gray-900">{result.estimatedCost} <span className="text-xs uppercase">{t.currency}</span></p>
                  <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-tight">{t.prod}</p>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-gray-100">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-4">{t.descLabel}</h4>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{result.description}"</p>
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 p-16 text-center rounded-lg">
              <svg className="w-20 h-20 mb-6 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p className="font-display text-2xl uppercase tracking-[0.2em] opacity-30">{t.wait}</p>
              <p className="text-xs mt-3 opacity-40 font-light">{t.waitSub}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Atelier;
