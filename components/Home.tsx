
import React from 'react';
import { AppView, Language } from '../types';

interface HomeProps {
  setView: (view: AppView) => void;
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ setView, lang }) => {
  const content = {
    en: {
      heroTitle: <>Elevate Your Style <br/> <span className="italic">With AI Precision</span></>,
      heroSub: "Experience the future of personal styling and artisan fashion. Your virtual closet and creative partner.",
      btn1: "Start Styling",
      btn2: "Shop Boutique",
      p1Title: "AI Outfit Stylist",
      p1Desc: "Digitize your wardrobe and let Aura suggest the perfect look for any occasion.",
      p2Title: "AI Fashion Designer",
      p2Desc: "Co-create dream garments. Describe your vision and see it come to life with AI.",
      p3Title: "The Boutique",
      p3Desc: "Shop exclusive, hand-crafted pieces designed with soul by master artisans.",
      valueSection: "Core Values",
      valueMain: "Why Choose Aura?",
      values: [
        { t: 'Personalized', d: 'AI that learns your taste.' },
        { t: 'Budget First', d: 'Always stylish, always affordable.' },
        { t: 'Artisan Crafted', d: 'Support slow fashion.' },
        { t: 'Modern Tech', d: 'Gemini-powered insights.' }
      ]
    },
    ar: {
      heroTitle: <>ارتقِ بأسلوبك <br/> <span className="italic">بذكاء فائق</span></>,
      heroSub: "اختبر مستقبل تنسيق الأزياء الشخصي والقطع الحرفية. خزانتك الافتراضية وشريكك الإبداعي في مكان واحد.",
      btn1: "ابدأ التنسيق",
      btn2: "تسوق المتجر",
      p1Title: "منسق الملابس الذكي",
      p1Desc: "حول خزانتك إلى رقمية ودع 'أورا' تقترح لك الإطلالة المثالية لكل مناسبة.",
      p2Title: "المصمم المبدع",
      p2Desc: "شارك في ابتكار ملابس أحلامك. صف رؤيتك وشاهدها تتحول لواقع عبر الذكاء الاصطناعي.",
      p3Title: "المتجر الحرفي",
      p3Desc: "تسوق قطعاً حصرية مصنوعة يدوياً بحب من قبل أمهر الحرفيين التقليديين.",
      valueSection: "قيمنا الأساسية",
      valueMain: "لماذا تختار أورا؟",
      values: [
        { t: 'مخصص لك', d: 'ذكاء يتعلم ذوقك الخاص.' },
        { t: 'ميزانية ذكية', d: 'أناقة دائمة بتكلفة مدروسة.' },
        { t: 'صناعة يدوية', d: 'دعم الموضة المستدامة والحرف.' },
        { t: 'تقنية حديثة', d: 'رؤى مدعومة من Gemini.' }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Fashion"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className={`text-4xl md:text-7xl lg:text-8xl text-white mb-8 font-display font-light leading-snug md:leading-normal`}>
            {t.heroTitle}
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={() => setView(AppView.Wardrobe)} className="px-12 py-5 bg-white text-gray-900 font-bold hover:bg-amber-50 transition-all uppercase tracking-widest text-[10px] shadow-2xl">
              {t.btn1}
            </button>
            <button onClick={() => setView(AppView.Boutique)} className="px-12 py-5 bg-transparent border border-white/40 text-white font-bold hover:bg-white hover:text-gray-900 transition-all uppercase tracking-widest text-[10px] backdrop-blur-sm">
              {t.btn2}
            </button>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-16">
        <div className="group cursor-pointer" onClick={() => setView(AppView.Wardrobe)}>
          <div className="overflow-hidden aspect-[3/4] mb-8 shadow-sm">
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Closet" />
          </div>
          <h3 className="text-3xl font-display mb-4 text-gray-900 leading-snug">{t.p1Title}</h3>
          <p className="text-gray-500 font-light leading-relaxed">{t.p1Desc}</p>
        </div>
        <div className="group cursor-pointer" onClick={() => setView(AppView.Atelier)}>
          <div className="overflow-hidden aspect-[3/4] mb-8 shadow-sm">
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Design" />
          </div>
          <h3 className="text-3xl font-display mb-4 text-gray-900 leading-snug">{t.p2Title}</h3>
          <p className="text-gray-500 font-light leading-relaxed">{t.p2Desc}</p>
        </div>
        <div className="group cursor-pointer" onClick={() => setView(AppView.Boutique)}>
          <div className="overflow-hidden aspect-[3/4] mb-8 shadow-sm">
            <img src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Shop" />
          </div>
          <h3 className="text-3xl font-display mb-4 text-gray-900 leading-snug">{t.p3Title}</h3>
          <p className="text-gray-500 font-light leading-relaxed">{t.p3Desc}</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-amber-50/30 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-600 text-[10px] tracking-[0.3em] uppercase mb-4 block font-bold">{t.valueSection}</span>
          <h2 className="text-4xl md:text-6xl font-display mb-20 text-gray-900 leading-snug">{t.valueMain}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {t.values.map((v, i) => (
              <div key={i} className="p-8 bg-white shadow-sm border border-amber-50">
                <h4 className="font-display text-2xl mb-3 text-gray-800 leading-snug">{v.t}</h4>
                <p className="text-gray-400 text-xs font-light leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;