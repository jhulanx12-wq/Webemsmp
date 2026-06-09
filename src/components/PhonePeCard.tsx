import { useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface PhonePeCardProps {
  price?: number;
  upiId?: string;
  merchantName?: string;
}

export default function PhonePeCard({ 
  price = 999, 
  upiId = 'kuntinaik@ybl', 
  merchantName = 'KUNTI NAIK' 
}: PhonePeCardProps) {
  // Construct UPI URI: upi://pay?pa=address&pn=name&am=amount&cu=INR
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${price}&cu=INR&tn=Empire%20SMP%20Rank%20Purchase`;
  
  // Use public QR Code generator API to create a scannable QR code
  const qrCodeImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&bgcolor=ffffff&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    alert(`UPI ID ${upiId} copied to clipboard!`);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white text-black p-5 border border-neutral-200 shadow-2xl relative select-none font-sans flex flex-col items-center">
      
      {/* PhonePe Branding Header */}
      <div className="flex items-center gap-2 mb-4 justify-center">
        {/* PhonePe Circular पे Icon */}
        <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center font-serif text-white font-black text-xl italic shadow-sm shrink-0">
          पे
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-neutral-800 font-sans">
          PhonePe
        </span>
      </div>

      {/* ACCEPTED HERE Banner */}
      <p className="text-base font-extrabold tracking-wider text-[#5f259f] uppercase text-center font-sans mb-1 scale-y-110">
        ACCEPTED HERE
      </p>
      
      {/* Subtext instruction */}
      <p className="text-[11px] font-medium text-neutral-500 tracking-tight text-center mb-5">
        Scan & Pay Using PhonePe App
      </p>

      {/* QR Code Container styled with a realistic borders and middle overlay logo */}
      <div className="relative p-3 bg-white border border-neutral-100 shadow-md mb-4 bg-white">
        <div className="w-48 h-48 relative">
          {/* Main QR Code image */}
          <img 
            src={qrCodeImageSrc} 
            alt="PhonePe UPI QR Code" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />

          {/* Center visual overlay "पे" as shown in the user's uploaded PhonePe QR code */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-serif font-black text-sm italic">
              पे
            </div>
          </div>
        </div>
      </div>

      {/* Merchant / Payee Name at the bottom */}
      <div className="text-center w-full mt-1">
        <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 block uppercase mb-0.5">UPI MERCHANT PAYEE</span>
        <h5 className="text-[15px] font-black tracking-widest text-neutral-800 uppercase font-sans">
          {merchantName}
        </h5>
      </div>

      {/* Interactive Helper buttons helpful for web integration */}
      <div className="w-full mt-4 pt-3 border-t border-neutral-100 flex gap-2">
        <button
          type="button"
          onClick={handleCopyUpi}
          className="flex-grow py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-[10px] tracking-wider uppercase font-mono rounded flex items-center justify-center gap-1.5 transition-colors border border-neutral-200"
        >
          <Copy size={11} />
          <span>Copy ID: {upiId}</span>
        </button>

        <div className="px-3 py-2 bg-[#5f259f]/5 border border-[#5f259f]/10 text-[#5f259f] font-mono text-[10px] font-bold text-center shrink-0 flex items-center">
          Amount: ₹{price}
        </div>
      </div>
    </div>
  );
}
