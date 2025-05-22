'use client';

import { Product } from '@/models/Product';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      setTimeout(() => {
        toast.success('Added to cart successfully');
      }, 0);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof Error && error.message !== 'Item already in cart') {
        setTimeout(() => {
          toast.error('Failed to add item to cart. Please try again.');
        }, 0);
      }
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, addToCart]);

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </Link>
          <div className="bg-black bg-opacity-5 rounded-xl p-6 border border-white/10 shadow-lg shadow-white/5">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0] || '/products/default-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
                <p className="text-gray-300 mb-6">{product.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Category:</span>
                    <span className="text-gray-300">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">Stock:</span>
                    <span className="text-gray-300">{product.stock} available</span>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || isAddingToCart}
                    className={`w-full bg-white text-black px-6 py-3 rounded-full transition-colors
                      ${product.stock <= 0 || isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black`}
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 