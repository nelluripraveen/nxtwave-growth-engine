import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, TrendingUp } from 'lucide-react';
import { store } from '../store/dataStore';
import type { CollegeLeaderboardEntry } from '../types';

export function CollegePage() {
  const [colleges, setColleges] = useState<CollegeLeaderboardEntry[]>([]);
  const [currentStudent] = useState(store.getCurrentStudent());

  useEffect(() => {
    setColleges(store.getCollegeLeaderboard());
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const COLORS = ['#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#4f46e5', '#4338ca', '#3730a3', '#312e81'];

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge badge-demo" style={{ marginBottom: 16, display: 'inline-flex' }}>
            Demo Data · Simulation
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
            🏫 College Challenge
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Which college can bring the most future AI builders?
          </p>
        </div>

        {/* My college highlight */}
        {currentStudent && (() => {
          const myCollege = colleges.find((c) => c.name === currentStudent.college);
          if (!myCollege) return null;
          return (
            <div style={{
              padding: '16px 20px', marginBottom: 28, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))',
              border: '1px solid rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {getRankEmoji(myCollege.rank)} Your college is ranked #{myCollege.rank}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  {currentStudent.college} · {myCollege.registrations} registrations
                </div>
              </div>
              <div className="badge badge-violet">
                <Users size={11} />
                {myCollege.registrations} registered
              </div>
            </div>
          );
        })()}

        {/* Top 3 showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {colleges.slice(0, 3).map((_college, i) => {
            const displayHeights = ['160px', '200px', '140px'];
            const c = i === 0 ? colleges[1] : i === 1 ? colleges[0] : colleges[2];
            const h = displayHeights[i];
            const bgColors = ['rgba(79,70,229,0.15)', 'rgba(124,58,237,0.2)', 'rgba(139,92,246,0.15)'];
            const borderColors = ['rgba(79,70,229,0.3)', 'rgba(124,58,237,0.4)', 'rgba(139,92,246,0.3)'];
            const emojis = ['🥈', '🥇', '🥉'];
            
            return (
              <div key={c.name} className="glass-card" style={{
                padding: 20, textAlign: 'center',
                height: h,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: bgColors[i], border: `1px solid ${borderColors[i]}`
              }}>
                <div style={{ fontSize: i === 1 ? 32 : 24, marginBottom: 10 }}>{emojis[i]}</div>
                <div style={{ fontWeight: 800, fontSize: i === 1 ? 16 : 14, marginBottom: 4, lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: i === 1 ? 28 : 22, fontWeight: 900, color: '#a78bfa' }}>
                  {c.registrations}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>registrations</div>
              </div>
            );
          })}
        </div>

        {/* Full college list */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={18} color="#a78bfa" />
              All Colleges
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Simulated rankings</span>
            </div>
          </div>

          <div style={{ padding: '8px 0' }}>
            {colleges.map((college, i) => {
              const isMyCollege = currentStudent?.college === college.name;
              return (
                <div key={college.name} style={{
                  padding: '16px 24px',
                  borderBottom: i < colleges.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: isMyCollege ? 'rgba(124,58,237,0.06)' : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: `${COLORS[i] || '#7c3aed'}20`,
                      border: `2px solid ${COLORS[i] || '#7c3aed'}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13, color: COLORS[i] || '#a78bfa'
                    }}>
                      {college.rank <= 3 ? ['🥇', '🥈', '🥉'][college.rank - 1] : `#${college.rank}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {college.name}
                        {isMyCollege && <span className="badge badge-violet" style={{ fontSize: 10 }}>Your College</span>}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: COLORS[i] || '#a78bfa' }}>
                      {college.registrations}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 80, textAlign: 'right' }}>
                      registrations
                    </div>
                  </div>
                  <div style={{ paddingLeft: 48 }}>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${college.percentage}%`,
                          background: `linear-gradient(90deg, ${COLORS[i] || '#7c3aed'}, ${COLORS[Math.min(i + 1, COLORS.length - 1)] || '#4f46e5'})`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {college.percentage}% of top college total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, padding: '24px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 16 }}>
            🏆 Help your college climb the rankings — share your referral link with your classmates!
          </p>
          {!currentStudent ? (
            <Link to="/register" className="btn-primary">
              Register & Represent Your College
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-primary">
              Go to My Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
