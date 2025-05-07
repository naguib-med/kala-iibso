// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
  listings?: Listing[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image: string;
  stock: number;
  categoryId?: string | null;
  category?: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  images: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';
  userId: string;
  categoryId?: string | null;
  location?: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category | null;
}
