import { useState, useRef } from 'react';
import { Gift, Award, Key, Play, ShieldAlert, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface CrateType {
  id: string;
  name: string;
  keysRequired: number;
  color: string;
  textColor: string;
  gradient: string;
  description: string;
  lootItems: { name: string; rarity: 'Common' | 'Rare' | 'Legendary'; qty: string; emoji: string }[];
}

const CRATES: CrateType[] = [
  {
    id: 'voter',
    name: 'Voter Crate',
    keysRequired: 1,
    color: 'border-emerald-500/30 bg-emerald-500/5',
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Basic survival rewards given to loyal voters including starter materials, raw food, and diamonds.',
    lootItems: [
      { name: 'Enchanted Golden Apple', rarity: 'Rare', qty: '8x', emoji: '🍎' },
      { name: 'Diamond Blocks', rarity: 'Rare', qty: '4x', emoji: '💎' },
      { name: 'Cooked Beef Supplies', rarity: 'Common', qty: '64x', emoji: '🥩' },
      { name: 'Iron Ingots Pack', rarity: 'Common', qty: '32x', emoji: '🪙' },
      { name: 'XP Experience Bottles', rarity: 'Common', qty: '16x', emoji: '🧪' },
      { name: 'Golden Carrots Food', rarity: 'Common', qty: '32x', emoji: '🥕' }
    ]
  },
  {
    id: 'rare',
    name: 'Rare Crate',
    keysRequired: 3,
    color: 'border-purple-500/30 bg-purple-500/5',
    textColor: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
    description: 'Upgraded weapon armor sets and advanced enchants perfect for high stakes survival PvP.',
    lootItems: [
      { name: 'Netherite Pickaxe (Eff V)', rarity: 'Legendary', qty: '1x', emoji: '⛏️' },
      { name: 'Double Enchanted Elytra Wings', rarity: 'Legendary', qty: '1x', emoji: '🕊️' },
      { name: 'Sharpness V Diamond Sword', rarity: 'Rare', qty: '1x', emoji: '⚔️' },
      { name: 'Obsidian Block Wall Kits', rarity: 'Common', qty: '64x', emoji: '⛰️' },
      { name: 'Enchanted G-Apples Pack', rarity: 'Rare', qty: '16x', emoji: '🍎' },
      { name: 'Shulker Box (Dye Purple)', rarity: 'Rare', qty: '1x', emoji: '📦' }
    ]
  },
  {
    id: 'legendary',
    name: 'Legendary Treasure Crate',
    keysRequired: 5,
    color: 'border-amber-500/30 bg-amber-500/5',
    textColor: 'text-amber-400',
    gradient: 'from-amber-600 to-yellow-500',
    description: 'Supreme tier endgame treasures. Rare beacon matrices, netherite equipment, and trial keys represent this vault.',
    lootItems: [
      { name: 'Ancient Netherite Ingot', rarity: 'Legendary', qty: '8x', emoji: '🧱' },
      { name: 'Active Star Beacon Beacon', rarity: 'Legendary', qty: '1x', emoji: '🌟' },
      { name: 'VIP Rank 2-Day Trial Ticket', rarity: 'Legendary', qty: '1x', emoji: '🎫' },
      { name: 'Netherite Helmet (Prot IV)', rarity: 'Rare', qty: '1x', emoji: '🪖' },
      { name: 'Totem of Undying Safety', rarity: 'Rare', qty: '3x', emoji: '🗿' },
      { name: 'Max Protection Chestplate', rarity: 'Rare', qty: '1x', emoji: '🛡️' }
    ]
  }
];

const VOTE_LINKS = [
  { id: 1, name: 'Minecraft-MP Portal', rewards: '✨ 1x Vote Key + ₹1,000 In-game', url: 'https://minecraft-mp.com/' },
  { id: 2, name: 'PlanetMinecraft Net', rewards: '✨ 1x Vote Key + ₹1,000 In-game', url: 'https://planetminecraft.com/' },
  { id: 3, name: 'TopG Server Board', rewards: '✨ 1x Vote Key + ₹1,000 In-game', url: 'https://topg.org/' },
  { id: 4, name: 'MC-Server-List Co', rewards: '✨ 1x Vote Key + ₹1,000 In-game', url: 'https://minecraft-server-list.com/' }
];

export default function VoteChest() {
  const [keysCount, setKeysCount] = useState<number>(3); // start with 3 free keys to play immediately!
  const [selectedCrateId, setSelectedCrateId] = useState<string>('voter');
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasVotedToday, setHasVotedToday] = useState<Record<number, boolean>>({});
  const [spinWinner, setSpinWinner] = useState<{ name: string; rarity: string; qty: string; emoji: string } | null>(null);
  const [spinVisualIndex, setSpinVisualIndex] = useState<number>(0);
  const [votedTimer, setVotedTimer] = useState<number | null>(null);

  const activeCrate = CRATES.find(c => c.id === selectedCrateId) || CRATES[0];

  // Synthesize Web Audio retro sounds for immersion (100% client side with zero external links)
  const playBeep = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 0.08) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime); // keep it low and pleasant
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignored if browser block autoplay
    }
  };

  const playFanfare = () => {
    setTimeout(() => playBeep(261.63, 'square', 0.15), 0); // C4
    setTimeout(() => playBeep(329.63, 'square', 0.15), 120); // E4
    setTimeout(() => playBeep(392.00, 'square', 0.15), 240); // G4
    setTimeout(() => playBeep(523.25, 'triangle', 0.4), 360); // C5
  };

  const simulateVote = (id: number) => {
    if (hasVotedToday[id]) return;
    setVotedTimer(id);
    playBeep(200, 'triangle', 0.2);

    setTimeout(() => {
      setHasVotedToday(prev => ({ ...prev, [id]: true }));
      setKeysCount(prev => prev + 1);
      setVotedTimer(null);
      playBeep(600, 'sine', 0.3);
    }, 1200);
  };

  const handleSpinCrate = () => {
    if (keysCount < activeCrate.keysRequired) {
      return;
    }
    setKeysCount(prev => prev - activeCrate.keysRequired);
    setIsSpinning(true);
    setSpinWinner(null);

    let rollCount = 0;
    const maxRolls = 20;
    const items = activeCrate.lootItems;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setSpinVisualIndex(randomIndex);
      playBeep(300 + randomIndex * 50, 'sine', 0.05);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        const finalPrize = items[Math.floor(Math.random() * items.length)];
        setSpinWinner(finalPrize);
        setIsSpinning(false);
        playFanfare();
      }
    }, 140);
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-none p-5 sm:p-7 relative overflow-hidden shadow-2xl space-y-8">
      <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top statistics tab bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">💎 STRENGTHEN SERVER STATS 💎</span>
          <h4 className="font-pixel text-[13px] text-white uppercase flex items-center gap-2">
            <Gift size={15} className="text-emerald-400" />
            <span>Minecraft Vote Portals & Crate Simulator</span>
          </h4>
        </div>

        {/* Keys Inventory Count Widget */}
        <div className="px-4 py-2.5 bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
          <Key size={14} className="text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Available Keys</span>
            <span className="text-xs font-mono font-black text-white uppercase">🗝️ {keysCount} Voter Keys</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Vote links and claim rewards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#050505] p-4 border border-neutral-900 rounded-none space-y-3">
            <h5 className="font-pixel text-[11px] text-white uppercase">📦 1. Vote Daily for Keys</h5>
            <p className="text-[10px] text-neutral-450 leading-normal">
              Click the official server listing portals below. Complete daily captchas to push Empire SMP higher in search rankings and reward yourself with server keys instantly!
            </p>
          </div>

          <div className="space-y-2.5">
            {VOTE_LINKS.map((link) => {
              const voted = hasVotedToday[link.id];
              const loading = votedTimer === link.id;
              return (
                <div 
                  key={link.id}
                  className="p-3 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-850 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300 font-sans tracking-wide uppercase">{link.name}</p>
                    <span className="text-[9px] font-mono text-emerald-400 block">{link.rewards}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#111] hover:bg-[#1a1a1a] border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                      title="Open external portal link"
                    >
                      <ExternalLink size={10} />
                    </a>

                    <button
                      onClick={() => simulateVote(link.id)}
                      disabled={voted || loading}
                      className={`px-3 py-1.5 text-[9px] font-pixel uppercase tracking-wider rounded-none cursor-pointer transition-all ${
                        voted 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : loading
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse'
                          : 'bg-[#111] border border-neutral-850 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 active:scale-95'
                      }`}
                    >
                      {voted ? '✓ CLAIMED' : loading ? 'CHECKING...' : 'VOTE & RECIVE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Virtual Crate Opener */}
        <div className="lg:col-span-7 space-y-4">
          {/* Crate Selection Boxes */}
          <div className="grid grid-cols-3 gap-2">
            {CRATES.map((crate) => (
              <button
                key={crate.id}
                onClick={() => { setSelectedCrateId(crate.id); setSpinWinner(null); }}
                className={`p-3 border text-center relative flex flex-col justify-between items-center gap-2 transition-all cursor-pointer rounded-none ${
                  selectedCrateId === crate.id
                    ? `border-amber-500 ${crate.color} shadow-[0_0_15px_rgba(212,175,55,0.1)]`
                    : 'bg-[#0a0a0a] border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white'
                }`}
              >
                <div className="text-xl">🧰</div>
                <div>
                  <p className={`text-[10px] uppercase font-pixel ${selectedCrateId === crate.id ? crate.textColor : 'text-slate-300'}`}>{crate.name}</p>
                  <p className="text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{crate.keysRequired} Keys Needed</p>
                </div>
              </button>
            ))}
          </div>

          {/* Core Simulator Stage */}
          <div className="bg-[#050505] border border-neutral-900 p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            {/* Background pattern */}
            <div className="absolute inset-0 mc-pattern-stone opacity-[0.015] pointer-events-none"></div>

            {/* Spinner Window (Only in spin phase) */}
            {isSpinning ? (
              <div className="space-y-6 text-center w-full max-w-sm">
                <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-black animate-pulse">ROLLING CRATE REWARDS...</p>
                
                {/* Rolling item card */}
                <div className="bg-[#0a0a0a] border-2 border-amber-500/40 p-6 rounded-none relative flex flex-col items-center justify-center gap-3 max-w-[200px] mx-auto animate-bounce shadow-xl">
                  {/* Glowing aura */}
                  <div className="absolute inset-0 bg-amber-500/5 blur-xl pointer-events-none"></div>
                  
                  <span className="text-4xl relative z-10">{activeCrate.lootItems[spinVisualIndex].emoji}</span>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">{activeCrate.lootItems[spinVisualIndex].qty}</span>
                    <h5 className="font-plus text-xs uppercase font-black text-white mt-1">{activeCrate.lootItems[spinVisualIndex].name}</h5>
                  </div>
                </div>

                <div className="w-40 h-1 bg-slate-900 mx-auto overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-amber-500 w-1/2 animate-[spin-progress_1.5s_infinite_linear]"></div>
                </div>
              </div>
            ) : spinWinner ? (
              /* Success winning state */
              <div className="space-y-4 text-center max-w-sm w-full animate-[fade-in-up_0.4s_ease-out] p-4 bg-amber-500/5 border border-amber-500/20 relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <Sparkles size={12} className="text-amber-400 animate-spin" />
                </div>
                
                <span className="text-5xl block animate-bounce">{spinWinner.emoji}</span>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-black block">★ CRATE VIRTUAL WIN ★</span>
                  <h4 className="font-plus text-sm uppercase font-black text-white">{spinWinner.qty} {spinWinner.name}</h4>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">Rarity: <span className={spinWinner.rarity === 'Legendary' ? 'text-amber-400 font-bold' : spinWinner.rarity === 'Rare' ? 'text-purple-400' : 'text-slate-400'}>{spinWinner.rarity}</span></p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-neutral-900 font-mono text-[9px] text-neutral-400 leading-normal">
                  Claiming voucher linked successfully to your next web ticket. Report this reward token inside checkout panel support.
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSpinWinner(null)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-neutral-800 text-[10px] font-pixel text-slate-400 uppercase rounded-none transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                  {keysCount >= activeCrate.keysRequired && (
                    <button
                      onClick={handleSpinCrate}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[10px] font-pixel uppercase rounded-none transition-colors font-bold cursor-pointer"
                    >
                      Spin Again
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Static crate idle state */
              <div className="text-center space-y-4 max-w-sm">
                <span className="text-6xl block transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] select-none">🧰</span>
                <div className="space-y-1.5">
                  <h4 className="font-plus text-xs uppercase font-black text-white tracking-widest">{activeCrate.name} Virtual Vault</h4>
                  <p className="text-[10px] text-neutral-500 leading-normal max-w-xs mx-auto">
                    {activeCrate.description}
                  </p>
                </div>

                {keysCount >= activeCrate.keysRequired ? (
                  <button
                    onClick={handleSpinCrate}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black font-pixel text-[10px] uppercase tracking-wider transition-all border-b-4 border-amber-800 rounded-none cursor-pointer flex items-center justify-center gap-2 mx-auto"
                  >
                    <Play size={11} fill="currentColor" />
                    <span>SPIN FOR REWARDS</span>
                  </button>
                ) : (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-none max-w-xs mx-auto flex items-center gap-2 justify-center text-rose-400 font-mono text-[9px] uppercase font-bold">
                    <ShieldAlert size={12} className="text-rose-500" />
                    <span>Insufficient keys! Daily voting gives free keys!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loot items preview card list */}
          <div className="p-4 bg-[#0a0a0a] border border-neutral-900 rounded-none">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block mb-3">★ REWARD CHANCE LISTING ★</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activeCrate.lootItems.map((item, idx) => (
                <div key={idx} className="p-2 bg-[#050505] border border-neutral-900 flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <h6 className="text-[9.5px] font-bold text-slate-350 uppercase truncate font-sans">{item.name}</h6>
                    <span className="text-[8px] font-mono text-slate-500 block">{item.qty} &bull; <span className={
                      item.rarity === 'Legendary' ? 'text-amber-500 font-black' :
                      item.rarity === 'Rare' ? 'text-purple-400 font-bold' : 'text-slate-500'
                    }>{item.rarity}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
