import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, ArrowLeft, Loader2, Landmark, Check } from 'lucide-react';

interface CheckoutProps {
  product: Product;
  quantity: number;
  onBack: () => void;
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => Promise<void>;
}

export default function Checkout({ product, quantity, onBack, onSubmit }: CheckoutProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = product.price * quantity;
  const deliveryFee = 0; // Free delivery as per landing page banner
  const total = subtotal + deliveryFee;

  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(subtotal);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(total);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!address.trim() || address.length < 15) {
      setError('Please enter a complete shipping address (min 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name, email, phone, address });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-container" className="min-h-screen bg-[#050505] text-[#E0D8D0] font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#D4AF37] selection:text-black">
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-10">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E0D8D0]/60 hover:text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-50 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product details
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left pane: Checkout Form */}
        <div className="lg:col-span-7 bg-[#111111] border border-white/5 p-6 sm:p-8 rounded-none shadow-xl">
          <h2 className="text-xl font-serif text-white uppercase tracking-wider mb-6">Shipping Details</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-wider p-4 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full-name" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D8D0]/50 mb-2">
                Complete Shipping Address
              </label>
              <textarea
                id="address"
                rows={4}
                placeholder="Flat/House No., Building, Street Name, City, State, Pincode"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 rounded px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all outline-none resize-none"
                required
              />
            </div>

            {/* Payment Method - Fixed to COD */}
            <div className="bg-white/5 border border-white/5 rounded p-5 flex gap-4 items-start">
              <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  Cash on Delivery Only (COD)
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
                    Selected
                  </span>
                </h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1.5 leading-relaxed">
                  No online payment is required today. Pay with cash safely at your doorstep once your AeroSound headphones arrive.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 px-6 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 text-center flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Your Order...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Place Order ({formattedTotal})
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right pane: Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#111111] border border-white/5 p-6 sm:p-8 rounded-none shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2.5 border-b border-white/5 pb-4">
              <ShoppingBag className="w-4.5 h-4.5 text-[#D4AF37]" />
              Order Summary
            </h3>

            {/* Product item display */}
            <div className="flex gap-4 items-center mb-6">
              <div className="w-16 h-16 rounded bg-[#050505] border border-white/10 p-2 flex items-center justify-center shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="object-contain max-h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">{product.name}</h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1">
                  Quantity: <span className="text-white font-semibold">{quantity}</span>
                </p>
              </div>
              <div className="text-sm font-serif text-white text-right">
                {formattedSubtotal}
              </div>
            </div>

            {/* Price lines */}
            <div className="space-y-3.5 text-xs border-t border-white/5 pt-6">
              <div className="flex justify-between text-[#E0D8D0]/60 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="font-serif text-white">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#E0D8D0]/60 uppercase tracking-widest">
                <span>Delivery</span>
                <span className="text-[#D4AF37] font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-[#E0D8D0]/60 uppercase tracking-widest">
                <span>Payment Fee</span>
                <span className="text-[#D4AF37] font-medium">FREE</span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-white border-t border-white/5 pt-4 mt-2">
                <span>Total Amount</span>
                <span className="text-[#D4AF37]">{formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

