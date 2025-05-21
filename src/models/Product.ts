export type Category = 'Electronics' | 'Computers' | 'Mobile' | 'Accessories';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
