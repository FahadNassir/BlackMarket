'use client';

import ProductCard from './ProductCard';
import { Product } from '@/models/Product';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import '@/styles/dropdowns.css';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function ProductList({ products, isLoading = false }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories).filter(Boolean);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesPrice = 
        (!minPrice || product.price >= parseFloat(minPrice)) &&
        (!maxPrice || product.price <= parseFloat(maxPrice));
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, debouncedSearchTerm, categoryFilter, minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    if (!sortOption) return filteredProducts;
    
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'price-low-to-high':
          return a.price - b.price;
        case 'price-high-to-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const handlePriceChange = (value: string, isMin: boolean) => {
    const numValue = value.replace(/[^0-9.]/g, '');
    if (isMin) {
      setMinPrice(numValue);
    } else {
      setMaxPrice(numValue);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-black/5 rounded-xl animate-pulse">
              <div className="aspect-square bg-gray-800/20 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-800/20 rounded w-3/4" />
                <div className="h-4 bg-gray-800/20 rounded w-1/4" />
                <div className="h-10 bg-gray-800/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/5 border border-white/10 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/10 text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
              aria-label="Search products"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-dropdown"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select-dropdown"
            aria-label="Sort products"
          >
            <option value="">Sort by</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => handlePriceChange(e.target.value, true)}
                className="w-full px-4 py-3 rounded-lg bg-black/10 text-white placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                aria-label="Minimum price"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => handlePriceChange(e.target.value, false)}
                className="w-full px-4 py-3 rounded-lg bg-black/10 text-white placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                aria-label="Maximum price"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-black/10 text-white border border-white/20 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/20 
                  focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-black/10 text-white border border-white/20 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/20 
                  focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

