'use client';

import Link from 'next/link';
import { CartSummary } from './CartSummary';

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center border border-white rounded-lg overflow-hidden">
                <span className="bg-white text-black px-3 py-1 font-semibold">Black</span>
                <span className="bg-black text-white px-3 py-1 font-semibold">Market</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </nav>
  );
} 