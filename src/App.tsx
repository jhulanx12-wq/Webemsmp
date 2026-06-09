import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  ShoppingCart, 
  MessageSquare, 
  Grid, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Trash2, 
  HelpCircle, 
  Volume2, 
  Moon, 
  Menu, 
  X, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';

import { Rank, CartItem } from './types';
import ServerStats from './components/ServerStats';
// @ts-ignore
import empireSmpLogo from './assets/images/empire_smp_logo_1781008557253.png';
import RankCard from './components/RankCard';
import TicketSystem from './components/TicketSystem';
import CheckoutModal from './components/CheckoutModal';
import StaffTeam from './components/StaffTeam';
import Leaderboard from './components/Leaderboard';
import ServerMap from './components/ServerMap';
import VoteChest from './components/VoteChest';

// Core Rank Config precisely matching the user request
const ranks: Rank[] = [
  {
    id: 'god',
    name: 'GOD',
    price: 299,
    emoji: '👑',
    badge: '1𝘴𝘵 • GOD',
    tier: 'Ultimate',
    tagline: 'Ultimate Premium Rank — Level up to god mode under the Empire throne!',
    perks: [
      'Full Netherite kit set with maximum resilience enchants',
      'Tunnel 3 custom enchantment for structural drilling',
      'Mine 9 blocks at one time (Instant 3x3 mining grid)',
      'Supreme priority login slot & custom GOD chat badge'
    ],
    ability: 'Mine 9 blocks simultaneously (Click "Try 3x3 Ability" above to test!)',
    kit: {
      title: 'GOD Pack Inventory Additions',
      items: ['Netherite Pickaxe (Efficiency V)', 'Full Netherite Armor Set', 'Tunnel 3 Enchanted Book', '32x Diamonds']
    },
    color: 'from-amber-600 via-orange-500 to-red-600',
    borderColor: 'border-amber-500/60',
    glowColor: 'mc-gold-shadow'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 90,
    emoji: '⚡',
    badge: '2𝘯𝘥 • VIP',
    tier: 'Premium',
    tagline: 'Exclusive VIP Perks — Highlight your survival status with premium items.',
    perks: [
      'Full Netherite basic kit set',
      '64x Enchanted Golden Apples (God Apples) to boost survival metrics',
      'Exclusive /fly and /feed survival command allowances',
      'Purple VIP server tag and customized Discord role'
    ],
    kit: {
      title: 'VIP Reward Pack',
      items: ['Netherite Chestplate', 'Netherite Sword (Sharpness IV)', '64x Enchanted Golden Apples']
    },
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/50',
    glowColor: 'mc-glow-vip'
  },
  {
    id: 'explorer',
    name: 'EXPLORER',
    price: 40,
    emoji: '🗺️',
    badge: '3𝘳𝘥 • EXPLORER',
    tier: 'Starter',
    tagline: 'Perfect Starter Rank — Best starter gears to accelerate resources grind.',
    perks: [
      'Perfect diamond starting weapon tools kit',
      'Starter resource logs and block material items to claim survival land',
      'Explorer chat badge color'
    ],
    kit: {
      title: 'Explorer Supplies',
      items: ['Diamond Pickaxe', 'Diamond Axe', 'Perfect Diamond Chestplate', '64x Cooked Beef']
    },
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/50',
    glowColor: 'mc-slate-glow'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'tickets' | 'team' | 'rules' | 'features'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartUsername, setCartUsername] = useState('');
  const [selectedQuickRank, setSelectedQuickRank] = useState<Rank | null>(null);
  const [prefilledRankId, setPrefilledRankId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync cart from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('empiresmp_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart retrieval failed", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('empiresmp_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (rank: Rank) => {
    const existing = cart.find(item => item.rank.id === rank.id);
    if (existing) {
      const updated = cart.map(item => 
        item.rank.id === rank.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      const updated = [...cart, { rank, quantity: 1, username: cartUsername }];
      saveCart(updated);
    }
    setCartOpen(true);
  };

  const updateQuantity = (rankId: string, val: number) => {
    const updated = cart.map(item => {
      if (item.rank.id === rankId) {
        const newQty = Math.max(1, item.quantity + val);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const handleRemoveFromCart = (rankId: string) => {
    const updated = cart.filter(item => item.rank.id !== rankId);
    saveCart(updated);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.rank.price * item.quantity), 0);

  const handleTriggerTicketFromCart = () => {
    if (cart.length === 0) return;
    // Set the first rank in cart as the target prefill
    setPrefilledRankId(cart[0].rank.id);
    setActiveTab('tickets');
    setCartOpen(false);
  };

  const handleQuickCheckout = (rank: Rank) => {
    setSelectedQuickRank(rank);
  };

  const handleSubmitTicketFromCheckout = (mcName: string, discordTag: string, rankId: string) => {
    // Generate simulated ticket directly inside TicketSystem
    setPrefilledRankId(rankId);
    setActiveTab('tickets');
    setSelectedQuickRank(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative">
      
      {/* Background Subtle Grid Layer */}
      <div className="absolute inset-0 mc-pattern-stone opacity-[0.04] pointer-events-none"></div>

      {/* Top Banner Notice - Gilded Gold */}
      <div className="bg-amber-500 text-neutral-950 py-2.5 px-4 text-center font-plus text-xs tracking-widest font-black uppercase shadow-lg z-30 flex items-center justify-center gap-2 select-none shrink-0 relative border-b-2 border-amber-600">
        <Flame size={14} className="animate-pulse" />
        <span>★ EMPIRE SUMMER UPGRADE SALE ACTIVE — ALL PACKAGES ARE CHRONICLED AS ONE-TIME LIFETIME REWARDS ★</span>
      </div>

      {/* Main Navigation Header - Sleek Black & Gilded Accent */}
      <header className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b-2 border-neutral-800/80 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Segment */}
          <div className="flex items-center gap-3">
            <div className="group relative">
              <div className="absolute inset-0 bg-amber-500/10 rounded blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#111] border-2 border-amber-500 h-11 w-11 rounded-none flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <img 
                  src={empireSmpLogo} 
                  alt="Empire Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </div>
            <div>
              <h1 className="font-plus text-base font-black tracking-normal text-white leading-normal uppercase italic">
                EMPIRE <span className="text-amber-500">SMP</span>
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 block uppercase font-medium">OFFICIAL RANK SHOP</span>
            </div>
          </div>

          {/* Navigation Links Desktop - Sharp tab buttons with gold underlines */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'shop', label: '🏬 RANK SHOP' },
              { id: 'features', label: '⚔️ FEATURES & REWARDS' },
              { id: 'tickets', label: '📩 TICKET SUPPORT' },
              { id: 'team', label: '👥 EMPIRE TEAM' },
              { id: 'rules', label: '📋 RULEBOOK & FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs tracking-wider font-extrabold uppercase transition-all duration-150 cursor-pointer border-t-2 border-transparent ${
                  activeTab === tab.id 
                    ? 'text-amber-500 border-t-2 !border-t-amber-500 bg-neutral-900/60 font-black' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Header Controls (Cart button + Discord Info) */}
          <div className="flex items-center gap-3">
            {/* Discord Server Link Button */}
            <a
              href="https://discord.gg/U85qPkYvFB"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-none bg-[#5865F2]/10 border-2 border-[#5865F2]/30 hover:border-[#5865F2] hover:bg-[#5865F2]/20 text-white cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              title="Join Discord Server"
            >
              <MessageSquare size={14} className="text-[#5865F2] animate-pulse" />
              <span className="hidden sm:inline font-plus text-[10px] tracking-widest uppercase font-black text-neutral-300">DISCORD</span>
              <ExternalLink size={9} className="text-neutral-500" />
            </a>

            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-none bg-[#111] border-2 border-neutral-800 hover:border-amber-500 hover:bg-neutral-900 text-white relative cursor-pointer active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              title="Open active cart"
            >
              <ShoppingCart size={15} className="text-amber-500" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-amber-500 text-slate-950 font-black font-mono text-[10px] rounded-full flex items-center justify-center shadow-lg border border-slate-950 animate-pulse">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
              <span className="hidden sm:inline font-plus text-[10px] tracking-widest uppercase font-bold text-neutral-300">CART</span>
            </button>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-[#111] border-2 border-neutral-800 text-slate-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-neutral-850 bg-[#0a0a0a] p-4 space-y-2.5 z-20 relative">
          <button
            onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold ${
              activeTab === 'shop' ? 'bg-neutral-900 text-amber-500 border-l-2 border-amber-500' : 'text-neutral-400'
            }`}
          >
            🏬 Rank Shop
          </button>
          <button
            onClick={() => { setActiveTab('features'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold ${
              activeTab === 'features' ? 'bg-neutral-900 text-amber-500 border-l-2 border-amber-500' : 'text-neutral-400'
            }`}
          >
            ⚔️ Features & Rewards
          </button>
          <button
            onClick={() => { setActiveTab('tickets'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold ${
              activeTab === 'tickets' ? 'bg-neutral-900 text-amber-500 border-l-2 border-amber-500' : 'text-neutral-400'
            }`}
          >
            📩 Ticket Support
          </button>
          <button
            onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold ${
              activeTab === 'team' ? 'bg-neutral-900 text-amber-500 border-l-2 border-amber-500' : 'text-neutral-400'
            }`}
          >
            👥 Our Team
          </button>
          <button
            onClick={() => { setActiveTab('rules'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold ${
              activeTab === 'rules' ? 'bg-neutral-900 text-amber-500 border-l-2 border-amber-500' : 'text-neutral-400'
            }`}
          >
            📋 Rules & FAQ
          </button>
          <a
            href="https://discord.gg/U85qPkYvFB"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left py-3 px-4 rounded-none font-plus text-xs uppercase font-extrabold text-white bg-[#5865F2]/10 border-l-2 border-[#5865F2] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#5865F2] animate-pulse" />
              <span>💬 Join Discord Server</span>
            </span>
            <ExternalLink size={12} className="text-white/40" />
          </a>
        </div>
      )}

      {/* Hero Display Showcase Area - Artistic Flair & Bold Italic Displays */}
      <section className="bg-gradient-to-b from-[#0e0e0e] to-transparent py-16 px-4 sm:px-6 relative overflow-hidden shrink-0 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02)_0,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-none border border-amber-500/30 text-[9px] font-mono text-amber-400 uppercase tracking-widest animate-pulse font-bold">
            <Sparkles size={11} className="text-amber-500" />
            <span>AUTHENTIC SURVIVAL MULTIPLAYER EXPERIENCES</span>
          </div>

          <div className="space-y-4">
            <span className="text-amber-500 block text-xs tracking-widest font-black uppercase italic">THE CONQUEROR'S REALM</span>
            
            {/* Spectacular Grand 3D Metallic Server Logo Accent */}
            <div className="relative mx-auto max-w-xs sm:max-w-md md:max-w-xl select-none group py-2">
              <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <img
                src={empireSmpLogo}
                alt="Empire SMP Grand Crown Logo"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain relative z-10 filter drop-shadow-[0_12px_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed font-sans pt-2">
              Enter the official domain of <strong className="text-neutral-100">Empire SMP</strong>. Instantly gear up, claim Netherite sets, activate hyper-fast mining permissions, and secure legendary roles.
            </p>
          </div>

          {/* Copyable IP widget */}
          <div className="max-w-xl mx-auto pt-4 space-y-4">
            <ServerStats />

            {/* Quick Interactive Redirect Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('shop')}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black font-plus tracking-widest text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md rounded-none"
              >
                🏬 EXPLORE RANK SHOP
              </button>
              <a
                href="https://discord.gg/U85qPkYvFB"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#5865F2] hover:bg-[#4d59e3] text-white font-black font-plus tracking-widest text-[10px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md rounded-none"
              >
                <MessageSquare size={13} className="animate-pulse" />
                <span>JOIN OFFICIAL DISCORD</span>
                <ExternalLink size={10} className="text-white/60" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative">
        {activeTab === 'shop' && (
          <div className="space-y-12">
            
            {/* Elegant ASCII Rank Shop Title Requested by the User */}
            <div className="text-center pt-4">
              <div className="inline-block max-w-[500px] text-center font-mono text-xs overflow-x-auto text-amber-500 whitespace-pre leading-relaxed select-none mb-3 bg-[#0a0a0a] p-4 border-2 border-neutral-900 rounded-lg">
{`╔═══━━━── • ──━━━═══╗
🔥 👑 EMPIRE SMP RANKS 👑 🔥
╚═══━━━── • ──━━━═══╝

💎 ⚡ 𝙾𝙵𝙵𝙸𝙲𝙸𝙰𝙻 𝚁𝙰𝙽𝙺 𝚂𝙷𝙾𝙿 ⚡ 💎`}
              </div>
              <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-widest">Select an exclusive tier beneath to claim your survival powerups</p>
              <div className="w-16 h-1 bg-amber-500/30 mx-auto mt-4 rounded animate-pulse"></div>
            </div>

            {/* Ranks showcase Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {ranks.map((rank) => (
                <RankCard
                  key={rank.id}
                  rank={rank}
                  onAddToCart={handleAddToCart}
                  onQuickCheckout={handleQuickCheckout}
                />
              ))}
            </div>

            {/* Discord CTA bottom notice board */}
            <div className="bg-[#0a0a0a] p-6 border-2 border-neutral-850 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-none shadow-2xl">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block">📩 OFFICIAL DISCORD SERVER</span>
                <p className="text-sm font-black font-plus uppercase text-white">Prefer to coordinate via Discord directly?</p>
                <p className="text-xs text-neutral-400">Join our community, grab status indicators, or submit support payloads directly.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="https://discord.gg/U85qPkYvFB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#5865F2] hover:bg-[#4d59e3] text-white font-bold text-xs font-mono uppercase text-center flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-none"
                >
                  <MessageSquare size={14} className="text-white animate-pulse" />
                  <span>Join Discord</span>
                </a>
                <button
                  onClick={() => { setPrefilledRankId('god'); setActiveTab('tickets'); }}
                  className="px-5 py-3 bg-[#111] text-amber-500 hover:text-white border-2 border-neutral-800 hover:border-amber-500 rounded-none text-xs font-mono uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>Create Web Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-pixel text-slate-500 uppercase tracking-widest">SMP CUSTOM HIGHLIGHT PORTS</span>
              <h3 className="font-pixel text-[13px] text-amber-400 tracking-wide uppercase">⚔️ Live Server Features & Interactive Tools ⚔️</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock, trace, and engage directly with the active heart of the Empire server using live visual panels of top slayers, coordinate navigators, and daily voting simulators!
              </p>
            </div>

            {/* Daily crate and vote links */}
            <VoteChest />

            {/* Server coordinates registries */}
            <ServerMap />

            {/* Hall of fame leaderboards */}
            <Leaderboard />
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-pixel text-slate-500 uppercase tracking-widest">Automated Dispatcher Portal</span>
              <h3 className="font-pixel text-[13px] text-amber-400 tracking-wide uppercase">📩 Support Tickets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need to finalize rank payment or ask questions? Spawn a ticket below. We support instant QR codes, payments processing, and immediate activation coordinates.
              </p>
            </div>

            <TicketSystem
              ranks={ranks}
              prefilledRankId={prefilledRankId}
              onClearPrefill={() => setPrefilledRankId(null)}
            />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-pixel text-slate-500 uppercase tracking-widest">Who runs Empire SMP?</span>
              <h3 className="font-pixel text-[13px] text-amber-400 tracking-wide uppercase">🔥 Empire SMP Team 🔥</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Meet the server owners, lead plugin developers, and dedicated support mods keeping the empire safe, competitive, and lag-free.
              </p>
            </div>

            <StaffTeam />
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            {/* Rules Container */}
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="font-pixel text-[13px] text-amber-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-500" />
                <span>⚖️ General Server Rules</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-lg border border-slate-850">
                  <h4 className="text-xs font-pixel text-cyan-400 uppercase">1. No Toxic Griefing</h4>
                  <p className="text-xs text-slate-300">Respect designated town zones and spawn claims. Unauthorized volcanic lava casting or water flooding is banned.</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-lg border border-slate-850">
                  <h4 className="text-xs font-pixel text-cyan-400 uppercase">2. No Hacking / Mods</h4>
                  <p className="text-xs text-slate-300">Cheating layouts like flight rigs, continuous auto-clickers, and custom combat range mods are caught by our anticheat.</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-lg border border-slate-850">
                  <h4 className="text-xs font-pixel text-cyan-400 uppercase">3. Chat Moderation</h4>
                  <p className="text-xs text-slate-300">Keep standard lobby channels friendly. Personal abuse, extreme spamming, or server coordinates leakage is moderated.</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-slate-950/60 rounded-lg border border-slate-850">
                  <h4 className="text-xs font-pixel text-cyan-400 uppercase">4. Purchase Scams Protection</h4>
                  <p className="text-xs text-slate-300">Ranks must exclusively be structured via this website ticket portal or authorized DMs with Owner Deral/Anya. Beware fake sellers.</p>
                </div>
              </div>
            </div>

            {/* General FAQs */}
            <div className="space-y-4">
              <h3 className="font-pixel text-[13px] text-white uppercase tracking-widest mb-4">❓ Frequently Asked Questions</h3>
              
              <div className="space-y-3">
                <details className="bg-slate-900 border border-slate-800 rounded-xl p-4 group select-none transition-all">
                  <summary className="font-semibold text-sm text-slate-200 hover:text-white flex justify-between items-center cursor-pointer outline-none font-pixel text-[11px] uppercase tracking-wide">
                    <span>How do I receive my rank once purchased?</span>
                    <Plus size={14} className="group-open:hidden text-amber-400" />
                    <Minus size={14} className="hidden group-open:block text-amber-400" />
                  </summary>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
                    As soon as you finalize payment (UPI scan, Cards, or PayPal) in your support ticket conversation, our staff will instantly verify your transaction ID. We then execute a server console terminal command which immediately upgrades your account! The whole process usually takes under 5 to 10 minutes.
                  </p>
                </details>

                <details className="bg-slate-900 border border-slate-800 rounded-xl p-4 group select-none transition-all">
                  <summary className="font-semibold text-sm text-slate-200 hover:text-white flex justify-between items-center cursor-pointer outline-none font-pixel text-[11px] uppercase tracking-wide">
                    <span>Are these recurring subscription fees?</span>
                    <Plus size={14} className="group-open:hidden text-amber-400" />
                    <Minus size={14} className="hidden group-open:block text-amber-400" />
                  </summary>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
                    No! Every rank package (GOD, VIP, and EXPLORER) are **one-time purchases only**! Once bought, you keep the in-game perks, kits, status symbols, and Discord channels forever with zero monthly fees.
                  </p>
                </details>

                <details className="bg-slate-900 border border-slate-800 rounded-xl p-4 group select-none transition-all">
                  <summary className="font-semibold text-sm text-slate-200 hover:text-white flex justify-between items-center cursor-pointer outline-none font-pixel text-[11px] uppercase tracking-wide">
                    <span>Does Bedrock/MCPE play on Empire SMP?</span>
                    <Plus size={14} className="group-open:hidden text-amber-400" />
                    <Minus size={14} className="hidden group-open:block text-amber-400" />
                  </summary>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
                    Yes, we are a hybrid crossplay network! Java edition player clients can seamlessly join with standard Bedrock (Minecraft Pocket Edition PE, Xbox, PS4, Switch) using port 19132. All rank deliveries apply correctly across either platform!
                  </p>
                </details>

                <details className="bg-slate-900 border border-slate-800 rounded-xl p-4 group select-none transition-all">
                  <summary className="font-semibold text-sm text-slate-200 hover:text-white flex justify-between items-center cursor-pointer outline-none font-pixel text-[11px] uppercase tracking-wide">
                    <span>How does the GOD rank 3x3 mine ability operate?</span>
                    <Plus size={14} className="group-open:hidden text-amber-400" />
                    <Minus size={14} className="hidden group-open:block text-amber-400" />
                  </summary>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
                    When holding a pickaxe inside our survival worlds, typing "/mine grid" activates standard quarry digging! Every single block swing breaks a 3x3 block matrix of stone, obsidian, netherite debris, or diamonds instantly, speeding up resource grinding significantly.
                  </p>
                </details>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Sidebar Shopping Cart */}
      {cartOpen && (
        <div className="fixed inset-0 z-45 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 flex flex-col p-6 text-white shadow-2xl relative animate-slide-in">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-amber-400" />
                <h4 className="font-pixel text-xs text-white uppercase tracking-wider">Your Shopping Cart</h4>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-1 rounded hover:bg-slate-950 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <ShoppingCart size={40} className="mx-auto text-slate-700 animate-pulse" />
                  <p className="text-xs text-slate-500 font-pixel uppercase">Your cart is empty</p>
                  <button
                    onClick={() => { setCartOpen(false); setActiveTab('shop'); }}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-amber-400 rounded transition-colors uppercase font-pixel tracking-wider cursor-pointer"
                  >
                    Browse Ranks
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.rank.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 relative">
                    <div className="space-y-1 max-w-[65%]">
                      <span className="text-[10px] uppercase font-pixel text-amber-400">{item.rank.name} Package</span>
                      <p className="text-[11px] text-slate-400 truncate">{item.rank.tagline}</p>
                      
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => updateQuantity(item.rank.id, -1)}
                          className="p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-xs"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold font-mono px-2 text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.rank.id, 1)}
                          className="p-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-xs"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-2">
                      <span className="font-bold text-sm block font-mono text-white">₹{item.rank.price * item.quantity}</span>
                      <button
                        onClick={() => handleRemoveFromCart(item.rank.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Remove package"
                      >
                        <Trash2 size={12} />
                        <span className="text-[10px] font-pixel uppercase text-[9px]">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Checkout info */}
            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-5 mt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-pixel text-slate-400 uppercase tracking-wider">Subtotal</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-white">₹{cartTotal}</span>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">~ ${(cartTotal/83).toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => saveCart([])}
                    className="py-3 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 text-xs font-pixel rounded-lg text-slate-400 cursor-pointer transition-colors uppercase text-center"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleTriggerTicketFromCart}
                    className="py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:from-amber-400 hover:to-yellow-400 text-xs font-pixel tracking-wider rounded-lg border-b-4 border-amber-700 active:border-b-0 cursor-pointer active:scale-95 transition-all uppercase text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Checkout Now</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Quick Checkout Modal Trigger */}
      {selectedQuickRank && (
        <CheckoutModal
          rank={selectedQuickRank}
          onClose={() => setSelectedQuickRank(null)}
          onSubmitTicketFromCheckout={handleSubmitTicketFromCheckout}
        />
      )}

      {/* Standard Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-pixel text-[11px] tracking-widest text-amber-400 uppercase">Empire SMP Network</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-sm">
              We are not affiliated with Monjang Studios AB or Microsoft Corporation. All server ranks support server hosting, plugin licenses, and anti-DDoS networks.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1 text-xs text-slate-500 font-pixel text-[10px]">
            <p>👑・💎・🔥・⚔️・🚀・⭐</p>
            <p>© 2026 Empire SMP. All rights reserved.</p>
            <a
              href="https://discord.gg/U85qPkYvFB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5865F2] hover:text-white font-mono text-[10px] uppercase tracking-widest font-black flex items-center gap-1 mt-1 transition-colors bg-[#5865F2]/5 px-2 py-1 border border-[#5865F2]/20"
            >
              <MessageSquare size={11} className="animate-pulse text-[#5865F2]" />
              <span>Join Discord Server</span>
              <ExternalLink size={9} />
            </a>
            <p className="text-[9px] text-amber-500/70 font-mono mt-1">Developed with craft precision</p>
          </div>
        </div>

        {/* RGB Animated Thank You Message */}
        <div className="max-w-7xl mx-auto border-t border-neutral-900/60 mt-8 pt-6 text-center">
          <p className="rgb-text text-[10px] uppercase tracking-widest font-semibold">
            ★ thanks for visit web ★
          </p>
        </div>
      </footer>
    </div>
  );
}
