import { useState, useEffect } from 'react';
import { Copy, Share2, Check, Sparkles, MessageSquare } from 'lucide-react';
import { store } from '../store/dataStore';
import { generateMessage, createWhatsAppURL } from '../utils/messageGenerator';
import type { MessageStyle } from '../utils/messageGenerator';
import type { Student } from '../types';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';

const STYLES: { id: MessageStyle; label: string; icon: string; desc: string }[] = [
  { id: 'casual', label: 'Casual', icon: '😊', desc: 'Friendly & conversational' },
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Formal & polished' },
  { id: 'placement', label: 'Placement-Focused', icon: '🎯', desc: 'Career & interview angle' },
  { id: 'fun', label: 'Fun & Hype', icon: '🔥', desc: 'Energetic & emoji-heavy' },
];

export function SharePage() {
  const { showToast, ToastComponent } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<MessageStyle>('casual');
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedSource, setGeneratedSource] = useState<'ai' | 'template' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStudent(store.getCurrentStudent());
  }, []);

  const domain = window.location.origin;
  const referralLink = student
    ? `${domain}/register?ref=${student.referralCode}`
    : `${domain}/register`;

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedSource(null);
    try {
      const result = await generateMessage({
        style: selectedStyle,
        studentName: student?.name || 'A friend',
        referralLink,
      });
      setMessage(result.message);
      setGeneratedSource(result.source);
    } catch {
      showToast('Failed to generate message. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      showToast('Message copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed. Please select and copy manually.', 'error');
    }
  };

  const handleWhatsApp = () => {
    if (!message) return;
    window.open(createWhatsAppURL(message), '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Sparkles size={12} /> AI Message Generator
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, marginBottom: 12 }}>
            Generate Your <span className="gradient-text">Perfect Invite</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Pick a style, generate a personalized WhatsApp message, and share instantly.
          </p>
        </div>

        {/* Not registered banner */}
        {!student && (
          <div style={{ padding: '16px 20px', marginBottom: 28, borderRadius: 12, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: '#fbbf24', fontSize: 14 }}>Register first to include your personal referral link in the message!</p>
            <Link to="/register" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>Register Free</Link>
          </div>
        )}

        {/* Style selector */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Choose Message Style</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                style={{
                  padding: '14px 12px',
                  borderRadius: 10,
                  border: `2px solid ${selectedStyle === s.id ? 'rgba(124,58,237,0.8)' : 'var(--border)'}`,
                  background: selectedStyle === s.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: selectedStyle === s.id ? '#a78bfa' : 'var(--text-primary)', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            id="generate-message-btn"
            className="btn-primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ fontSize: 16, padding: '14px 40px', minWidth: 200 }}
          >
            {generating ? (
              <>Generating<span style={{ animation: 'pulse-glow 1s infinite' }}>...</span></>
            ) : (
              <><Sparkles size={17} /> Generate Message</>
            )}
          </button>
          {generatedSource && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
              {generatedSource === 'ai' ? '✨ Generated with AI' : '📝 Generated from template'}
            </div>
          )}
        </div>

        {/* Message output */}
        {message && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={16} color="#a78bfa" />
                Your Message
              </h2>
              <div className="badge badge-violet">{STYLES.find((s) => s.id === selectedStyle)?.icon} {STYLES.find((s) => s.id === selectedStyle)?.label}</div>
            </div>

            {/* Message textarea */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--text-primary)',
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: 'Inter, sans-serif',
                resize: 'vertical',
                marginBottom: 16,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                id="copy-message-btn"
                className="btn-secondary"
                onClick={handleCopy}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Message</>}
              </button>
              <button
                id="share-message-whatsapp"
                className="btn-whatsapp"
                onClick={handleWhatsApp}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Share2 size={15} /> Share on WhatsApp
              </button>
            </div>

            <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', fontSize: 12, color: 'var(--text-muted)' }}>
              💡 You can edit the message above before sharing. Your referral link is already included.
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="glass-card" style={{ padding: 24, marginTop: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📱 Sharing Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '👥', tip: 'Share in your college WhatsApp groups for maximum reach' },
              { icon: '🎯', tip: 'Target final-year students preparing for placements' },
              { icon: '⏰', tip: 'Share in the morning — higher open rates on WhatsApp' },
              { icon: '🔁', tip: 'Follow up once after 2 days with a placement-focused message' },
            ].map((item) => (
              <div key={item.tip} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
