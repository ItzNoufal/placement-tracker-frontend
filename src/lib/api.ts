import { Application, ApplicationStatus, Interview, FeedbackEntry, CompanyDrive } from '@/types';
import { applicationsList, upcomingInterviews } from '@/data/mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const SESSION_KEY = 'placement-tracker-session';

export type Session = {
  studentId: number;
  fullName: string;
  email: string;
  accessToken: string;
};

type ApiCompany = {
  id: number;
  name: string;
  website: string | null;
  location: string | null;
};

type ApiApplication = {
  id: number;
  studentId: number;
  companyId: number;
  companyName: string;
  role: string;
  status: string;
  appliedDate: string | null;
  notes: string | null;
};

export type ApiInterview = {
  id: number | string;
  studentId?: number;
  companyName: string;
  role: string;
  roundName: string;
  date: string;
  timeSlot: string;
  format: 'Online' | 'In-Person';
  status: 'Confirmed' | 'Conflict Alert' | 'Completed' | 'Pending';
  platform?: string;
  interviewer?: string;
};

export type ApiFeedback = {
  id: number | string;
  studentId?: number;
  company: string;
  roundType: string;
  overallRating: number;
  strengths: string[];
  improvements: string[];
  evaluatorNote: string;
  date: string;
};

export function saveSession(session: Session) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Session;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return getSession() !== null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('auth-change'));
  }
}

export function getCurrentUser(): { name: string; email: string; studentId: number } | null {
  const session = getSession();
  if (!session) {
    return {
      name: 'Rohan Verma',
      email: 'rohan.verma@university.edu',
      studentId: 1084,
    };
  }
  return {
    name: session.fullName || 'Student User',
    email: session.email || '',
    studentId: session.studentId,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = typeof window === 'undefined' ? null : getSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed (${response.status})`);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

export async function login(email: string, password: string): Promise<Session> {
  const session = await request<Session>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(session);
  return session;
}

export async function signup(fullName: string, email: string, password: string): Promise<Session> {
  const session = await request<Session>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  saveSession(session);
  return session;
}

function backendStatus(status: ApplicationStatus) {
  return (
    {
      Applied: 'APPLIED',
      Shortlisted: 'ONLINE_ASSESSMENT',
      Interviewing: 'INTERVIEW',
      Selected: 'OFFER',
      Archived: 'WITHDRAWN',
      'Conflict Alert': 'INTERVIEW',
    }[status] ?? 'APPLIED'
  );
}

function frontendStatus(status: string): ApplicationStatus {
  return (
    {
      WISHLIST: 'Applied',
      APPLIED: 'Applied',
      ONLINE_ASSESSMENT: 'Shortlisted',
      INTERVIEW: 'Interviewing',
      OFFER: 'Selected',
      REJECTED: 'Archived',
      WITHDRAWN: 'Archived',
    }[status] as ApplicationStatus ?? 'Applied'
  );
}

function toApplication(application: ApiApplication): Application {
  return {
    id: String(application.id),
    reqId: `APP-${application.id}`,
    company: application.companyName,
    role: application.role,
    logoIcon: 'business',
    ctc: 'Tracked in profile',
    ctcBreakdown: 'Standard campus package',
    appliedDate: application.appliedDate ?? 'Recently Applied',
    driveType: 'Campus Drive',
    nextStep: application.status === 'INTERVIEW' ? 'Interview Round' : application.status === 'OFFER' ? 'Offer Letter' : 'Under Review',
    status: frontendStatus(application.status),
    tags: application.notes
      ? application.notes
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : ['Placement Track'],
  };
}

// ----------------------------------------------------
// APPLICATIONS
// ----------------------------------------------------
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<void> {
  const session = getSession();
  const key = session ? `user_apps_${session.studentId}` : 'demo_user_apps';

  // 1. ALWAYS update local storage first so changes are immediately persisted
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    let list: Application[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch {
        list = [...applicationsList];
      }
    } else {
      list = [...applicationsList];
    }

    const updated = list.map((a) =>
      String(a.id) === String(id)
        ? {
            ...a,
            status,
            statusDetail: status === 'Selected' ? 'Offer Extended 🎉' : a.statusDetail,
            nextStep: status === 'Selected' ? 'Offer Letter Verified & Accepted' : a.nextStep,
          }
        : a
    );
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem('demo_user_apps', JSON.stringify(updated));

    // Broadcast change across the whole app (Dashboard, Progress, Navbar, etc.)
    window.dispatchEvent(new CustomEvent('application-updated', { detail: { id, status } }));
    window.dispatchEvent(new Event('new-application-added'));
  }

  // 2. Sync with backend if available
  try {
    await request<unknown>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: backendStatus(status) }),
    });
  } catch {
    try {
      await request<unknown>(`/api/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: backendStatus(status) }),
      });
    } catch {
      // Local storage is already the source of truth
    }
  }
}

export async function getApplications(): Promise<Application[]> {
  const session = getSession();
  const key = session ? `user_apps_${session.studentId}` : 'demo_user_apps';

  try {
    const applications = await request<ApiApplication[]>('/api/applications');
    const mapped = applications.map(toApplication);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(mapped));
    }
    return mapped;
  } catch (err) {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(key);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore parse error
        }
      }
      localStorage.setItem(key, JSON.stringify(applicationsList));
      return applicationsList;
    }
    return applicationsList;
  }
}

export async function createApplicationFromDraft(draft: Application): Promise<Application> {
  const session = getSession();
  const key = session ? `user_apps_${session.studentId}` : 'demo_user_apps';

  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem(key);
    let apps: Application[] = [];
    if (existing) {
      try {
        apps = JSON.parse(existing);
      } catch {
        apps = [...applicationsList];
      }
    } else {
      apps = [...applicationsList];
    }
    apps = [draft, ...apps.filter((a) => a.id !== draft.id)];
    localStorage.setItem(key, JSON.stringify(apps));
    localStorage.setItem('demo_user_apps', JSON.stringify(apps));
    window.dispatchEvent(new Event('new-application-added'));
  }

  try {
    const companies = await request<ApiCompany[]>('/api/companies');
    let company = companies.find(
      (candidate) => candidate.name.toLowerCase() === draft.company.toLowerCase()
    );
    if (!company) {
      company = await request<ApiCompany>('/api/companies', {
        method: 'POST',
        body: JSON.stringify({ name: draft.company, website: null, location: null }),
      });
    }
    const application = await request<ApiApplication>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({
        companyId: company.id,
        role: draft.role,
        status: backendStatus(draft.status),
        appliedDate: new Date().toISOString().slice(0, 10),
        notes: draft.tags.join(', '),
      }),
    });
    return toApplication(application);
  } catch (err) {
    return draft;
  }
}

// ----------------------------------------------------
// COMPANIES
// ----------------------------------------------------
export async function getCompanies(): Promise<ApiCompany[]> {
  try {
    return await request<ApiCompany[]>('/api/companies');
  } catch (err) {
    return [];
  }
}

export async function createCompany(companyData: { name: string; website?: string; location?: string }): Promise<ApiCompany> {
  return request<ApiCompany>('/api/companies', {
    method: 'POST',
    body: JSON.stringify(companyData),
  });
}

// ----------------------------------------------------
// INTERVIEWS & CLASH GUARD
// ----------------------------------------------------
export async function getInterviews(): Promise<Interview[]> {
  try {
    const data = await request<ApiInterview[]>('/api/interviews');
    return data.map((item) => ({
      id: String(item.id),
      company: item.companyName,
      role: item.role,
      roundName: item.roundName,
      date: item.date,
      timeSlot: item.timeSlot,
      format: item.format,
      status: item.status,
      platform: item.platform,
      interviewer: item.interviewer,
    }));
  } catch {
    const session = getSession();
    const key = session ? `user_interviews_${session.studentId}` : 'demo_user_interviews';
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (stored) return JSON.parse(stored);
    if (!session && typeof window !== 'undefined') {
      const initialIntvs: Interview[] = upcomingInterviews.map((item) => ({
        id: item.id,
        company: item.company,
        role: item.role || 'Software Engineer',
        roundName: item.roundName,
        date: item.date,
        timeSlot: item.timeSlot,
        format: item.platform.toLowerCase().includes('campus') ? 'In-Person' : 'Online',
        status: item.hasClash ? 'Conflict Alert' : 'Confirmed',
        platform: item.platform,
        interviewer: item.interviewer,
      }));
      localStorage.setItem('demo_user_interviews', JSON.stringify(initialIntvs));
      return initialIntvs;
    }
    return [];
  }
}

export async function saveInterview(interview: Interview): Promise<Interview> {
  try {
    const created = await request<ApiInterview>('/api/interviews', {
      method: 'POST',
      body: JSON.stringify({
        companyName: interview.company,
        role: interview.role,
        roundName: interview.roundName,
        date: interview.date,
        timeSlot: interview.timeSlot,
        format: interview.format,
        status: interview.status,
        platform: interview.platform,
        interviewer: interview.interviewer,
      }),
    });
    return {
      ...interview,
      id: String(created.id),
    };
  } catch {
    const session = getSession();
    const key = session ? `user_interviews_${session.studentId}` : 'demo_user_interviews';
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const list: Interview[] = stored ? JSON.parse(stored) : [];
    const updated = [interview, ...list.filter((i) => i.id !== interview.id)];
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(updated));
    }
    return interview;
  }
}

export async function deleteInterview(id: string): Promise<void> {
  try {
    await request<void>(`/api/interviews/${id}`, { method: 'DELETE' });
  } catch {
    // If backend offline, remove from local storage
    const session = getSession();
    const key = session ? `user_interviews_${session.studentId}` : 'demo_user_interviews';
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (stored) {
      const list: Interview[] = JSON.parse(stored);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(list.filter((i) => i.id !== id)));
      }
    }
  }
}

// ----------------------------------------------------
// FEEDBACK & DEBRIEFS
// ----------------------------------------------------
export async function getFeedbackEntries(): Promise<FeedbackEntry[]> {
  try {
    const data = await request<ApiFeedback[]>('/api/feedback');
    return data.map((f) => ({
      id: String(f.id),
      company: f.company,
      roundType: f.roundType,
      overallRating: f.overallRating,
      strengths: f.strengths,
      improvements: f.improvements,
      evaluatorNote: f.evaluatorNote,
      date: f.date,
    }));
  } catch {
    const session = getSession();
    if (!session) return [];
    const key = `user_feedback_${session.studentId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveFeedback(entry: FeedbackEntry): Promise<FeedbackEntry> {
  try {
    const created = await request<ApiFeedback>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return {
      ...entry,
      id: String(created.id),
    };
  } catch {
    const session = getSession();
    if (session) {
      const key = `user_feedback_${session.studentId}`;
      const stored = localStorage.getItem(key);
      const list: FeedbackEntry[] = stored ? JSON.parse(stored) : [];
      const updated = [entry, ...list.filter((f) => f.id !== entry.id)];
      localStorage.setItem(key, JSON.stringify(updated));
    }
    return entry;
  }
}
