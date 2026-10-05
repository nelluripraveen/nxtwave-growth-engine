// Types for the NxtWave AI Workshop Growth Engine

export interface Student {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  college: string;
  branch: string;
  graduationYear: number;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
  source: 'direct' | 'referral' | 'ambassador' | 'whatsapp_community' | 'college_email';
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  registrationCount: number;
  ambassadorCount?: number;
}

export interface Ambassador {
  id: string;
  name: string;
  college: string;
  referralCode: string;
  referralCount: number;
  rank?: number;
}

export interface Campaign {
  target: number;
  currentRegistrations: number;
  referralRegistrations: number;
  activeReferrers: number;
  colleges: number;
  averageReferrals: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'on_track' | 'needs_attention' | 'completed';
}

export interface DailyRegistration {
  day: number;
  date: string;
  count: number;
  cumulative: number;
}

export interface SourceBreakdown {
  source: string;
  count: number;
  color: string;
}

export interface MessageStyle {
  id: 'casual' | 'professional' | 'placement' | 'fun';
  label: string;
  icon: string;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  college: string;
  referralCode: string;
  referrals: number;
  isCurrentUser?: boolean;
}

export interface CollegeLeaderboardEntry {
  rank: number;
  name: string;
  registrations: number;
  maxRegistrations: number;
  percentage: number;
}
