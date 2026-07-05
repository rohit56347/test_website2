import React from 'react';
import { Sparkles, Calendar, Receipt, Package, Headphones } from 'lucide-react';

interface ConfirmationProps {
  orderId: string;
  totalAmount: number;
  quantity: number;
  productName: string;
  customerName: string;
  onContinue: () => void;
}

export default function Confirmation({
  orderId,
  totalAmount,
  quantity,
  productName,
  customerName,
  onContinue
}: ConfirmationProps) {
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalAmount);

  // Simple estimate: 3 to 5 business days from current date
  const estDateStart = new Date();
  estDateStart.setDate(estDateStart.getDate() + 3);
  const estDateEnd = new Date();
  estDateEnd.setDate(estDateEnd.getDate() + 5);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div id="confirmation-container" className="min-h-screen bg-[#050505] text-[#E0D8D0] flex items-center justify-center font-sans py-12 px-4 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-xl w-full bg-[#111111] border border-white/5 p-8 sm:p-10 rounded-none shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration icon badge */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-16 h-16 rounded bg-[#D4AF37] flex items-center justify-center shadow-xl shadow-[#D4AF37]/20">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
        </div>

        {/* Success header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-tight">Order Confirmed</h2>
          <p className="text-[#E0D8D0]/60 text-xs uppercase tracking-widest mt-2">
            Thank you, <span className="text-white font-semibold">{customerName}</span>. Your premium acoustic package is now in process.
          </p>
        </div>

        {/* Detailed order summary box */}
        <div className="bg-[#050505] border border-white/10 rounded-none p-5 sm:p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center text-[10px] text-[#E0D8D0]/40 uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-3">
            <span>Order Reference</span>
            <span>Total amount</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#D4AF37]" />
              <span id="order-reference" className="text-sm font-bold font-mono text-white tracking-wide">{orderId}</span>
            </div>
            <span className="text-base font-serif text-[#D4AF37] font-bold">{formattedTotal}</span>
          </div>

          {/* Details lines */}
          <div className="text-xs text-[#E0D8D0]/60 space-y-2 pt-2 uppercase tracking-wider">
            <p className="flex justify-between">
              <span>Product:</span>
              <span className="text-white font-medium">{productName} (x{quantity})</span>
            </p>
            <p className="flex justify-between">
              <span>Method:</span>
              <span className="text-[#D4AF37] font-semibold">Cash on Delivery</span>
            </p>
          </div>
        </div>

        {/* Shipping steps & information info */}
        <div className="space-y-5 mb-8">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E0D8D0]/80">Estimated Delivery</h4>
              <p className="text-xs text-[#E0D8D0]/60 mt-1">
                Acoustic parcel arriving between <span className="text-white font-semibold">{formatDate(estDateStart)}</span> and <span className="text-white font-semibold">{formatDate(estDateEnd)}</span>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E0D8D0]/80">Doorstep Verification</h4>
              <p className="text-xs text-[#E0D8D0]/60 mt-1 leading-relaxed">
                Pay in cash exactly <span className="text-white font-semibold">{formattedTotal}</span> upon arrival. Handled with absolute care.
              </p>
            </div>
          </div>
        </div>

        {/* Back to shopping CTA */}
        <button
          onClick={onContinue}
          className="w-full bg-[#D4AF37] text-black font-bold py-4 px-6 uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-300 text-center flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
        >
          <Headphones className="w-4 h-4 stroke-[2.5]" />
          Continue to Store
        </button>
      </div>
    </div>
  );
}

