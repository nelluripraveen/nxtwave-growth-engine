import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export function FaqAccordion({ items, title, subtitle }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {title && <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 12 }}>{title}</h2>}
          {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{subtitle}</p>}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="glass-card" style={{ overflow: 'hidden' }}>
              <button
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: isOpen ? '#a78bfa' : 'var(--text-primary)',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  outline: 'none'
                }}
              >
                <span>{item.question}</span>
                <ChevronDown 
                  size={20} 
                  style={{ 
                    transform: isOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.3s ease',
                    flexShrink: 0,
                    marginLeft: 16,
                    color: isOpen ? '#a78bfa' : 'var(--text-muted)'
                  }} 
                />
              </button>
              
              <div 
                style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s ease',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
