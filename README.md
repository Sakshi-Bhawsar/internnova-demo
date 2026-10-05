# Internova

**Learn → Build → Intern → Get Evaluated → Get Verified → Become Career Ready**

A production-quality internship and career platform for students and recent graduates in India. Internova focuses on practical internships, real projects, mentorship, assessments, and verifiable certificates — not certificate-selling gimmicks.

> Build real skills. Work on real projects. Prove what you can do.

---

## Features (Roadmap)

| Status | Feature |
|--------|---------|
| ✅ Phase 1 | Project setup, health check API, frontend scaffold |
| ✅ Phase 2 | UI design system, layout, public page shells |
| ✅ Phase 3 | Database models & seed data |
| 🔜 Phase 4 | Authentication (JWT, RBAC) |
| 🔜 Phase 5+ | Public site, dashboards, applications, tasks, certificates, admin |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full architecture, API spec, and milestones.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Validation | Zod |

---

## Folder Structure

```
Internova/
├── backend/          # Express REST API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── validators/
│       └── utils/
├── frontend/         # Next.js App Router
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── hooks/
│   └── types/
├── docs/
└── postman/
```

---

## Prerequisites

- **Node.js** 20+
- **MongoDB** 6+ (local or Atlas)
- **npm** 10+

---

## Installation

### 1. Clone and install dependencies

```bash
git clone <repo-url> Internova
cd Internova

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 2. Configure environment

**Backend** (`backend/.env`):

```env
MONGODB_URI=mongodb://localhost:27017/internova
JWT_SECRET=your-long-random-secret-at-least-16-chars
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running Locally

Open two terminals:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Health | http://localhost:5000/api/health |

---

## Database seed (development)

Requires MongoDB running and `backend/.env` configured.

```bash
cd backend
npm run seed
```

**Warning:** In development, `npm run seed` **drops the entire database** for `MONGODB_URI` and inserts fictional demo data.

| Account | Email | Password |
|---------|-------|----------|
| Admin | `admin@demo.internova` | `Demo@Internova123` |
| Mentor (approved) | `mentor@demo.internova` | same |
| Mentor (pending) | `mentor.pending@demo.internova` | same |
| Student | `student@demo.internova` | same |
| Student | `student2@demo.internova` | same |

Models live in `backend/src/models/`. See `docs/ARCHITECTURE.md` section 4 for schema details.

---

## Testing Phase 1

1. Start MongoDB locally
2. Start backend — should log `MongoDB connected` and `API running on :5000`
3. `curl http://localhost:5000/api/health` → `{ "success": true, "data": { "status": "ok" } }`
4. Start frontend — visit http://localhost:3000

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `develop` | Integration branch |
| `feature/*` | Feature work |

---

## Confirmed V1 Decisions

| Decision | Choice |
|----------|--------|
| Brand | Internova |
| File storage | Local `/uploads` (dev) |
| Email | V1 (Nodemailer; console fallback in dev) |
| Payments | Architecture-only (Razorpay model, no checkout UI) |
| Mentor registration | Public signup + **admin approval** (`PENDING` → `APPROVED`) |

---

## API Response Format

```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "message": "...", "error": "ERROR_CODE" }
```

---

## License

MIT
