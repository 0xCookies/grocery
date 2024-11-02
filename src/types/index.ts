export interface Product {
  id: number;
  name: string;
  category: string;
  dateAdded: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
} 