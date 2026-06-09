export interface Rank {
  id: string;
  name: string;
  price: number;
  badge: string;
  tier: string;
  tagline: string;
  perks: string[];
  kit: {
    title: string;
    items: string[];
  };
  color: string;
  borderColor: string;
  glowColor: string;
  bgTexture?: string;
  ability?: string;
  emoji: string;
}

export interface CartItem {
  rank: Rank;
  quantity: number;
  username: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'staff';
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface SupportTicket {
  id: string;
  minecraftUsername: string;
  discordTag: string;
  selectedRankId: string;
  createdAt: string;
  status: 'Open' | 'Processing' | 'Completed' | 'Closed';
  messages: TicketMessage[];
}

export interface ServerStatus {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  ip: string;
  port?: string;
}
