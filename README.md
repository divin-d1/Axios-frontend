# Axios Frontend

Recruiter-facing web client for the Axios AI screening platform. Built with Next.js 16, React 19, and Tailwind CSS 4.

---

## Responsibility

This module owns the complete recruiter experience:

- Secure authentication and session-based route protection
- Company onboarding (one-time AI calibration setup)
- Job creation, editing, and deletion
- Candidate ingestion via CSV/Excel upload or PDF resume
- AI screening trigger and ranked shortlist review
- Per-candidate reasoning display (strengths, gaps, recommendation)
- Shortlist email dispatch
- Company profile management
- Mobile-responsive dashboard

The frontend never makes hiring decisions. It presents AI output with full explanation so the recruiter remains the final authority.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State | React hooks + context |
| Auth | JWT stored in cookie, enforced at edge via middleware |

---

## Route Map

### Auth Routes
| Route | Purpose |
|---|---|
| `/login` | Recruiter sign-in |
| `/register` | New account creation |
| `/forgot-password` | Password reset request |
| `/reset-password` | OTP-based password reset |
| `/onboarding` | First-time company setup (locked after completion) |

### Dashboard Routes
| Route | Purpose |
|---|---|
| `/` | Overview dashboard with hiring metrics |
| `/jobs` | Job listing and management |
| `/jobs/create` | New job form |
| `/jobs/[id]` | Job detail, edit, delete |
| `/screening/[jobId]` | AI screening trigger and ranked shortlist |
| `/candidates` | All candidates across jobs |
| `/candidates/[id]` | Candidate profile detail |
| `/emails` | Shortlist email dispatch |
| `/company` | Company profile management |

---

## Access Control

Route protection is enforced in `proxy.ts` (Next.js middleware):

- Unauthenticated users hitting protected routes → redirected to `/login`
- Authenticated users hitting auth pages → redirected to `/`
- Static assets (images, fonts) are excluded from middleware matching

---

## Key Modules

| File | Purpose |
|---|---|
| `app/lib/api.ts` | Typed API client with JWT injection |
| `app/lib/errors.ts` | Consistent API error message extraction |
| `app/lib/types.ts` | Shared domain type definitions |
| `app/lib/store.ts` | Redux store configuration |
| `app/components/Sidebar.tsx` | Desktop sidebar + mobile bottom nav |
| `app/components/Toast.tsx` | Global async feedback notifications |
| `app/components/Modal.tsx` | Reusable confirmation/action modal |
| `app/components/ScoreBadge.tsx` | Visual score indicator for candidates |
| `proxy.ts` | Edge middleware for auth and route protection |

---

## Company Onboarding — Why It Exists

The onboarding flow is the AI's calibration layer, not just a setup form.

When a recruiter completes onboarding, they provide:
- Company name, industry, size
- Departments and hiring areas
- Hiring philosophy (startup-fast, enterprise-structured, research-heavy, balanced)
- Company description and culture signals
- Core skills and tech stack

This data is stored and injected into every Gemini screening prompt. A startup screening for a backend engineer gets different AI weighting than an enterprise doing the same search. Without this context, AI screening is generic. With it, shortlists are calibrated to how a specific company actually hires.

The onboarding route is also guarded: once a company profile exists, the page redirects to the dashboard — it cannot be completed twice.

---

## Auth Screens — Design Rationale

The login and register pages use a split-panel layout:
- Left panel: full-height background image with a testimonial overlay
- Right panel: clean, minimal form

This layout was chosen to reduce cognitive load on the form side while giving the product a strong visual identity. The background image is served from `/public` as a static asset and rendered via Next.js `<Image>` with `fill` for optimal loading.

---

## Environment Setup

Create `axios-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, point this to your deployed backend URL.

---

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

---

## Production Build

```bash
npm run lint
npm run build
npm run start
```

---

## Deployment (Vercel)

1. Connect repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` in environment variables
3. Ensure backend CORS allows the Vercel deployment domain
4. Framework preset: Next.js (auto-detected)

---

## Known Console Noise (Not Application Errors)

The following errors appear in browser console from installed extensions and are not caused by this application:

- `Could not establish connection. Receiving end does not exist` — browser extension messaging
- `Failed to connect to MetaMask` — MetaMask extension not active
- `SES Removing unpermitted intrinsics` — MetaMask security sandbox

These can be safely ignored.
