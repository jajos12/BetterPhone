export type UserRole = 'PARENT' | 'CHILD';

export interface AppUsage {
  appName: string;
  minutes: number;
  limitMinutes?: number;
  icon: string;
  color: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'away' | 'at_school' | 'offline';
  location?: { lat: number; lng: number; address: string };
  isOutsideSafeZone?: boolean;
  screenTimeUsed: number; // in minutes
  screenTimeLimit: number; // in minutes
  appUsage?: AppUsage[];
  batteryLevel?: number;
  isCharging?: boolean;
  deviceStatus?: 'silent' | 'vibrate' | 'loud';
  downtime?: {
    start: string; // "21:00"
    end: string; // "07:00"
    enabled: boolean;
  };
  contentSettings?: {
    strictMode: boolean;
    socialMedia: boolean;
    games: boolean;
    adultContent: boolean;
  };
}

export interface RequestItem {
  id: string;
  childId: string;
  childName: string;
  childAvatar: string;
  type: 'APP_TIME' | 'APP_INSTALL' | 'WEBSITE';
  title: string;
  details: string;
  timestamp: number;
}

export interface AlertItem {
  id: string;
  childId: string;
  childName: string;
  type: 'CONTENT' | 'SOCIAL' | 'LOCATION' | 'SYSTEM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'BULLYING' | 'DEPRESSION' | 'SELF_HARM' | 'SEXUAL_CONTENT' | 'VIOLENCE' | 'PROFANITY' | 'OTHER';
  title: string;
  snippet?: string; // The actual message content
  timestamp: string; // e.g. "12m ago"
  expertTip?: string; // Advice for parents
  appIcon?: string; // e.g. "fa-brands fa-instagram"
  conversationContext?: {
    sender: string;
    text: string;
    isChild: boolean;
    timestamp: string;
  }[];
}

export interface MonitoredApp {
  id: string;
  name: string;
  icon: string;
  status: 'CONNECTED' | 'NEEDS_AUTH' | 'NOT_CONNECTED';
  lastSync?: string;
  issuesDetected?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAI?: boolean;
}

export enum AppSection {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  TRACKER = 'TRACKER',
  SAFETY = 'SAFETY',
  AI_CHAT = 'AI_CHAT',
  CHECKOUT = 'CHECKOUT',
  PROFILE = 'PROFILE',
  USAGE_DETAILS = 'USAGE_DETAILS'
}

export type OnboardingStep = 
  | 'WELCOME' 
  | 'PROFILE' 
  | 'DEVICES' 
  | 'APPS' 
  | 'GOOGLE_LINK' 
  | 'CONNECT_DEVICE' 
  | 'SUBSCRIPTION';