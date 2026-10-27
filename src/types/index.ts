export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interviewing'
  | 'Selected'
  | 'Archived'
  | 'Conflict Alert';

export interface Application {
  id: string;
  reqId: string;
  company: string;
  role: string;
  logoIcon: string;
  ctc: string;
  ctcBreakdown: string;
  appliedDate: string;
  driveType: string;
  nextStep: string;
  status: ApplicationStatus;
  statusDetail?: string;
  tags: string[];
}

export interface InterviewRound {
  id: string;
  company: string;
  companyInitials: string;
  role?: string;
  roundName: string;
  roundNumber: number;
  date: string;
  timeSlot: string;
  durationMins?: number;
  platform: string;
  interviewer: string;
  hasClash?: boolean;
  clashingWith?: string;
  clashWith?: string;
  overlapDuration?: string;
  confirmed?: boolean;
  status?: 'Confirmed' | 'Conflict Alert' | 'Completed' | 'Pending';
  topics?: string;
  prepNotesUrl?: string;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  roundName: string;
  date: string;
  timeSlot: string;
  format: 'Online' | 'In-Person';
  status: 'Confirmed' | 'Conflict Alert' | 'Completed' | 'Pending';
  platform?: string;
  interviewer?: string;
}

export interface FeedbackEntry {
  id: string;
  company: string;
  roundType: string;
  overallRating: number;
  strengths: string[];
  improvements: string[];
  evaluatorNote: string;
  date: string;
}

export interface CompanyDrive {
  id: string;
  name: string;
  category: 'Tier-1 Dream' | 'Tier-2 Tech' | 'Fintech & Quant' | 'Consulting';
  industry: string;
  logoIcon: string;
  locations: string;
  rolesOpen: string[];
  ctcRange: string;
  eligibilityCgpa: number;
  status: 'Offer Extended & Selected' | 'Interviewing' | 'Drive Scheduled' | 'Applications Open';
  statusColor: 'primary' | 'secondary' | 'tertiary' | 'emerald';
  isPinned?: boolean;
}

export interface DebriefScorecard {
  id: string;
  company: string;
  logoUrl?: string;
  initials: string;
  roundType: 'System Design' | 'Coding & DS' | 'Concurrency & Architecture' | 'Behavioral' | 'Technical HR';
  evaluator: string;
  date: string;
  rating: number;
  recommendationTag: string;
  recommendationColor: 'primary' | 'secondary' | 'tertiary';
  highlightQuote: string;
  tags: string[];
  dimensions: {
    name: string;
    percentage: number;
    color: 'primary' | 'secondary' | 'tertiary';
  }[];
}

export interface MilestoneStage {
  stageNumber: string;
  title: string;
  metric: string;
  badge: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  highlight?: boolean;
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  degree: string;
  branch: string;
  gradYear: string;
  avatarUrl: string;
  cgpa: string;
  activeCycle: string;
}
