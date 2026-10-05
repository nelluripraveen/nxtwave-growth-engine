import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import {
  Users, Target, TrendingUp, Award, Building2, BarChart3,
  Search, ChevronRight, AlertTriangle,
  CheckCircle, Clock, Zap, ArrowUpRight
} from 'lucide-react';
import { store, type ProjectSubmission } from '../store/dataStore';
import type { Campaign, Student, Ambassador, DailyRegistration, SourceBreakdown } from '../types';
import { EvaluationModal } from '../components/EvaluationModal';

// ─── Admin sub-tabs ────────────────────────────────────────────────────────────
const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={15} /> },
  { id: 'registrations', label: 'Registrations', icon: <Users size={15} /> },
  { id: 'ambassadors', label: 'Ambassadors', icon: <Award size={15} /> },
  { id: 'colleges', label: 'Colleges', icon: <Building2 size={15} /> },
  { id: 'evaluations', label: 'AI Evaluations', icon: <Zap size={15} /> },
];

const COLORS = ['#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px' }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: '#f0f0ff' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontSize: 13 }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [dailyData, setDailyData] = useState<DailyRegistration[]>([]);
  const [sourceData, setSourceData] = useState<SourceBreakdown[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [projectStats, setProjectStats] = useState({ total: 0, submitted: 0, evaluating: 0, evaluated: 0, failed: 0 });
  const [projects, setProjects] = useState<(ProjectSubmission & { studentName: string })[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [collegeLeaderboard] = useState(store.getCollegeLeaderboard());

  useEffect(() => {
    setCampaign(store.getCampaignStats());
    setDailyData(store.getDailyRegistrations());
    setSourceData(store.getSourceBreakdown());
    setAmbassadors(store.getTopAmbassadors());
    setStudents(store.getAdminRegistrations());
    setProjectStats(store.getSubmissionStats());
    setProjects(store.getAllProjects());
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchSearch = !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSource = sourceFilter === 'all' || s.source === sourceFilter;
    return matchSearch && matchSource;
  });

  if (!campaign) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  const progressPct = Math.min(100, (campaign.currentRegistrations / campaign.target) * 100);

  const insights = [
    `Referral registrations account for ${Math.round((campaign.referralRegistrations / campaign.currentRegistrations) * 100)}% of total registrations. Increasing ambassador activity in high-performing colleges could accelerate the campaign toward the 500-registration target.`,
    `${collegeLeaderboard[0]?.name || 'Amrita'} is currently the highest-performing college with ${collegeLeaderboard[0]?.registrations || 82} registrations.`,
    `${campaign.activeReferrers} active referrers are driving ${campaign.referralRegistrations} registrations. Activating more students as referrers could significantly increase daily registration rates.`,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Admin top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,18,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, gap: 16
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>NxtWave Admin</span>
        </Link>
        <ChevronRight size={14} color="var(--text-muted)" />
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Growth Dashboard</span>
        <div className="badge badge-demo" style={{ marginLeft: 'auto' }}>
          Campaign Simulation · Demo Data
        </div>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>← Back to site</Link>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            NxtWave AI Workshop — Growth Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Campaign analytics and referral tracking · Simulation data for Growth Intern demo
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: activeTab === tab.id ? '#a78bfa' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Campaign progress hero */}
            <div className="glass-card" style={{
              padding: 32,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.12))',
              border: '1px solid rgba(124,58,237,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800 }}>REGISTRATIONS</h2>
                    <div className={campaign.status === 'on_track' ? 'badge badge-track' : 'badge badge-attention'}>
                      {campaign.status === 'on_track' ? <><CheckCircle size={11} /> On Track</> : <><AlertTriangle size={11} /> Needs Attention</>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: 'Outfit', fontSize: 52, fontWeight: 900, lineHeight: 1 }} className="gradient-text">
                      {campaign.currentRegistrations}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 24, fontWeight: 300 }}>/ {campaign.target}</span>
                    <span style={{ color: '#22c55e', fontSize: 20, fontWeight: 700, marginLeft: 8 }}>
                      {progressPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>
                    <Clock size={14} />
                    {campaign.daysRemaining} days remaining
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {campaign.target - campaign.currentRegistrations} registrations to go
                  </div>
                </div>
              </div>
              <div className="progress-bar-track" style={{ height: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Campaign start: Sep 27</span>
                <span>Target: Oct 3</span>
              </div>
            </div>

            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { label: 'Total Registrations', value: campaign.currentRegistrations, icon: <Users size={18} />, color: '#7c3aed' },
                { label: 'Target', value: campaign.target, icon: <Target size={18} />, color: '#6366f1' },
                { label: 'Referral Registrations', value: campaign.referralRegistrations, icon: <TrendingUp size={18} />, color: '#10b981' },
                { label: 'Active Referrers', value: campaign.activeReferrers, icon: <Award size={18} />, color: '#f59e0b' },
                { label: 'Colleges', value: campaign.colleges, icon: <Building2 size={18} />, color: '#ec4899' },
                { label: 'Avg Referrals', value: campaign.averageReferrals, icon: <BarChart3 size={18} />, color: '#60a5fa' },
              ].map((kpi) => (
                <div key={kpi.label} className="kpi-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ color: kpi.color, opacity: 0.8 }}>{kpi.icon}</div>
                    <span className="kpi-label">{kpi.label}</span>
                  </div>
                  <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
              
              {/* Registrations by day */}
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15 }}>Registrations Over Time</h3>
                  <span className="badge badge-demo">Projected</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#5a5a78', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5a5a78', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cumulative" name="Total" stroke="#7c3aed" fill="url(#grad1)" strokeWidth={2} dot={{ fill: '#7c3aed', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Source breakdown */}
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15 }}>Source Breakdown</h3>
                  <span className="badge badge-demo">Simulated</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <PieChart width={160} height={160}>
                    <Pie data={sourceData} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="count" strokeWidth={0}>
                      {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {sourceData.map((item) => (
                      <div key={item.source} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{item.source}</span>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top ambassadors */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Top Ambassadors</h3>
                <span className="badge badge-demo">Demo Data</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Ambassador</th>
                      <th>College</th>
                      <th>Code</th>
                      <th>Referrals</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassadors.map((amb) => (
                      <tr key={amb.id}>
                        <td>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: amb.rank === 1 ? 'linear-gradient(135deg,#FFD700,#FFA500)' : amb.rank === 2 ? 'linear-gradient(135deg,#C0C0C0,#A8A8A8)' : amb.rank === 3 ? 'linear-gradient(135deg,#CD7F32,#A0522D)' : 'rgba(255,255,255,0.08)', color: (amb.rank ?? 4) <= 3 ? 'white' : 'var(--text-secondary)' }}>
                            {amb.rank}
                          </div>
                        </td>
                        <td><span style={{ fontWeight: 600 }}>{amb.name}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{amb.college}</td>
                        <td><code style={{ fontSize: 12, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 4 }}>{amb.referralCode}</code></td>
                        <td><span style={{ fontWeight: 700, fontSize: 16 }}>{amb.referralCount}</span></td>
                        <td style={{ width: 120 }}>
                          <div className="progress-bar-track" style={{ width: 100 }}>
                            <div className="progress-bar-fill" style={{ width: `${(amb.referralCount / 30) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top colleges bar chart */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Top Colleges</h3>
                <span className="badge badge-demo">Simulated</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={collegeLeaderboard.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#5a5a78', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={160} tick={{ fill: '#9a9ab0', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="registrations" name="Registrations" radius={[0, 4, 4, 0]}>
                    {collegeLeaderboard.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Insights */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={16} color="white" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Growth Insights</h3>
                <span className="badge badge-demo" style={{ marginLeft: 'auto' }}>Auto-generated</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', gap: 12, alignItems: 'flex-start'
                  }}>
                    <ArrowUpRight size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign status summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Target', value: campaign.target, color: '#7c3aed' },
                { label: 'Current', value: campaign.currentRegistrations, color: '#22c55e' },
                { label: 'Remaining', value: campaign.target - campaign.currentRegistrations, color: '#f59e0b' },
                { label: 'Days Remaining', value: campaign.daysRemaining, color: '#60a5fa' },
              ].map((item) => (
                <div key={item.label} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: item.color, marginBottom: 6 }}>{item.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REGISTRATIONS TAB ── */}
        {activeTab === 'registrations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Filters */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input-field"
                    placeholder="Search by name, email, college, code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: 14 }}
                  />
                </div>
                <select
                  className="input-field"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  style={{ width: 'auto', fontSize: 14 }}
                >
                  <option value="all">All Sources</option>
                  <option value="direct">Direct</option>
                  <option value="referral">Referral</option>
                  <option value="ambassador">Ambassador</option>
                  <option value="whatsapp_community">WhatsApp Community</option>
                  <option value="college_email">College Email</option>
                </select>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, minWidth: 120 }}>
                  {filteredStudents.length} records
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Registration Table</h3>
                <span className="badge badge-demo">Demo Data</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>College</th>
                      <th>Branch</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Code</th>
                      <th>Referred By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.slice(0, 30).map((s) => (
                      <tr key={s.id}>
                        <td><span style={{ fontWeight: 600 }}>{s.name}</span></td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.college}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.branch}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </td>
                        <td>
                          <span className={`badge ${s.source === 'referral' ? 'badge-violet' : s.source === 'ambassador' ? 'badge-success' : 'badge-demo'}`} style={{ fontSize: 10 }}>
                            {s.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td><code style={{ fontSize: 11, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 6px', borderRadius: 4 }}>{s.referralCode}</code></td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {s.referredBy ? <code style={{ fontSize: 11, color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '2px 6px', borderRadius: 4 }}>{s.referredBy}</code> : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredStudents.length > 30 && (
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                  Showing 30 of {filteredStudents.length} records
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AMBASSADORS TAB ── */}
        {activeTab === 'ambassadors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div className="kpi-card"><div className="kpi-value gradient-text">{ambassadors.length}</div><div className="kpi-label">Total Ambassadors</div></div>
              <div className="kpi-card"><div className="kpi-value" style={{ color: '#fbbf24' }}>{ambassadors[0]?.referralCount || 0}</div><div className="kpi-label">Top Ambassador</div></div>
              <div className="kpi-card"><div className="kpi-value" style={{ color: '#22c55e' }}>{campaign.referralRegistrations}</div><div className="kpi-label">Via Ambassadors</div></div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>Ambassador Leaderboard</h3>
                <span className="badge badge-demo">Demo Data</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Ambassador</th>
                      <th>College</th>
                      <th>Referral Code</th>
                      <th>Referrals</th>
                      <th>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambassadors.map((amb) => (
                      <tr key={amb.id}>
                        <td>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: amb.rank! <= 3 ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.08)', color: 'white' }}>
                            {amb.rank}
                          </div>
                        </td>
                        <td><span style={{ fontWeight: 600 }}>{amb.name}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{amb.college}</td>
                        <td><code style={{ fontSize: 12, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 4 }}>{amb.referralCode}</code></td>
                        <td><span style={{ fontWeight: 800, fontSize: 18, color: '#a78bfa' }}>{amb.referralCount}</span></td>
                        <td style={{ width: 150 }}>
                          <div className="progress-bar-track" style={{ width: 120 }}>
                            <div className="progress-bar-fill" style={{ width: `${(amb.referralCount / 30) * 100}%` }} />
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {Math.round((amb.referralCount / campaign.referralRegistrations) * 100)}% of referral total
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── COLLEGES TAB ── */}
        {activeTab === 'colleges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>College Performance</h3>
                <span className="badge badge-demo">Simulated</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={collegeLeaderboard.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#5a5a78', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fill: '#9a9ab0', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="registrations" name="Registrations" radius={[0, 4, 4, 0]}>
                    {collegeLeaderboard.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>College Rankings</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>College</th>
                      <th>Registrations</th>
                      <th>Share</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collegeLeaderboard.map((c) => (
                      <tr key={c.name}>
                        <td style={{ fontWeight: 700, color: c.rank <= 3 ? '#a78bfa' : 'var(--text-muted)' }}>#{c.rank}</td>
                        <td><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                        <td><span style={{ fontWeight: 700, fontSize: 16 }}>{c.registrations}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.percentage}%</td>
                        <td style={{ width: 160 }}>
                          <div className="progress-bar-track" style={{ width: 140 }}>
                            <div className="progress-bar-fill" style={{ width: `${c.percentage}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── EVALUATIONS TAB ── */}
        {activeTab === 'evaluations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><div style={{ color: '#a78bfa' }}><Zap size={16} /></div><span className="kpi-label">Total Projects</span></div>
                <div className="kpi-value" style={{ color: '#a78bfa' }}>{projectStats.total}</div>
              </div>
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><div style={{ color: '#fbbf24' }}><Clock size={16} /></div><span className="kpi-label">Pending / Evaluating</span></div>
                <div className="kpi-value" style={{ color: '#fbbf24' }}>{projectStats.submitted + projectStats.evaluating}</div>
              </div>
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><div style={{ color: '#22c55e' }}><CheckCircle size={16} /></div><span className="kpi-label">Evaluated</span></div>
                <div className="kpi-value" style={{ color: '#22c55e' }}>{projectStats.evaluated}</div>
              </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15 }}>AI Project Evaluations</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Project Name</th>
                      <th>Status</th>
                      <th>AI Score</th>
                      <th>Submitted Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.studentId}>
                        <td><span style={{ fontWeight: 600 }}>{p.studentName}</span></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{p.projectName}</td>
                        <td>
                          {p.status === 'evaluated' ? <span className="badge badge-success">Evaluated</span> :
                           p.status === 'evaluating' ? <span className="badge badge-violet">Evaluating</span> :
                           p.status === 'evaluation_failed' ? <span className="badge badge-demo" style={{ color: '#f87171' }}>Failed</span> :
                           <span className="badge badge-demo" style={{ color: '#fbbf24' }}>Pending</span>}
                        </td>
                        <td>
                          {p.evaluation ? (
                            <span style={{ fontWeight: 700, color: p.evaluation.overallScore >= 75 ? '#22c55e' : '#fbbf24' }}>
                              {p.evaluation.overallScore} / 100
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(p.submittedAt).toLocaleDateString()}</td>
                        <td>
                          {p.evaluation && (
                            <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setSelectedProject(p)}>
                              View Report
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                          No projects submitted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Evaluation Modal */}
      {selectedProject && (
        <EvaluationModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
