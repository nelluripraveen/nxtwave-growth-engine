import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Clock, BookOpen, Briefcase, Users, ChevronDown, Brain, Share2, TrendingUp, LayoutDashboard } from 'lucide-react';
import { store } from '../store/dataStore';
import { FaqAccordion } from '../components/FaqAccordion';
import { WorkshopCountdown } from '../components/WorkshopCountdown';

const HOME_FAQ = [
  { question: "Who can attend this workshop?", answer: "The workshop is designed for final-year engineering students who want to build a practical AI project and strengthen their placement profile." },
  { question: "Is this workshop completely free?", answer: "Yes. The workshop is 100% free. No payment or hidden charges are required." },
  { question: "Do I need prior AI experience?", answer: "No. The workshop is beginner-friendly. You don't need previous AI experience to participate." },
  { question: "Do I need coding experience?", answer: "Basic programming knowledge can help, but the workshop is designed so beginners can follow along." },
  { question: "What will I build in 60 minutes?", answer: "You'll build a working AI project during the session rather than just watching a theoretical presentation." },
  { question: "What tools will I need?", answer: "You'll need a laptop and a stable internet connection. Any required tools or setup instructions will be shared before the workshop." },
  { question: "Will this project help with placements?", answer: "Yes. The goal is to give you something practical that you can understand, showcase and discuss during placement interviews." },
  { question: "How do I register?", answer: "Click 'Register Free', complete the registration form, and you'll be taken to your personal dashboard after successful registration." },
  { question: "Can I register if I have never built an AI project?", answer: "Yes. That's exactly who the workshop is designed for — students going from zero to a working AI project." },
  { question: "What happens after I register?", answer: "You'll get access to your personal dashboard, where you can see your registration status, referral information, workshop details and other participant features." }
];

const FEATURES = [
  { icon: <Zap size={20} color="#a78bfa" />, label: 'FREE', desc: 'No cost, no catch' },
  { icon: <Clock size={20} color="#60a5fa" />, label: '60 MINUTES', desc: 'Quick & intense' },
  { icon: <BookOpen size={20} color="#34d399" />, label: 'BEGINNER FRIENDLY', desc: 'Zero AI exp needed' },
  { icon: <Briefcase size={20} color="#fbbf24" />, label: 'PLACEMENT RELEVANT', desc: 'Talk about it in interviews' },
];

const GROWTH_STEPS = [
  { icon: <Users size={18} />, text: 'Student registers', color: '#7c3aed' },
  { icon: <Zap size={18} />, text: 'Gets unique referral link', color: '#6366f1' },
  { icon: <Share2 size={18} />, text: 'Shares with friends on WhatsApp', color: '#8b5cf6' },
  { icon: <Users size={18} />, text: 'Friends register', color: '#a78bfa' },
  { icon: <TrendingUp size={18} />, text: 'Leaderboard updates', color: '#c4b5fd' },
  { icon: <Zap size={18} />, text: 'More students share → campaign grows', color: '#ddd6fe' },
];

export function HomePage() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsRegistered(!!store.getCurrentStudent());
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        padding: '100px 20px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-violet" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <Brain size={12} />
            Free AI Workshop • Limited Seats
          </div>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            Build Your First{' '}
            <span className="gradient-text">AI Project</span>
            <br />in 60 Minutes
          </h1>

          <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 16px' }}>
            Don't just learn AI. <strong style={{ color: 'var(--text-primary)' }}>Build something you can talk about</strong> in your next placement interview.
          </p>

          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 40 }}>
            A free, beginner-friendly session designed for final-year engineering students.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
            {FEATURES.map((f) => (
              <div key={f.label} className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                {f.icon}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px' }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {isRegistered ? (
                <Link to="/dashboard" className="btn-primary" style={{ fontSize: 17, padding: '16px 40px' }}>
                  Go to Dashboard <LayoutDashboard size={18} />
                </Link>
              ) : (
                <Link to="/register" className="btn-primary" style={{ fontSize: 17, padding: '16px 40px' }}>
                  Register Free <ArrowRight size={18} />
                </Link>
              )}
              <a href="#how-it-works" className="btn-secondary">
                See How It Works <ChevronDown size={16} />
              </a>
            </div>
            
            {!isRegistered && (
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Already registered? <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
              </div>
            )}
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 40, padding: '16px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'inline-block' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              🎯 <strong style={{ color: 'var(--text-primary)' }}>500+</strong> engineering students are expected to join this workshop
            </span>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Simulation / Campaign Target</div>
          </div>
        </div>
      </section>

      {/* ── Growth Loop ── */}
      <section id="how-it-works" style={{ padding: '80px 20px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>The Growth Engine</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
            Build → Share → <span className="gradient-text">Grow</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>
            Every registration becomes a distribution channel. One student can bring dozens more.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
          {GROWTH_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${step.color}22`, border: `1px solid ${step.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: step.color,
              }}>
                {step.icon}
              </div>
              <div className="glass-card" style={{ flex: 1, padding: '14px 18px', fontSize: 15, fontWeight: 500 }}>
                {step.text}
              </div>
              {i < GROWTH_STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: 39, marginTop: 52, width: 2, height: 12, background: 'var(--border)', zIndex: -1 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "Every registration becomes a distribution channel."
          </p>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section style={{ padding: '60px 20px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 12 }}>Why This Workshop?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '🤖', title: 'Build Real AI', desc: 'Walk out with a working AI project, not just theory' },
            { icon: '⚡', title: 'Learn by Doing', desc: '60 minutes of hands-on building, not slides' },
            { icon: '💼', title: 'Interview Ready', desc: 'Something concrete to discuss in placements' },
            { icon: '🎯', title: 'Zero to Project', desc: 'No prerequisites, no experience needed' },
          ].map((item) => (
            <div key={item.title} className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '40px 20px 80px', maxWidth: 900, margin: '0 auto' }}>
        <FaqAccordion
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before joining the workshop."
          items={HOME_FAQ}
        />
      </section>

      {/* ── Countdown + Final CTA ── */}
      <section style={{ padding: '20px 20px 100px', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '40px 24px', marginBottom: 48 }}>
          <WorkshopCountdown />
        </div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, marginBottom: 16 }}>
          Ready to Build Your First AI Project?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 20px', fontSize: 16 }}>
          Join the free 60-minute AI workshop and build something you can talk about in your next placement interview.
        </p>
        {isRegistered ? (
          <Link to="/dashboard" className="btn-primary" style={{ fontSize: 17, padding: '16px 48px', display: 'inline-flex' }}>
            Go to Dashboard <LayoutDashboard size={18} />
          </Link>
        ) : (
          <Link to="/register" className="btn-primary" style={{ fontSize: 17, padding: '16px 48px', display: 'inline-flex' }}>
            Register Free <ArrowRight size={18} />
          </Link>
        )}
      </section>
    </div>
  );
}
