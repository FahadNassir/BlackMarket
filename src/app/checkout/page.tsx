'use client';

import { useState } from 'react';

import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState<Partial<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }>>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    // Validate all fields
    const validationErrors = validateShippingInfo(shippingInfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ...validationErrors
      }));
      return;
    }

    if (totalItems === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to process the order
      // For now, we'll simulate the order placement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear cart
      clearCart();
      
      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Store order in localStorage (temporarily)
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        items,
        total: totalPrice,
        shippingInfo,
        timestamp: new Date().toISOString()
      }));
      
      setOrderSuccess(true);
      toast.success('Order placed successfully! Your order ID is: ' + orderId);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateShippingInfo = (info: typeof shippingInfo): Partial<typeof errors> => {
    const newErrors: Partial<typeof errors> = {
      fullName: !info.fullName ? 'Full name is required' : undefined,
      email: !info.email ? 'Email is required' : 
             !info.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Please enter a valid email address' : undefined,
      phone: !info.phone ? 'Phone number is required' : 
             !info.phone.match(/^[0-9\+\-\s]+$/) ? 'Please enter a valid phone number' : undefined,
      address: !info.address ? 'Address is required' : undefined,
      city: !info.city ? 'City is required' : undefined,
      postalCode: !info.postalCode ? undefined : 
                 !info.postalCode.match(/^[0-9A-Za-z\s-]+$/) ? 'Please enter a valid postal code' : undefined,
      country: !info.country ? 'Country is required' : undefined,
    };
    return newErrors;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-white hover:text-white/80"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold ml-96">Checkout</h1>
        </div>
        {orderSuccess ? (
          <div className="bg-black border border-white/10 text-white px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Order Placed Successfully!</strong>
            <span className="block sm:inline"> Your order has been successfully placed. You will receive an email confirmation shortly.</span>
            <button
              onClick={() => {
                setOrderSuccess(false);
                setShippingInfo({
                  fullName: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  country: '',
                });
                setErrors({
                  fullName: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  country: '',
                });
              }}
              className="ml-4 text-sm text-white hover:text-white/80"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-6">Checkout</h1>
              <ShippingForm 
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                errors={errors}
                setErrors={setErrors}
              />
            </div>

            <div>
              <div className="bg-black border border-white/10 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span>$10.00</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${totalPrice + 10}</span>
                    </div>
                  </div>
                </div>
                <OrderSummary 
                  items={items}
                  totalPrice={totalPrice}
                />
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3 px-4 rounded-md hover:bg-black hover:text-white hover:border hover:border-white disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
