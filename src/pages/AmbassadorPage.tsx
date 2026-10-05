import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Trophy, TrendingUp, Users, Copy, Check, ExternalLink } from 'lucide-react';
import { store } from '../store/dataStore';
import type { Student, Ambassador } from '../types';
import { createWhatsAppURL, getDefaultShareMessage } from '../utils/messageGenerator';
import { useToast } from '../components/Toast';

export function AmbassadorPage() {
  const { showToast, ToastComponent } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [ambassadors] = useState<Ambassador[]>(store.getTopAmbassadors());
  const [referralCount, setReferralCount] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [collegeRank, setCollegeRank] = useState<number | null>(null);
  const [recentReferrals, setRecentReferrals] = useState<Student[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const current = store.getCurrentStudent();
    setStudent(current);

    if (current) {
      const count = store.getReferralCount(current.id, current.referralCode);
      setReferralCount(count);

      const lb = store.getLeaderboard();
      const myEntry = lb.find((e) => e.referralCode === current.referralCode);
      setRank(myEntry?.rank ?? null);

      const colleges = store.getCollegeLeaderboard();
      const myCollege = colleges.find((c) => c.name === current.college);
      setCollegeRank(myCollege?.rank ?? null);

      // Recent referrals: students referred by this code
      const all = store.getAllStudents();
      const referred = all
        .filter((s) => s.referredBy === current.referralCode)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentReferrals(referred);
    }
  }, []);

  const domain = window.location.origin;
  const referralLink = student ? `${domain}/register?ref=${student.referralCode}` : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      showToast('Link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  const openWhatsApp = () => {
    if (!student) return;
    const msg = getDefaultShareMessage(student.name, referralLink);
    window.open(createWhatsAppURL(msg), '_blank');
  };

  if (!student) {
    return (
      <div style={{ minHeight: '100vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎖️</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ambassador Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Register first to access your ambassador dashboard and start tracking your referrals.</p>
          <Link to="/register" className="btn-primary">Register Free</Link>
        </div>
      </div>
    );
  }

  const myAmbassadorRank = rank ?? '—';

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Trophy size={12} /> Ambassador Dashboard
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 8 }}>
            You're Ambassador{' '}
            <span className="gradient-text">#{myAmbassadorRank}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            {referralCount > 0
              ? `${referralCount} student${referralCount !== 1 ? 's' : ''} registered through your link.`
              : 'Share your link to start earning ambassador credits.'}
            {collegeRank && ` Your college is currently #${collegeRank}.`}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value gradient-text">{referralCount}</div>
                <div className="kpi-label">Referrals</div>
              </div>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value" style={{ color: '#fbbf24' }}>
                  {rank ? `#${rank}` : '—'}
                </div>
                <div className="kpi-label">Overall Rank</div>
              </div>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value" style={{ color: '#60a5fa' }}>
                  {collegeRank ? `#${collegeRank}` : '—'}
                </div>
                <div className="kpi-label">College Rank</div>
              </div>
              <div className="kpi-card" style={{ textAlign: 'center' }}>
                <div className="kpi-value" style={{ color: '#34d399' }}>
                  {student.college.split(' ')[0]}
                </div>
                <div className="kpi-label">College</div>
              </div>
            </div>

            {/* Referral link */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Referral Code</h3>
              <div style={{
                padding: '14px', borderRadius: 10, marginBottom: 14,
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
                fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 3,
                textAlign: 'center', color: '#a78bfa'
              }}>
                {student.referralCode}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, wordBreak: 'break-all', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                {referralLink}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={copyLink} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
                <button className="btn-whatsapp" onClick={openWhatsApp} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                  <Share2 size={14} /> WhatsApp
                </button>
              </div>
            </div>

            {/* AI message generator link */}
            <Link to="/share" className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>✨</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Generate AI Message</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Create a personalized invite for any style</div>
              </div>
              <ExternalLink size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </Link>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Recent referrals */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} color="#a78bfa" />
                Recent Referrals
              </h3>
              {recentReferrals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No referrals yet. Share your link to get started!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentReferrals.map((ref, _i) => (
                    <div key={ref.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--gradient-brand)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 14, color: 'white'
                      }}>
                        {ref.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{ref.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{ref.college} · {ref.branch}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(ref.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top ambassadors */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="#a78bfa" />
                Top Ambassadors
                <span className="badge badge-demo" style={{ marginLeft: 4, fontSize: 10 }}>Demo</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ambassadors.slice(0, 5).map((amb) => {
                  const isMe = student.referralCode === amb.referralCode;
                  return (
                    <div key={amb.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 8,
                      background: isMe ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isMe ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent'
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: amb.rank === 1 ? 'linear-gradient(135deg,#FFD700,#FFA500)' : amb.rank === 2 ? 'linear-gradient(135deg,#C0C0C0,#A8A8A8)' : 'linear-gradient(135deg,#CD7F32,#A0522D)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 12, color: 'white'
                      }}>
                        {amb.rank}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {amb.name}
                          {isMe && <span className="badge badge-violet" style={{ marginLeft: 6, fontSize: 10 }}>You</span>}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{amb.college}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#a78bfa' }}>{amb.referralCount}</div>
                    </div>
                  );
                })}
              </div>
              <Link to="/leaderboard" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#a78bfa', fontSize: 13, textDecoration: 'none' }}>
                View full leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
