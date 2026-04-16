# 🔥 Firebase Realtime Database Setup Guide

## Step 1 — Enable Realtime Database

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Left sidebar → **Realtime Database** → **Create Database**
4. Choose region (e.g., `us-central1` or `asia-southeast1`)
5. Start in **Test mode** (change rules later)

## Step 2 — Get Database URL

After creating, you'll see a URL like:
```
https://your-project-default-rtdb.firebaseio.com
```
Copy this and put it in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

## Step 3 — Set Database Rules

In Firebase Console → Realtime Database → **Rules** tab, paste:

```json
{
  "rules": {
    "about":        { ".read": true, ".write": "auth != null" },
    "education":    { ".read": true, ".write": "auth != null" },
    "projects":     { ".read": true, ".write": "auth != null" },
    "certificates": { ".read": true, ".write": "auth != null" },
    "skills":       { ".read": true, ".write": "auth != null" },
    "achievements": { ".read": true, ".write": "auth != null" },
    "visits":       { ".read": "auth != null", ".write": true }
  }
}
```

## Step 4 — Seed Data (Import JSON)

In Firebase Console → Realtime Database → **⋮ menu** → **Import JSON**

Upload this JSON file (save as `seed-data.json`):

```json
{
  "about": {
    "item1": {
      "name": "Suriya S",
      "title": "Suriya S",
      "tagline": "Full-Stack Developer · AI Engineer · Creator",
      "subtitle": "Full-Stack Developer · AI Engineer",
      "bio": "I build digital experiences at the intersection of elegant design and powerful engineering. With expertise in full-stack development and a deep passion for AI, I craft solutions that are both technically robust and visually compelling.",
      "location": "Chennai, Tamil Nadu, India",
      "level": 95,
      "createdAt": 1700000000000
    }
  },
  "education": {
    "item1": {
      "title": "B.E. Computer Science & Engineering",
      "degree": "B.E. Computer Science & Engineering",
      "subtitle": "Anna University · 2020–2024",
      "institution": "Anna University",
      "year": "2024",
      "gpa": "8.6 / 10",
      "level": 92,
      "description": "Specialized in AI, data structures, and distributed systems. Led the college coding club.",
      "createdAt": 1700000001000
    },
    "item2": {
      "title": "Higher Secondary (12th Grade)",
      "degree": "Higher Secondary (12th Grade)",
      "subtitle": "Sri Vidya Mandir HSS · 92.4%",
      "institution": "Sri Vidya Mandir HSS",
      "year": "2020",
      "gpa": "92.4%",
      "level": 92,
      "createdAt": 1700000002000
    }
  },
  "projects": {
    "item1": {
      "title": "Suriya AI Portfolio",
      "subtitle": "Next.js · Three.js · Firebase · GSAP",
      "description": "A cinematic 3D portfolio experience with AI agent narration, Firebase CMS, and analytics dashboard.",
      "level": 98,
      "featured": true,
      "createdAt": 1700000003000
    },
    "item2": {
      "title": "SmartFinance AI",
      "subtitle": "React · Python · TensorFlow · FastAPI",
      "description": "AI-powered personal finance tracker that predicts spending patterns and generates monthly reports.",
      "level": 92,
      "featured": true,
      "createdAt": 1700000004000
    },
    "item3": {
      "title": "CollabDocs Platform",
      "subtitle": "Next.js · WebSockets · OpenAI · Redis",
      "description": "Real-time collaborative document editor with conflict resolution, version history, and AI writing assistant.",
      "level": 88,
      "createdAt": 1700000005000
    },
    "item4": {
      "title": "Real-time Analytics",
      "subtitle": "Node.js · Redis · PostgreSQL",
      "description": "High-performance analytics dashboard processing millions of events per second.",
      "level": 85,
      "createdAt": 1700000006000
    }
  },
  "certificates": {
    "item1": {
      "title": "Google Cloud Professional Data Engineer",
      "subtitle": "Google Cloud Platform",
      "issuer": "Google Cloud",
      "year": "2024",
      "date": "Mar 2024",
      "createdAt": 1700000007000
    },
    "item2": {
      "title": "AWS Certified Solutions Architect",
      "subtitle": "Amazon Web Services",
      "issuer": "Amazon Web Services",
      "year": "2023",
      "date": "Nov 2023",
      "createdAt": 1700000008000
    },
    "item3": {
      "title": "TensorFlow Developer Certificate",
      "subtitle": "Google / TensorFlow",
      "issuer": "Google / TensorFlow",
      "year": "2023",
      "date": "Aug 2023",
      "createdAt": 1700000009000
    },
    "item4": {
      "title": "Meta Front-End Developer",
      "subtitle": "Meta Blueprint · Coursera",
      "issuer": "Meta",
      "year": "2024",
      "date": "Jan 2024",
      "createdAt": 1700000010000
    }
  },
  "skills": {
    "item1": {
      "title": "React & Next.js",
      "name": "React & Next.js",
      "subtitle": "Frontend Development",
      "category": "Frontend",
      "level": 93,
      "createdAt": 1700000011000
    },
    "item2": {
      "title": "Python & AI/ML",
      "name": "Python & AI/ML",
      "subtitle": "TensorFlow · PyTorch",
      "category": "AI & ML",
      "level": 88,
      "createdAt": 1700000012000
    },
    "item3": {
      "title": "Node.js & Firebase",
      "name": "Node.js & Firebase",
      "subtitle": "Backend & Cloud",
      "category": "Backend",
      "level": 86,
      "createdAt": 1700000013000
    },
    "item4": {
      "title": "Three.js & R3F",
      "name": "Three.js & R3F",
      "subtitle": "3D Web Development",
      "category": "3D",
      "level": 82,
      "createdAt": 1700000014000
    },
    "item5": {
      "title": "Docker & AWS",
      "name": "Docker & AWS",
      "subtitle": "DevOps & Deployment",
      "category": "DevOps",
      "level": 78,
      "createdAt": 1700000015000
    }
  },
  "achievements": {
    "item1": {
      "title": "Smart India Hackathon — Winner",
      "subtitle": "National Winner · 5000+ teams",
      "issuer": "Government of India",
      "year": "2023",
      "description": "National winner among 5,000+ teams for building an AI-based drought prediction system.",
      "createdAt": 1700000016000
    },
    "item2": {
      "title": "Google Developer Student Club Lead",
      "subtitle": "200+ member community led",
      "issuer": "Google",
      "year": "2022",
      "description": "Led a 200+ member tech community, organizing workshops and hackathons.",
      "createdAt": 1700000017000
    },
    "item3": {
      "title": "IEEE Best Paper Award",
      "subtitle": "Edge computing research",
      "issuer": "IEEE",
      "year": "2023",
      "description": "Best paper award for research on adaptive ML pipelines in edge computing.",
      "createdAt": 1700000018000
    },
    "item4": {
      "title": "HackWithInfy — Top 50",
      "subtitle": "From 50,000+ participants",
      "issuer": "Infosys",
      "year": "2023",
      "description": "Selected in the top 50 nationwide from 50,000+ participants.",
      "createdAt": 1700000019000
    }
  }
}
```

## ✅ After Importing

Your portfolio will automatically read all this data in real-time.
To edit any data, use the **Admin Dashboard** at `/admin-dashboard`.

## 🔄 How RTDB Data is Read

The `lib/rtdb.js` `fetchRTDB(path)` function:
1. Reads all children of a path (e.g., `/skills`)
2. Converts `{ key: { ...data } }` → `[{ id: key, ...data }]`
3. Returns array — same format the HUD and portfolio components expect

