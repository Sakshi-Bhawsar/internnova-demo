# Internova — Architecture & Planning Document

> **Status:** Planning (V1) — awaiting confirmation before Phase 1 implementation  
> **Product tagline:** Learn → Build → Intern → Get Evaluated → Get Verified → Become Career Ready

---

## 1. Product Architecture

### 1.1 High-Level Overview

Internova is a **monorepo** with two deployable applications sharing types and conventions:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  Public Website │ Student Dashboard │ Admin Dashboard │ Verify  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────────────┐
│                   Next.js Frontend (App Router)                  │
│  SSR/SSG public pages │ Client dashboards │ API proxy (optional)│
└────────────────────────────┬────────────────────────────────────┘
                             │ REST + JWT (Bearer / HttpOnly cookie)
┌────────────────────────────▼────────────────────────────────────┐
│                   Express.js Backend (TypeScript)                │
│  Routes → Controllers → Services → Models                       │
│  Auth │ RBAC │ Validation │ Rate Limit │ Error Handler           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      MongoDB (Mongoose)                          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

| Principle | Decision |
|-----------|----------|
| Separation of concerns | Backend owns all business logic; frontend is presentation + API client |
| Role extensibility | `UserRole` enum includes `COMPANY` (reserved, not implemented in V1) |
| No fake features | Every button/form either works or is clearly marked "Coming Soon" |
| Payment-ready | `Payment` model + Razorpay service stub; no card storage |
| Certificate integrity | Server-generated IDs, QR links to `/verify/[id]`, revocable |

### 1.3 Role Matrix (V1)

| Capability | Student | Mentor | Admin | Company (Future) |
|------------|---------|--------|-------|------------------|
| Public browse internships | ✓ | ✓ | ✓ | — |
| Register (public) | ✓ (default) | ✓ | ✗ | Future |
| Apply to internship | ✓ | ✗ | ✗ | — |
| Submit tasks/projects | ✓ | ✗ | ✗ | — |
| Take assessments | ✓ | ✗ | ✗ | — |
| View assigned students | ✗ | ✓ (limited V1) | ✓ | — |
| Review submissions | ✗ | ✓ (limited V1) | ✓ | — |
| CRUD internships | ✗ | ✗ | ✓ | Future |
| Manage applications | ✗ | ✗ | ✓ | Future |
| Generate certificates | ✗ | ✗ | ✓ | — |
| Platform analytics | ✗ | ✗ | ✓ | — |

### 1.4 Authentication Strategy

- **Registration:** Public signup creates `STUDENT` or `MENTOR` only. Admin seeded or created by existing admin.
- **Password:** bcrypt (cost factor 12).
- **JWT:** Access token in `Authorization: Bearer` header; optional HttpOnly refresh cookie in later iteration.
- **Protected routes:** Next.js middleware checks token + role for dashboard routes; backend enforces on every API call.
- **Token payload:** `{ userId, role, email }` — no sensitive data.

### 1.5 Internship Lifecycle (Student Journey)

```
Browse → Apply → Under Review → Accepted → Active Internship
  → Stages (Orientation → Learning → Tasks → Project → Assessment → Evaluation → Certificate)
  → Certificate Issued (if criteria met) → Public Verification
```

### 1.6 Certificate Issuance Criteria (Configurable per Internship)

Default criteria (admin can override per internship):

1. All required tasks `APPROVED`
2. Project status `APPROVED`
3. Assessment passed (score ≥ passing score)
4. Evaluation submitted with overall score ≥ threshold
5. Admin final approval (optional flag per internship)

### 1.7 Payment Architecture (Prepared, Not Active in V1 UI)

```
Frontend → POST /api/payments/create-order → Razorpay Order
Frontend → Razorpay Checkout → Payment callback
Frontend → POST /api/payments/verify (signature + orderId)
Backend  → Verify with Razorpay API → Update Payment status → Unlock internship access
```

V1: Model + env vars + admin view of payments. No checkout UI unless internship marked `isPaid: true` in seed.

### 1.8 Company Portal Extension Point (Future)

Reserved without V1 implementation:

- `CompanyProfile` model (stub comment in schema file)
- `UserRole.COMPANY` in enum
- Route namespace `/api/companies/*` (commented route index)
- Public page `/for-companies` with interest-list form only

---

## 2. Page Map

### 2.1 Public Website (No Auth Required)

| Route | Page | SSR/SSG |
|-------|------|---------|
| `/` | Home | SSG + revalidate |
| `/about` | About | SSG |
| `/internships` | Internship listing (search, filters, pagination) | SSR |
| `/internships/[slug]` | Internship detail + Apply CTA | SSR |
| `/mentorship` | Mentorship info | SSG |
| `/for-companies` | Coming soon + interest form | SSG |
| `/faq` | FAQ | SSG |
| `/contact` | Contact form | SSG |
| `/verify` | Certificate ID lookup form | SSG |
| `/verify/[certificateId]` | Certificate verification result | SSR |
| `/login` | Login | Client |
| `/register` | Registration | Client |

### 2.2 Student Dashboard (Auth: STUDENT)

| Route | Page |
|-------|------|
| `/dashboard` | Overview (welcome, progress, pending tasks, certificates) |
| `/dashboard/profile` | Profile view/edit + completion % |
| `/dashboard/applications` | My applications + status |
| `/dashboard/internship` | Active internship + stage progress |
| `/dashboard/tasks` | Task list |
| `/dashboard/tasks/[id]` | Task detail + submission |
| `/dashboard/project` | Project brief + submission |
| `/dashboard/assessments` | Assessment list |
| `/dashboard/assessments/[id]` | Take assessment |
| `/dashboard/assessments/[id]/result` | Assessment result |
| `/dashboard/evaluations` | View evaluation feedback |
| `/dashboard/certificates` | My certificates |
| `/dashboard/certificates/[id]` | Certificate view + download |

### 2.3 Mentor Dashboard (Auth: MENTOR — Limited V1)

| Route | Page |
|-------|------|
| `/mentor` | Overview (assigned students count) |
| `/mentor/students` | Assigned students list |
| `/mentor/submissions` | Pending task/project reviews |
| `/mentor/submissions/[id]` | Review + feedback form |

### 2.4 Admin Dashboard (Auth: ADMIN)

| Route | Page |
|-------|------|
| `/admin` | Analytics overview + charts |
| `/admin/students` | Student management |
| `/admin/mentors` | Mentor management |
| `/admin/internships` | Internship CRUD |
| `/admin/internships/new` | Create internship |
| `/admin/internships/[id]/edit` | Edit internship |
| `/admin/applications` | Application management |
| `/admin/tasks` | Task management |
| `/admin/projects` | Project management |
| `/admin/assessments` | Assessment + question management |
| `/admin/certificates` | Generate, view, revoke |
| `/admin/payments` | Payment records (read-only V1) |
| `/admin/inquiries` | Contact + company interest inquiries |
| `/admin/settings` | Platform settings (basic V1) |

---

## 3. User Flows

### 3.1 Student Registration & Onboarding

```
Landing → Register (role=STUDENT) → Email validation → Login
  → Redirect /dashboard → Profile completion prompt
  → Browse /internships → View detail → Apply
  → Track in /dashboard/applications
```

### 3.2 Application Flow

```
Student: Apply → status APPLIED
Admin:   Review → UNDER_REVIEW → ACCEPTED | REJECTED
Student: If ACCEPTED → Active internship assigned → /dashboard/internship
Student: Can WITHDRAW while APPLIED or UNDER_REVIEW
```

### 3.3 Task Submission Flow

```
Admin creates tasks for internship
  → Student sees PENDING tasks on dashboard
  → Student marks IN_PROGRESS → submits work
  → Status SUBMITTED
  → Mentor/Admin reviews → APPROVED | REVISION_REQUIRED
  → If REVISION_REQUIRED → Student resubmits
```

### 3.4 Assessment Flow

```
Admin creates assessment + MCQ questions
  → Student starts attempt (Attempt record created)
  → Answers submitted (correct answers never sent to client before submit)
  → Server grades → Pass/Fail + score stored
  → Student views result (no correct answers shown post-submit in V1)
```

### 3.5 Certificate Flow

```
Admin triggers generation (or auto when criteria met)
  → Server validates all criteria
  → Generates unique ID (UM-YYYY-NNNNNN)
  → Creates Certificate record + verification URL
  → Student views/downloads PDF with QR code
  → Public verifies at /verify/[certificateId]
```

### 3.6 Admin Internship Management

```
Admin → Create internship (draft) → Add tasks, project, assessment
  → Publish → Visible on public listing
  → Manage applications → Assign mentor → Assign student to cohort
  → Monitor progress → Evaluate → Issue certificate
```

### 3.7 Contact / Company Interest

```
User fills contact form → POST /api/contact → Stored in ContactInquiry
Admin views in /admin/inquiries → Mark resolved

Company interest on /for-companies → Same collection with type=COMPANY_INTEREST
```

---

## 4. Database Design (ER-Style)

### 4.1 Entity Relationship Overview

```
User (1) ────── (0..1) StudentProfile
User (1) ────── (0..1) MentorProfile
User (1) ────── (*) Application
User (1) ────── (*) Certificate
User (1) ────── (*) Payment
User (1) ────── (*) Notification

Internship (1) ──── (*) Application
Internship (1) ──── (*) Task
Internship (1) ──── (0..1) Project
Internship (1) ──── (0..1) Assessment
Internship (*) ──── (*) Mentor (via assignedMentors[])

Application (1) ─── (1) User (student)
Application (1) ─── (1) Internship
Application (1) ──── (0..1) InternshipProgress

Task (1) ────────── (*) TaskSubmission
TaskSubmission (*) ─ (1) User (student)

Project (1) ─────── (0..1) ProjectSubmission
ProjectSubmission (*) ─ (1) User (student)

Assessment (1) ──── (*) Question
Assessment (1) ──── (*) AssessmentAttempt
AssessmentAttempt (*) ─ (1) User (student)

Evaluation (*) ──── (1) User (student)
Evaluation (*) ──── (1) Internship
Evaluation (*) ──── (1) User (evaluator: mentor/admin)

Certificate (*) ─── (1) User (student)
Certificate (*) ─── (1) Internship
Certificate (*) ─── (0..1) Evaluation

ContactInquiry — standalone
Payment (*) ─────── (1) User
Payment (*) ─────── (1) Internship
```

### 4.2 Core Schemas (Summary)

#### User
```
email (unique, indexed), passwordHash, fullName, phone, role (enum),
education, college, graduationYear, isActive, avatarUrl,
createdAt, updatedAt
```

#### StudentProfile
```
userId (ref, unique), degree, location, skills[], github, linkedin,
portfolio, resumeUrl, bio, completionPercentage (computed/cached),
createdAt, updatedAt
```

#### MentorProfile
```
userId (ref, unique), expertise[], bio, linkedin, yearsOfExperience,
assignedInternshipIds[], createdAt, updatedAt
```

#### Internship
```
title, slug (unique, indexed), description, category (indexed),
technologies[], durationWeeks, mode (REMOTE|HYBRID|ONSITE),
level (BEGINNER|INTERMEDIATE|ADVANCED), isPaid, price,
status (DRAFT|PUBLISHED|ARCHIVED, indexed), applicationDeadline,
whatYouLearn[], skillsRequired[], eligibility, weeklyCurriculum[],
projectInfo, assessmentInfo, mentorshipInfo, certificateCriteria,
faqs[], assignedMentors[], stages[], featured (bool),
createdAt, updatedAt
```

#### Application
```
student (ref, indexed), internship (ref, indexed),
status (enum, indexed), appliedAt, reviewedAt, reviewedBy,
notes, createdAt, updatedAt
Unique index: (student, internship)
```

#### InternshipProgress
```
application (ref), student (ref), internship (ref),
currentStage (enum), stageProgress (array of { stage, completedAt }),
overallProgress (0-100), createdAt, updatedAt
```

#### Task
```
internship (ref), title, description, instructions, dueDate,
difficulty, technologies[], resources[], submissionType,
order, isRequired, createdAt, updatedAt
```

#### TaskSubmission
```
task (ref), student (ref), internship (ref),
content, fileUrl, githubUrl, status (enum),
feedback, reviewedBy, reviewedAt, createdAt, updatedAt
Unique index: (task, student) — latest submission wins or version array
```

#### Project
```
internship (ref, unique), title, description, requirements[],
technologies[], deliverables[], submissionDeadline, createdAt, updatedAt
```

#### ProjectSubmission
```
project (ref), student (ref),
githubUrl, liveDemoUrl, documentationUrl, status (enum),
feedback, evaluationScores, reviewedBy, reviewedAt,
createdAt, updatedAt
```

#### Assessment
```
internship (ref), title, description, passingScore, durationMinutes,
maxAttempts, isActive, createdAt, updatedAt
```

#### Question
```
assessment (ref), questionText, options[] (text only, no isCorrect exposed),
correctOptionIndex (server-only field, select: false in queries),
order, points, createdAt, updatedAt
```

#### AssessmentAttempt
```
assessment (ref), student (ref),
answers[] ({ questionId, selectedIndex }),
score, passed, startedAt, submittedAt, attemptNumber,
createdAt, updatedAt
```

#### Evaluation
```
student (ref), internship (ref), evaluator (ref),
criteria: { technicalSkills, taskCompletion, projectQuality,
           communication, problemSolving, professionalism },
overallScore, comments, createdAt, updatedAt
```

#### Certificate
```
certificateId (unique, indexed, format UM-YYYY-NNNNNN),
student (ref), internship (ref), studentName, programName,
startDate, endDate, skills[], projectTitle, overallScore,
status (VALID|REVOKED), issuedAt, revokedAt, revokeReason,
verificationUrl, createdAt, updatedAt
```

#### Payment
```
user (ref), internship (ref), amount, currency,
razorpayOrderId, razorpayPaymentId, status (enum),
metadata, createdAt, updatedAt
```

#### ContactInquiry
```
type (CONTACT|COMPANY_INTEREST), name, email, subject, message,
companyName (optional), isResolved, resolvedAt, createdAt, updatedAt
```

#### Notification
```
user (ref), type, title, message, isRead, link, createdAt, updatedAt
```

### 4.3 Indexes

| Collection | Index |
|------------|-------|
| User | email (unique) |
| Internship | slug (unique), category, status, applicationDeadline |
| Application | student, internship, status, compound unique (student+internship) |
| Certificate | certificateId (unique) |
| TaskSubmission | task+student |
| AssessmentAttempt | assessment+student |

---

## 5. API Specification

**Base URL:** `http://localhost:5000/api` (dev)  
**Auth header:** `Authorization: Bearer <token>`  
**Response format:** As specified in master prompt (success/error/pagination)

### 5.1 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register student/mentor |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/logout` | User | Invalidate (client-side + optional blocklist) |
| GET | `/auth/me` | User | Current user + profile |

### 5.2 Students

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/students/profile` | Student | Get profile |
| PUT | `/students/profile` | Student | Update profile |
| POST | `/students/resume` | Student | Upload resume (multipart) |

### 5.3 Internships (Public + Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/internships` | Public | List with filters, search, pagination |
| GET | `/internships/:slugOrId` | Public | Detail by slug or ID |
| POST | `/internships` | Admin | Create |
| PUT | `/internships/:id` | Admin | Update |
| DELETE | `/internships/:id` | Admin | Soft delete / archive |
| PATCH | `/internships/:id/publish` | Admin | Publish/unpublish |

### 5.4 Applications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/applications` | Student | Apply to internship |
| GET | `/applications/my` | Student | My applications |
| GET | `/applications/:id` | Student/Admin | Application detail |
| PATCH | `/applications/:id/withdraw` | Student | Withdraw |
| PUT | `/applications/:id/status` | Admin | Update status |
| GET | `/applications` | Admin | List all (filterable) |

### 5.5 Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tasks` | Student/Admin | Tasks for active internship |
| GET | `/tasks/:id` | Student/Admin/Mentor | Task detail |
| POST | `/tasks` | Admin | Create task |
| PUT | `/tasks/:id` | Admin | Update task |
| DELETE | `/tasks/:id` | Admin | Delete task |
| POST | `/tasks/:id/submit` | Student | Submit task |
| PATCH | `/tasks/submissions/:id/review` | Admin/Mentor | Review submission |

### 5.6 Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects/my` | Student | Project for active internship |
| POST | `/projects` | Admin | Create project for internship |
| PUT | `/projects/:id` | Admin | Update |
| POST | `/projects/:id/submit` | Student | Submit project |
| PATCH | `/projects/submissions/:id/review` | Admin/Mentor | Review |

### 5.7 Assessments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/assessments/my` | Student | Available assessments |
| GET | `/assessments/:id` | Student | Questions (no answers) |
| POST | `/assessments/:id/start` | Student | Start attempt |
| POST | `/assessments/:id/submit` | Student | Submit answers |
| GET | `/assessments/:id/result` | Student | Attempt result |
| POST | `/assessments` | Admin | Create assessment |
| POST | `/assessments/:id/questions` | Admin | Add questions |
| PUT | `/assessments/questions/:id` | Admin | Update question |

### 5.8 Evaluations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/evaluations` | Admin/Mentor | Create evaluation |
| GET | `/evaluations/my` | Student | My evaluations |
| GET | `/evaluations` | Admin | List all |

### 5.9 Certificates

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/certificates/my` | Student | My certificates |
| GET | `/certificates/:id` | Student/Admin | Certificate detail |
| GET | `/certificates/verify/:certificateId` | Public | Verify certificate |
| POST | `/certificates/generate` | Admin | Generate for student |
| PATCH | `/certificates/:id/revoke` | Admin | Revoke |

### 5.10 Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/analytics` | Admin | Dashboard stats |
| GET | `/admin/students` | Admin | List students |
| PATCH | `/admin/students/:id/status` | Admin | Activate/deactivate |
| GET | `/admin/mentors` | Admin | List mentors |
| POST | `/admin/mentors/assign` | Admin | Assign mentor to internship |

### 5.11 Contact & Interest

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contact` | Public | Submit contact form |
| POST | `/company-interest` | Public | Company interest list |
| GET | `/admin/inquiries` | Admin | List inquiries |
| PATCH | `/admin/inquiries/:id/resolve` | Admin | Mark resolved |

### 5.12 Payments (Architecture Only V1)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create-order` | Student | Create Razorpay order |
| POST | `/payments/verify` | Student | Verify payment signature |
| GET | `/admin/payments` | Admin | List payments |

### 5.13 Error Codes (Sample)

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `DUPLICATE_APPLICATION`, `INTERNSHIP_CLOSED`, `CERTIFICATE_NOT_FOUND`, `CERTIFICATE_REVOKED`, `ASSESSMENT_MAX_ATTEMPTS`, `CRITERIA_NOT_MET`

---

## 6. Folder Structure

```
Internova/
├── README.md
├── .gitignore
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   └── API.md                   # Detailed API docs (Phase 4+)
├── postman/
│   └── Internova-API.postman_collection.json
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   ├── db.ts
│       │   ├── env.ts
│       │   └── cors.ts
│       ├── models/
│       │   ├── User.ts
│       │   ├── StudentProfile.ts
│       │   ├── MentorProfile.ts
│       │   ├── Internship.ts
│       │   ├── Application.ts
│       │   ├── InternshipProgress.ts
│       │   ├── Task.ts
│       │   ├── TaskSubmission.ts
│       │   ├── Project.ts
│       │   ├── ProjectSubmission.ts
│       │   ├── Assessment.ts
│       │   ├── Question.ts
│       │   ├── AssessmentAttempt.ts
│       │   ├── Evaluation.ts
│       │   ├── Certificate.ts
│       │   ├── Payment.ts
│       │   ├── ContactInquiry.ts
│       │   ├── Notification.ts
│       │   └── index.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── student.routes.ts
│       │   ├── internship.routes.ts
│       │   ├── application.routes.ts
│       │   ├── task.routes.ts
│       │   ├── project.routes.ts
│       │   ├── assessment.routes.ts
│       │   ├── evaluation.routes.ts
│       │   ├── certificate.routes.ts
│       │   ├── admin.routes.ts
│       │   ├── contact.routes.ts
│       │   ├── payment.routes.ts
│       │   └── index.ts
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── rbac.middleware.ts
│       │   ├── validate.middleware.ts
│       │   ├── rateLimit.middleware.ts
│       │   └── error.middleware.ts
│       ├── validators/
│       ├── utils/
│       │   ├── apiResponse.ts
│       │   ├── certificateId.ts
│       │   └── slugify.ts
│       └── scripts/
│           └── seed.ts
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── .env.example
    ├── public/
    │   ├── robots.txt
    │   └── sitemap.xml (generated)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                    # Home
    │   ├── about/page.tsx
    │   ├── internships/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── mentorship/page.tsx
    │   ├── for-companies/page.tsx
    │   ├── faq/page.tsx
    │   ├── contact/page.tsx
    │   ├── verify/
    │   │   ├── page.tsx
    │   │   └── [certificateId]/page.tsx
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── dashboard/                  # Student layout group
    │   ├── mentor/                     # Mentor layout group
    │   └── admin/                      # Admin layout group
    ├── components/
    │   ├── ui/                         # Button, Input, Modal, etc.
    │   ├── layout/                     # Navbar, Footer, Sidebar
    │   ├── internships/
    │   ├── dashboard/
    │   └── admin/
    ├── lib/
    │   ├── api.ts                      # Axios/fetch client
    │   └── auth.ts                       # Token storage helpers
    ├── services/                       # API service functions
    ├── hooks/
    ├── types/
    └── utils/
```

---

## 7. Development Milestones

### Phase 1 — Project Setup
- Init monorepo, git (main + develop), .gitignore, .env.example
- Backend: Express + TypeScript + Mongoose scaffold
- Frontend: Next.js 14+ App Router + Tailwind + TypeScript
- Health check endpoint, basic README

### Phase 2 — UI / Design System
- Color palette, typography, spacing tokens
- Core components: Button, Input, Card, Modal, Badge, ProgressBar, etc.
- Layout: Navbar, Footer, mobile menu
- Loading, Empty, Error states

### Phase 3 — Database Architecture
- All Mongoose models + indexes
- Seed script (admin, mentor, students, internships, tasks, assessment)
- DB connection + env validation

### Phase 4 — Authentication
- Register, login, logout, /me
- JWT middleware + RBAC
- Frontend auth pages + protected route middleware
- Profile creation on register

### Phase 5 — Public Internship System
- Public pages: Home, About, Internships list/detail, FAQ, Contact, etc.
- Internship APIs with search/filter/pagination
- SEO metadata, slugs, robots.txt

### Phase 6 — Student Dashboard
- Dashboard overview, profile CRUD, completion %
- Active internship + progress visualization

### Phase 7 — Applications
- Apply, track, withdraw
- Admin application management

### Phase 8 — Tasks & Projects
- Task CRUD (admin), submission flow, review flow
- Project submission + mentor/admin feedback

### Phase 9 — Assessments & Evaluations
- MCQ assessment (admin create, student take, grade)
- Evaluation form (admin/mentor)

### Phase 10 — Certificates
- Generation with unique IDs, PDF + QR
- Public verification page
- Revocation

### Phase 11 — Admin Dashboard
- Analytics, all CRUD screens, inquiry management

### Phase 12 — Payments (Architecture)
- Payment model, Razorpay service stub, admin payment view

### Phase 13 — Testing
- Postman collection, manual E2E checklist

### Phase 14 — Security Hardening
- Rate limiting, helmet, input sanitization, audit

### Phase 15 — Deployment
- Deployment docs (Vercel + Railway/Render or similar)

---

## 8. Key Decisions & Recommendations

| Topic | Recommendation | Rationale |
|-------|----------------|-----------|
| Next.js version | 14+ App Router | SSR for internships, modern React |
| API client | Native fetch wrapper | Fewer deps; axios optional |
| Validation | Zod (shared patterns) | Type-safe, popular |
| Forms | React Hook Form + Zod | Good DX, validation |
| File uploads | Local `/uploads` in dev; S3-compatible in prod | Simple V1 |
| Certificate PDF | `@react-pdf/renderer` or `pdfkit` on backend | Server-side generation |
| QR codes | `qrcode` npm package | Verification URLs |
| Charts (admin) | `recharts` | Lightweight, React-friendly |
| Brand name | **Internova** (workspace name) | Original identity |
| Primary color direction | Deep indigo + teal accent | Professional, distinct from competitors |

---

## 9. Confirmed Decisions

| Decision | Choice |
|----------|--------|
| Brand name | **Internova** |
| File storage | Local filesystem for dev (`backend/uploads/`) |
| Email notifications | **V1** — Nodemailer with console fallback when SMTP not configured |
| Paid internships | **Architecture-only** — Payment model + Razorpay env vars; no checkout UI |
| Mentor registration | **Public signup + admin approval** (recommended & confirmed) |

### Mentor Registration Flow

```
Mentor registers (role=MENTOR)
  → User created with mentorStatus=PENDING, isActive=false
  → Admin notified (email in V1)
  → Admin reviews in /admin/mentors → APPROVED | REJECTED
  → On APPROVED: isActive=true, mentor can access /mentor dashboard
  → On REJECTED: account remains inactive with reason stored
```

**Why this approach:** Scales without admin creating every mentor manually; maintains platform trust by vetting mentors before they review student work.

---

*Phase 3 complete (Mongoose models + dev seed). Next: **Phase 4 — Authentication**.*
