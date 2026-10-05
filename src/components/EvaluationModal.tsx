import { X, CheckCircle, AlertTriangle, Award } from 'lucide-react';
import type { ProjectSubmission } from '../store/dataStore';

interface EvaluationModalProps {
  project: ProjectSubmission;
  onClose: () => void;
}

export function EvaluationModal({ project, onClose }: EvaluationModalProps) {
  if (!project.evaluation) return null;
  const ev = project.evaluation;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh',
        overflowY: 'auto', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} color="#a78bfa" />
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700 }}>AI Project Evaluation</h2>
          </div>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{project.projectName}</div>
        </div>

        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Top Score Summary */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, padding: 24, borderRadius: 16, textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.1))',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>Overall Score</div>
              <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'monospace', color: ev.overallScore >= 75 ? '#22c55e' : (ev.overallScore >= 50 ? '#fbbf24' : '#f87171'), lineHeight: 1 }}>
                {ev.overallScore} <span style={{ fontSize: 24, color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
            
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>GitHub Verification</span>
                {ev.verification.github === 'verified' ? <span style={{ color: '#22c55e', fontSize: 14, display: 'flex', gap: 6, alignItems: 'center' }}><CheckCircle size={14}/> Verified</span> : <span style={{ color: '#fbbf24', fontSize: 14, display: 'flex', gap: 6, alignItems: 'center' }}><AlertTriangle size={14}/> Not Verified</span>}
              </div>
              <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Live Demo Verification</span>
                {ev.verification.demo === 'verified' ? <span style={{ color: '#22c55e', fontSize: 14, display: 'flex', gap: 6, alignItems: 'center' }}><CheckCircle size={14}/> Verified</span> : <span style={{ color: '#fbbf24', fontSize: 14, display: 'flex', gap: 6, alignItems: 'center' }}><AlertTriangle size={14}/> Not Verified</span>}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div style={{ padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a78bfa' }}>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 1 }}>AI Recommendation</h4>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5 }}>"{ev.recommendation}"</p>
          </div>

          {/* Category Scores */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              SCORING
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
              {[
                { label: 'Problem Definition', score: ev.criteria.problemDefinition, max: 20 },
                { label: 'AI/ML Implementation', score: ev.criteria.aiImplementation, max: 20 },
                { label: 'Technical Implementation', score: ev.criteria.technicalImplementation, max: 20 },
                { label: 'Innovation', score: ev.criteria.innovation, max: 15 },
                { label: 'Documentation', score: ev.criteria.documentation, max: 10 },
                { label: 'Demo / Usability', score: ev.criteria.demo, max: 10 },
                { label: 'Completeness', score: ev.criteria.completeness, max: 5 },
              ].map((c) => (
                <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.label}</span>
                  <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{c.score} <span style={{ color: 'var(--text-muted)' }}>/ {c.max}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>What You Did Well</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ev.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.5 }}>What Could Be Improved</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ev.improvements.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recommended Next Steps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ev.nextSteps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.1)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button className="btn-secondary" onClick={onClose} style={{ padding: '12px 32px' }}>Close Report</button>
          </div>

        </div>
      </div>
    </div>
  );
}
