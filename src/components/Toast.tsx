import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <X size={18} className="text-red-400" />,
    info: <CheckCircle size={18} className="text-violet-400" />,
  };

  const colors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-violet-500/30',
  };

  return (
    <div className={`toast ${colors[type]}`} style={{ borderColor: type === 'success' ? 'rgba(34,197,94,0.3)' : type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)' }}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 'auto', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => setToast(null);

  const ToastComponent = toast ? (
    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
}
