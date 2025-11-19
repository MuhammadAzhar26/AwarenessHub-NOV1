export enum ScenarioType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SEARCH = 'SEARCH',
  VOICE = 'VOICE', // New for Vishing
  AUTH = 'AUTH',   // New for MFA/Login
}

export enum PhishingType {
  GENERAL = 'General Phishing',
  SPEAR = 'Spear Phishing',
  WHALING = 'Whaling',
  SEO = 'SEO Poisoning',
  SMISHING = 'Smishing',
  RANSOMWARE = 'Ransomware / Malware',
  VISHING = 'Vishing (Voice Phishing)',
  QUISHING = 'Quishing (QR Phishing)',
  MFA_FATIGUE = 'MFA Fatigue / Bombing',
  BEC = 'Business Email Compromise',
  NONE = 'Not Phishing',
}

export enum DefenseType {
  THINK = 'Think! (Is it too good to be true?)',
  DONT_CLICK = "Don't Click! (Verify sender/URL)",
  PATCH = 'Patch Systems',
  ANTIVIRUS = 'Use Antivirus/EDR',
  EMAIL_SCRUB = 'Use Email Scrub',
  SECURE_DNS = 'Use Secure DNS',
  BACKUP = 'Maintain Offline Backups',
  VERIFY_MFA = 'Verify Login Request / Deny Unknown',
  HANG_UP = 'Hang Up & Call Official Number',
}

export enum SocialTactic {
  URGENCY = 'URGENCY',
  FEAR = 'FEAR',
  GREED = 'GREED',
  AUTHORITY = 'AUTHORITY',
  CURIOSITY = 'CURIOSITY',
  FAMILIARITY = 'FAMILIARITY',
  TRUST = 'TRUST',
  NONE = 'NONE'
}

export enum SimulationModule {
  ALL = 'ALL',
  EMAIL_DEFENSE = 'EMAIL_DEFENSE',
  MOBILE_SECURITY = 'MOBILE_SECURITY',
  WEB_MALWARE = 'WEB_MALWARE',
  IDENTITY_AUTH = 'IDENTITY_AUTH',
  SOCIAL_ENG = 'SOCIAL_ENG',
  RANSOMWARE = 'RANSOMWARE' // New Module
}

export interface Attachment {
  name: string;
  size: string;
  type: 'PDF' | 'DOC' | 'ZIP' | 'EXE' | 'IMG';
}

export interface RiskPoint {
  location: 'SENDER' | 'SUBJECT' | 'BODY' | 'ATTACHMENT';
  text: string;
}

export interface ScenarioContent {
  // Email specific
  sender?: string;
  senderEmail?: string;
  subject?: string;
  body?: string;
  attachment?: Attachment;
  
  // SMS / Voice specific
  phoneNumber?: string;
  message?: string; // Used for Voice Transcript too

  // Search / Web specific
  searchQuery?: string;
  results?: Array<{
    title: string;
    url: string;
    snippet: string;
    isMalicious?: boolean;
  }>;
}

export interface Scenario {
  id: string;
  type: ScenarioType;
  content: ScenarioContent;
  isPhishing: boolean;
  correctPhishingType: PhishingType;
  correctDefense: DefenseType;
  socialTactic: SocialTactic;
  explanation: string;
  indicator: string; 
  riskPoints?: RiskPoint[];
}