const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN";
export type SubmissionStatus =
  | "PENDING"
  | "UPLOADING"
  | "QUEUED"
  | "BUILDING"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "TIMEOUT"
  | "CANCELED"
  | "MISSING";

export type Environment = "NODE" | "REACT" | "JAVA";
export type YearLevel = "YEAR_1" | "YEAR_2" | "YEAR_3" | "YEAR_4";

export type ProfessorMetrics = {
  activeClasses: number;
  submissionsNeedingReview: number;
  dockerEngineHealthy: boolean;
};

export type ClassInfo = {
  id: string;
  name: string;
  section: string;
  yearLevel: YearLevel;
  inviteCode: string;
  professorId: string;
  studentCount: number;
  activeActivities: number;
};

export type ActivityInfo = {
  id: string;
  classId: string;
  title: string;
  dueAt: string;
  maxScore: number;
  submissionCount: number;
  healthAvg: number;
};

export type RosterEntry = {
  studentId: string;
  studentName: string;
  status: "ACTIVE" | "INACTIVE";
  lastActivity?: string | null;
};

export type MatrixRow = {
  studentId: string;
  studentName: string;
  lastHealthScore: number;
  cells: {
    submissionId?: string | null;
    status: SubmissionStatus;
    healthScore?: number | null;
    submittedAt?: string | null;
    environment?: Environment | null;
  }[];
};

export type ActivityMatrix = {
  activityId: string;
  activityTitle?: string | null;
  classId?: string | null;
  rows: MatrixRow[];
};

export type TimelineItem = {
  id: string;
  classId: string;
  activityId: string;
  title: string;
  dueAt: string;
  status: SubmissionStatus;
  submissionId?: string | null;
  professorScore?: number | null;
  professorComment?: string | null;
};

export type UserInfo = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function login(email: string) {
  return postJson<{ ok: boolean; user?: UserInfo; message?: string }>(
    "/auth/login",
    { email }
  );
}

export function fetchProfessorMetrics(professorId?: string) {
  const query = professorId ? `?professorId=${encodeURIComponent(professorId)}` : "";
  return fetchJson<ProfessorMetrics>(`/professor/metrics${query}`);
}

export function fetchProfessorClasses(professorId?: string) {
  const query = professorId ? `?professorId=${encodeURIComponent(professorId)}` : "";
  return fetchJson<ClassInfo[]>(`/professor/classes${query}`);
}

export function fetchClassActivities(classId: string) {
  return fetchJson<ActivityInfo[]>(`/professor/classes/${classId}/activities`);
}

export function fetchClassStudents(classId: string) {
  return fetchJson<RosterEntry[]>(`/professor/classes/${classId}/students`);
}

export function fetchActivityMatrix(activityId: string) {
  return fetchJson<ActivityMatrix>(`/professor/activities/${activityId}/matrix`);
}

export function fetchStudentClasses(studentId: string) {
  return fetchJson<ClassInfo[]>(`/student/classes?studentId=${encodeURIComponent(studentId)}`);
}

export function fetchStudentActivities(classId: string, studentId: string) {
  const query = `?studentId=${encodeURIComponent(studentId)}`;
  return fetchJson<TimelineItem[]>(`/student/classes/${classId}/activities${query}`);
}
