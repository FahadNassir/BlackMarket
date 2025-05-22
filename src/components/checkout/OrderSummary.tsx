'use client';

import { Product } from '@/models/Product';
import { useState } from 'react';

interface OrderSummaryProps {
  items: { product: Product; quantity: number }[];
  totalPrice: number;
}

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  return (
    <div className="bg-black rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product._id} className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <div className="font-medium">
              ${item.product.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={() => setPaymentMethod('credit-card')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Credit Card</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between mb-4">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      {/* <button
        onClick={onPlaceOrder}

        disabled={isLoading}
        className="w-full bg-white text-black py-3 px-4 rounded-md hover:bg-black hover:text-white hover:border hover:border-white disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </button> */}
    </div>
  );
}
