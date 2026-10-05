import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Copy, Share2, Users, Trophy, Check, Zap, ExternalLink,
  Calendar, Download, Send, Edit3, Code, Globe, Clock,
} from 'lucide-react';
import { store, type ProjectSubmission } from '../store/dataStore';
import type { Student } from '../types';
import { createWhatsAppURL } from '../utils/messageGenerator';
import { useToast } from '../components/Toast';
import { FaqAccordion } from '../components/FaqAccordion';
import { WorkshopCountdown } from '../components/WorkshopCountdown';
import { EvaluationModal } from '../components/EvaluationModal';
import { evaluateProject } from '../services/aiEvaluation';
import {
  WORKSHOP_CONFIG, getWorkshopStartDate,
  formatWorkshopDate, formatWorkshopTime,
  getGoogleCalendarURL, downloadICSFile, isWorkshopLive,
} from '../config/workshop';

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
const DASHBOARD_FAQ = [
  { question: 'How do I know that my registration is confirmed?', answer: 'Your dashboard will display a confirmation message showing that your registration was successfully completed.' },
  { question: 'When is the workshop?', answer: 'The workshop date and time will be displayed on your dashboard once the schedule is finalized.' },
  { question: 'How do I join the workshop?', answer: 'When the workshop is live, your dashboard will provide the Join Workshop button or link.' },
  { question: 'What should I prepare before the workshop?', answer: 'Keep your laptop charged, internet connection stable, and required tools ready before the session begins.' },
  { question: 'Do I need to install anything before the workshop?', answer: 'If any installation is required, setup instructions will be provided before the session.' },
  { question: 'Can I share the workshop with my friends?', answer: 'Yes. You can use your personal referral code or referral link from the dashboard to invite other students.' },
  { question: 'How does the referral system work?', answer: 'Share your referral link or code with friends. When eligible students register through your referral, your referral count will increase.' },
  { question: 'Where can I see my referral progress?', answer: 'Your dashboard shows your current referrals and referral progress.' },
  { question: 'Where can I see my leaderboard position?', answer: 'Open the Leaderboard section from the navigation bar to see your current ranking.' },
  { question: 'What if I have a problem or question?', answer: 'Use the Help or Support option or contact the workshop team through the provided support channel.' },
];

// ─── Milestone logic ───────────────────────────────────────────────────────────
interface Milestone { threshold: number; message: string; emoji: string; color: string; }
const MILESTONES: Milestone[] = [
  { threshold: 0, message: 'Share with your friends to get started.', emoji: '🚀', color: '#7c3aed' },
  { threshold: 1, message: 'Great start! Keep the momentum going.', emoji: '⚡', color: '#6366f1' },
  { threshold: 3, message: "Nice! You're on the leaderboard.", emoji: '🔥', color: '#f59e0b' },
  { threshold: 5, message: "You're becoming a top referrer!", emoji: '🏅', color: '#10b981' },
  { threshold: 10, message: "You're a Growth Champion!", emoji: '🏆', color: '#FFD700' },
];
function getMilestoneMessage(count: number): Milestone {
  return [...MILESTONES].reverse().find((m) => count >= m.threshold) || MILESTONES[0];
}

// ─── Checklist items ───────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  'Registration completed',
  'Profile completed',
  'Add workshop to calendar',
  'Complete required AI/tool setup',
  'Join workshop communication group',
];

// ─── Journey steps ─────────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  'Registered',
  'Prepare',
  'Attend Workshop',
  'Build AI Project',
  'Submit Project',
  'Get Evaluated',
];

// ════════════════════════════════════════════════════════════════════════════════
export function DashboardPage() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  // Checklist
  const [checklist, setChecklist] = useState<boolean[]>([true, true, false, false, false]);

  // Project submission
  const [project, setProject] = useState<ProjectSubmission | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ projectName: '', description: '', githubUrl: '', demoUrl: '' });
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const current = store.getCurrentStudent();
    if (!current) { navigate('/login'); return; }
    setStudent(current);

    const count = store.getReferralCount(current.id, current.referralCode);
    setReferralCount(count);

    const lb = store.getLeaderboard();
    const myEntry = lb.find((e) => e.referralCode === current.referralCode);
    setRank(myEntry?.rank || null);

    // Load checklist
    setChecklist(store.getChecklist(current.id));

    // Load project
    const sub = store.getProjectSubmission(current.id);
    setProject(sub);
    if (sub) setProjectForm({ projectName: sub.projectName, description: sub.description, githubUrl: sub.githubUrl, demoUrl: sub.demoUrl });
  }, [navigate]);

  if (!student) return null;

  const domain = window.location.origin;
  const referralLink = `${domain}/register?ref=${student.referralCode}`;
  const milestone = getMilestoneMessage(referralCount);
  const progressPct = Math.min(100, (referralCount / 10) * 100);
  const checklistDone = checklist.filter(Boolean).length;

  // ── Copy helpers ─────────────────────────────────────────────────────────────
  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      showToast(type === 'code' ? '✓ Referral code copied!' : '✓ Referral link copied!', 'success');
      setTimeout(() => setCopied(null), 2000);
    } catch { showToast('Could not copy. Please copy manually.', 'error'); }
  };

  const openWhatsApp = () => {
    const msg = `🚀 I'm joining the NxtWave "${WORKSHOP_CONFIG.title}" workshop!\n\nIt's free and beginner-friendly.\n\nJoin me:\n${referralLink}`;
    window.open(createWhatsAppURL(msg), '_blank');
  };

  // ── Checklist toggle ─────────────────────────────────────────────────────────
  const toggleChecklist = (idx: number) => {
    if (idx <= 1) return; // auto-checked
    const updated = [...checklist];
    updated[idx] = !updated[idx];
    setChecklist(updated);
    store.saveChecklist(student.id, updated);
  };

  // ── Project submission ───────────────────────────────────────────────────────
  const validateProject = (): boolean => {
    const errs: Record<string, string> = {};
    if (!projectForm.projectName.trim()) errs.projectName = 'Project name is required';
    if (!projectForm.description.trim()) errs.description = 'Description is required';
    if (!projectForm.githubUrl.trim()) errs.githubUrl = 'GitHub URL is required';
    else if (!/^https?:\/\/(www\.)?github\.com\/.+/i.test(projectForm.githubUrl.trim())) errs.githubUrl = 'Enter a valid GitHub URL';
    if (projectForm.demoUrl.trim() && !/^https?:\/\/.+/i.test(projectForm.demoUrl.trim())) errs.demoUrl = 'Enter a valid URL';
    setProjectErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitProject = () => {
    if (!validateProject()) return;
    const sub = store.saveProjectSubmission(student.id, projectForm);
    setProject(sub);
    setShowProjectForm(false);
    showToast('✓ Project submitted successfully!', 'success');
  };

  const handleEvaluateProject = async () => {
    if (!project) return;
    
    // Set to evaluating state locally and in store
    const updated = store.updateProjectStatus(student.id, 'evaluating');
    if (updated) setProject(updated);

    try {
      const evaluation = await evaluateProject(project);
      const finalProject = store.saveProjectEvaluation(student.id, evaluation);
      if (finalProject) {
        setProject(finalProject);
        showToast('✓ Evaluation complete!', 'success');
      }
    } catch (error) {
      const failedProject = store.updateProjectStatus(student.id, 'evaluation_failed');
      if (failedProject) setProject(failedProject);
      showToast('⚠ Evaluation failed. Please try again.', 'error');
    }
  };

  // ── Journey progress ─────────────────────────────────────────────────────────
  const journeyProgress = project ? (project.status === 'evaluated' ? 6 : 5) : (isWorkshopLive() ? 3 : 2);

  const workshopStart = getWorkshopStartDate();

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── 1. Welcome / Registration Confirmation ── */}
        <div style={{
          padding: '24px 28px', borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 40 }}>🎉</div>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, marginBottom: 4 }}>
              You're in, {student.name.split(' ')[0]}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Your registration for <strong style={{ color: 'var(--text-primary)' }}>{WORKSHOP_CONFIG.title}</strong> is confirmed.
            </p>
          </div>
        </div>

        {/* ── 2. Workshop Countdown + Calendar ── */}
        <div className="glass-card" style={{ padding: 32 }}>
          <WorkshopCountdown />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
              <Calendar size={16} color="#a78bfa" />
              <span>{formatWorkshopDate(workshopStart)}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <Clock size={14} color="#a78bfa" />
              <span>{formatWorkshopTime(workshopStart)} IST</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <a
              href={getGoogleCalendarURL()}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary" style={{ fontSize: 13 }}
            >
              <Calendar size={14} /> Add to Google Calendar
            </a>
            <button
              className="btn-secondary" style={{ fontSize: 13 }}
              onClick={() => { downloadICSFile(); showToast('✓ Calendar event downloaded!', 'success'); }}
            >
              <Download size={14} /> Download .ics
            </button>
          </div>
        </div>

        {/* ── 3. Workshop Journey ── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 20, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Workshop Journey</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {JOURNEY_STEPS.map((step, i) => {
              const done = i < journeyProgress;
              return (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: done ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${done ? 'transparent' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: done ? 'white' : 'var(--text-muted)',
                    }}>
                      {done ? <Check size={14} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div style={{ marginLeft: 13, width: 2, height: 16, background: done ? 'rgba(124,58,237,0.4)' : 'var(--border)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── 4. Pre-Workshop Checklist ── */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Get Ready for the Workshop</h3>
            <div className="badge badge-violet">{checklistDone} / {CHECKLIST_ITEMS.length}</div>
          </div>
          <div className="progress-bar-track" style={{ marginBottom: 16 }}>
            <div className="progress-bar-fill" style={{ width: `${(checklistDone / CHECKLIST_ITEMS.length) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CHECKLIST_ITEMS.map((item, i) => {
              const done = checklist[i];
              const autoChecked = i <= 1;
              return (
                <button
                  key={i}
                  onClick={() => toggleChecklist(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: done ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${done ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '12px 16px', cursor: autoChecked ? 'default' : 'pointer',
                    width: '100%', textAlign: 'left', color: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: done ? '#22c55e' : 'rgba(255,255,255,0.06)',
                    border: done ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && <Check size={14} color="white" />}
                  </div>
                  <span style={{ fontSize: 14, color: done ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: done ? 'none' : 'none' }}>{item}</span>
                </button>
              );
            })}
          </div>
          {checklistDone === CHECKLIST_ITEMS.length && (
            <div style={{
              marginTop: 16, padding: '14px 18px', borderRadius: 10,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
              textAlign: 'center', fontWeight: 600, color: '#22c55e', fontSize: 14,
            }}>
              🎉 You're fully prepared for the workshop!
            </div>
          )}
        </div>

        {/* ── 5. Profile + Referral grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* LEFT COLUMN: Profile + Invite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Student info */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 12 }}>Your Profile</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Name', student.name],
                  ['Email', student.email],
                  ['College', student.college],
                  ['Branch', student.branch],
                  ['Grad Year', student.graduationYear.toString()],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 14, whiteSpace: 'nowrap' }}>{l}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Your Friends */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Invite Your Friends</h2>

              {/* Code */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Your Referral Code</label>
                <div style={{
                  padding: '14px 18px', borderRadius: 10,
                  background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
                  fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 3,
                  textAlign: 'center', color: '#a78bfa', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {student.referralCode}
                  <button onClick={() => copyToClipboard(student.referralCode, 'code')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa', padding: 4 }}>
                    {copied === 'code' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Link */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Your Referral Link</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {referralLink}
                  </span>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button id="copy-referral-link" className="btn-secondary" onClick={() => copyToClipboard(referralLink, 'link')} style={{ flex: 1, justifyContent: 'center' }}>
                  {copied === 'link' ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
                </button>
                <button id="share-whatsapp-btn" className="btn-whatsapp" onClick={openWhatsApp} style={{ flex: 1, justifyContent: 'center' }}>
                  <Share2 size={15} /> WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats + Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value gradient-text">{referralCount}</div>
                <div className="kpi-label">Your Referrals</div>
              </div>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value" style={{ color: '#fbbf24' }}>{rank ? `#${rank}` : '—'}</div>
                <div className="kpi-label">Current Rank</div>
              </div>
            </div>

            {/* Referral progress */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Referral Progress</h3>
                <div className="badge badge-violet"><Users size={11} /> {referralCount} / 10</div>
              </div>
              <div className="progress-bar-track" style={{ marginBottom: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: 8, background: `${milestone.color}15`, border: `1px solid ${milestone.color}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{milestone.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: milestone.color }}>{milestone.message}</span>
              </div>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {[1, 3, 5, 7, 10].map((m) => (
                  <div key={m} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 4px',
                      background: referralCount >= m ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${referralCount >= m ? 'transparent' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: referralCount >= m ? 'white' : 'var(--text-muted)',
                    }}>{m}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>refs</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/leaderboard" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                <Trophy size={14} /> Leaderboard
              </Link>
              <Link to="/share" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                <Zap size={14} /> Generate Message
              </Link>
            </div>
          </div>
        </div>

        {/* ── 6. Project Submission ── */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20 }}>
              🚀 Submit Your AI Project
            </h3>
            {project && !showProjectForm && (
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setShowProjectForm(true)}>
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {project && !showProjectForm ? (
            <div>
              <div style={{
                padding: '14px 18px', borderRadius: 10, marginBottom: 20,
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Check size={18} color="#22c55e" />
                <span style={{ fontWeight: 600, color: '#22c55e', fontSize: 15 }}>Project Submitted</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[
                  ['Project Name', project.projectName],
                  ['Description', project.description],
                  ['GitHub URL', project.githubUrl],
                  ['Demo URL', project.demoUrl || '—'],
                  ['Submitted', new Date(project.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{label}</span>
                    <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '16px 20px', borderRadius: 12, marginTop: 16,
                background: project.status === 'evaluated' ? 'rgba(34,197,94,0.08)' : (project.status === 'evaluating' ? 'rgba(124,58,237,0.08)' : (project.status === 'evaluation_failed' ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.03)')),
                border: `1px solid ${project.status === 'evaluated' ? 'rgba(34,197,94,0.2)' : (project.status === 'evaluating' ? 'rgba(124,58,237,0.2)' : (project.status === 'evaluation_failed' ? 'rgba(248,113,113,0.2)' : 'var(--border)'))}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>AI Project Score</div>
                    {project.status === 'evaluating' && <div style={{ fontWeight: 600, color: '#a78bfa', fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>🤖 Evaluating...</div>}
                    {project.status === 'evaluation_failed' && <div style={{ fontWeight: 600, color: '#f87171', fontSize: 15 }}>⚠ Evaluation Failed</div>}
                    {project.status === 'submitted' && <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: 15 }}>Pending Evaluation</div>}
                    {project.status === 'evaluated' && project.evaluation && (
                      <div style={{ fontWeight: 800, color: project.evaluation.overallScore >= 75 ? '#22c55e' : '#fbbf24', fontSize: 20 }}>
                        {project.evaluation.overallScore} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ 100</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {(project.status === 'submitted' || project.status === 'evaluation_failed') && (
                      <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleEvaluateProject}>
                        🤖 Evaluate My Project
                      </button>
                    )}
                    {project.status === 'evaluated' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleEvaluateProject}>
                          Re-Evaluate
                        </button>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setShowEvaluationModal(true)}>
                          View Evaluation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label"><Send size={11} style={{ display: 'inline', marginRight: 4 }} />Project Name *</label>
                <input className="input-field" placeholder="My AI Chatbot" value={projectForm.projectName}
                  onChange={(e) => { setProjectForm(p => ({ ...p, projectName: e.target.value })); setProjectErrors(e2 => ({ ...e2, projectName: '' })); }} />
                {projectErrors.projectName && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{projectErrors.projectName}</div>}
              </div>
              <div>
                <label className="input-label">Description *</label>
                <textarea className="input-field" rows={3} placeholder="What does your project do?" value={projectForm.description}
                  style={{ resize: 'vertical', minHeight: 60 }}
                  onChange={(e) => { setProjectForm(p => ({ ...p, description: e.target.value })); setProjectErrors(e2 => ({ ...e2, description: '' })); }} />
                {projectErrors.description && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{projectErrors.description}</div>}
              </div>
              <div>
                <label className="input-label"><Code size={11} style={{ display: 'inline', marginRight: 4 }} />GitHub URL *</label>
                <input className="input-field" placeholder="https://github.com/username/project" value={projectForm.githubUrl}
                  onChange={(e) => { setProjectForm(p => ({ ...p, githubUrl: e.target.value })); setProjectErrors(e2 => ({ ...e2, githubUrl: '' })); }} />
                {projectErrors.githubUrl && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{projectErrors.githubUrl}</div>}
              </div>
              <div>
                <label className="input-label"><Globe size={11} style={{ display: 'inline', marginRight: 4 }} />Live Demo URL (Optional)</label>
                <input className="input-field" placeholder="https://your-demo.vercel.app" value={projectForm.demoUrl}
                  onChange={(e) => { setProjectForm(p => ({ ...p, demoUrl: e.target.value })); setProjectErrors(e2 => ({ ...e2, demoUrl: '' })); }} />
                {projectErrors.demoUrl && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{projectErrors.demoUrl}</div>}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submitProject}>
                  <Send size={15} /> {project ? 'Update Project' : 'Submit Project'}
                </button>
                {showProjectForm && project && (
                  <button className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setShowProjectForm(false)}>Cancel</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 7. Workshop Details + Before the Workshop ── */}
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Workshop Details</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                📅 {formatWorkshopDate(workshopStart)} • ⏰ {formatWorkshopTime(workshopStart)} IST
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                Duration: {WORKSHOP_CONFIG.durationMinutes} minutes • Online
              </p>
              <button
                className="btn-primary"
                disabled={!isWorkshopLive()}
                style={{ opacity: isWorkshopLive() ? 1 : 0.6, cursor: isWorkshopLive() ? 'pointer' : 'not-allowed', padding: '12px 24px' }}
              >
                {isWorkshopLive() ? 'Join Workshop Now' : 'Join Workshop (Link active 15 mins before)'}
              </button>
            </div>
            <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: 'var(--text-primary)' }}>Before the Workshop</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Keep your laptop ready', 'Check your internet connection', 'Complete any required setup', 'Join a few minutes early'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Check size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 8. FAQ ── */}
        <FaqAccordion
          title="Workshop Help & FAQs"
          subtitle="Everything you need to know before the workshop."
          items={DASHBOARD_FAQ}
        />

      </div>

      {/* ── Evaluation Modal ── */}
      {showEvaluationModal && project && (
        <EvaluationModal project={project} onClose={() => setShowEvaluationModal(false)} />
      )}
    </div>
  );
}
