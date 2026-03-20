export type UserRole = "STUDENT" | "PROFESSOR";
export type SubmissionStatus =
  | "PENDING"
  | "UPLOADING"
  | "QUEUED"
  | "BUILDING"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "TIMEOUT"
  | "CANCELED";

export type Environment = "NODE" | "REACT" | "JAVA";
export type YearLevel = "YEAR_1" | "YEAR_2" | "YEAR_3" | "YEAR_4";

type AuditReport = {
  eslintIssues: number;
  snykIssues: number;
  summary: string;
};

type ClassInfo = {
  id: string;
  name: string;
  section: string;
  yearLevel: YearLevel;
  inviteCode: string;
  professorId: string;
  studentCount: number;
  activeActivities: number;
};

type ActivityInfo = {
  id: string;
  classId: string;
  title: string;
  dueAt: string;
  submissionCount: number;
  healthAvg: number;
};

type TimelineItem = {
  id: string;
  classId: string;
  activityId: string;
  title: string;
  dueAt: string;
  status: SubmissionStatus;
  submissionId?: string;
  professorScore?: number;
  professorComment?: string;
};

type MatrixRow = {
  studentId: string;
  studentName: string;
  lastHealthScore: number;
  cells: {
    submissionId: string;
    status: SubmissionStatus;
    healthScore: number;
  }[];
};

type SandboxRun = {
  id: string;
  studentName: string;
  className: string;
  activityTitle: string;
  status: SubmissionStatus;
  submissionId: string;
};

type RosterEntry = {
  studentId: string;
  studentName: string;
  status: "ACTIVE" | "INACTIVE";
  lastActivity?: string;
};

export const mockData = {
  currentUser: {
    id: "u_prof_1",
    email: "prof@dock0de.edu",
    displayName: "Dr. Kay",
    role: "PROFESSOR" as UserRole,
  },
  professorMetrics: {
    activeClasses: 3,
    submissionsNeedingReview: 12,
    dockerEngineHealthy: true,
  },
  studentMetrics: {
    enrolledClasses: 2,
    pendingGrades: 2,
    upcomingActivities: 3,
  },
  classes: [
    {
      id: "class_1",
      name: "CS301",
      section: "A",
      yearLevel: "YEAR_3" as YearLevel,
      inviteCode: "582104",
      professorId: "u_prof_1",
      studentCount: 28,
      activeActivities: 3,
    },
    {
      id: "class_2",
      name: "CS201",
      section: "B",
      yearLevel: "YEAR_2" as YearLevel,
      inviteCode: "611204",
      professorId: "u_prof_1",
      studentCount: 24,
      activeActivities: 2,
    },
    {
      id: "class_3",
      name: "CS101",
      section: "C",
      yearLevel: "YEAR_1" as YearLevel,
      inviteCode: "190442",
      professorId: "u_prof_1",
      studentCount: 32,
      activeActivities: 4,
    },
  ] as ClassInfo[],
  studentEnrollments: [
    { classId: "class_1" },
    { classId: "class_2" },
  ],
  activities: [
    {
      id: "act_1",
      classId: "class_1",
      title: "Week 3 Lab",
      dueAt: "2026-03-28T12:00:00.000Z",
      submissionCount: 22,
      healthAvg: 86,
    },
    {
      id: "act_2",
      classId: "class_1",
      title: "Week 4 API",
      dueAt: "2026-04-05T12:00:00.000Z",
      submissionCount: 18,
      healthAvg: 82,
    },
    {
      id: "act_3",
      classId: "class_1",
      title: "Week 5 React",
      dueAt: "2026-04-12T12:00:00.000Z",
      submissionCount: 10,
      healthAvg: 79,
    },
    {
      id: "act_4",
      classId: "class_2",
      title: "Week 2 CLI",
      dueAt: "2026-03-26T12:00:00.000Z",
      submissionCount: 20,
      healthAvg: 88,
    },
  ] as ActivityInfo[],
  studentTimeline: [
    {
      id: "tl_1",
      classId: "class_1",
      activityId: "act_1",
      title: "Week 3 Lab",
      dueAt: "2026-03-28T12:00:00.000Z",
      status: "SUCCESS" as SubmissionStatus,
      submissionId: "sub_123",
      professorScore: 92,
      professorComment: "Nice structure. Fix lint warnings.",
    },
    {
      id: "tl_2",
      classId: "class_1",
      activityId: "act_2",
      title: "Week 4 API",
      dueAt: "2026-04-05T12:00:00.000Z",
      status: "PENDING" as SubmissionStatus,
    },
    {
      id: "tl_3",
      classId: "class_2",
      activityId: "act_4",
      title: "Week 2 CLI",
      dueAt: "2026-03-26T12:00:00.000Z",
      status: "FAILED" as SubmissionStatus,
      submissionId: "sub_124",
      professorScore: 64,
      professorComment: "Missing README and test coverage.",
    },
  ] as TimelineItem[],
  classMetrics: {
    class_1: {
      completionRate: 0.78,
      topEslintErrors: [
        "no-unused-vars",
        "react-hooks/exhaustive-deps",
        "eqeqeq",
      ],
      runningContainers: 3,
    },
    class_2: {
      completionRate: 0.64,
      topEslintErrors: ["no-console", "no-undef", "prefer-const"],
      runningContainers: 2,
    },
    class_3: {
      completionRate: 0.52,
      topEslintErrors: ["no-alert", "no-var", "no-shadow"],
      runningContainers: 1,
    },
  } as Record<
    string,
    { completionRate: number; topEslintErrors: string[]; runningContainers: number }
  >,
  activityMatrix: {
    act_1: {
      activityId: "act_1",
      rows: [
        {
          studentId: "u_stud_1",
          studentName: "A. Student",
          lastHealthScore: 87,
          cells: [
            {
              submissionId: "sub_123",
              status: "SUCCESS" as SubmissionStatus,
              healthScore: 87,
            },
          ],
        },
        {
          studentId: "u_stud_2",
          studentName: "J. Rivera",
          lastHealthScore: 72,
          cells: [
            {
              submissionId: "sub_126",
              status: "PENDING" as SubmissionStatus,
              healthScore: 72,
            },
          ],
        },
      ] as MatrixRow[],
    },
  } as Record<string, { activityId: string; rows: MatrixRow[] }>,
  classRoster: {
    class_1: [
      { studentId: "u_stud_1", studentName: "A. Student", status: "ACTIVE", lastActivity: "Week 3 Lab" },
      { studentId: "u_stud_2", studentName: "J. Rivera", status: "ACTIVE", lastActivity: "Week 3 Lab" },
      { studentId: "u_stud_3", studentName: "M. Chen", status: "INACTIVE" },
    ],
    class_2: [
      { studentId: "u_stud_4", studentName: "R. Singh", status: "ACTIVE", lastActivity: "Week 2 CLI" },
      { studentId: "u_stud_5", studentName: "K. Patel", status: "ACTIVE" },
    ],
    class_3: [
      { studentId: "u_stud_6", studentName: "T. Nguyen", status: "ACTIVE" },
      { studentId: "u_stud_7", studentName: "S. Lopez", status: "ACTIVE" },
    ],
  } as Record<string, RosterEntry[]>,
  sandboxRuns: [
    {
      id: "sb_1",
      studentName: "A. Student",
      className: "CS301 A",
      activityTitle: "Week 3 Lab",
      status: "SUCCESS" as SubmissionStatus,
      submissionId: "sub_123",
    },
    {
      id: "sb_2",
      studentName: "J. Rivera",
      className: "CS301 A",
      activityTitle: "Week 3 Lab",
      status: "PENDING" as SubmissionStatus,
      submissionId: "sub_126",
    },
    {
      id: "sb_3",
      studentName: "A. Student",
      className: "CS201 B",
      activityTitle: "Week 2 CLI",
      status: "FAILED" as SubmissionStatus,
      submissionId: "sub_124",
    },
  ] as SandboxRun[],
  auditReports: {
    sub_123: {
      eslintIssues: 3,
      snykIssues: 1,
      summary: "3 ESLint warnings, 1 vulnerability",
    },
    sub_124: {
      eslintIssues: 6,
      snykIssues: 2,
      summary: "6 ESLint warnings, 2 vulnerabilities",
    },
    "new-id": {
      eslintIssues: 2,
      snykIssues: 0,
      summary: "2 ESLint warnings, 0 vulnerabilities",
    },
  } as Record<string, AuditReport>,
  systemLogs: {
    sub_123: [
      "Installing dependencies...",
      "Starting dev server...",
      "Build complete.",
    ],
    sub_124: [
      "Installing dependencies...",
      "Build failed: missing package.json",
    ],
    "new-id": [
      "Extracting zip...",
      "Installing dependencies...",
      "Starting dev server...",
    ],
  } as Record<string, string[]>,
  environments: [
    { value: "REACT", label: "React/Vite" },
    { value: "NODE", label: "Node.js" },
    { value: "JAVA", label: "Java" },
  ] as { value: Environment; label: string }[],
};
