import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, TrendingUp, Users } from 'lucide-react';
import { store } from '../store/dataStore';
import type { LeaderboardEntry } from '../types';
import { createWhatsAppURL, getDefaultShareMessage } from '../utils/messageGenerator';

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentStudent] = useState(store.getCurrentStudent());

  useEffect(() => {
    const lb = store.getLeaderboard();
    setEntries(lb);
  }, []);

  const domain = window.location.origin;
  const myRank = entries.find((e) => e.isCurrentUser);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <span style={{ fontSize: 20 }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: 20 }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: 20 }}>🥉</span>;
    return <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge badge-demo" style={{ marginBottom: 16, display: 'inline-flex' }}>
            Demo Data · Simulation
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, marginBottom: 12 }}>
            🏆 AI Builder Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Top students driving the growth of NxtWave AI Workshop
          </p>
        </div>

        {/* My rank callout */}
        {myRank && (
          <div style={{
            padding: '16px 20px', marginBottom: 24, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))',
            border: '1px solid rgba(124,58,237,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 28 }}>✨</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>You're ranked #{myRank.rank}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>with {myRank.referrals} referral{myRank.referrals !== 1 ? 's' : ''}</div>
              </div>
            </div>
            {currentStudent && (
              <button
                className="btn-whatsapp"
                onClick={() => {
                  const link = `${domain}/register?ref=${currentStudent.referralCode}`;
                  const msg = getDefaultShareMessage(currentStudent.name, link);
                  window.open(createWhatsAppURL(msg), '_blank');
                }}
                style={{ fontSize: 13, padding: '10px 18px' }}
              >
                <Share2 size={14} /> Share to climb higher
              </button>
            )}
          </div>
        )}

        {/* CTA if not registered */}
        {!currentStudent && (
          <div style={{ padding: '16px 20px', marginBottom: 24, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Register to appear on the leaderboard and earn your rank!</p>
            <Link to="/register" className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
              Register Free
            </Link>
          </div>
        )}

        {/* Top 3 podium */}
        {entries.length >= 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: 12, marginBottom: 32, alignItems: 'end' }}>
            {[entries[1], entries[0], entries[2]].map((entry, i) => {
              const heights = ['180px', '220px', '160px'];
              const emojis = ['🥈', '🥇', '🥉'];
              return (
                <div key={entry.id} className={`glass-card ${entry.isCurrentUser ? 'highlighted' : ''}`} style={{
                  padding: 20, textAlign: 'center', height: heights[i],
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: entry.isCurrentUser ? '1px solid rgba(124,58,237,0.5)' : undefined,
                  background: i === 1 ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))' : undefined,
                }}>
                  <div style={{ fontSize: i === 1 ? 32 : 24, marginBottom: 8 }}>{emojis[i]}</div>
                  <div style={{ fontWeight: 800, fontSize: i === 1 ? 18 : 15, marginBottom: 4 }}>{entry.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 8 }}>{entry.college}</div>
                  <div className="badge badge-violet">
                    <Users size={11} />
                    {entry.referrals} refs
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full leaderboard table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: 16 }}>Full Rankings</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={14} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Live simulation</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>College</th>
                  <th>Code</th>
                  <th>Referrals</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className={entry.isCurrentUser ? 'highlighted' : ''}>
                    <td style={{ width: 60 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="badge badge-violet" style={{ marginLeft: 8, fontSize: 10 }}>You</span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{entry.college}</td>
                    <td>
                      <code style={{ fontSize: 12, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                        {entry.referralCode}
                      </code>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{entry.referrals}</span>
                        <div className="progress-bar-track" style={{ width: 60, height: 4, display: 'inline-block' }}>
                          <div className="progress-bar-fill" style={{ width: `${Math.min(100, (entry.referrals / 35) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {currentStudent && entry.isCurrentUser ? (
                        <button
                          className="btn-whatsapp"
                          onClick={() => {
                            const link = `${domain}/register?ref=${entry.referralCode}`;
                            const msg = getDefaultShareMessage(entry.name, link);
                            window.open(createWhatsAppURL(msg), '_blank');
                          }}
                          style={{ fontSize: 11, padding: '6px 12px' }}
                        >
                          <Share2 size={12} /> Share
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
            Invite more friends to climb the leaderboard
          </p>
          {!currentStudent && (
            <Link to="/register" className="btn-primary">
              Register & Start Referring
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
