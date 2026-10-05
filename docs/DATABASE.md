# Internova — Database (Phase 3)

MongoDB via Mongoose. All models are in `backend/src/models/` and exported from `index.ts`.

## Collections

| Model | Purpose |
|-------|---------|
| User | Auth identity, role, mentor approval status |
| StudentProfile | Extended student fields + completion % |
| MentorProfile | Expertise, assigned internships |
| Internship | Programs, slugs, curriculum, criteria |
| Application | Student applications (unique per student+internship) |
| InternshipProgress | Stage tracking for accepted students |
| Task / TaskSubmission | Internship tasks and student work |
| Project / ProjectSubmission | Capstone project per internship |
| Assessment / Question / AssessmentAttempt | MCQ assessments |
| Evaluation | Mentor/admin structured scores |
| Certificate / CertificateCounter | Issued certs + ID sequence |
| Payment | Razorpay-ready payment records |
| ContactInquiry | Contact + company interest forms |
| Notification | In-app notifications |

## Indexes (highlights)

- `User.email` (unique)
- `Internship.slug` (unique), `category`, `status`
- `Application` compound unique `(student, internship)`
- `Certificate.certificateId` (unique)
- `TaskSubmission` unique `(task, student)`
- `Question.correctOptionIndex` — `select: false` by default

## Seed

```bash
cd backend && npm run seed
```

Development only — drops DB and loads demo data (`isDemoSeed` on key entities).
