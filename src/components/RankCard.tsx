import React, { useState } from 'react';
import { Sparkles, ShoppingCart, ShieldCheck, Flame, Zap, Compass, Gem, Pickaxe } from 'lucide-react';
import { Rank } from '../types';

interface RankCardProps {
  key?: any;
  rank: Rank;
  onAddToCart: (rank: Rank) => void;
  onQuickCheckout: (rank: Rank) => void;
}

export default function RankCard({ rank, onAddToCart, onQuickCheckout }: RankCardProps) {
  const [mineState, setMineState] = useState<{
    blocks: { id: number; broken: boolean; reward: string }[];
    minedCount: number;
    showClaimMsg: boolean;
  }>({
    blocks: Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      broken: false,
      reward: i === 4 ? '💎 DIAMOND' : i % 2 === 0 ? '✨ COAL' : '🪨 STONE'
    })),
    minedCount: 0,
    showClaimMsg: false
  });

  const [activeTab, setActiveTab] = useState<'perks' | 'trial'>('perks');

  // Interactive 3x3 block breaker for GOD rank
  const handleMineBlock = () => {
    // Mine ALL 9 blocks simultaneously!
    setMineState(prev => {
      const allBroken = prev.blocks.map(b => ({ ...b, broken: true }));
      return {
        blocks: allBroken,
        minedCount: prev.minedCount + 1,
        showClaimMsg: true
      };
    });

    // Reset simulator after 4 seconds
    setTimeout(() => {
      setMineState({
        blocks: Array.from({ length: 9 }).map((_, i) => ({
          id: i,
          broken: false,
          reward: i === 4 ? '💎 DIAMOND' : i % 2 === 0 ? '✨ COAL' : '🪨 STONE'
        })),
        minedCount: 0,
        showClaimMsg: false
      });
    }, 4500);
  };

  const getRankIcon = (id: string) => {
    switch (id) {
      case 'god':
        return <Flame className="w-6 h-6 text-amber-400 fill-amber-500 animate-pulse" />;
      case 'vip':
        return <Zap className="w-6 h-6 text-purple-400 fill-purple-500" />;
      case 'grinder':
        return <Gem className="w-6 h-6 text-cyan-400 fill-cyan-500" />;
      case 'explorer':
        return <Compass className="w-6 h-6 text-emerald-400 fill-emerald-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div 
      className={`relative rounded-none bg-[#0a0a0a] border-2 overflow-hidden transition-all duration-300 hover:-translate-y-2.5 ${
        rank.borderColor
      } ${rank.glowColor} group flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.85)]`}
    >
      {/* Decorative colored glow bar at top */}
      <div className={`h-2 w-full bg-gradient-to-r ${rank.color}`}></div>

      {rank.id === 'god' && (
        <div className="absolute top-4 right-4 bg-amber-500 text-[9px] font-mono tracking-widest text-neutral-950 px-2.5 py-1 font-extrabold shadow-lg animate-bounce select-none">
          ★ ULTIMATE CROWN
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        {/* Header containing name and pricing */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#111] border border-neutral-800 shadow-inner">
              {getRankIcon(rank.id)}
            </div>
            <h3 className="font-plus text-lg tracking-normal font-black text-white group-hover:text-amber-500 transition-colors uppercase italic animate-fade-in">
              {rank.name}
            </h3>
          </div>
          <p className="text-neutral-400 text-xs min-h-[34px] line-clamp-2 leading-relaxed">
            {rank.tagline}
          </p>
        </div>

        {/* Price Tag */}
        <div className="bg-[#111] border-2 border-neutral-900 p-4 rounded-none mb-5 text-center relative overflow-hidden group-hover:border-amber-500/20 transition-all">
          <div className="text-[9px] uppercase font-mono tracking-widest text-[#d4af37] font-black">ONE-TIME ENDOWMENT</div>
          <div className="flex items-baseline justify-center gap-1.5 mt-1">
            <span className="text-3xl font-black text-white tracking-tighter">₹{rank.price}</span>
            <span className="text-neutral-500 text-[10px] font-mono tracking-widest font-black">INR</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-1 font-mono">
            ~ ${(rank.price / 83).toFixed(2)} USD
          </div>
        </div>

        {/* Interactive GOD rank Minecraft block trial tab */}
        {rank.id === 'god' && (
          <div className="flex bg-[#111] p-1 rounded-none border border-neutral-900 gap-1 mb-5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('perks')}
              className={`flex-1 py-1.5 rounded-none cursor-pointer transition-all text-center font-plus text-[10px] tracking-wider uppercase font-black ${
                activeTab === 'perks' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-neutral-400 hover:text-white'
              }`}
            >
              👑 Rank Perks
            </button>
            <button
              onClick={() => setActiveTab('trial')}
              className={`flex-1 py-1.5 rounded-none cursor-pointer transition-all text-center flex items-center justify-center gap-1 font-plus text-[10px] tracking-wider uppercase font-black ${
                activeTab === 'trial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Pickaxe size={11} className="text-amber-500" />
              <span>3x3 simulator</span>
            </button>
          </div>
        )}

        {/* Tab Content Display */}
        {rank.id === 'god' && activeTab === 'trial' ? (
          <div className="flex-grow space-y-4 flex flex-col justify-center">
            <div className="text-center space-y-1">
              <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block font-bold">★ INSTANT EXCAVATION DEMO</span>
              <p className="text-[11px] text-neutral-400">Mine 9 blocks with a single stroke</p>
            </div>

            {/* Simulated 3x3 grid */}
            <div className="grid grid-cols-3 gap-1.5 w-44 mx-auto bg-[#111] p-3 border-2 border-neutral-900">
              {mineState.blocks.map((block) => (
                <div
                  key={block.id}
                  className={`aspect-square rounded-none border flex items-center justify-center text-xs select-none transition-all duration-300 ${
                    block.broken 
                      ? 'bg-neutral-900 border-neutral-800 text-sky-400 scale-95 duration-100 rotate-6 shadow-inner' 
                      : 'bg-stone-700 border-stone-600 hover:bg-stone-650 cursor-pointer text-stone-300'
                  }`}
                  onClick={handleMineBlock}
                >
                  {block.broken ? (
                    block.reward.split(' ')[0]
                  ) : (
                    '🪨'
                  )}
                </div>
              ))}
            </div>

            <div className="text-center min-h-[38px] flex items-center justify-center">
              {mineState.showClaimMsg ? (
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest animate-pulse font-black">
                  💥 9x Blocks Broken! Diamonds Sighted!
                </span>
              ) : (
                <button
                  onClick={handleMineBlock}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black tracking-widest text-[10px] font-plus flex items-center gap-1.5 mx-auto active:scale-95 cursor-pointer uppercase shadow-lg border-b-2 border-amber-600"
                >
                  <Pickaxe size={12} />
                  <span>SWING PICKAXE</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-grow space-y-5">
            {/* Perks Section list */}
            <div>
              <p className="text-[9px] font-plus text-amber-500/80 mb-2.5 uppercase tracking-widest font-black">★ CHRONICLED BENEFITS</p>
              <ul className="space-y-2">
                {rank.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-neutral-300 text-xs leading-relaxed">
                    <ShieldCheck size={14} className="mt-0.5 text-amber-500 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
                {rank.ability && (
                  <li className="flex items-start gap-2 bg-amber-500/5 text-amber-300 p-2.5 rounded-none border border-amber-500/20 text-xs">
                    <Flame size={14} className="mt-0.5 text-amber-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <strong className="block text-amber-200 text-[10px] uppercase tracking-wider font-mono">Special Overlord Ability:</strong>
                      {rank.ability}
                    </div>
                  </li>
                )}
              </ul>
            </div>


          </div>
        )}

        {/* Bottom CTA Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onAddToCart(rank)}
            className="px-3 py-2.5 rounded-none border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-white font-bold font-plus tracking-wider text-[10px] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all text-center uppercase"
          >
            <ShoppingCart size={13} className="text-neutral-400" />
            <span>Add Cart</span>
          </button>
          
          <button
            onClick={() => onQuickCheckout(rank)}
            className={`px-3 py-2.5 rounded-none font-plus text-[10px] tracking-widest uppercase font-black cursor-pointer active:scale-95 transition-all outline-none border-2 text-center shadow-lg ${
              rank.id === 'god' 
                ? 'bg-amber-500 hover:bg-amber-400 border-amber-500 text-neutral-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : rank.id === 'vip'
                ? 'bg-purple-600 hover:bg-purple-500 border-purple-600 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : rank.id === 'grinder'
                ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-600 text-neutral-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-neutral-950 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
