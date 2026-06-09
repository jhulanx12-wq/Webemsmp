import React, { useState, useEffect } from 'react';
import { X, Check, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { Rank } from '../types';
import PhonePeCard from './PhonePeCard';

interface CheckoutModalProps {
  rank: Rank | null;
  onClose: () => void;
  onSubmitTicketFromCheckout: (mcName: string, discordTag: string, rankId: string) => void;
}

export default function CheckoutModal({ rank, onClose, onSubmitTicketFromCheckout }: CheckoutModalProps) {
  const [mcName, setMcName] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'paypal' | 'card'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://mc-heads.net/avatar/steve');

  // Dynamically update standard Minecraft avatar when username changes
  useEffect(() => {
    const trimmed = mcName.trim();
    if (trimmed.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        setAvatarUrl(`https://mc-heads.net/avatar/${trimmed}`);
      }, 605);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setAvatarUrl('https://mc-heads.net/avatar/steve');
    }
  }, [mcName]);

  if (!rank) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcName.trim() || !discordTag.trim()) return;

    // Trigger ticket creation back in mother state
    onSubmitTicketFromCheckout(mcName, discordTag, rank.id);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border-2 border-[#d4af37] rounded-none shadow-[2px_12px_45px_rgba(0,0,0,0.9)] overflow-hidden text-white">
        
        {/* Colorful status bar */}
        <div className="h-1.5 w-full bg-[#d4af37]"></div>

        {/* Modal Header */}
        <div className="p-5 border-b-2 border-neutral-900 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-amber-500 w-5 h-5 animate-pulse" />
            <h3 className="font-plus text-xs tracking-widest text-[#d4af37] uppercase font-black font-bold">Checkout rank order</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-none bg-[#0a0a0a] text-neutral-400 hover:text-white cursor-pointer active:scale-90 transition-all border border-neutral-850"
          >
            <X size={15} />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-5 bg-[#050505]">
            <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-none flex items-center justify-center mx-auto text-emerald-500 animate-pulse">
              <Check size={32} />
            </div>

            <div className="space-y-2">
              <h4 className="font-plus text-sm text-emerald-400 uppercase tracking-widest font-black italic">Order Ticket Generated!</h4>
              <p className="text-sm text-neutral-300 font-bold">Username: <span className="text-lime-400 font-mono font-black">{mcName}</span></p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                We've automatically initialized a specialized checkout conversation support ticket for you. You can talk directly to Empire SMP staff on our Tickets Page!
              </p>
            </div>

            <div className="bg-[#111] border-2 border-neutral-900 p-4 rounded-none flex items-center justify-between gap-3 text-left">
              <div>
                <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest font-bold">Next steps</p>
                <p className="text-xs text-neutral-300 font-bold font-plus uppercase">Proceed to instant tickets payment.</p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#050505] font-black text-[10px] rounded-none flex items-center gap-1 cursor-pointer transition-all active:scale-95 uppercase tracking-widest shadow-lg border-b-2 border-amber-600 font-plus"
              >
                <span>Active Tickets</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Item Summary Card */}
            <div className="p-4 bg-[#111] border-2 border-neutral-900 rounded-none flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Selected Rank Package</span>
                <h4 className="font-plus text-[13px] text-white font-black uppercase mt-0.5">{rank.emoji} {rank.name} Package</h4>
                <p className="text-xs text-neutral-400 mt-1">{rank.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0 bg-[#050505] p-2 border border-neutral-850">
                <span className="text-xl font-black font-mono text-white block">₹{rank.price}</span>
                <span className="text-[9px] text-neutral-500 uppercase font-mono font-bold">One-Time</span>
              </div>
            </div>

            {/* Minecraft Username + Skin API preview */}
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="col-span-1 flex flex-col items-center justify-center p-2 bg-[#050505] rounded-none border-2 border-neutral-900 self-stretch justify-center h-24">
                <img
                  src={avatarUrl}
                  alt="Minecraft avatar"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-none object-contain shadow-lg border-2 border-neutral-850 bg-[#111]"
                  onError={() => setAvatarUrl('https://mc-heads.net/avatar/steve')}
                />
                <span className="text-[9px] font-mono text-neutral-500 uppercase mt-1.5 truncate max-w-full font-bold">
                  {mcName.trim() ? mcName : 'Guest'}
                </span>
              </div>

              <div className="col-span-3 space-y-3">
                <div>
                  <label className="block text-neutral-400 text-[10px] font-mono mb-1.5 uppercase tracking-widest font-bold">Minecraft Username</label>
                  <input
                    type="text"
                    required
                    placeholder="DreamMiner"
                    value={mcName}
                    onChange={(e) => setMcName(e.target.value)}
                    className="w-full bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-xs text-lime-400 font-mono font-semibold focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Username is verified to allocate rewards automatically.</p>
                </div>
              </div>
            </div>

            {/* Discord Tag Details */}
            <div>
              <label className="block text-neutral-400 text-[10px] font-mono mb-1.5 uppercase tracking-widest font-bold">Discord tag / Username</label>
              <input
                type="text"
                required
                placeholder="mineking#1337"
                value={discordTag}
                onChange={(e) => setDiscordTag(e.target.value)}
                className="w-full bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Payment Options Selection */}
            <div>
              <label className="block text-neutral-400 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">Payment Method</label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-3 rounded-none text-[10px] uppercase tracking-wider font-mono font-bold border-2 transition-all cursor-pointer text-center ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#050505] border-neutral-900 text-neutral-500 hover:text-white'
                  }`}
                >
                  💳 UPI / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-2 px-3 rounded-none text-[10px] uppercase tracking-wider font-mono font-bold border-2 transition-all cursor-pointer text-center ${
                    paymentMethod === 'paypal'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#050505] border-neutral-900 text-neutral-500 hover:text-white'
                  }`}
                >
                  🌍 PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-none text-[10px] uppercase tracking-wider font-mono font-bold border-2 transition-all cursor-pointer text-center ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-[#050505] border-neutral-900 text-neutral-500 hover:text-white'
                  }`}
                >
                  🏦 Card
                </button>
              </div>
            </div>

            {/* Dynamic Details for Selected Payment Option */}
            <div className="p-4 bg-[#111] border-2 border-neutral-900 rounded-none space-y-3">
              {paymentMethod === 'upi' ? (
                <div className="space-y-3">
                  <div className="text-center font-mono text-[10px] uppercase text-emerald-400 tracking-wider font-bold">
                    ★ Instant QR Payment Active ★
                  </div>
                  <PhonePeCard price={rank.price} />
                  <p className="text-[10px] text-neutral-400 leading-normal text-center font-medium">
                    For faster activation, scan this PhonePe QR code and complete the payment. After creating your support ticket, you can share the transaction details there.
                  </p>
                </div>
              ) : paymentMethod === 'paypal' ? (
                <div className="space-y-1 text-center font-mono text-[10px]">
                  <p className="text-amber-400 uppercase tracking-widest font-black">★ PayPal Billing Option ★</p>
                  <p className="text-neutral-450 leading-relaxed pt-1">
                    PayPal billing is fully managed via staff tickets. Since the price is ₹{rank.price} (~${(rank.price / 83).toFixed(2)} USD), please click "Create Ticket" to get your personalized payment invoice sent immediately.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-center font-mono text-[10px]">
                  <p className="text-cyan-400 uppercase tracking-widest font-black">★ International Card Gates ★</p>
                  <p className="text-neutral-450 leading-relaxed pt-1">
                    Debit & Credit cards are authorized via our secure third party gateways. Click "Create Ticket" and a staff administrator will generate your one-time pay link in less than 5 minutes!
                  </p>
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 border-2 border-neutral-900 hover:border-neutral-850 bg-[#050505] rounded-none text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white active:scale-95 transition-all text-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 bg-amber-500 text-neutral-950 font-black font-plus text-[10px] tracking-widest rounded-none border-b-4 border-amber-700 hover:bg-amber-400 active:scale-95 cursor-pointer active:border-b-0 transition-all text-center uppercase shadow-lg"
              >
                🔒 Create Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
