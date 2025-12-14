export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum InterestType {
  DATING = 'Namoro',
  NETWORKING = 'Networking',
  FRIENDSHIP = 'Amizade',
  MENTORSHIP = 'Mentoria',
  ACTIVITY_PARTNER = 'Parceiro de Atividades'
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  bio?: string; // Added Bio for profile editing
  avatarUrl?: string; // Added Avatar URL for profile photo
  role: UserRole;
  isPremium: boolean;
  country?: string;
  language?: string;
  location?: string;
  primaryInterest?: InterestType;
  questionnaireAnswers?: Record<string, string>;
  createdAt: Date;
}

export interface CompatibilityMetric {
  subject: string;
  A: number; // User score (or Match score normalized)
  fullMark: number;
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  compatibilityScore: number;
  interestType: InterestType;
  avatarUrl: string;
  isNew: boolean;
  matchReasoning?: string; // Stores the "Why" we matched them
  compatibilityDetails?: CompatibilityMetric[]; // NEW: For Radar Chart
  // Private fields revealed only on mutual agreement
  instagram?: string;
  phoneNumber?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

export interface DashboardStats {
  totalMatches: number;
  successfulMatches: number;
  rejectedMatches: number;
  revenue: number;
  activeUsers: number;
  waitingListCount: number;
  aiTokensUsed: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  label?: string;
}