// utils/seedFirestore.js
// Run this ONCE to seed Firestore with sample data.
// Usage: node utils/seedFirestore.js  (after configuring Firebase admin SDK)
// OR: paste each object into the Firebase Console manually.

/**
 * ─── FIRESTORE SAMPLE DATA ───────────────────────────────────────────────────
 *
 * Collection: about
 */
const aboutSample = {
  name: 'Suriya S',
  tagline: 'Full-Stack Developer · AI Engineer · Creator',
  bio: 'I build digital experiences that sit at the intersection of elegant design and powerful engineering. With expertise in full-stack development and a deep passion for AI, I craft solutions that are both technically robust and visually compelling.',
  location: 'Chennai, Tamil Nadu, India',
  photoUrl: '',
  interests: ['AI/ML', 'Web3', '3D Design', 'Open Source', 'Music'],
  stats: [
    { label: 'Projects', value: '25+' },
    { label: 'Certificates', value: '12' },
    { label: 'Years Exp.', value: '3+' },
  ],
  order: 1,
};

/**
 * Collection: education
 */
const educationSamples = [
  {
    degree: 'B.E. Computer Science & Engineering',
    institution: 'Anna University',
    year: '2020 – 2024',
    gpa: '8.6 / 10',
    description: 'Specialized in AI, data structures, and distributed systems. Led the college coding club.',
    subjects: ['DSA', 'AI & ML', 'DBMS', 'Cloud Computing', 'Computer Networks'],
    order: 1,
  },
  {
    degree: 'Higher Secondary (12th Grade)',
    institution: 'Sri Vidya Mandir HSS',
    year: '2018 – 2020',
    gpa: '92.4%',
    description: 'Computer Science stream. State-level science fair participant.',
    subjects: ['Mathematics', 'Physics', 'Computer Science'],
    order: 2,
  },
];

/**
 * Collection: projects
 */
const projectSamples = [
  {
    title: 'Suriya AI Portfolio',
    description: 'A cinematic 3D portfolio experience with AI agent narration, Firebase CMS, and analytics dashboard.',
    tags: ['Next.js', 'Three.js', 'Firebase', 'GSAP', 'AI'],
    liveUrl: 'https://suriya.dev',
    githubUrl: 'https://github.com/suriya/portfolio',
    emoji: '🚀',
    featured: true,
    order: 1,
  },
  {
    title: 'SmartFinance AI',
    description: 'An AI-powered personal finance tracker that predicts spending patterns and generates monthly reports.',
    tags: ['React', 'Python', 'TensorFlow', 'FastAPI'],
    liveUrl: '',
    githubUrl: 'https://github.com/suriya/smartfinance',
    emoji: '💰',
    featured: true,
    order: 2,
  },
  {
    title: 'CollabDocs',
    description: 'Real-time collaborative document editor with conflict resolution, version history, and AI writing assistant.',
    tags: ['Next.js', 'WebSockets', 'OpenAI', 'Redis'],
    liveUrl: '',
    githubUrl: '',
    emoji: '📝',
    featured: false,
    order: 3,
  },
];

/**
 * Collection: certificates
 */
const certificateSamples = [
  {
    title: 'Google Cloud Professional Data Engineer',
    issuer: 'Google Cloud',
    date: 'Mar 2024',
    credentialUrl: 'https://google.com/cert/xxx',
    skills: ['BigQuery', 'Dataflow', 'Pub/Sub'],
    emoji: '☁️',
    order: 1,
  },
  {
    title: 'Meta Front-End Developer',
    issuer: 'Meta / Coursera',
    date: 'Jan 2024',
    credentialUrl: '',
    skills: ['React', 'CSS', 'UX Design'],
    emoji: '⚛️',
    order: 2,
  },
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'Nov 2023',
    credentialUrl: '',
    skills: ['EC2', 'S3', 'Lambda', 'VPC'],
    emoji: '🏗️',
    order: 3,
  },
  {
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google / TensorFlow',
    date: 'Aug 2023',
    credentialUrl: '',
    skills: ['TensorFlow', 'Keras', 'CNN', 'NLP'],
    emoji: '🧠',
    order: 4,
  },
];

/**
 * Collection: skills
 */
const skillSamples = [
  { name: 'JavaScript / TypeScript', category: 'Languages', level: 92, icon: '⚡', order: 1 },
  { name: 'Python', category: 'Languages', level: 88, icon: '🐍', order: 2 },
  { name: 'React & Next.js', category: 'Frontend', level: 93, icon: '⚛️', order: 3 },
  { name: 'Three.js / R3F', category: 'Frontend', level: 80, icon: '🎮', order: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: '🎨', order: 5 },
  { name: 'Node.js / Express', category: 'Backend', level: 85, icon: '🌿', order: 6 },
  { name: 'Firebase / Firestore', category: 'Backend', level: 88, icon: '🔥', order: 7 },
  { name: 'PostgreSQL / MongoDB', category: 'Backend', level: 82, icon: '🗄️', order: 8 },
  { name: 'TensorFlow / PyTorch', category: 'AI & ML', level: 75, icon: '🧠', order: 9 },
  { name: 'LangChain / OpenAI API', category: 'AI & ML', level: 78, icon: '🤖', order: 10 },
  { name: 'Docker / Kubernetes', category: 'DevOps', level: 72, icon: '🐳', order: 11 },
  { name: 'Git & CI/CD', category: 'DevOps', level: 88, icon: '🔀', order: 12 },
];

/**
 * Collection: achievements
 */
const achievementSamples = [
  {
    title: 'Smart India Hackathon — Winner',
    issuer: 'Government of India',
    year: '2023',
    description: 'National winner among 5,000+ teams for building an AI-based drought prediction system.',
    emoji: '🏆',
    order: 1,
  },
  {
    title: 'Google Developer Student Club Lead',
    issuer: 'Google',
    year: '2022–2023',
    description: 'Led a 200+ member tech community, organizing workshops and hackathons.',
    emoji: '🎯',
    order: 2,
  },
  {
    title: 'Top 50 — HackWithInfy',
    issuer: 'Infosys',
    year: '2023',
    description: 'Selected in the top 50 nationwide from 50,000+ participants.',
    emoji: '⭐',
    order: 3,
  },
  {
    title: 'Best Paper Award — ICSE 2023',
    issuer: 'IEEE',
    year: '2023',
    description: 'Best paper award for research on adaptive ML pipelines in edge computing.',
    emoji: '📄',
    order: 4,
  },
];

/**
 * ─── FIRESTORE SECURITY RULES ────────────────────────────────────────────────
 *
 * Paste these rules in Firebase Console → Firestore → Rules:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Public read for portfolio data
 *     match /about/{doc}    { allow read: if true; allow write: if request.auth != null; }
 *     match /education/{doc}{ allow read: if true; allow write: if request.auth != null; }
 *     match /projects/{doc} { allow read: if true; allow write: if request.auth != null; }
 *     match /certificates/{doc} { allow read: if true; allow write: if request.auth != null; }
 *     match /skills/{doc}   { allow read: if true; allow write: if request.auth != null; }
 *     match /achievements/{doc} { allow read: if true; allow write: if request.auth != null; }
 *     // Anyone can log visits, only admin can read
 *     match /visits/{doc}   { allow create: if true; allow read, write: if request.auth != null; }
 *   }
 * }
 */

module.exports = {
  aboutSample,
  educationSamples,
  projectSamples,
  certificateSamples,
  skillSamples,
  achievementSamples,
};
