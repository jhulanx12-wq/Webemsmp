import { useState } from 'react';
import { Map, MapPin, Copy, Check, Search, Calculator, Ruler, Compass } from 'lucide-react';

interface Landmark {
  name: string;
  category: 'Spawns' | 'Farms' | 'Danger' | 'Portals';
  x: number;
  y: number;
  z: number;
  biome: string;
  safety: 'Safe' | 'Medium' | 'Dangerous';
  description: string;
}

const LANDMARKS_DATA: Landmark[] = [
  { name: 'Grand Spawn Hub & Castle', category: 'Spawns', x: 0, y: 72, z: 0, biome: 'Cherry Groves', safety: 'Safe', description: 'The official entry point of players with helpful trade NPCs, community chests, protective zones, and direct portal gates.' },
  { name: 'Royal Shopping Mall', category: 'Spawns', x: -440, y: 68, z: 820, biome: 'Plains Border', safety: 'Safe', description: 'Establish secure custom chest shops in designated plots. Active item trading and diamond economies happen here daily.' },
  { name: 'End Portal Stronghold', category: 'Portals', x: 1480, y: 41, z: -2560, biome: 'Deep Ocean Floor', safety: 'Dangerous', description: 'Fully secure fortress containing active ender eye sockets. Beware of hostile factions patrolling the nether coordinates above.' },
  { name: 'Public Iron & Gold Farms', category: 'Farms', x: -180, y: 110, z: -1420, biome: 'Mushroom Fields', safety: 'Safe', description: '24/7 public resource grinding hub operated by Empire Staff. Yields 15,000+ iron bars and gold nuggets hourly with public chest access.' },
  { name: 'Community PvP Arena', category: 'Danger', x: 920, y: 64, z: 1150, biome: 'Desert Badlands', safety: 'Dangerous', description: 'High stakes PvP gladiator tournament zone. Item drop matches are fully permitted inside. Gilded spectator galleries surround.' },
  { name: 'Nether Ice Highway Junction', category: 'Portals', x: 120, y: 118, z: -85, biome: 'Nether Wastes', safety: 'Medium', description: 'Hyper-fast traveling hub connecting major coordinates. Paved fully with blue ice for extreme boat metrics speed.' },
  { name: 'Public Elder Guardian Temple', category: 'Farms', x: -1250, y: 38, z: 420, biome: 'Deep Warm Ocean', safety: 'Medium', description: 'Fully drained prismarine monument farm. Excellent for prismarine shards, sea lanterns, and high-efficiency XP mining.' },
  { name: 'Ancient Netherite Mine Basin', category: 'Danger', x: -2500, y: 15, z: -2500, biome: 'Basalt Deltas', safety: 'Dangerous', description: 'Highly chaotic nether basin optimized for bed blasting ancient raw debris. Extremely toxic territorial mobs spawn.' }
];

export default function ServerMap() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Distance calculator states
  const [userX, setUserX] = useState<number | ''>('');
  const [userZ, setUserZ] = useState<number | ''>('');
  const [selectedDest, setSelectedDest] = useState<Landmark | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);

  const handleCopyCoords = (lm: Landmark, idx: number) => {
    const coordString = `/tp ${lm.x} ${lm.y} ${lm.z}`;
    navigator.clipboard.writeText(coordString);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCalculate = () => {
    if (userX === '' || userZ === '' || !selectedDest) {
      alert('Please fill out your coordinates and select a target destination!');
      return;
    }
    const dx = selectedDest.x - Number(userX);
    const dz = selectedDest.z - Number(userZ);
    // Euclidean distance in blocks flat
    const dist = Math.round(Math.sqrt(dx * dx + dz * dz));
    setCalculatedDistance(dist);
  };

  const filteredLandmarks = LANDMARKS_DATA.filter(lm => {
    const matchesSearch = lm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lm.biome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || lm.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-none p-5 sm:p-7 relative overflow-hidden shadow-2xl space-y-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">🗺️ DISCOVER LANDMARK COORDINATES 🗺️</span>
          <h4 className="font-pixel text-[13px] text-white uppercase flex items-center gap-2">
            <Map size={15} className="text-cyan-400" />
            <span>Empire Landmark Coordinates Registry</span>
          </h4>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Spawns', 'Farms', 'Portals', 'Danger'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all rounded-none cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold'
                  : 'bg-slate-900 border-neutral-850 hover:border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? '🌐 View All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of coordinates with search input */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search landmark coordinates, portal names, or biomes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs text-white uppercase tracking-wider font-mono placeholder:text-slate-600 rounded-none transition-all placeholder:text-[10px]"
          />
        </div>

        {/* Landmarks Card List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLandmarks.map((lm, idx) => {
            const isCopied = copiedIndex === idx;
            return (
              <div 
                key={lm.name}
                className="bg-[#0a0a0a] hover:bg-[#111] p-4 border border-neutral-900 hover:border-cyan-500/20 transition-all duration-300 rounded-none flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-mono px-2 py-0.5 uppercase tracking-widest border font-bold ${
                      lm.category === 'Spawns' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      lm.category === 'Farms' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      lm.category === 'Portals' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {lm.category}
                    </span>
                    <span className={`text-[8px] font-mono uppercase tracking-widest ${
                      lm.safety === 'Safe' ? 'text-emerald-500' :
                      lm.safety === 'Medium' ? 'text-amber-500' : 'text-rose-500 font-bold'
                    }`}>
                      ● {lm.safety} Area
                    </span>
                  </div>

                  <h5 className="font-plus text-xs uppercase font-black text-white group-hover:text-cyan-400 transition-colors pt-1">
                    {lm.name}
                  </h5>
                  <p className="text-[10px] text-neutral-500 leading-normal line-clamp-2">
                    {lm.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                  {/* Coordinate Numbers */}
                  <div className="font-mono text-[10px] text-slate-300 bg-[#050505] px-2.5 py-1 border border-neutral-850">
                    <span className="text-rose-400 font-bold">X:</span> {lm.x} &bull; <span className="text-emerald-400 font-bold">Y:</span> {lm.y} &bull; <span className="text-cyan-400 font-bold">Z:</span> {lm.z}
                  </div>

                  {/* Copy command button */}
                  <button
                    onClick={() => handleCopyCoords(lm, idx)}
                    className={`p-1.5 border transition-all text-[9px] font-mono font-bold uppercase rounded-none cursor-pointer flex items-center gap-1 shrink-0 ${
                      isCopied 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-900 border-neutral-800 hover:border-cyan-400 hover:text-cyan-400 text-slate-400'
                    }`}
                    title="Copy /tp command"
                  >
                    {isCopied ? (
                      <>
                        <Check size={10} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={10} />
                        <span>TP Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Manhattan / Block distance calculator */}
      <div className="bg-slate-[#131] border-2 border-neutral-900 p-5 rounded-none relative">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg text-center lg:text-left">
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">⚔️ SURVIVAL GPS SYSTEM ⚔️</span>
            <h5 className="font-pixel text-[11px] text-white uppercase flex items-center justify-center lg:justify-start gap-1.5">
              <Compass size={13} className="text-cyan-400 animate-spin" />
              <span>Block Distance Locator</span>
            </h5>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Enter your current survival coordinates (X & Z) and choose a landmark destination from the menu below to calculate the layout distance in flat blocks!
            </p>
          </div>

          {/* Calculator Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            {/* Input X */}
            <div className="w-24">
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Your Coords X</label>
              <input
                type="number"
                placeholder="X"
                value={userX}
                onChange={(e) => setUserX(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#050505] border border-neutral-850 p-2 text-xs font-mono text-white text-center rounded-none focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Input Z */}
            <div className="w-24">
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Your Coords Z</label>
              <input
                type="number"
                placeholder="Z"
                value={userZ}
                onChange={(e) => setUserZ(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#050505] border border-neutral-850 p-2 text-xs font-mono text-white text-center rounded-none focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Destination Selection dropdown */}
            <div className="min-w-[140px]">
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Target Destination</label>
              <select
                value={selectedDest?.name || ''}
                onChange={(e) => {
                  const found = LANDMARKS_DATA.find(lm => lm.name === e.target.value);
                  setSelectedDest(found || null);
                  setCalculatedDistance(null);
                }}
                className="w-full bg-[#050505] border border-neutral-850 p-2 text-[10px] font-pixel text-slate-300 rounded-none outline-none focus:border-cyan-500"
              >
                <option value="">-- Choose --</option>
                {LANDMARKS_DATA.map(lm => (
                  <option key={lm.name} value={lm.name}>{lm.name}</option>
                ))}
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-[10px] uppercase rounded-none mt-4 transition-all duration-150 active:scale-95 flex items-center gap-1 cursor-pointer border-b-2 border-cyan-800"
            >
              <Calculator size={11} />
              <span>Calculate</span>
            </button>
          </div>
        </div>

        {/* Calculation Result */}
        {calculatedDistance !== null && selectedDest && (
          <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/20 text-center flex items-center justify-center gap-3 animate-pulse">
            <Ruler size={14} className="text-cyan-400" />
            <p className="text-xs font-mono uppercase tracking-widest">
              You are exactly <span className="text-cyan-400 font-bold">{calculatedDistance.toLocaleString()}</span> blocks away from <span className="text-white font-heavy bg-[#111] px-1.5 py-0.5 border border-cyan-800">{selectedDest.name}</span>!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
