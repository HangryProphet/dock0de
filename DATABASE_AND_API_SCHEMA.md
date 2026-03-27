# Dock0de Database and API Schema

This document aligns with ARCHITECTURE.md, UI_UX_GUIDE.md, and PAGE_SPECIFICATIONS.md. It defines the data backbone using Prisma + SQLite and the Fastify API contract.

## Section 1: Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

enum UserRole {
  STUDENT
  PROFESSOR
  ADMIN
}

enum AccountStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

enum SubmissionStatus {
  PENDING
  UPLOADING
  QUEUED
  BUILDING
  RUNNING
  SUCCESS
  FAILED
  TIMEOUT
  CANCELED
}

enum Environment {
  NODE
  REACT
  JAVA
}

enum LogLevel {
  INFO
  WARN
  ERROR
}

enum YearLevel {
  YEAR_1
  YEAR_2
  YEAR_3
  YEAR_4
}

model User {
  id                String        @id @default(cuid())
  email             String        @unique
  passwordHash      String
  role              UserRole
  status            AccountStatus @default(ACTIVE)
  displayName       String
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Auth security
  passwordResetToken     String?   @unique
  passwordResetExpiresAt DateTime?
  otpCode                String?
  otpExpiresAt           DateTime?
  lastLoginAt            DateTime?

  submissions       Submission[]
  auditLogs         AuditLog[]
  classes           Class[]        @relation("ProfessorClasses")
  enrollments       Enrollment[]
}

model Class {
  id           String      @id @default(cuid())
  name         String
  section      String
  yearLevel    YearLevel
  inviteCode   String      @unique
  professorId  String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  professor    User        @relation("ProfessorClasses", fields: [professorId], references: [id])
  activities   Activity[]
  enrollments  Enrollment[]
  submissions  Submission[]
}

model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  classId   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  class     Class    @relation(fields: [classId], references: [id])

  @@unique([userId, classId])
}

model Activity {
  id          String   @id @default(cuid())
  classId     String
  title       String
  description String?
  dueAt       DateTime
  maxScore    Int      @default(100)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  class       Class        @relation(fields: [classId], references: [id])
  submissions Submission[]
}

model Submission {
  id                 String            @id @default(cuid())
  userId             String
  classId            String
  activityId         String?
  environment        Environment
  status             SubmissionStatus  @default(PENDING)
  assignmentName     String
  zipPath            String
  isTestRun          Boolean           @default(false)
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  // Container runtime
  containerId        String?
  imageId            String?
  hostPort           Int?
  startedAt          DateTime?
  finishedAt         DateTime?
  timeoutSeconds     Int               @default(300)

  // Metrics and health
  exitCode           Int?
  cpuUsagePercent    Float?
  memoryUsageMb      Float?
  healthScore        Int?
  professorScore     Int?
  professorComment   String?

  // Relations
  user               User              @relation(fields: [userId], references: [id])
  class              Class             @relation(fields: [classId], references: [id])
  activity           Activity          @relation(fields: [activityId], references: [id])
  auditReport        AuditReport?
  systemLogs         SystemLog[]
  auditLogs          AuditLog[]
}

model AuditReport {
  id                 String   @id @default(cuid())
  submissionId       String   @unique
  eslintIssues       Int      @default(0)
  snykIssues         Int      @default(0)
  summary            String
  createdAt          DateTime @default(now())

  submission         Submission @relation(fields: [submissionId], references: [id])
}

model SystemLog {
  id                 String   @id @default(cuid())
  submissionId       String
  level              LogLevel @default(INFO)
  message            String
  createdAt          DateTime @default(now())

  submission         Submission @relation(fields: [submissionId], references: [id])
}

model AuditLog {
  id                 String   @id @default(cuid())
  userId             String
  submissionId       String
  action             String
  ipAddress          String?
  userAgent          String?
  createdAt          DateTime @default(now())

  user               User        @relation(fields: [userId], references: [id])
  submission         Submission  @relation(fields: [submissionId], references: [id])
}
```

Logic Notes
- `isTestRun` submissions are excluded from class/activity metrics and timelines.
- `professorScore` and `professorComment` represent manual grading and feedback.

## Section 2: API Endpoints and Types

### Sandbox
POST /runs/test (multipart)
Fields
- file: zip file
- environment: NODE | REACT | JAVA

Response
```json
{
  "runId": "sub_123",
  "status": "QUEUED",
  "isTestRun": true
}
```

### Upload and Runs
POST /runs (multipart)
Fields
- file: zip file
- environment: NODE | REACT | JAVA
- classId: string
- activityId: string

Response
```json
{
  "runId": "sub_456",
  "status": "QUEUED",
  "isTestRun": false
}
```

### Metrics
- Class/Activity metrics must exclude `isTestRun = true` submissions.

## Section 3: Standardized Enums

UserRole
- STUDENT
- PROFESSOR
- ADMIN

SubmissionStatus
- PENDING
- UPLOADING
- QUEUED
- BUILDING
- RUNNING
- SUCCESS
- FAILED
- TIMEOUT
- CANCELED

Environment
- NODE
- REACT
- JAVA

YearLevel
- YEAR_1
- YEAR_2
- YEAR_3
- YEAR_4

AccountStatus
- ACTIVE
- SUSPENDED
- PENDING_VERIFICATION

LogLevel
- INFO
- WARN
- ERROR
