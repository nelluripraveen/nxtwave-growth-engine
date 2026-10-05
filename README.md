# NxtWave AI Workshop Growth Engine

> **Growth Intern Challenge Prototype** — A referral-driven campaign management system for NxtWave's free AI workshop.

## 🚀 Live Demo Flow

1. Visit `/` → Homepage
2. Click **Register Free** → Fill form → Register
3. Receive your **unique referral code** on the dashboard
4. **Copy referral link** → Share on WhatsApp
5. Open referral link in incognito → Register second student
6. First student's referral count increases in real-time
7. Visit `/leaderboard` → See rankings update
8. Visit `/colleges` → See college rankings
9. Visit `/admin` → Full campaign analytics dashboard
10. Visit `/share` → AI-powered WhatsApp message generator

---

## 📋 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with growth loop visualization |
| `/register` | Student registration with referral code capture |
| `/dashboard` | Student dashboard with referral code, progress, sharing |
| `/leaderboard` | Referral leaderboard with podium |
| `/colleges` | College challenge leaderboard |
| `/share` | AI-powered WhatsApp message generator |
| `/ambassador` | Ambassador tracking dashboard |
| `/admin` | Full admin growth analytics dashboard |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom CSS design system
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: LocalStorage (mock backend — structured for easy DB swap)
- **AI**: OpenAI GPT-3.5 (optional) with high-quality template fallback

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENAI_API_KEY` | Optional | Enables AI message generation. App works without this. |
| `VITE_APP_DOMAIN` | Optional | Production domain for referral links |

---

## 🗄️ Data Architecture

The app uses **LocalStorage as a mock backend** with 327 seeded demo students.

### Data Models

```typescript
Student {
  id, name, email, whatsapp, college, branch,
  graduationYear, referralCode, referredBy, createdAt, source
}

Referral {
  id, referrerId, referredUserId, createdAt
}
```

To connect a real database (Supabase/PostgreSQL), swap out `src/store/dataStore.ts` — the API interface stays the same.

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add `VITE_OPENAI_API_KEY` in Vercel dashboard → Project Settings → Environment Variables.

Add `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🎯 Growth Strategy Demonstrated

> **"Instead of trying to acquire 500 students manually, I designed a system where every student becomes a distribution channel."**

### Core Growth Loop
```
Student discovers workshop
→ Registers (gets unique referral code)
→ Shares on WhatsApp (1-click via pre-filled message)
→ Friends register via referral link
→ Leaderboard updates → social proof
→ More students share → campaign reaches 500
```

### Key Metrics (Campaign Simulation)
- **Target**: 500 registrations in 7 days
- **Budget**: ₹2,000
- **Primary channel**: Student referrals via WhatsApp
- **Referral conversion**: 36% of registrations from referrals
- **Active referrers**: 74 students driving 118 referral registrations

---

## 📱 Mobile-First Design

Student-facing pages are optimized for mobile (primary WhatsApp sharing flow).
Admin dashboard is desktop-first but fully responsive.

---

## ⚠️ Demo Notes

- All data marked "Demo Data" or "Simulation" is seeded mock data
- Numbers shown are campaign projections, not real NxtWave results
- Admin credentials: Visit `/admin` directly (no auth required for demo)

---

*Built for NxtWave Growth Intern Challenge — demonstrating referral-driven student acquisition at scale.*
