import ProductList from '@/components/ProductList';
import { getProducts } from '@/lib/db';
import { Product } from '@/models/Product';
import { CartProvider } from '@/context/CartContext';
import { CartSummary } from '@/components/CartSummary';
import Navbar from '@/components/Navbar';

export default async function Home() {
  const products = await getProducts();

  // Convert MongoDB documents to Product type
  const typedProducts = products.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }));

  return (
    <CartProvider>
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <ProductList products={typedProducts as Product[]} />
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
