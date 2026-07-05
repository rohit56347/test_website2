import React, { useState } from 'react';
import { Product } from '../types';
import { ShieldCheck, Truck, RotateCcw, Volume2, Bluetooth, Battery, Headphones } from 'lucide-react';

interface StorefrontProps {
  product: Product;
  onBuyNow: (quantity: number) => void;
}

export default function Storefront({ product, onBuyNow }: StorefrontProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const incrementQty = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQty = () => setQuantity(prev => Math.max(prev - 1, 1));

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const totalFormattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price * quantity);

  return (
    <div id="storefront-container" className="min-h-screen bg-[#050505] text-[#E0D8D0] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Premium Announcement Bar */}
      <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 py-2.5 text-center text-[10px] tracking-[0.25em] text-[#D4AF37] font-medium uppercase">
        Free Express Delivery & Cash on Delivery (COD) Nationwide
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Headphones className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <span className="font-serif font-bold text-lg tracking-wider text-white uppercase">
            AeroSound <span className="text-[#D4AF37] italic font-normal">X1</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] text-[#E0D8D0]/60">
          <span className="text-white border-b border-[#D4AF37] pb-1 cursor-default">Storefront</span>
          <span className="hover:text-white transition-colors cursor-pointer">Specs</span>
          <span className="hover:text-white transition-colors cursor-pointer">Support</span>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
        {/* Subtle backdrop gold glow */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none opacity-40"></div>

        {/* Left: Product Image Showcase */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="relative group overflow-hidden rounded bg-[#111111] border border-white/5 p-8 flex items-center justify-center aspect-square shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_75%)] pointer-events-none" />
            <img
              id="hero-product-image"
              src={product.image_url}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="object-contain max-h-[85%] w-auto transition-transform duration-700 ease-out group-hover:scale-105 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
            {/* Stock indicator badge */}
            <div className="absolute top-6 left-6 bg-[#050505]/90 backdrop-blur border border-white/10 px-4 py-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Stock: {product.stock_quantity} available
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col justify-center relative z-10">
          {/* Tagline */}
          <span className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 block">
            Aerosound / Official Flagship Release
          </span>

          {/* Title */}
          <h1 id="product-title" className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-6 tracking-tight leading-none">
            Aerosound <br /><span className="text-[#D4AF37] italic">X1 Wireless</span>
          </h1>

          {/* Price Tag */}
          <div className="flex items-baseline gap-4 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">Price</div>
              <div className="text-3xl font-serif tracking-tight text-white">{formattedPrice}</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">M.R.P.</div>
              <div className="text-lg font-serif tracking-tight text-slate-500 line-through">₹4,999</div>
            </div>
            <div className="text-xs border border-[#D4AF37]/30 text-[#D4AF37] font-medium px-2.5 py-1 uppercase tracking-wider bg-[#D4AF37]/5 rounded">
              Save 50%
            </div>
          </div>

          {/* Description */}
          <p id="product-description" className="text-[#E0D8D0]/80 text-sm md:text-base font-light leading-relaxed mb-8 max-w-xl">
            {product.description}
          </p>

          {/* Spec Badges Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/5 p-4 rounded flex gap-3 items-start">
              <Battery className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">Playtime</h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1">{product.specs.battery_life}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded flex gap-3 items-start">
              <Volume2 className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">Acoustics</h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1">{product.specs.driver_size}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded flex gap-3 items-start">
              <Bluetooth className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">Connection</h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1">{product.specs.connectivity}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded flex gap-3 items-start">
              <Headphones className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">ANC Hybrid</h4>
                <p className="text-xs text-[#E0D8D0]/60 mt-1">{product.specs.noise_cancelling}</p>
              </div>
            </div>
          </div>

          {/* Purchase Block */}
          <div className="bg-[#111111] border border-white/5 p-6 mb-8 rounded">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase tracking-wider font-medium text-[#E0D8D0]/80">Select Quantity</span>
              <div className="flex items-center border border-white/10 rounded overflow-hidden bg-[#050505]">
                <button
                  onClick={decrementQty}
                  className="w-10 h-10 flex items-center justify-center text-[#E0D8D0]/80 hover:bg-white/5 hover:text-white transition-colors border-r border-white/10 font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-semibold font-mono text-white">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  className="w-10 h-10 flex items-center justify-center text-[#E0D8D0]/80 hover:bg-white/5 hover:text-white transition-colors border-l border-white/10 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6 border-t border-white/5 pt-4">
              <span className="text-xs uppercase tracking-wider text-[#E0D8D0]/60">Order Total</span>
              <span className="text-2xl font-serif text-[#D4AF37] font-bold">{totalFormattedPrice}</span>
            </div>

            <button
              onClick={() => onBuyNow(quantity)}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 px-6 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 text-center flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
            >
              Order Now (Cash on Delivery)
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#E0D8D0]/60 uppercase tracking-widest">
            <div className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Free COD Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded">
              <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-white">AEROSOUND / OFFICIAL</span>
          </div>
          <p className="text-[11px] text-[#E0D8D0]/40 uppercase tracking-widest text-center md:text-right">
            &copy; 2026 AeroSound Systems Inc. All rights reserved. Pay in cash when your order arrives.
          </p>
        </div>
      </footer>
    </div>
  );
}

