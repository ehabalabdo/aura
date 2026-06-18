
import React, { useState, useRef } from 'react';
import { MarketProduct, Language, Order } from '../types';

interface AdminPortalProps {
  products: MarketProduct[];
  setProducts: React.Dispatch<React.SetStateAction<MarketProduct[]>>;
  orders: Order[];
  onUpdateOrder: (id: string, status: Order['status']) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ products, setProducts, orders, onUpdateOrder, onDelete, lang }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<MarketProduct>>({
    name: '', nameAr: '', description: '', descriptionAr: '', price: 0, imageUrl: '', story: '', storyAr: ''
  });

  const t = {
    en: {
      title: "Admin Portal",
      tabProducts: "Boutique Inventory",
      tabOrders: "Incoming Orders",
      addProduct: "Add New Piece",
      editProduct: "Edit Piece",
      name: "Product Name (EN)",
      nameAr: "Product Name (AR)",
      desc: "Description (EN)",
      descAr: "Description (AR)",
      price: "Price (JOD)",
      imgBtn: "Upload Photo",
      save: "Add to Shop",
      delete: "Delete Now",
      empty: "The store is empty.",
      orderId: "Order ID",
      customer: "Customer",
      items: "Items",
      total: "Total",
      status: "Status",
      actions: "Actions",
      statusLabels: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered"
      }
    },
    ar: {
      title: "بوابة المدير",
      tabProducts: "مخزون المتجر",
      tabOrders: "طلبات الزبائن",
      addProduct: "إضافة قطعة جديدة",
      editProduct: "تعديل القطعة",
      name: "اسم المنتج (EN)",
      nameAr: "اسم المنتج (AR)",
      desc: "وصف المنتج (EN)",
      descAr: "وصف المنتج (AR)",
      price: "السعر (دينار)",
      imgBtn: "رفع صورة",
      save: "حفظ في المتجر",
      delete: "حذف فوراً",
      empty: "المتجر فارغ حالياً.",
      orderId: "رقم الطلب",
      customer: "الزبون",
      items: "القطع",
      total: "المجموع",
      status: "الحالة",
      actions: "إجراءات",
      statusLabels: {
        pending: "قيد الانتظار",
        processing: "جاري التجهيز",
        shipped: "تم الشحن",
        delivered: "تم التسليم"
      }
    }
  }[lang];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      // Downscale to keep payload small (KV value limit + faster site)
      const img = new Image();
      img.onload = () => {
        try {
          const MAX = 1000;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
            else { width = Math.round(width * MAX / height); height = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const out = canvas.toDataURL('image/jpeg', 0.82);
          setFormData(prev => ({ ...prev, imageUrl: out }));
        } catch {
          setFormData(prev => ({ ...prev, imageUrl: src }));
        }
        setIsUploading(false);
      };
      img.onerror = () => { setFormData(prev => ({ ...prev, imageUrl: src })); setIsUploading(false); };
      img.src = src;
    };
    reader.onerror = () => setIsUploading(false);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Accept a name in EITHER language; mirror the missing one automatically
    const nameEn = (formData.name || formData.nameAr || '').trim();
    const nameAr = (formData.nameAr || formData.name || '').trim();
    const missing: string[] = [];
    if (!nameEn) missing.push(lang === 'ar' ? "الاسم" : "name");
    if (!formData.price) missing.push(lang === 'ar' ? "السعر" : "price");
    if (!formData.imageUrl) missing.push(lang === 'ar' ? "الصورة" : "image");
    if (isUploading) {
      alert(lang === 'ar' ? "الصورة قيد التحميل، انتظر لحظة..." : "Image is still uploading, please wait...");
      return;
    }
    if (missing.length) {
      alert((lang === 'ar' ? "يرجى تعبئة: " : "Please fill: ") + missing.join(lang === 'ar' ? "، " : ", "));
      return;
    }

    const payload = { ...formData, name: nameEn, nameAr } as MarketProduct;
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...payload } : p));
    } else {
      const newProd: MarketProduct = {
        id: 'p-' + Date.now(),
        ...payload
      } as MarketProduct;
      setProducts(prev => [newProd, ...prev]);
    }
    setEditingId(null);
    setFormData({ name: '', nameAr: '', description: '', descriptionAr: '', price: 0, imageUrl: '', story: '', storyAr: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-5xl font-display text-gray-900">{t.title}</h1>
          <div className="flex gap-8 mt-6">
            <button 
              onClick={() => setActiveTab('products')}
              className={`text-[10px] uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'products' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400'}`}
            >
              {t.tabProducts}
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`relative text-[10px] uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'orders' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400'}`}
            >
              {t.tabOrders}
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-4 bg-red-500 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="grid lg:grid-cols-12 gap-12">
          {/* FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 shadow-xl border border-gray-100 sticky top-28 rounded-lg">
              <h2 className="text-2xl font-display mb-6 border-b pb-2">{editingId ? t.editProduct : t.addProduct}</h2>
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg group"
                >
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2}/></svg>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{isUploading ? "..." : t.imgBtn}</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder={t.name} className="w-full p-3 bg-gray-50 border border-gray-100 text-xs rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="text" placeholder={t.nameAr} className="w-full p-3 bg-gray-50 border border-gray-100 text-xs rounded" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
                </div>

                <div className="relative">
                  <input type="number" placeholder={t.price} className="w-full p-3 bg-gray-50 border border-gray-100 text-xs rounded font-bold" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">JOD</span>
                </div>

                <textarea placeholder={t.desc} className="w-full p-3 bg-gray-50 border border-gray-100 text-xs rounded h-20 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <textarea placeholder={t.descAr} className="w-full p-3 bg-gray-50 border border-gray-100 text-xs rounded h-20 resize-none" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} />

                <button onClick={handleSave} className="w-full py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all rounded shadow-lg">
                  {t.save}
                </button>
                {editingId && (
                    <button onClick={() => {setEditingId(null); setFormData({});}} className="w-full py-2 text-[9px] uppercase font-bold text-gray-400">Cancel</button>
                )}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 border border-gray-100 flex gap-6 group hover:shadow-xl transition-all rounded-lg">
                  <div className="w-32 h-32 bg-gray-50 overflow-hidden shrink-0 rounded">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-grow py-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold uppercase tracking-tight text-gray-900">{lang === 'ar' ? p.nameAr : p.name}</p>
                      <p className="text-amber-700 font-display text-2xl font-bold">{p.price} <span className="text-[10px] uppercase">JOD</span></p>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 mb-4 italic">
                      {lang === 'ar' ? p.descriptionAr : p.description}
                    </p>
                    <div className="flex gap-4 border-t border-gray-50 pt-3">
                      <button onClick={() => { setEditingId(p.id); setFormData(p); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-[10px] uppercase font-bold text-gray-400 hover:text-gray-900 transition-colors">Edit</button>
                      <button onClick={() => onDelete(p.id)} className="text-[10px] uppercase font-bold text-red-400 hover:text-red-700 transition-colors">
                        {t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && <div className="text-center py-20 text-gray-300 font-display text-2xl">{t.empty}</div>}
          </div>
        </div>
      ) : (
        /* ORDERS MANAGEMENT */
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((o) => (
              <div key={o.id} className="bg-white border border-gray-100 p-8 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">{t.orderId}: {o.id}</span>
                    <h3 className="text-xl font-display mt-1">{t.customer}: <span className="text-amber-800">{o.userName}</span></h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{o.createdAt.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right rtl:text-left">
                      <span className="block text-[9px] uppercase font-bold text-gray-400">{t.total}</span>
                      <span className="text-2xl font-display font-bold text-gray-900">{o.totalPrice} JOD</span>
                    </div>
                    <select 
                      value={o.status}
                      onChange={(e) => onUpdateOrder(o.id, e.target.value as Order['status'])}
                      className="bg-gray-50 border-none p-3 text-[10px] uppercase font-bold tracking-widest rounded cursor-pointer focus:ring-1 focus:ring-amber-200"
                    >
                      {Object.entries(t.statusLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {o.items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="group relative">
                      <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <p className="mt-2 text-[9px] font-bold uppercase truncate">{lang === 'ar' ? item.nameAr : item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 text-gray-300 font-display text-2xl italic">No orders yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
