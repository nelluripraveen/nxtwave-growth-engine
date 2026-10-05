import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar, ArrowRight, AlertCircle, Check, Info } from 'lucide-react';
import { store } from '../store/dataStore';
import { useToast } from '../components/Toast';

const COLLEGES = [
  'VIT Vellore', 'Amrita Vishwa Vidyapeetham', 'SRM Institute', 'PSG College of Technology',
  'CBIT Hyderabad', 'SASTRA University', 'BITS Pilani', 'NIT Trichy', 'Anna University',
  'Manipal Institute', 'Saveetha Engineering College', 'KCG College of Technology',
  'Vel Tech University', 'Sathyabama University', 'Hindustan Institute', 'Other'
];

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'DATA SCIENCE', 'BIOTECH', 'MBA', 'Other'];
const GRAD_YEARS = [2025, 2026, 2027, 2028, 2029];

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  college: string;
  branch: string;
  graduationYear: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  college?: string;
  branch?: string;
}

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [form, setForm] = useState<FormData>({
    name: '', email: '', whatsapp: '', college: '', branch: '', graduationYear: 2027,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);

  useEffect(() => {
    if (referralCode) {
      const referrer = store.getStudentByReferralCode(referralCode);
      if (referrer) setReferrerName(referrer.name);
    }
  }, [referralCode]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Enter your full name';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.whatsapp.trim() || !/^[6-9]\d{9}$/.test(form.whatsapp.replace(/\s/g, ''))) newErrors.whatsapp = 'Enter a valid 10-digit WhatsApp number';
    if (!form.college) newErrors.college = 'Select your college';
    if (!form.branch) newErrors.branch = 'Select your branch';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountExists(false);
    if (!validate()) return;

    setLoading(true);
    try {
      // Prevent self-referral
      const existingStudent = store.getCurrentStudent();
      if (existingStudent && referralCode === existingStudent.referralCode) {
        showToast('You cannot refer yourself!', 'error');
        setLoading(false);
        return;
      }

      store.registerStudent({
        ...form,
        referredBy: referralCode || null,
        source: referralCode ? 'referral' : 'direct',
      });

      showToast('Registration successful! 🎉', 'success');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      if (err.message && err.message.includes('already registered')) {
        setAccountExists(true);
      } else {
        showToast(err.message || 'Registration failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const setField = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setAccountExists(false);
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
        
        {/* Left: Info panel */}
        <div>
          <div className="badge badge-violet" style={{ marginBottom: 20, display: 'inline-flex' }}>
            Free Workshop Registration
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
            Build Your First <span className="gradient-text">AI Project</span> in 60 Minutes
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Build a real AI project from scratch in one beginner-friendly session — completely free.
          </p>

          {/* Referred by banner */}
          {referralCode && (
            <div style={{ padding: '14px 18px', marginBottom: 24, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Info size={16} color="#a78bfa" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>
                  Referred by {referrerName || referralCode}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Your registration will be credited to them
                </div>
              </div>
            </div>
          )}

          {/* Why join */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Why Join?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Build your first AI project — hands on',
                'Learn by doing, not by watching',
                'Something to discuss in placement interviews',
                'Completely beginner friendly',
                'Done in just 60 minutes',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Check size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontSize: 14 }}>
            <strong style={{ color: 'var(--text-primary)' }}>🎯 500+</strong>
            <span style={{ color: 'var(--text-muted)' }}> engineering students are expected to join.</span>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              This is a simulation / campaign target, not a verified count.
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Register Free</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Fill in your details to secure your spot</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div>
              <label className="input-label" htmlFor="reg-name">
                <User size={11} style={{ display: 'inline', marginRight: 4 }} />
                Full Name *
              </label>
              <input
                id="reg-name"
                className="input-field"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                disabled={loading}
              />
              {errors.name && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.name}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="reg-email">
                <Mail size={11} style={{ display: 'inline', marginRight: 4 }} />
                Email Address *
              </label>
              <input
                id="reg-email"
                className="input-field"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                disabled={loading}
              />
              {errors.email && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.email}</div>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="input-label" htmlFor="reg-whatsapp">
                <Phone size={11} style={{ display: 'inline', marginRight: 4 }} />
                WhatsApp Number *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>+91</span>
                <input
                  id="reg-whatsapp"
                  className="input-field"
                  type="tel"
                  placeholder="9876543210"
                  value={form.whatsapp}
                  onChange={(e) => setField('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={loading}
                  style={{ paddingLeft: 44 }}
                />
              </div>
              {errors.whatsapp && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.whatsapp}</div>}
            </div>

            {/* College */}
            <div>
              <label className="input-label" htmlFor="reg-college">
                <GraduationCap size={11} style={{ display: 'inline', marginRight: 4 }} />
                College *
              </label>
              <select
                id="reg-college"
                className="input-field"
                value={form.college}
                onChange={(e) => setField('college', e.target.value)}
                disabled={loading}
              >
                <option value="">Select your college</option>
                {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.college && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.college}</div>}
            </div>

            {/* Branch + Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="input-label" htmlFor="reg-branch">
                  <BookOpen size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Branch *
                </label>
                <select
                  id="reg-branch"
                  className="input-field"
                  value={form.branch}
                  onChange={(e) => setField('branch', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.branch && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{errors.branch}</div>}
              </div>
              <div>
                <label className="input-label" htmlFor="reg-year">
                  <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Grad Year
                </label>
                <select
                  id="reg-year"
                  className="input-field"
                  value={form.graduationYear}
                  onChange={(e) => setField('graduationYear', Number(e.target.value))}
                  disabled={loading}
                >
                  {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Referral code (read-only if set) */}
            {referralCode && (
              <div>
                <label className="input-label">Referred By (Auto-captured)</label>
                <input
                  className="input-field"
                  type="text"
                  value={referralCode}
                  disabled
                  readOnly
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>
            )}
            
            {accountExists && (
              <div style={{
                padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px', color: '#f87171', textAlign: 'center'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>An account already exists with this email.</div>
                <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: 14 }}>
                  Login to your account
                </Link>
              </div>
            )}

            <button
              id="register-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 4, padding: '15px 24px', fontSize: 16 }}
            >
              {loading ? 'Registering...' : <>Register Free <ArrowRight size={18} /></>}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
              Already registered? <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
