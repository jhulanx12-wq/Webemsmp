import { useState } from 'react';
import { Trophy, Swords, Coins, Clock, ShieldAlert, Sparkles, Search } from 'lucide-react';

interface PlayerStat {
  rank: number;
  username: string;
  uuidName: string; // for mc-heads.net
  statValue: string;
  subStat: string;
  tags: string[];
}

const LEADERBOARD_DATA: Record<string, PlayerStat[]> = {
  slayers: [
    { rank: 1, username: 'くコ:彡ADI😈DON', uuidName: 'Adi', statValue: '4,892 Kills', subStat: 'Level 142 • K/D 4.2', tags: ['PVP God', 'Staff Admin'] },
    { rank: 2, username: 'SHADOWXER01', uuidName: 'Shadowxer01', statValue: '3,120 Kills', subStat: 'Level 98 • K/D 2.8', tags: ['Owner', 'Dragon Slayer'] },
    { rank: 3, username: 'Randeep Royal', uuidName: 'Royal', statValue: '2,904 Kills', subStat: 'Level 105 • K/D 3.1', tags: ['Admin', 'Wither Hunter'] },
    { rank: 4, username: 'Anya_Playz', uuidName: 'Anya', statValue: '1,844 Kills', subStat: 'Level 84 • K/D 1.9', tags: ['Veteran', 'Bounty Hunter'] },
    { rank: 5, username: 'JHULAN', uuidName: 'Jhulan', statValue: '1,502 Kills', subStat: 'Level 110 • K/D 1.5', tags: ['Dev', 'Code Warrior'] },
    { rank: 6, username: 'ViperMC', uuidName: 'Viper', statValue: '1,230 Kills', subStat: 'Level 62 • K/D 2.1', tags: ['Elite Grind'] }
  ],
  coins: [
    { rank: 1, username: 'SHADOWXER01', uuidName: 'Shadowxer01', statValue: '₹95,200', subStat: '9.5M Net Worth', tags: ['Owner', 'Server Merchant'] },
    { rank: 2, username: 'Anya_Playz', uuidName: 'Anya', statValue: '₹42,800', subStat: '4.2M Net Worth', tags: ['Veteran', 'Empire Tycoon'] },
    { rank: 3, username: 'くコ:彡ADI😈DON', uuidName: 'Adi', statValue: '₹38,150', subStat: '3.8M Net Worth', tags: ['Admin', 'Rich Tier'] },
    { rank: 4, username: 'ViperMC', uuidName: 'Viper', statValue: '₹22,400', subStat: '2.2M Net Worth', tags: ['Elite Grind', 'Trade Elder'] },
    { rank: 5, username: 'GamerSam', uuidName: 'Sam', statValue: '₹18,900', subStat: '1.8M Net Worth', tags: ['Explorer', 'Gold Miner'] },
    { rank: 6, username: 'JHULAN', uuidName: 'Jhulan', statValue: '₹14,500', subStat: '1.4M Net Worth', tags: ['Dev', 'Salary Tier'] }
  ],
  playtime: [
    { rank: 1, username: 'Anya_Playz', uuidName: 'Anya', statValue: '938 Hours', subStat: 'Joined Aug 2025', tags: ['Veteran', 'Always Live'] },
    { rank: 2, username: 'くコ:彡ADI😈DON', uuidName: 'Adi', statValue: '840 Hours', subStat: 'Joined Sep 2025', tags: ['Admin', 'Lobby Guard'] },
    { rank: 3, username: 'SHADOWXER01', uuidName: 'Shadowxer01', statValue: '730 Hours', subStat: 'Joined Jul 2025', tags: ['Owner', 'Overseer'] },
    { rank: 4, username: 'JHULAN', uuidName: 'Jhulan', statValue: '542 Hours', subStat: 'Joined Dec 2025', tags: ['Dev', 'Bug Squasher'] },
    { rank: 5, username: 'Randeep Royal', uuidName: 'Royal', statValue: '498 Hours', subStat: 'Joined Nov 2025', tags: ['Admin', 'Town Mayor'] },
    { rank: 6, username: 'RedStonePro', uuidName: 'Mumbo', statValue: '412 Hours', subStat: 'Joined Jan 2026', tags: ['Gold Miner', 'Machinist'] }
  ],
  power: [
    { rank: 1, username: 'くコ:彡ADI😈DON', uuidName: 'Adi', statValue: '2,900 Power', subStat: 'Maxed Skills (15/15)', tags: ['Admin', 'PVP God'] },
    { rank: 2, username: 'SHADOWXER01', uuidName: 'Shadowxer01', statValue: '2,840 Power', subStat: 'Maxed Skills (14/15)', tags: ['Owner', 'Empire Tycoon'] },
    { rank: 3, username: 'JHULAN', uuidName: 'Jhulan', statValue: '2,620 Power', subStat: 'Maxed Skills (12/15)', tags: ['Dev', 'Mechanic'] },
    { rank: 4, username: 'Anya_Playz', uuidName: 'Anya', statValue: '2,440 Power', subStat: 'Maxed Skills (11/15)', tags: ['Veteran', 'Always Live'] },
    { rank: 5, username: 'Randeep Royal', uuidName: 'Royal', statValue: '2,310 Power', subStat: 'Maxed Skills (10/15)', tags: ['Admin', 'Town Mayor'] },
    { rank: 6, username: 'SteveGrinder', uuidName: 'Steve', statValue: '1,980 Power', subStat: 'Maxed Skills (8/15)', tags: ['Grinder', 'Iron Base'] }
  ]
};

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<'slayers' | 'coins' | 'playtime' | 'power'>('slayers');
  const [searchQuery, setSearchQuery] = useState('');

  const currentData = LEADERBOARD_DATA[activeCategory];
  
  const filteredData = currentData.filter(player => 
    player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-none p-5 sm:p-7 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-slate-900">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block font-bold">★ REALTIME IN-GAME LEAGUE ★</span>
          <h4 className="font-pixel text-[13px] text-white uppercase flex items-center gap-2">
            <Trophy size={15} className="text-amber-500" />
            <span>Empire SMP Hall Of Fame</span>
          </h4>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-64">
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search Player or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:outline-none focus:border-amber-500 text-xs text-white uppercase tracking-wider font-mono placeholder:text-slate-600 rounded-none transition-all"
          />
        </div>
      </div>

      {/* Categories Horizontal Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {[
          { id: 'slayers', label: '⚔️ BEST SLAYERS', icon: Swords, color: 'text-rose-400' },
          { id: 'coins', label: '💰 TOP COINS', icon: Coins, color: 'text-amber-400' },
          { id: 'playtime', label: '⏰ MOST HOURS', icon: Clock, color: 'text-cyan-400' },
          { id: 'power', label: '🛡️ POWER SCORE', icon: Trophy, color: 'text-indigo-400' }
        ].map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id as any); setSearchQuery(''); }}
              className={`py-3 px-3.5 flex items-center justify-center gap-2 border text-[10px] font-pixel tracking-wider uppercase transition-all duration-150 rounded-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#111] border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.15)] font-black'
                  : 'bg-[#050505] border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-800'
              }`}
            >
              <IconComp size={12} className={cat.color} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Entries List */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-[#050505] border border-slate-900 font-mono text-xs text-slate-500 uppercase tracking-widest">
            <ShieldAlert size={24} className="mx-auto text-slate-600 mb-2" />
            No warriors found matching "{searchQuery}"
          </div>
        ) : (
          filteredData.map((player) => (
            <div 
              key={player.username}
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border transition-all duration-300 rounded-none ${
                player.rank === 1 
                  ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30 shadow-[0_4px_20px_rgba(212,175,55,0.05)]' 
                  : player.rank === 2
                  ? 'bg-[#111] hover:bg-[#151515] border-neutral-800'
                  : 'bg-[#0a0a0a] hover:bg-[#0e0e0e] border-neutral-900'
              }`}
            >
              {/* Left Profile Section */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Ranking Medal/Number */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono font-black text-sm relative">
                  {player.rank === 1 ? (
                    <span className="text-xl animate-bounce">👑</span>
                  ) : player.rank === 2 ? (
                    <span className="text-neutral-300 bg-neutral-800/85 border border-neutral-700 w-6 h-6 flex items-center justify-center text-xs">2</span>
                  ) : player.rank === 3 ? (
                    <span className="text-amber-600 bg-amber-950/70 border border-amber-900 w-6 h-6 flex items-center justify-center text-xs">3</span>
                  ) : (
                    <span className="text-neutral-500 text-xs">#{player.rank}</span>
                  )}
                </div>

                {/* Avatar Skull */}
                <div className="relative h-11 w-11 flex-shrink-0 border-2 border-slate-900 bg-slate-950 p-0.5 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-amber-500/10 group-hover:opacity-100 transition-opacity rounded"></div>
                  <img
                    src={`https://mc-heads.net/avatar/${player.uuidName}`}
                    alt={player.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain relative z-10 scale-105"
                  />
                </div>

                {/* Username & Subtitle */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold tracking-tight text-white uppercase font-sans">{player.username}</p>
                    {player.rank === 1 && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[8px] font-mono text-amber-500 tracking-wider uppercase font-bold animate-pulse">CHAMPION</span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">{player.subStat}</p>
                </div>
              </div>

              {/* Right Stats Details */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* tags */}
                <div className="hidden md:flex items-center gap-1.5">
                  {player.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[8px] font-mono bg-[#111] px-2 py-1 text-slate-400 border border-neutral-900 rounded-none whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Primary Stat box */}
                <div className="p-2 sm:p-2.5 bg-slate-900 border border-slate-800 rounded-none text-right min-w-[120px] shadow-inner">
                  <p className="text-[8px] uppercase tracking-wider font-mono text-slate-500">Record Level</p>
                  <span className="text-xs font-mono font-black text-white flex items-center justify-end gap-1">
                    {activeCategory === 'slayers' && <Swords size={10} className="text-rose-500" />}
                    {activeCategory === 'coins' && <Coins size={10} className="text-amber-500" />}
                    {activeCategory === 'playtime' && <Clock size={10} className="text-cyan-500" />}
                    {activeCategory === 'power' && <Sparkles size={10} className="text-indigo-500" />}
                    <span>{player.statValue}</span>
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      <div className="text-center mt-5 text-[9px] font-mono text-neutral-500 tracking-wider">
        ⚠ Live tracking cycles run automatically every 15 minutes inside primary server terminals.
      </div>
    </div>
  );
}
