import { useState } from 'react';
import { ShieldAlert, Terminal, MessageSquareCode, Heart, Check, Copy } from 'lucide-react';

interface Staff {
  name: string;
  role: string;
  roleColor: string;
  avatar: string;
  bio: string;
  specialty: string;
}

export default function StaffTeam() {
  const [copiedBanner, setCopiedBanner] = useState(false);

  const staffList: Staff[] = [
    {
      name: 'pokemon',
      role: '👑 Founder',
      roleColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
      avatar: 'https://mc-heads.net/avatar/pokemon',
      bio: 'Server Founder overseeing development timelines, core system operations, funding, and overall Empire SMP vision.',
      specialty: 'Empire SMP Founder'
    },
    {
      name: 'SHADOWXER01',
      role: '👑 Owner',
      roleColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      avatar: 'https://mc-heads.net/avatar/Shadowxer01',
      bio: 'Server Owner coordinating main development, hosting plans, general upkeep, community standards, and overall economy structures.',
      specialty: 'Empire SMP Director'
    },
    {
      name: 'Randeep Royal',
      role: '❖ Admin ❖',
      roleColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      avatar: 'https://mc-heads.net/avatar/Randeep',
      bio: '"I am Cooking!" Overseeing daily server operations, player permissions, event coordinates, and premium tickets support.',
      specialty: 'Server Administration / Hosting'
    },
    {
      name: 'Raksh X OG',
      role: '❖ Admin ❖',
      roleColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      avatar: 'https://mc-heads.net/avatar/Raksh',
      bio: '"Dc server making only [30r] dm me." Core administrator managing high-security roles, community discord setups, and support setups.',
      specialty: 'Discord Setup & Bot Tech'
    },
    {
      name: 'くコ:彡ADI😈DON',
      role: '❖ Admin ❖',
      roleColor: 'text-red-500 border-red-500/30 bg-red-500/10',
      avatar: 'https://mc-heads.net/avatar/Adi',
      bio: 'Server Administrator focused on player safety, coordinate logging, spam control, and direct in-game player support.',
      specialty: 'Rules & Support coordination'
    },
    {
      name: 'JHULAN',
      role: '★ Developer ★',
      roleColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      avatar: 'https://mc-heads.net/avatar/JHULAN',
      bio: 'Core Developer in charge of custom plugins integration, performance optimizations, bug patches, and API configurations.',
      specialty: 'Server Development'
    },
    {
      name: 'Eagle',
      role: '🛡️ Helper',
      roleColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      avatar: 'https://mc-heads.net/avatar/Eagle',
      bio: 'Dedicated Helper answering user support tickets, welcoming newcomers, and verifying community guidelines compliance.',
      specialty: 'Player Assistance'
    }
  ];

  const bannerText = `╔═══━━━── • ──━━━═══╗
🔥 EMPIRE SMP TEAM 🔥
💎 THANK YOU 💎
╚═══━━━── • ──━━━═══╝`;

  const handleCopyBanner = () => {
    navigator.clipboard.writeText(bannerText);
    setCopiedBanner(true);
    setTimeout(() => setCopiedBanner(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Decorative SMP Team Box */}
      <div className="bg-[#0a0a0a] border-2 border-neutral-850 p-6 rounded-none flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 max-w-lg">
          <pre className="font-mono text-amber-500 text-xs tracking-tight leading-relaxed max-w-full overflow-x-auto select-all p-3.5 bg-[#050505] border-2 border-neutral-900 rounded-none">
            {bannerText}
          </pre>
          <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase font-bold">
            ★ This banner displays natively in server welcome notes and official Discord announcements.
          </p>
        </div>

        <button 
          onClick={handleCopyBanner}
          className="px-4 py-2.5 bg-[#111] hover:bg-neutral-900 border-2 border-neutral-800 hover:border-amber-500 rounded-none text-[10px] font-mono uppercase tracking-widest text-amber-500 cursor-pointer transition-all active:scale-95 flex items-center gap-2 font-black shadow-lg"
        >
          {copiedBanner ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied Banner!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Team Banner</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Staff Members */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((s, idx) => (
          <div 
            key={idx} 
            className="bg-[#0a0a0a] border-2 border-neutral-850 hover:border-neutral-700 p-5 rounded-none text-center space-y-4 group transition-all shadow-xl"
          >
            {/* Minecraft Avatar */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-500/10 rounded-none blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src={s.avatar} 
                alt={s.name} 
                referrerPolicy="no-referrer"
                className="w-20 h-20 mx-auto rounded-none object-contain bg-[#050505] border-2 border-neutral-800 shadow-md group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>

            {/* Title & Badge */}
            <div className="space-y-1.5">
              <h4 className="font-plus text-base font-black tracking-normal text-white uppercase italic">{s.name}</h4>
              <span className={`inline-block text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-none border-2 font-bold ${s.roleColor}`}>
                {s.role}
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed min-h-[72px]">
              {s.bio}
            </p>

            {/* Skill focus footbar */}
            <div className="bg-[#111] p-2.5 border-2 border-neutral-900 rounded-none">
              <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block font-bold">Specialty focus</span>
              <p className="text-[10px] text-neutral-100 font-mono tracking-tight font-black uppercase">{s.specialty}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-neutral-500 max-w-lg mx-auto italic font-medium leading-relaxed font-sans">
        "Our team works around the clock to support standard updates, combat hackers, organize coordinates, and run community giveaways. Huge thank you to all Empire patrons!"
      </div>
    </div>
  );
}
