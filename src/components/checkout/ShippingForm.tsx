'use client';

import React from 'react';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ShippingErrors {
  [key: string]: string;
}

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  errors: Partial<ShippingErrors>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<ShippingErrors>>>;
}

export default function ShippingForm({
  shippingInfo,
  setShippingInfo,
  errors,
  setErrors,
}: ShippingFormProps) {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));

    // Basic validation
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? undefined
          : 'Please enter a valid email address';
        break;
      case 'phone':
        newErrors.phone = /^[0-9+\-\s]+$/.test(value)
          ? undefined
          : 'Please enter a valid phone number';
        break;
      case 'postalCode':
        newErrors.postalCode = /^[0-9A-Za-z\s-]+$/.test(value)
          ? undefined
          : 'Please enter a valid postal code';
        break;
    }

    setErrors(newErrors);
  };

  return (
    <div className="bg-black rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-white/80">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={shippingInfo.fullName}
            onChange={handleChange}
            className={`w-full p-2 border border-white/10 rounded ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Full Name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}

          <label htmlFor="email" className="block text-sm font-medium text-white/80">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={shippingInfo.email}
            onChange={handleChange}
            className={`w-full p-2 border border-white/10 rounded ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <label htmlFor="phone" className="block text-sm font-medium text-white/80">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
            className={`w-full p-2 border border-white/10 rounded ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="Phone"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}

          <label htmlFor="address" className="block text-sm font-medium text-white/80">
            Address
          </label>
          <textarea
            name="address"
            id="address"
            value={shippingInfo.address}
            onChange={handleChange}
            className="w-full p-2 border border-white/10 rounded h-24 bg-black text-white"
            placeholder="Address"
            autoComplete="street-address"
          ></textarea>
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white/80">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border border-white/10 ${errors.city ? 'border-red-500' : ''}`}
                required
                autoComplete="address-level2"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-white/80">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border border-white/10 ${
                  errors.postalCode
                    ? 'border-red-500'
                    : ''
                }`}
                placeholder="e.g., 12345 or ABC 123"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-white/80">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={shippingInfo.country}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border border-white/10 ${errors.country ? 'border-red-500' : ''}`}
              required
              autoComplete="country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
