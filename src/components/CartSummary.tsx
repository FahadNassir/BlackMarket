'use client';

import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/models/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

// Map product names to their image filenames
const productImageMap: { [key: string]: string } = {
  'Wireless Bluetooth Headphones': '/products/Wireless Bluetooth Headphones.jpg',
  'Gaming Laptop': '/products/laptop.jpg',
  'Wireless Mouse': '/products/mouse.jpg',
  'Gaming Keyboard': '/products/keyboard.jpg',
  'Smartphone': '/products/smartphone.jpg',
  'Smartwatch': '/products/smartwatch.jpg',
};

export function CartSummary() {
  const { totalItems, totalPrice, items, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  const getImageSrc = (product: Product) => {
    // Try to get the image from the product's images array first
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // If no images in the array, try to get from the mapping
    const mappedImage = productImageMap[product.name];
    if (mappedImage) {
      return mappedImage;
    }
    
    // If no mapping found, use default image
    return '/products/default-product.jpg';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-lg"
        aria-label="Shopping cart"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="font-medium">{totalItems}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black border border-white/20 rounded-xl shadow-lg shadow-white/10 z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Shopping Cart</h3>
            
            {items.length === 0 ? (
              <p className="text-white text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.product._id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={getImageSrc(item.product)}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{item.product.name}</h4>
                        <p className="text-white">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => item.product._id && updateQuantity(item.product._id, Math.max(0, item.quantity - 1))}
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button
                            onClick={() => item.product._id && updateQuantity(item.product._id, item.quantity + 1)}
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => item.product._id && removeFromCart(item.product._id)}
                        className="text-white hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 mt-4 pt-4">
                  <div className="flex justify-between text-white mb-4">
                    <span>Total:</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-white text-black py-2 rounded-lg font-medium
                      hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2
                      focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
