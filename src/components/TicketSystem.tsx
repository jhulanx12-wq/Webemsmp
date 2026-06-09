import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Ticket, Bot, Check, Shield, Copy, RefreshCw, X } from 'lucide-react';
import { SupportTicket, TicketMessage, Rank } from '../types';
import PhonePeCard from './PhonePeCard';

interface TicketSystemProps {
  ranks: Rank[];
  prefilledRankId?: string | null;
  onClearPrefill?: () => void;
}

export default function TicketSystem({ ranks, prefilledRankId, onClearPrefill }: TicketSystemProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  
  // Form state
  const [mcUsername, setMcUsername] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [selectedRank, setSelectedRank] = useState(prefilledRankId || 'god');
  const [messageText, setMessageText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPhonePeQR, setShowPhonePeQR] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync Prefill values if changed from mother component
  useEffect(() => {
    if (prefilledRankId) {
      setSelectedRank(prefilledRankId);
    }
  }, [prefilledRankId]);

  // Load tickets from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('empiresmp_tickets');
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse saved tickets", e);
      }
    }
  }, []);

  // Save tickets to local storage on change
  const saveTickets = (updatedTickets: SupportTicket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem('empiresmp_tickets', JSON.stringify(updatedTickets));
  };

  // Scroll mock chat to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicketId, tickets, isTyping]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcUsername.trim() || !discordTag.trim()) return;

    const rank = ranks.find(r => r.id === selectedRank) || ranks[0];
    const ticketId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialMessages: TicketMessage[] = [
      {
        id: 'sys-1',
        sender: 'staff',
        text: `Welcome to Empire SMP Support, ${mcUsername}! This is specialized ticket #${ticketId} for your "${rank.name}" Rank purchase.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      },
      {
        id: 'sys-2',
        sender: 'staff',
        text: `Hey! I'm Deral, Owner of Empire SMP. Thank you so much for wanting to support the server! I have locked in your choice: ${rank.name} (Amount: ₹${rank.price}). To speed up your order, please see the Discord copyable snippet below. How would you like to pay (UPI / QR Code, Cards, or PayPal)?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    const newTicket: SupportTicket = {
      id: ticketId,
      minecraftUsername: mcUsername,
      discordTag: discordTag,
      selectedRankId: selectedRank,
      createdAt: new Date().toLocaleDateString(),
      status: 'Open',
      messages: initialMessages
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    setActiveTicketId(ticketId);

    // Reset inputs
    setMcUsername('');
    setDiscordTag('');
    if (onClearPrefill) onClearPrefill();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeTicketId) return;

    const currentTicket = tickets.find(t => t.id === activeTicketId);
    if (!currentTicket) return;

    const userMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentTicket.messages, userMsg];
    const updatedTickets = tickets.map(t => {
      if (t.id === activeTicketId) {
        return { ...t, messages: updatedMessages };
      }
      return t;
    });

    saveTickets(updatedTickets);
    setMessageText('');

    // Trigger AI / Mock Staff reply
    simulateStaffReply(activeTicketId, messageText);
  };

  const simulateStaffReply = (ticketId: string, userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const parentTicket = tickets.find(t => t.id === ticketId);
      if (!parentTicket) {
        setIsTyping(false);
        return;
      }

      const chosenRank = ranks.find(r => r.id === parentTicket.selectedRankId) || ranks[0];
      let replyText = '';

      const cleanedMsg = userMessage.toLowerCase();
      if (cleanedMsg.includes('upi') || cleanedMsg.includes('pay') || cleanedMsg.includes('qr') || cleanedMsg.includes('how')) {
        replyText = `Excellent choice! 💳 You can pay immediately using our PhonePe QR code. Just click the "Scan PhonePe QR" button at the top of our chat to open KUNTI NAIK's PhonePe QR for ₹${chosenRank.price}! After paying, share the transaction details here.`;
      } else if (cleanedMsg.includes('paypal') || cleanedMsg.includes('dollar') || cleanedMsg.includes('usd')) {
        replyText = `Yes, we support PayPal! To buy from so join dc! Since your rank is ₹${chosenRank.price} (~$${(chosenRank.price / 83).toFixed(2)} USD), please join our official Discord server to get activated!`;
      } else if (cleanedMsg.includes('done') || cleanedMsg.includes('paid') || cleanedMsg.includes('txn') || cleanedMsg.includes('screenshot')) {
        replyText = `Awesome! I've received your transaction details. Verification is in progress! Your rank "${chosenRank.name}" will be credited to username "${parentTicket.minecraftUsername}". Keep an eye on server chat! 👑`;
      } else {
        replyText = `Thank you for your message! Our staff is verifying your target Minecraft account "${parentTicket.minecraftUsername}". We will help deliver your ${chosenRank.name} package soon. Is there anything else about the perks you'd like to ask?`;
      }

      const staffMsg: TicketMessage = {
        id: `reply-${Date.now()}`,
        sender: 'staff',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalTickets = tickets.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Processing' as const,
            messages: [...t.messages, staffMsg]
          };
        }
        return t;
      });

      saveTickets(finalTickets);
      setIsTyping(false);
    }, 2200);
  };

  const deleteTicket = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tickets.filter(t => t.id !== id);
    saveTickets(updated);
    if (activeTicketId === id) {
      setActiveTicketId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const generateDiscordCopyText = (t: SupportTicket) => {
    const rank = ranks.find(r => r.id === t.selectedRankId) || ranks[0];
    return `╔═══━━━── • ──━━━═══╗
🔥 EMPIRE SMP RANKS 👑 🔥
╚═══━━━── • ──━━━═══╝

💎 ⚡ PURCHASE TICKET: #${t.id} ⚡ 💎
━━━━━━━━━━━━━━━━━━
🎮 Minecraft Username: ${t.minecraftUsername}
💬 Discord Username: ${t.discordTag}
👑 Chosen Rank: ${rank.name} (Price: ₹${rank.price})
💳 Preferred Payment: UPI / PayPal
━━━━━━━━━━━━━━━━━━
📩 TICKET GENERATED SECURELY VIA WEBSTORE
🔥 EMPIRE SMP TEAM 🔥
╚═══━━━── • ──━━━═══╝`;
  };

  const copyDiscordText = (t: SupportTicket) => {
    const text = generateDiscordCopyText(t);
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Column 1: Ticket Creator & Ticket List (Left, Span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Ticket Creator Form */}
        <div className="bg-[#0a0a0a] border-2 border-neutral-850 p-6 shadow-2xl relative rounded-none">
          <h3 className="font-plus text-xs text-amber-500 tracking-widest mb-4 uppercase flex items-center gap-2 font-black">
            <Ticket size={16} className="text-amber-500 animate-pulse" />
            <span>Create Ticket To Buy</span>
          </h3>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-neutral-400 text-[10px] font-mono mb-1.5 uppercase tracking-wider font-bold">Minecraft Username</label>
              <input
                type="text"
                placeholder="e.g. MinerKing77"
                required
                value={mcUsername}
                onChange={(e) => setMcUsername(e.target.value)}
                className="w-full bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-sm text-lime-400 focus:outline-none focus:border-amber-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[10px] font-mono mb-1.5 uppercase tracking-wider font-bold">Discord Tag</label>
              <input
                type="text"
                placeholder="e.g. mineking#1234"
                required
                value={discordTag}
                onChange={(e) => setDiscordTag(e.target.value)}
                className="w-full bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-400 text-[10px] font-mono mb-1.5 uppercase tracking-wider font-bold">Select Target Rank</label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {ranks.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#0a0a0a]">
                    {r.emoji} {r.name} - ₹{r.price}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black font-plus text-xs tracking-widest rounded-none border-b-4 border-amber-700 active:border-b-0 active:scale-95 transition-all text-center uppercase cursor-pointer shadow-md"
            >
              🚀 Generate Order Ticket
            </button>
          </form>
        </div>

        {/* Existing active tickets */}
        <div className="bg-[#0a0a0a] border-2 border-neutral-850 p-6 shadow-2xl rounded-none">
          <h3 className="font-plus text-[10px] text-neutral-400 uppercase tracking-widest mb-3.5 flex items-center justify-between font-black">
            <span>Your Active Tickets</span>
            <span className="font-mono bg-[#111] px-2 py-0.5 rounded-none text-xs text-amber-500 font-bold border border-neutral-800">{tickets.length}</span>
          </h3>

          {tickets.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-neutral-800 rounded-none text-neutral-500 text-xs">
              <FileText className="mx-auto mb-2 text-neutral-600 animate-pulse" size={24} />
              <p className="font-plus text-[10px] uppercase font-black tracking-wider text-neutral-400">No active tickets</p>
              <p className="mt-1 text-[9px] font-mono">Your billing tickets will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {tickets.map(t => {
                const rank = ranks.find(r => r.id === t.selectedRankId) || ranks[0];
                const isActive = t.id === activeTicketId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`p-3 rounded-none border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive 
                        ? 'bg-neutral-900/80 border-amber-500' 
                        : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-amber-500 font-black">{t.id}</span>
                        <span className="text-[10px] font-mono text-lime-400 bg-emerald-950/10 px-1 py-0.2 select-none font-bold">
                          {t.minecraftUsername}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-350 font-bold font-plus uppercase">Selected: {rank.name}</p>
                      <p className="text-[9px] text-neutral-500 font-mono">Created: {t.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-none font-black uppercase ${
                        t.status === 'Open' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : t.status === 'Processing'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {t.status}
                      </span>
                      <button
                        onClick={(e) => deleteTicket(t.id, e)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
                        title="Close Ticket"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Messaging portal & Copyable Discord codes (Right, Span 7) */}
      <div className="lg:col-span-7">
        {activeTicket ? (
          <div className="bg-[#0a0a0a] border-2 border-neutral-850 shadow-2xl overflow-hidden flex flex-col h-[540px] rounded-none">
            {/* Header info bar */}
            <div className="bg-[#111] px-5 py-4 border-b-2 border-neutral-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-none text-neutral-950 font-black font-plus text-xs">
                  EMP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-plus text-xs font-black text-white uppercase italic">LOCKED TICKET {activeTicket.id}</h4>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-400">
                    User: <span className="text-lime-450 font-bold">{activeTicket.minecraftUsername}</span> | Discord: <span className="text-amber-400">{activeTicket.discordTag}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPhonePeQR(!showPhonePeQR)}
                  className={`px-3 py-1.5 rounded-none text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer uppercase border transition-all ${
                    showPhonePeQR 
                      ? 'bg-purple-600 border-purple-500 text-white hover:bg-purple-500 animate-pulse' 
                      : 'bg-[#5f259f]/10 border-[#5f259f]/20 text-purple-400 hover:bg-[#5f259f]/20'
                  }`}
                >
                  <span>💳 {showPhonePeQR ? 'Hide QR Code' : 'Scan PhonePe QR'}</span>
                </button>
                <button
                  onClick={() => copyDiscordText(activeTicket)}
                  className="px-3 py-1.5 rounded-none bg-[#0a0a0a] hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[10px] font-mono text-amber-500 font-bold flex items-center gap-1.5 cursor-pointer uppercase"
                >
                  {copiedCode ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedCode ? 'Copied' : 'Discord Payload'}</span>
                </button>
              </div>
            </div>

            {/* Custom Split Messenger Screen with slide-out PhonePe helper */}
            <div className="flex-grow flex overflow-hidden relative">
              {/* Simulated Live Chat Messaging Window */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-[#050505]">
                {activeTicket.messages.map((m) => {
                  if (m.isSystem) {
                    return (
                      <div key={m.id} className="text-center">
                        <span className="inline-block px-3 py-1 bg-[#111] border-2 border-neutral-900 text-neutral-400 rounded-none text-[9px] font-mono uppercase tracking-wider">
                          {m.text}
                        </span>
                      </div>
                    );
                  }

                  const isStaff = m.sender === 'staff';
                  return (
                    <div key={m.id} className={`flex gap-3 max-w-[85%] ${isStaff ? '' : 'ml-auto flex-row-reverse'}`}>
                      <div className={`p-2 rounded-none flex-shrink-0 ${isStaff ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-lime-500/10 border border-lime-500/20 text-lime-400'}`}>
                        {isStaff ? <Bot size={16} /> : <Shield size={16} />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-255 font-plus uppercase">
                            {isStaff ? '💎 Deral (SMP Administrator)' : activeTicket.minecraftUsername}
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono">{m.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-none text-xs leading-relaxed border ${
                          isStaff ? 'bg-[#111] border-neutral-900 text-neutral-300' : 'bg-neutral-900 border-neutral-850 text-white'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="p-2 rounded-none bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Bot size={16} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-neutral-400">Deral is typing...</span>
                      <div className="p-3 bg-[#111] border border-neutral-900 rounded-none text-neutral-500 text-xs flex gap-1">
                        <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                        <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Side slide-out PhonePe QR Code helper panel */}
              {showPhonePeQR && (
                <div className="w-[305px] border-l-2 border-neutral-900 bg-neutral-950 p-4 shrink-0 overflow-y-auto flex flex-col items-center space-y-4 shadow-xl z-10">
                  <div className="flex justify-between items-center w-full pb-2 border-b border-neutral-850">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">💳 Scan Live QR Code</span>
                    <button 
                      onClick={() => setShowPhonePeQR(false)} 
                      className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      title="Hide QR code panel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="w-full scale-90 origin-top">
                    {(() => {
                      const activeRank = ranks.find(r => r.id === activeTicket.selectedRankId) || ranks[0];
                      return <PhonePeCard price={activeRank.price} />;
                    })()}
                  </div>

                  <div className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-none text-[9px] font-mono text-neutral-400 leading-normal w-full">
                    <p className="text-emerald-400 font-bold uppercase mb-1">📋 PAYMENT INSTRUCTIONS</p>
                    Scan using any GPay / PhonePe UPI app. After sending the money, paste the transaction reference ID in the chat and Deral will authorize it immediately.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions buttons */}
            <div className="bg-[#111] p-2 border-t-2 border-neutral-900 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMessageText("I would like to pay via UPI / GPay please.");
                  setShowPhonePeQR(true);
                }}
                className="px-2.5 py-1 text-[9px] bg-[#050505] border border-neutral-800 text-neutral-300 rounded-none hover:border-amber-500 transition-colors cursor-pointer uppercase font-mono tracking-wider"
              >
                💳 UPI GPay Help
              </button>
              <button
                type="button"
                onClick={() => setMessageText("Do you support international PayPal transactions?")}
                className="px-2.5 py-1 text-[9px] bg-[#050505] border border-neutral-800 text-neutral-300 rounded-none hover:border-amber-500 transition-colors cursor-pointer uppercase font-mono tracking-wider"
              >
                🌍 PayPal Invoice
              </button>
              <button
                type="button"
                onClick={() => setMessageText("I have completed the payment, what should I do next?")}
                className="px-2.5 py-1 text-[9px] bg-[#050505] border border-neutral-800 text-neutral-300 rounded-none hover:border-amber-500 transition-colors cursor-pointer uppercase font-mono tracking-wider"
              >
                ✅ Done Payment
              </button>
            </div>

            {/* Messaging Form input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a0a] border-t-2 border-neutral-900 flex gap-2.5">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask Owner about UPI transfer details, verification, etc..."
                className="flex-grow bg-[#050505] border-2 border-neutral-900 rounded-none py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="p-2.5 bg-amber-500 hover:bg-amber-400 rounded-none text-neutral-950 font-extrabold cursor-pointer active:scale-95 transition-all text-sm flex items-center justify-center shadow-md"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border-2 border-neutral-850 rounded-none h-[540px] flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Ticket size={48} className="text-neutral-700 animate-pulse" />
            <h4 className="font-plus text-xs text-neutral-300 uppercase tracking-widest font-black italic">No Active Ticket Selected</h4>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Please design and create your purchase ticket using the form on the left. A live support panel and virtual staff session will spawn here!
            </p>
            <div className="pt-2">
              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/5 px-3 py-1.5 rounded-none border border-amber-500/20 uppercase tracking-widest font-bold">
                ⭐ RECOMMENDED FAST PAYMENT VERIFICATION
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
