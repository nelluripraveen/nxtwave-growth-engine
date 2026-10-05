import React, { useState, useEffect } from 'react';
import { getWorkshopStartDate, isWorkshopLive } from '../config/workshop';

interface CountdownProps {
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft | null {
  const diff = getWorkshopStartDate().getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function WorkshopCountdown({ compact = false }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calcTimeLeft);
  const [live, setLive] = useState(isWorkshopLive);

  useEffect(() => {
    const id = setInterval(() => {
      const tl = calcTimeLeft();
      setTimeLeft(tl);
      if (!tl) setLive(true);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (live) {
    return (
      <div style={{ textAlign: 'center', padding: compact ? '16px' : '32px 20px' }}>
        <div style={{ fontSize: compact ? 28 : 36, marginBottom: 8 }}>🎉</div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: compact ? 20 : 28, color: '#22c55e' }}>
          Workshop is Live!
        </div>
      </div>
    );
  }

  if (!timeLeft) return null;

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <span style={{ fontSize: 16, marginRight: 4 }}>⏰</span>
        {units.map((u, i) => (
          <React.Fragment key={u.label}>
            <div style={{
              fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#a78bfa',
              background: 'rgba(124,58,237,0.12)', padding: '6px 10px', borderRadius: 8,
              minWidth: 44, textAlign: 'center',
            }}>
              {pad(u.value)}
            </div>
            {i < units.length - 1 && <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>:</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 16, marginBottom: 12, color: 'var(--text-secondary)' }}>⏰ Workshop Starts In</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {units.map((u) => (
          <div key={u.label} style={{
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 12, padding: '14px 16px', minWidth: 72, textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>
              {pad(u.value)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
