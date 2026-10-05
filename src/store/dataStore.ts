import type { Student, Referral, Ambassador, Campaign, DailyRegistration, SourceBreakdown, LeaderboardEntry, CollegeLeaderboardEntry } from '../types';

// ─── Utility: Generate referral code from name ───────────────────────────────
export function generateReferralCode(name: string): string {
  const cleaned = name.replace(/\s+/g, '').toUpperCase().slice(0, 8);
  const suffix = Math.floor(10 + Math.random() * 89).toString();
  return `${cleaned}${suffix}`;
}

// ─── Seed Demo Data ────────────────────────────────────────────────────────────
const DEMO_STUDENTS: Student[] = [
  { id: 'd1', name: 'Aarav Sharma', email: 'aarav@example.com', whatsapp: '9876543201', college: 'VIT Vellore', branch: 'CSE', graduationYear: 2025, referralCode: 'AARAV23', referredBy: null, createdAt: '2026-09-27T08:12:00Z', source: 'direct' },
  { id: 'd2', name: 'Ananya Reddy', email: 'ananya@example.com', whatsapp: '9876543202', college: 'Amrita Vishwa Vidyapeetham', branch: 'CSE', graduationYear: 2025, referralCode: 'ANANYA12', referredBy: null, createdAt: '2026-09-27T09:00:00Z', source: 'ambassador' },
  { id: 'd3', name: 'Rahul Verma', email: 'rahul@example.com', whatsapp: '9876543203', college: 'SRM Institute', branch: 'IT', graduationYear: 2026, referralCode: 'RAHUL88', referredBy: null, createdAt: '2026-09-27T10:30:00Z', source: 'direct' },
  { id: 'd4', name: 'Sneha Patel', email: 'sneha@example.com', whatsapp: '9876543204', college: 'PSG College of Technology', branch: 'ECE', graduationYear: 2025, referralCode: 'SNEHA45', referredBy: null, createdAt: '2026-09-27T11:00:00Z', source: 'whatsapp_community' },
  { id: 'd5', name: 'Aditya Kumar', email: 'aditya@example.com', whatsapp: '9876543205', college: 'CBIT Hyderabad', branch: 'CSE', graduationYear: 2026, referralCode: 'ADITYA99', referredBy: null, createdAt: '2026-09-27T13:00:00Z', source: 'direct' },
  { id: 'd6', name: 'Priya Nair', email: 'priya@example.com', whatsapp: '9876543206', college: 'VIT Vellore', branch: 'MECH', graduationYear: 2027, referralCode: 'PRIYA07', referredBy: null, createdAt: '2026-09-28T08:00:00Z', source: 'referral' },
  { id: 'd7', name: 'Arjun Mehta', email: 'arjun@example.com', whatsapp: '9876543207', college: 'Amrita Vishwa Vidyapeetham', branch: 'CSE', graduationYear: 2025, referralCode: 'ARJUN22', referredBy: null, createdAt: '2026-09-28T09:30:00Z', source: 'referral' },
  { id: 'd8', name: 'Kavya Rao', email: 'kavya@example.com', whatsapp: '9876543208', college: 'SRM Institute', branch: 'CSE', graduationYear: 2026, referralCode: 'KAVYA34', referredBy: null, createdAt: '2026-09-28T10:00:00Z', source: 'referral' },
  { id: 'd9', name: 'Rohan Singh', email: 'rohan@example.com', whatsapp: '9876543209', college: 'BITS Pilani', branch: 'CS', graduationYear: 2025, referralCode: 'ROHAN56', referredBy: null, createdAt: '2026-09-28T11:00:00Z', source: 'college_email' },
  { id: 'd10', name: 'Meera Iyer', email: 'meera@example.com', whatsapp: '9876543210', college: 'PSG College of Technology', branch: 'CSE', graduationYear: 2026, referralCode: 'MEERA78', referredBy: null, createdAt: '2026-09-28T14:00:00Z', source: 'referral' },
  { id: 'd11', name: 'Karthik Reddy', email: 'karthik@example.com', whatsapp: '9876543211', college: 'SASTRA University', branch: 'IT', graduationYear: 2025, referralCode: 'KARTHIK11', referredBy: null, createdAt: '2026-09-29T08:00:00Z', source: 'direct' },
  { id: 'd12', name: 'Nisha Sharma', email: 'nisha@example.com', whatsapp: '9876543212', college: 'VIT Vellore', branch: 'CSE', graduationYear: 2026, referralCode: 'NISHA67', referredBy: null, createdAt: '2026-09-29T09:00:00Z', source: 'referral' }
];

const LEADERBOARD_CODES = DEMO_STUDENTS.map(s => s.referralCode);

// Generate 312 more demo students for realistic count
function generateMoreStudents(count: number): Student[] {
  const colleges = ['VIT Vellore', 'Amrita Vishwa Vidyapeetham', 'SRM Institute', 'PSG College of Technology', 'CBIT Hyderabad', 'SASTRA University', 'BITS Pilani', 'NIT Trichy', 'Anna University', 'Manipal Institute'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'AIDS', 'AIML'];
  const firstNames = ['Aarav', 'Aditi', 'Arjun', 'Deepa', 'Girish', 'Harini', 'Ishan', 'Jaya', 'Kabir', 'Lalitha', 'Madhav', 'Nandini', 'Om', 'Priya', 'Ravi', 'Saanvi', 'Tanvi', 'Uma', 'Varun', 'Yamini'];
  const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Singh', 'Gupta', 'Verma', 'Pillai', 'Joshi', 'Bhat', 'Rao', 'Shah'];
  const sources: Student['source'][] = ['direct', 'referral', 'whatsapp_community', 'college_email', 'ambassador'];
  
  const students: Student[] = [];
  for (let i = 0; i < count; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const name = `${first} ${last}`;
    const id = `gen_${i}`;
    const code = `${first.toUpperCase().slice(0,5)}${last.toUpperCase().slice(0,3)}${(10 + i % 90).toString()}`;
    const sourceIdx = i % sources.length;
    const collegePick = colleges[i % colleges.length];
    const days = Math.floor(i / 50);
    const date = new Date('2026-09-27T08:00:00Z');
    date.setDate(date.getDate() + days);
    date.setMinutes(date.getMinutes() + (i % 60));

    let referredBy = null;
    if (i < 50) referredBy = LEADERBOARD_CODES[0];
    else if (i < 90) referredBy = LEADERBOARD_CODES[1];
    else if (i < 125) referredBy = LEADERBOARD_CODES[2];
    else if (i < 155) referredBy = LEADERBOARD_CODES[3];
    else if (i < 180) referredBy = LEADERBOARD_CODES[4];
    else if (i < 200) referredBy = LEADERBOARD_CODES[5];
    else if (i < 215) referredBy = LEADERBOARD_CODES[6];
    else if (i < 225) referredBy = LEADERBOARD_CODES[7];
    else if (i < 232) referredBy = LEADERBOARD_CODES[8];
    else if (i < 237) referredBy = LEADERBOARD_CODES[9];
    else if (i < 240) referredBy = LEADERBOARD_CODES[10];
    else if (i < 242) referredBy = LEADERBOARD_CODES[11];

    students.push({
      id,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      whatsapp: `98${(10000000 + i).toString()}`,
      college: collegePick,
      branch: branches[i % branches.length],
      graduationYear: 2025 + (i % 3),
      referralCode: code,
      referredBy,
      createdAt: date.toISOString(),
      source: sources[sourceIdx],
    });
  }
  return students;
}

const ALL_STUDENTS: Student[] = [...DEMO_STUDENTS, ...generateMoreStudents(312)];

// ─── Local Storage Key ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'nxtwave_workshop_data';
const CHECKLIST_KEY = 'nxtwave_checklists';
const PROJECTS_KEY = 'nxtwave_projects';

export interface ProjectEvaluation {
  overallScore: number;
  criteria: {
    problemDefinition: number;
    aiImplementation: number;
    technicalImplementation: number;
    innovation: number;
    documentation: number;
    demo: number;
    completeness: number;
  };
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  verification: {
    github: 'verified' | 'not_verified';
    demo: 'verified' | 'not_verified';
  };
  recommendation: string;
}

export interface ProjectSubmission {
  studentId: string;
  projectName: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  status: 'submitted' | 'evaluating' | 'evaluated' | 'evaluation_failed';
  evaluation?: ProjectEvaluation;
  submittedAt: string;
  updatedAt: string;
}

interface AppData {
  students: Student[];
  referrals: Referral[];
  currentStudent: Student | null;
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      return parsed;
    }
  } catch {
    // ignore
  }
  return { students: [], referrals: [], currentStudent: null };
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ─── Checklist helpers (per-user, keyed by student id) ─────────────────────────
function loadChecklists(): Record<string, boolean[]> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveChecklists(data: Record<string, boolean[]>) {
  try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

// ─── Project helpers (per-user, keyed by student id) ───────────────────────────
function loadProjects(): Record<string, ProjectSubmission> {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveProjects(data: Record<string, ProjectSubmission>) {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

// ─── Store API ─────────────────────────────────────────────────────────────────
export const store = {
  // Get all students (demo + real)
  getAllStudents(): Student[] {
    const local = loadData();
    const localIds = new Set(local.students.map((s) => s.id));
    const demo = ALL_STUDENTS.filter((s) => !localIds.has(s.id));
    return [...local.students, ...demo];
  },

  // Register a new student
  registerStudent(data: Omit<Student, 'id' | 'referralCode' | 'createdAt'>): Student {
    const local = loadData();
    
    // Check for duplicate email
    const allStudents = store.getAllStudents();
    if (allStudents.some((s) => s.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('A student with this email is already registered.');
    }
    
    const id = `real_${Date.now()}`;
    const referralCode = generateReferralCode(data.name);
    const student: Student = {
      ...data,
      id,
      referralCode,
      createdAt: new Date().toISOString(),
    };

    local.students.push(student);

    // If referred, record referral
    if (data.referredBy) {
      const referrer = allStudents.find((s) => s.referralCode === data.referredBy);
      if (referrer) {
        const referral: Referral = {
          id: `ref_${Date.now()}`,
          referrerId: referrer.id,
          referredUserId: id,
          createdAt: new Date().toISOString(),
        };
        local.referrals.push(referral);
      }
    }

    local.currentStudent = student;
    saveData(local);
    return student;
  },

  // Get current logged-in student
  getCurrentStudent(): Student | null {
    return loadData().currentStudent;
  },

  // Set current student (for demo login by referral code)
  setCurrentStudent(student: Student) {
    const local = loadData();
    local.currentStudent = student;
    saveData(local);
  },

  // Get student by referral code
  getStudentByReferralCode(code: string): Student | null {
    return store.getAllStudents().find((s) => s.referralCode === code) || null;
  },

  // Get referral count for a student
  getReferralCount(studentId: string, referralCode: string): number {
    const local = loadData();
    const localReferralCount = local.referrals.filter((r) => r.referrerId === studentId).length;
    
    // For demo students, compute from ALL_STUDENTS
    const demoCount = ALL_STUDENTS.filter((s) => s.referredBy === referralCode && !s.id.startsWith('real_')).length;
    
    // Real students who were referred by this code
    const realCount = local.students.filter((s) => s.referredBy === referralCode).length;
    
    return localReferralCount + (studentId.startsWith('d') || studentId.startsWith('gen_') ? demoCount : realCount);
  },

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    const all = store.getAllStudents();
    const current = store.getCurrentStudent();

    const countMap: Record<string, { name: string; college: string; code: string; count: number; id: string }> = {};
    
    for (const s of all) {
      if (!countMap[s.referralCode]) {
        countMap[s.referralCode] = { name: s.name, college: s.college, code: s.referralCode, count: 0, id: s.id };
      }
    }
    for (const s of all) {
      if (s.referredBy && countMap[s.referredBy]) {
        countMap[s.referredBy].count += 1;
      }
    }

    const entries = Object.values(countMap)
      .filter((e) => e.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map((e, i) => ({
        rank: i + 1,
        id: e.id,
        name: e.name,
        college: e.college,
        referralCode: e.code,
        referrals: e.count,
        isCurrentUser: current ? e.code === current.referralCode : false,
      }));

    return entries;
  },

  // College leaderboard
  getCollegeLeaderboard(): CollegeLeaderboardEntry[] {
    const all = store.getAllStudents();
    const countMap: Record<string, number> = {};
    for (const s of all) {
      countMap[s.college] = (countMap[s.college] || 0) + 1;
    }
    const entries = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
    const max = entries[0]?.[1] || 1;
    return entries.map(([name, count], i) => ({
      rank: i + 1,
      name,
      registrations: count,
      maxRegistrations: max,
      percentage: Math.round((count / max) * 100),
    }));
  },

  // Campaign stats
  getCampaignStats(): Campaign {
    const all = store.getAllStudents();
    const total = all.length;
    const referralStudents = all.filter((s) => s.referredBy !== null);
    const referralCount = referralStudents.length;

    const referrerSet = new Set(referralStudents.map((s) => s.referredBy).filter(Boolean));
    const activeReferrers = referrerSet.size;

    const collegeSet = new Set(all.map((s) => s.college));
    const avgReferrals = activeReferrers > 0 ? +(referralCount / activeReferrers).toFixed(1) : 0;

    const endDate = new Date('2026-10-03T23:59:59Z');
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const progress = total / 500;
    const dayElapsed = (7 - daysRemaining) / 7;
    const status: Campaign['status'] = total >= 500 ? 'completed' : progress >= dayElapsed - 0.1 ? 'on_track' : 'needs_attention';

    return {
      target: 500,
      currentRegistrations: total,
      referralRegistrations: referralCount,
      activeReferrers,
      colleges: collegeSet.size,
      averageReferrals: avgReferrals,
      startDate: '2026-09-27',
      endDate: '2026-10-03',
      daysRemaining,
      status,
    };
  },

  // Daily registrations (simulated growth curve)
  getDailyRegistrations(): DailyRegistration[] {
    const targets = [50, 100, 175, 250, 350, 440, 500];
    const dates = ['Sep 27', 'Sep 28', 'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3'];
    return targets.map((cumulative, i) => ({
      day: i + 1,
      date: dates[i],
      count: i === 0 ? cumulative : cumulative - targets[i - 1],
      cumulative,
    }));
  },

  // Source breakdown
  getSourceBreakdown(): SourceBreakdown[] {
    return [
      { source: 'College Ambassadors', count: 220, color: '#6366f1' },
      { source: 'WhatsApp Communities', count: 180, color: '#8b5cf6' },
      { source: 'College Email', count: 50, color: '#a78bfa' },
      { source: 'Student Referrals', count: 50, color: '#c4b5fd' },
    ];
  },

  // Top ambassadors
  getTopAmbassadors(): Ambassador[] {
    return [
      { id: 'a1', name: 'Aarav Sharma', college: 'VIT', referralCode: 'AARAV23', referralCount: 27, rank: 1 },
      { id: 'a2', name: 'CSE Club', college: 'VIT', referralCode: 'CSECLUB07', referralCount: 23, rank: 2 },
      { id: 'a3', name: 'AI Club Lead', college: 'SRM', referralCode: 'AICLUB12', referralCount: 19, rank: 3 },
      { id: 'a4', name: 'Vikram AI', college: 'VIT', referralCode: 'VITAI09', referralCount: 17, rank: 4 },
      { id: 'a5', name: 'SRM CS Club', college: 'SRM', referralCode: 'SRMCS05', referralCount: 15, rank: 5 },
      { id: 'a6', name: 'Ananya Reddy', college: 'Amrita', referralCode: 'ANANYA12', referralCount: 12, rank: 6 },
      { id: 'a7', name: 'Kavya Rao', college: 'SRM', referralCode: 'KAVYA34', referralCount: 10, rank: 7 },
    ];
  },

  // Admin table: get recent registrations
  getAdminRegistrations(): Student[] {
    return store.getAllStudents().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 50);
  },

  // Validate referral code exists
  validateReferralCode(code: string): boolean {
    if (!code) return false;
    return store.getAllStudents().some((s) => s.referralCode === code);
  },

  // Login existing student
  login(email: string): Student {
    const local = loadData();
    const allStudents = store.getAllStudents();
    const student = allStudents.find((s) => s.email.toLowerCase() === email.toLowerCase().trim());
    
    if (!student) {
      throw new Error('Invalid email. Please try again.');
    }
    
    local.currentStudent = student;
    saveData(local);
    return student;
  },

  // Logout / clear current student
  logout() {
    const local = loadData();
    local.currentStudent = null;
    saveData(local);
  },

  // ─── Checklist API ────────────────────────────────────────────────────────────
  getChecklist(studentId: string): boolean[] {
    const all = loadChecklists();
    // Default: item 0 (Registration) and item 1 (Profile) are auto-checked
    return all[studentId] || [true, true, false, false, false];
  },

  saveChecklist(studentId: string, items: boolean[]) {
    const all = loadChecklists();
    // Always force items 0 & 1 to true (auto-completed)
    items[0] = true;
    items[1] = true;
    all[studentId] = items;
    saveChecklists(all);
  },

  // ─── Project Submission API ───────────────────────────────────────────────────
  getProjectSubmission(studentId: string): ProjectSubmission | null {
    const all = loadProjects();
    return all[studentId] || null;
  },

  saveProjectSubmission(studentId: string, data: Omit<ProjectSubmission, 'studentId' | 'status' | 'evaluation' | 'submittedAt' | 'updatedAt'>): ProjectSubmission {
    const all = loadProjects();
    const existing = all[studentId];
    const now = new Date().toISOString();
    const submission: ProjectSubmission = {
      ...data,
      studentId,
      status: existing && existing.status !== 'evaluation_failed' ? existing.status : 'submitted',
      evaluation: existing ? existing.evaluation : undefined,
      submittedAt: existing ? existing.submittedAt : now,
      updatedAt: now,
    };
    all[studentId] = submission;
    saveProjects(all);
    return submission;
  },

  updateProjectStatus(studentId: string, status: ProjectSubmission['status']): ProjectSubmission | null {
    const all = loadProjects();
    const existing = all[studentId];
    if (!existing) return null;
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    all[studentId] = existing;
    saveProjects(all);
    return existing;
  },

  saveProjectEvaluation(studentId: string, evaluation: ProjectEvaluation): ProjectSubmission | null {
    const all = loadProjects();
    const existing = all[studentId];
    if (!existing) return null;
    existing.status = 'evaluated';
    existing.evaluation = evaluation;
    existing.updatedAt = new Date().toISOString();
    all[studentId] = existing;
    saveProjects(all);
    return existing;
  },

  // ─── Admin: aggregated submission stats ───────────────────────────────────────
  getSubmissionStats(): { total: number; submitted: number; evaluating: number; evaluated: number; failed: number } {
    const all = loadProjects();
    const subs = Object.values(all);
    return {
      total: subs.length,
      submitted: subs.filter(s => s.status === 'submitted').length,
      evaluating: subs.filter(s => s.status === 'evaluating').length,
      evaluated: subs.filter(s => s.status === 'evaluated').length,
      failed: subs.filter(s => s.status === 'evaluation_failed').length,
    };
  },

  getAllProjects(): (ProjectSubmission & { studentName: string })[] {
    const all = loadProjects();
    const students = loadData().students;
    const subs = Object.values(all).map(p => {
      const student = students.find(s => s.id === p.studentId);
      return { ...p, studentName: student?.name || 'Unknown' };
    });
    return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  getChecklistStats(): { totalUsers: number; fullyCompleted: number } {
    const all = loadChecklists();
    const entries = Object.values(all);
    return {
      totalUsers: entries.length,
      fullyCompleted: entries.filter(arr => arr.every(Boolean)).length,
    };
  },
};

