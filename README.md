# 🚀 Suriya AI Animated Portfolio
### Production-Ready · Next.js · React Three Fiber · Firebase · GSAP · AI Voice

---

## 📁 Complete Folder Structure

```
suriya-portfolio/
├── app/
│   ├── layout.js                    ← Root layout, fonts, toaster
│   ├── page.js                      ← Entry: popup → mode selector → portfolio
│   ├── globals.css                  ← Design system, CSS variables, utility classes
│   ├── agentic/
│   │   └── page.js                  ← Agentic intro + 3D scene loader
│   ├── admin-login/
│   │   └── page.js                  ← Firebase auth login form
│   └── admin-dashboard/
│       └── page.js                  ← Protected CMS + analytics
│
├── components/
│   ├── ui/
│   │   ├── VisitPopup.js            ← First-visit name/company form
│   │   └── ModeSelector.js          ← Choose Manual or Agentic
│   │
│   ├── portfolio/
│   │   ├── ManualPortfolio.js       ← Parent: fetches all data, renders sections
│   │   ├── Navbar.js                ← Scroll-aware sticky nav
│   │   ├── HeroSection.js           ← Full-screen hero with name & CTA
│   │   ├── AboutSection.js          ← Bio, photo, stats, interests
│   │   ├── EducationSection.js      ← Timeline with degree cards
│   │   ├── ProjectsSection.js       ← Filterable project grid
│   │   ├── CertificatesSection.js   ← Certificate card grid
│   │   ├── SkillsSection.js         ← Animated skill bars by category
│   │   ├── AchievementsSection.js   ← Achievement cards with emoji
│   │   └── ContactSection.js        ← Links: email, GitHub, Instagram, etc.
│   │
│   ├── agentic/
│   │   ├── AgenticScene.js          ← R3F canvas: car, road, rooms, camera
│   │   └── AgentHUD.js              ← HUD overlay: nav, data panel, voice indicator
│   │
│   └── admin/
│       ├── AdminSidebar.js          ← CMS sidebar navigation
│       ├── CRUDPanel.js             ← Generic add/edit/delete for any section
│       └── AnalyticsDashboard.js    ← Stats, charts (Line/Pie/Bar), visitor table
│
├── lib/
│   ├── firebase.js                  ← Firebase app init (Firestore + Auth)
│   ├── firestore.js                 ← CRUD helpers + visit logging
│   └── auth.js                      ← Admin login/logout/onAuthChange
│
├── hooks/
│   ├── useVoice.js                  ← Web Speech API hook (speak, stop, speaking)
│   └── usePortfolioData.js          ← Data fetching hooks
│
├── utils/
│   └── seedFirestore.js             ← Sample data + Firestore security rules
│
├── public/                          ← Static assets
├── .env.local.example               ← Environment variable template
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| UI | React + Tailwind CSS |
| 3D | Three.js + React Three Fiber + Drei |
| Animation | GSAP + Framer Motion |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Voice | Web Speech API |
| Fonts | Cormorant Garamond + DM Sans + JetBrains Mono |

---

## 🔥 Firebase Setup (Step by Step)

### 1. Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it `suriya-portfolio`
3. Disable Google Analytics (optional)

### 2. Enable Firestore
1. Go to **Firestore Database** → **Create Database**
2. Choose **Production mode**
3. Select region (e.g., `asia-south1` for India)

### 3. Enable Authentication
1. Go to **Authentication** → **Get Started**
2. Enable **Email/Password** provider
3. Add a user: `admin@suriya.dev` + a strong password (this is your admin login)

### 4. Get Config Keys
1. Go to **Project Settings** → **General** → **Your apps**
2. Click **Add app** → Web (`</>`)
3. Copy the `firebaseConfig` object

### 5. Firestore Security Rules
Paste in **Firestore → Rules**:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /about/{doc}        { allow read: if true; allow write: if request.auth != null; }
    match /education/{doc}    { allow read: if true; allow write: if request.auth != null; }
    match /projects/{doc}     { allow read: if true; allow write: if request.auth != null; }
    match /certificates/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /skills/{doc}       { allow read: if true; allow write: if request.auth != null; }
    match /achievements/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /visits/{doc}       { allow create: if true; allow read, write: if request.auth != null; }
  }
}
```

### 6. Seed Initial Data
Go to **Firestore → Data** and create these collections manually using the sample data from `utils/seedFirestore.js`, or use Firebase Admin SDK to run it programmatically.

---

## 🗄️ Firestore Schema

### `about` collection
```json
{
  "name": "Suriya S",
  "tagline": "Full-Stack Developer · AI Engineer",
  "bio": "Long description of yourself...",
  "location": "Chennai, Tamil Nadu, India",
  "photoUrl": "https://...",
  "interests": ["AI/ML", "Web3", "3D Design"],
  "stats": [
    { "label": "Projects", "value": "25+" },
    { "label": "Certificates", "value": "12" },
    { "label": "Years Exp.", "value": "3+" }
  ],
  "order": 1
}
```

### `education` collection
```json
{
  "degree": "B.E. Computer Science & Engineering",
  "institution": "Anna University",
  "year": "2020 – 2024",
  "gpa": "8.6 / 10",
  "description": "Specialized in AI...",
  "subjects": ["DSA", "AI & ML", "DBMS"],
  "order": 1
}
```

### `projects` collection
```json
{
  "title": "Project Name",
  "description": "What it does...",
  "tags": ["Next.js", "Firebase", "AI"],
  "liveUrl": "https://...",
  "githubUrl": "https://github.com/...",
  "imageUrl": "https://...",
  "emoji": "🚀",
  "featured": true,
  "color": "rgba(201,168,76,0.1)",
  "order": 1
}
```

### `certificates` collection
```json
{
  "title": "Google Cloud Professional",
  "issuer": "Google Cloud",
  "date": "Mar 2024",
  "credentialUrl": "https://...",
  "skills": ["BigQuery", "Dataflow"],
  "emoji": "☁️",
  "order": 1
}
```

### `skills` collection
```json
{
  "name": "React & Next.js",
  "category": "Frontend",
  "level": 93,
  "icon": "⚛️",
  "order": 1
}
```

### `achievements` collection
```json
{
  "title": "Smart India Hackathon — Winner",
  "issuer": "Government of India",
  "year": "2023",
  "description": "National winner...",
  "emoji": "🏆",
  "order": 1
}
```

### `visits` collection (auto-generated)
```json
{
  "name": "Elon Musk",
  "company": "Tesla",
  "mode": "agentic",
  "sessionId": "uuid-v4",
  "timestamp": "Firestore Timestamp"
}
```

---

## 🛠️ Local Development

```bash
# 1. Clone / unzip the project
cd suriya-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your Firebase config

# 4. Run development server
npm run dev

# 5. Open in browser
# http://localhost:3000          → Portfolio (popup → mode select)
# http://localhost:3000/agentic  → 3D Experience
# http://localhost:3000/admin-login     → Admin login
# http://localhost:3000/admin-dashboard → CMS + Analytics
```

---

## 🚀 Deployment on Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard:
#    Project → Settings → Environment Variables
#    Add all variables from .env.local.example

# 5. Redeploy
vercel --prod
```

Or use the **Vercel Dashboard**:
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Add all `NEXT_PUBLIC_*` environment variables
4. Click **Deploy**

---

## 🎮 Feature Summary

### 🏠 Entry Flow
- Name + Company popup on first visit (sessionStorage prevents repeat)
- Stores visitor data in Firestore `visits` collection
- Mode selector: Manual or Agentic

### 📄 Manual Mode
- Full responsive portfolio with 7 sections
- All data from Firestore (real-time, editable via CMS)
- Animated with Framer Motion
- Glassmorphism design with gold accent system

### 🎬 Agentic Mode (3D)
- React Three Fiber canvas with Stars, fog, lighting
- Lamborghini-inspired 3D car (geometry primitives)
- GSAP camera animation flying between rooms
- 7 room buildings representing each portfolio section
- Web Speech API voice narration (Jarvis agent)
- HUD overlay with progress bar, data panel, nav controls

### 🔐 Admin Mode
- Firebase email/password authentication
- Protected route (redirects if not logged in)
- Full CRUD for all 6 portfolio sections
- Generic schema-driven form — add/edit/delete any entry
- Toast notifications for all actions

### 📊 Analytics
- Total visitors, unique visitors, agentic vs manual counts
- Monthly line chart
- Mode usage pie chart
- Company visits bar chart
- Recent visitors table with timestamps

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary font | Cormorant Garamond (display) |
| Body font | DM Sans |
| Mono font | JetBrains Mono |
| Gold | `#c9a84c` |
| Electric | `#00d4ff` |
| Background | `#050508` (void) |
| Card | `rgba(255,255,255,0.03)` glass |

---

## 🔒 Security Notes

- Admin routes check Firebase auth state on every render
- Firestore rules: public read for portfolio, auth required for writes
- Visits are create-only publicly, read only by admin
- All secrets in `.env.local` (never committed)
- Input sanitization via type constraints in CRUD forms

---

## 📦 Key Dependencies

```json
{
  "next": "14.2.3",
  "@react-three/fiber": "^8.16.8",
  "@react-three/drei": "^9.105.4",
  "three": "^0.164.1",
  "gsap": "^3.12.5",
  "firebase": "^10.11.1",
  "recharts": "^2.12.7",
  "framer-motion": "^11.2.10",
  "react-hot-toast": "^2.4.1"
}
```

---

## 🧩 Extending the Project

**Add a new portfolio section:**
1. Create Firestore collection (e.g., `publications`)
2. Add schema in `CRUDPanel.js` → `SCHEMAS` object
3. Add to `SECTIONS` array in `admin-dashboard/page.js`
4. Create component in `components/portfolio/`
5. Add to `ManualPortfolio.js`
6. Add room to `ROOMS` array in `AgenticScene.js`

**Add OpenAI for better Jarvis responses:**
```js
// In AgenticScene.js, replace speak() call with:
const res = await fetch('/api/jarvis', {
  method: 'POST',
  body: JSON.stringify({ section: room.id, data: sectionData })
});
const { text } = await res.json();
speak(text);
```

Create `/app/api/jarvis/route.js` calling OpenAI Chat API.
