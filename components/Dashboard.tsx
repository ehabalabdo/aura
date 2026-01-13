
import React from 'react';
import { ClosetItem, Language, Order } from '../types';

interface DashboardProps {
  items: ClosetItem[];
  orders: Order[];
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ items, orders, lang }) => {
  const t = {
    en: {
      title: "Welcome Back",
      sub: "Your fashion journey at a glance.",
      m1: "Closet Size",
      m1Sub: "Items",
      m2: "My Orders",
      m2Sub: "Total",
      m3: "New Alerts",
      m3Sub: "Active",
      recent: "Recent Additions",
      orderHistory: "Order History",
      analysis: "Style Analysis",
      c1: "Closet Cohesion",
      c2: "Color Harmony",
      tipTitle: "FitFusion Stylist Tip",
      tip: "Your palette is neutral. Try adding emerald or navy to diversify your looks this season.",
      status: "Status",
      statusLabels: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered"
      }
    },
    ar: {
      title: "أهلاً بك مجدداً",
      sub: "رحلة أناقتك في لمحة سريعة.",
      m1: "حجم الخزانة",
      m1Sub: "قطع",
      m2: "طلباتي",
      m2Sub: "إجمالي",
      m3: "تنبيهات",
      m3Sub: "نشط",
      recent: "أحدث الإضافات",
      orderHistory: "سجل الطلبات",
      analysis: "تحليل الأسلوب",
      c1: "تماسك الخزانة",
      c2: "تناسق الألوان",
      tipTitle: "نصيحة فيت فيوجن",
      tip: "خزانتك تميل للألوان الهادئة. نقترح إضافة لون زمردي أو كحلي لكسر الرتابة وتنشيط مظهرك هذا الموسم.",
      status: "الحالة",
      statusLabels: {
        pending: "قيد الانتظار",
        processing: "جاري التجهيز",
        shipped: "تم الشحن",
        delivered: "تم التسليم"
      }
    }
  }[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16 border-b border-gray-100 pb-10">
        <h1 className="text-5xl font-display text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-500 font-light italic">{t.sub}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-16">
        <div className="bg-white border border-amber-100 p-10 shadow-sm rounded-lg">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{t.m1}</h4>
          <p className="text-5xl font-display text-gray-900">{items.length} <span className="text-sm font-light text-gray-400">{t.m1Sub}</span></p>
        </div>
        <div className="bg-white border border-gray-100 p-10 shadow-sm rounded-lg">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{t.m2}</h4>
          <p className="text-5xl font-display text-gray-900">{orders.length} <span className="text-sm font-light text-gray-400">{t.m2Sub}</span></p>
        </div>
        <div className="bg-white border border-gray-100 p-10 shadow-sm rounded-lg">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{t.m3}</h4>
          <p className="text-5xl font-display text-amber-600">
             {orders.filter(o => o.status === 'processing').length}
             <span className="text-sm font-light text-gray-400 ml-2">{t.m3Sub}</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
         {/* ORDERS SECTION */}
        <div className="bg-white border border-gray-100 p-12 shadow-sm rounded-lg">
          <h3 className="text-3xl font-display mb-10">{t.orderHistory}</h3>
          <div className="space-y-8">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="border-b border-gray-50 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Order {order.id}</span>
                    <p className="text-[10px] text-gray-500 mt-1">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-3 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-amber-50 text-amber-800' : 
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-800' : 
                    'bg-green-50 text-green-800'
                  }`}>
                    {(t.statusLabels as any)[order.status]}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {order.items.map((it, i) => (
                    <img key={i} src={it.imageUrl} className="w-12 h-16 object-cover rounded shadow-sm shrink-0" alt="" />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900 mt-3">{order.totalPrice} JOD</p>
              </div>
            )) : (
              <p className="text-center text-gray-300 italic py-10">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-16">
          <div className="bg-white border border-gray-100 p-12 shadow-sm rounded-lg">
            <h3 className="text-3xl font-display mb-10">{t.recent}</h3>
            <div className="space-y-6">
              {items.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-8 p-5 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0">
                  <img src={item.imageUrl} className="w-16 h-16 object-cover rounded shadow-sm" alt="" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm uppercase tracking-widest">{item.category}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{item.color} • {item.style}</p>
                  </div>
                  <span className="ml-auto text-[9px] text-gray-300 font-bold uppercase">{item.addedAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              ))}
              {items.length === 0 && <p className="text-center text-gray-300 italic">No items in closet.</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-12 shadow-sm rounded-lg">
            <h3 className="text-3xl font-display mb-10">{t.analysis}</h3>
            <div className="space-y-10">
              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                  <span>{t.c1}</span>
                  <span className="text-amber-600">80%</span>
                </div>
                <div className="h-1 bg-gray-50 w-full overflow-hidden">
                  <div className="h-full bg-amber-600 w-[80%] transition-all duration-1000"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                  <span>{t.c2}</span>
                  <span className="text-gray-900">45%</span>
                </div>
                <div className="h-1 bg-gray-50 w-full overflow-hidden">
                  <div className="h-full bg-gray-900 w-[45%] transition-all duration-1000"></div>
                </div>
              </div>
              <div className="mt-16 p-8 bg-amber-50/50 border border-amber-100 rounded">
                <h5 className="text-[10px] font-bold uppercase mb-4 text-amber-800 tracking-[0.2em]">{t.tipTitle}:</h5>
                <p className={`text-sm italic text-amber-900 leading-relaxed ${lang === 'ar' ? 'font-sans' : ''}`}>
                  "{t.tip}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
