import Image from 'next/image';
import { Product, Category } from '@/models/Product';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Define allowed product categories
const ALLOWED_CATEGORIES: Category[] = ['Electronics', 'Computers', 'Mobile', 'Accessories'] as const;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Validate product data
  if (!product || !product._id || !product.name || !product.price) {
    console.error('Invalid product data:', { product });
    return (
      <div className="border border-red-500/50 text-red-300 p-4 rounded-xl" role="alert">
        <p className="font-medium">Unable to display product</p>
        <p className="text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  // Validate category
  if (!ALLOWED_CATEGORIES.includes(product.category)) {
    console.warn(`Unknown category: ${product.category}`);
  }

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    setIsLoading(true);
    try {
      await addToCart(product, 1);
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Only show error if it's not a duplicate add
      if (error instanceof Error && error.message !== 'Item already in cart') {
        toast.error('Failed to add item to cart. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!product._id) {
      toast.error('Product information is incomplete');
      return;
    }
    
    // Add error handling for navigation
    try {
      router.push(`/product/${product._id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate to product details');
    }
  };

  const getImageSrc = () => {
    if (!product.images?.length) {
      return '/products/default-product.jpg';
    }
    
    const imagePath = product.images[0];
    if (!imagePath || typeof imagePath !== 'string') {
      return '/products/default-product.jpg';
    }

    // Ensure imagePath is a string before using startsWith
    const imagePathStr = String(imagePath);
    if (!imagePathStr) return '';
    return imagePathStr.startsWith('/') ? imagePathStr : `/products/${imagePathStr}`;
  };

  return (
    <div 
      className="bg-black bg-opacity-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/10 w-full"
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      <div className="relative aspect-square">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-800/20 animate-pulse" />
        )}
        <Image
          src={getImageSrc()}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            console.error(`Failed to load image for ${product.name}`);
          }}
        />
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-300 mb-4 text-lg font-medium">${product.price.toFixed(2)}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isLoading}
            className={`flex-1 bg-white text-black px-3 py-1.5 rounded-full transition-colors duration-200 font-medium border border-white
              ${product.stock <= 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black shadow-sm`}
            aria-label={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200 font-medium border border-white
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black shadow-sm"
            aria-label="View product details"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
