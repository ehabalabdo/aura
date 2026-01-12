
export type Language = 'en' | 'ar';

export type Category = 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessory';

export type UserRole = 'admin' | 'user';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface ClosetItem {
  id: string;
  imageUrl: string;
  category: Category;
  color: string;
  style: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: MarketProduct[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface MarketProduct {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  imageUrl: string;
  story: string;
  storyAr: string;
}

export interface AIDesignResult {
  imageUrl: string;
  materials: string[];
  estimatedCost: number;
  description: string;
}

// Added StylingResult interface to fix the module export error
export interface StylingResult {
  picks: {
    itemId: string;
    role: string;
    explanation: string;
  }[];
  overallDescription: string;
}

export enum AppView {
  Home = 'home',
  Wardrobe = 'wardrobe',
  Atelier = 'atelier',
  Boutique = 'boutique',
  Dashboard = 'dashboard',
  AdminPortal = 'admin_portal'
}
