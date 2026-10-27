import { Application, ApplicationStatus, Interview, FeedbackEntry, CompanyDrive } from '@/types';

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
  if (!session) return null;
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
  try {
    await request<unknown>(`/api/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: backendStatus(status) }),
    });
  } catch {
    // If backend offline, update in local storage
    const session = getSession();
    if (session) {
      const key = `user_apps_${session.studentId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const apps: Application[] = JSON.parse(stored);
        const updated = apps.map((a) => (a.id === id ? { ...a, status } : a));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    }
  }
}

export async function getApplications(): Promise<Application[]> {
  try {
    const applications = await request<ApiApplication[]>('/api/applications');
    return applications.map(toApplication);
  } catch (err) {
    const session = getSession();
    if (!session) return [];
    // User-specific storage key so logging out preserves this user's data on log back in
    const key = `user_apps_${session.studentId}`;
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : [];
  }
}

export async function createApplicationFromDraft(draft: Application): Promise<Application> {
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
    // If backend is offline or network error, persist in student's private persistent store
    const session = getSession();
    if (session) {
      const key = `user_apps_${session.studentId}`;
      const existing = localStorage.getItem(key);
      const apps: Application[] = existing ? JSON.parse(existing) : [];
      apps.unshift(draft);
      localStorage.setItem(key, JSON.stringify(apps));
    }
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
    if (!session) return [];
    const key = `user_interviews_${session.studentId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
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
    if (session) {
      const key = `user_interviews_${session.studentId}`;
      const stored = localStorage.getItem(key);
      const list: Interview[] = stored ? JSON.parse(stored) : [];
      const updated = [interview, ...list.filter((i) => i.id !== interview.id)];
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
    if (session) {
      const key = `user_interviews_${session.studentId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const list: Interview[] = JSON.parse(stored);
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
