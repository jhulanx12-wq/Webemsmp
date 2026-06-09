import { useState, useEffect } from 'react';
import { Copy, Check, Server, Users, Wifi } from 'lucide-react';
import { ServerStatus } from '../types';

export default function ServerStats() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ServerStatus>({
    online: true,
    playersOnline: 247,
    maxPlayers: 500,
    ip: 'play.empiresmp.shop',
    port: '25589'
  });

  // Simulate players fluctuating slightly to make the site feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const newPlayers = Math.max(120, Math.min(490, prev.playersOnline + change));
        return { ...prev, playersOnline: newPlayers };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${stats.ip}:${stats.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border-2 border-neutral-850 p-6 relative overflow-hidden rounded-none shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Left: Server Connection Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-black">★ Empire Online</span>
          </div>
          <h3 className="font-plus text-lg font-black text-white tracking-tight uppercase italic leading-none">Connect with Nobles!</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">Java & Bedrock multi-platform support. Claim your empire.</p>
        </div>

        {/* Center: Copy IP Address Box */}
        <div className="bg-[#050505] border-2 border-neutral-900 p-3.5 rounded-none flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#111] border border-neutral-800 text-amber-500 rounded-none">
              <Server size={18} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 font-bold">Multiplayer Realm IP</p>
              <p className="text-sm font-mono text-white select-all font-bold tracking-tight">
                {stats.ip}<span className="text-amber-500">:</span><span className="text-amber-500 font-black">{stats.port}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-none transition-all cursor-pointer bg-[#111] hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 border border-neutral-800 hover:border-amber-500 font-mono text-[10px] tracking-wider uppercase font-black active:scale-95 flex items-center gap-1.5"
            title="Copy server IP address"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400 font-black">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Players Online Counter & Stats */}
        <div className="flex justify-between md:justify-around items-center border-t md:border-t-0 md:border-l border-neutral-900 pt-4 md:pt-0 md:pl-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase font-mono font-bold tracking-wider">
              <Users size={15} className="text-amber-500" />
              <span>Conquerors</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl text-white font-black">{stats.playersOnline}</span>
              <span className="text-[10px] text-neutral-500 font-bold">/ {stats.maxPlayers}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase font-mono font-bold tracking-wider">
              <Wifi size={15} className="text-emerald-500" />
              <span>Network</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xs text-semibold text-white font-black">18ms latency</span>
              <span className="text-[9px] text-emerald-400 uppercase font-black">Stable</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress visual representation for server memory or load */}
      <div className="w-full bg-[#050505] h-1 absolute bottom-0 left-0">
        <div 
          className="bg-[#d4af37] h-1 transition-all duration-1000"
          style={{ width: `${(stats.playersOnline / stats.maxPlayers) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
