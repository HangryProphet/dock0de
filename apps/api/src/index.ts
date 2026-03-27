import Fastify from "fastify";
import cors from "@fastify/cors";
import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient, SubmissionStatus, UserRole, Environment } from "@prisma/client";

const app = Fastify({ logger: true });
const databasePath = path.resolve(process.cwd(), "..", "..", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${databasePath}` });
const prisma = new PrismaClient({ adapter });

await app.register(cors, { origin: true });

const defaultProfessorEmail = "prof@dock0de.edu";
const defaultStudentEmails = ["a.student@dock0de.edu", "j.rivera@dock0de.edu", "m.chen@dock0de.edu"];

async function ensureSeedData() {
  const userCount = await prisma.user.count();
  if (userCount > 0) return;

  const professor = await prisma.user.create({
    data: {
      email: defaultProfessorEmail,
      passwordHash: "seeded",
      role: UserRole.PROFESSOR,
      displayName: "Dr. Kay",
    },
  });

  const students = await prisma.user.createMany({
    data: defaultStudentEmails.map((email, index) => ({
      email,
      passwordHash: "seeded",
      role: UserRole.STUDENT,
      displayName: ["A. Student", "J. Rivera", "M. Chen"][index] ?? "Student",
    })),
  });

  const studentRecords = await prisma.user.findMany({
    where: { role: UserRole.STUDENT },
    orderBy: { createdAt: "asc" },
  });

  const classOne = await prisma.class.create({
    data: {
      name: "CS301",
      section: "A",
      yearLevel: "YEAR_3",
      inviteCode: "582104",
      professorId: professor.id,
    },
  });

  const classTwo = await prisma.class.create({
    data: {
      name: "CS201",
      section: "B",
      yearLevel: "YEAR_2",
      inviteCode: "611204",
      professorId: professor.id,
    },
  });

  const classThree = await prisma.class.create({
    data: {
      name: "CS101",
      section: "C",
      yearLevel: "YEAR_1",
      inviteCode: "190442",
      professorId: professor.id,
    },
  });

  await prisma.enrollment.createMany({
    data: [
      { classId: classOne.id, userId: studentRecords[0]?.id ?? "" },
      { classId: classOne.id, userId: studentRecords[1]?.id ?? "" },
      { classId: classOne.id, userId: studentRecords[2]?.id ?? "" },
      { classId: classTwo.id, userId: studentRecords[0]?.id ?? "" },
      { classId: classThree.id, userId: studentRecords[1]?.id ?? "" },
    ].filter((entry) => entry.userId),
  });

  const activityOne = await prisma.activity.create({
    data: {
      classId: classOne.id,
      title: "Week 3 Lab",
      description: "Intro lab work",
      dueAt: new Date("2026-03-28T12:00:00.000Z"),
      maxScore: 100,
    },
  });

  await prisma.activity.create({
    data: {
      classId: classOne.id,
      title: "Week 4 API",
      description: "API integration",
      dueAt: new Date("2026-04-05T12:00:00.000Z"),
      maxScore: 100,
    },
  });

  await prisma.activity.create({
    data: {
      classId: classTwo.id,
      title: "Week 2 CLI",
      description: "CLI fundamentals",
      dueAt: new Date("2026-03-26T12:00:00.000Z"),
      maxScore: 100,
    },
  });

  await prisma.activity.create({
    data: {
      classId: classThree.id,
      title: "Week 1 Basics",
      description: "Intro fundamentals",
      dueAt: new Date("2026-03-24T12:00:00.000Z"),
      maxScore: 100,
    },
  });

  await prisma.submission.createMany({
    data: [
      {
        userId: studentRecords[0]?.id ?? "",
        classId: classOne.id,
        activityId: activityOne.id,
        environment: Environment.REACT,
        status: SubmissionStatus.SUCCESS,
        assignmentName: activityOne.title,
        zipPath: "uploads/seed-1.zip",
        healthScore: 87,
        professorScore: 92,
        professorComment: "Nice structure. Fix lint warnings.",
      },
      {
        userId: studentRecords[1]?.id ?? "",
        classId: classOne.id,
        activityId: activityOne.id,
        environment: Environment.NODE,
        status: SubmissionStatus.PENDING,
        assignmentName: activityOne.title,
        zipPath: "uploads/seed-2.zip",
        healthScore: 72,
      },
    ].filter((entry) => entry.userId),
  });
}

app.get("/health", async () => ({ ok: true }));

app.get("/", async () => ({ message: "Dock0de API" }));

app.post("/auth/login", async (request) => {
  const body = request.body as { email?: string } | null;
  const email = body?.email ?? defaultProfessorEmail;
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return { ok: false, message: "User not found" };
  }
  return { ok: true, user };
});

app.get("/professor/metrics", async (request) => {
  const professorId = (request.query as { professorId?: string }).professorId;
  const classIds = await prisma.class.findMany({
    where: professorId ? { professorId } : undefined,
    select: { id: true },
  });
  const ids = classIds.map((item) => item.id);
  const activeClasses = ids.length;
  const submissionsNeedingReview = await prisma.submission.count({
    where: {
      classId: ids.length ? { in: ids } : undefined,
      status: SubmissionStatus.PENDING,
      isTestRun: false,
    },
  });
  return {
    activeClasses,
    submissionsNeedingReview,
    dockerEngineHealthy: true,
  };
});

app.get("/professor/classes", async (request) => {
  const professorId = (request.query as { professorId?: string }).professorId;
  const classes = await prisma.class.findMany({
    where: professorId ? { professorId } : undefined,
    orderBy: { createdAt: "asc" },
  });
  const classIds = classes.map((item) => item.id);
  const enrollmentCounts = await prisma.enrollment.groupBy({
    by: ["classId"],
    _count: { classId: true },
    where: { classId: { in: classIds } },
  });
  const activityCounts = await prisma.activity.groupBy({
    by: ["classId"],
    _count: { classId: true },
    where: { classId: { in: classIds } },
  });
  return classes.map((item) => ({
    id: item.id,
    name: item.name,
    section: item.section,
    yearLevel: item.yearLevel,
    inviteCode: item.inviteCode,
    professorId: item.professorId,
    studentCount:
      enrollmentCounts.find((entry) => entry.classId === item.id)?._count.classId ?? 0,
    activeActivities:
      activityCounts.find((entry) => entry.classId === item.id)?._count.classId ?? 0,
  }));
});

app.get("/professor/classes/:id/activities", async (request) => {
  const classId = (request.params as { id: string }).id;
  const activities = await prisma.activity.findMany({
    where: { classId },
    orderBy: { dueAt: "asc" },
  });
  const submissions = await prisma.submission.groupBy({
    by: ["activityId"],
    where: { classId, isTestRun: false },
    _count: { activityId: true },
    _avg: { healthScore: true },
  });
  return activities.map((activity) => {
    const summary = submissions.find((entry) => entry.activityId === activity.id);
    return {
      id: activity.id,
      classId: activity.classId,
      title: activity.title,
      dueAt: activity.dueAt.toISOString(),
      maxScore: activity.maxScore,
      submissionCount: summary?._count.activityId ?? 0,
      healthAvg: summary?._avg.healthScore ? Math.round(summary._avg.healthScore) : 0,
    };
  });
});

app.get("/professor/classes/:id/students", async (request) => {
  const classId = (request.params as { id: string }).id;
  const enrollments = await prisma.enrollment.findMany({
    where: { classId },
    include: { user: true },
  });
  const submissions = await prisma.submission.findMany({
    where: { classId, isTestRun: false },
    orderBy: { createdAt: "desc" },
    include: { activity: true },
  });
  return enrollments.map((entry) => {
    const latest = submissions.find((item) => item.userId === entry.userId);
    return {
      studentId: entry.userId,
      studentName: entry.user.displayName,
      status: "ACTIVE",
      lastActivity: latest?.activity?.title ?? null,
    };
  });
});

app.get("/professor/activities/:activityId/matrix", async (request) => {
  const activityId = (request.params as { activityId: string }).activityId;
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });
  if (!activity) {
    return { activityId, activityTitle: null, classId: null, rows: [] };
  }
  const enrollments = await prisma.enrollment.findMany({
    where: { classId: activity.classId },
    include: { user: true },
  });
  const submissions = await prisma.submission.findMany({
    where: { activityId, isTestRun: false },
    orderBy: { createdAt: "desc" },
  });
  const rows = enrollments.map((entry) => {
    const submission = submissions.find((item) => item.userId === entry.userId);
    return {
      studentId: entry.userId,
      studentName: entry.user.displayName,
      lastHealthScore: submission?.healthScore ?? 0,
      cells: [
        submission
          ? {
              submissionId: submission.id,
              status: submission.status,
              healthScore: submission.healthScore ?? undefined,
              submittedAt: submission.createdAt.toISOString(),
              environment: submission.environment,
            }
          : { status: "MISSING" },
      ],
    };
  });
  return { activityId, activityTitle: activity.title, classId: activity.classId, rows };
});

app.get("/student/classes", async (request) => {
  const studentId = (request.query as { studentId?: string }).studentId;
  if (!studentId) return [];
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: studentId },
    include: { class: true },
  });
  const classIds = enrollments.map((entry) => entry.classId);
  const activityCounts = await prisma.activity.groupBy({
    by: ["classId"],
    _count: { classId: true },
    where: { classId: { in: classIds } },
  });
  const enrollmentCounts = await prisma.enrollment.groupBy({
    by: ["classId"],
    _count: { classId: true },
    where: { classId: { in: classIds } },
  });
  return enrollments.map((entry) => ({
    id: entry.class.id,
    name: entry.class.name,
    section: entry.class.section,
    yearLevel: entry.class.yearLevel,
    inviteCode: entry.class.inviteCode,
    professorId: entry.class.professorId,
    studentCount:
      enrollmentCounts.find((item) => item.classId === entry.classId)?._count.classId ?? 0,
    activeActivities:
      activityCounts.find((item) => item.classId === entry.classId)?._count.classId ?? 0,
  }));
});

app.get("/student/classes/:id/activities", async (request) => {
  const classId = (request.params as { id: string }).id;
  const studentId = (request.query as { studentId?: string }).studentId;
  if (!studentId) return [];
  const activities = await prisma.activity.findMany({
    where: { classId },
    orderBy: { dueAt: "asc" },
  });
  const submissions = await prisma.submission.findMany({
    where: { classId, userId: studentId, isTestRun: false },
    orderBy: { createdAt: "desc" },
  });
  return activities.map((activity) => {
    const submission = submissions.find((item) => item.activityId === activity.id);
    return {
      id: `${activity.id}-${studentId}`,
      classId,
      activityId: activity.id,
      title: activity.title,
      dueAt: activity.dueAt.toISOString(),
      status: submission?.status ?? SubmissionStatus.PENDING,
      submissionId: submission?.id ?? null,
      professorScore: submission?.professorScore ?? null,
      professorComment: submission?.professorComment ?? null,
    };
  });
});

app.addHook("onClose", async () => {
  await prisma.$disconnect();
});

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await ensureSeedData();
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
