import React from 'react';
import { useUIStore } from '../../store';

const Toast: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            animation: 'fadeInUp 0.3s ease',
            ...(toast.type === 'success'
              ? { background: 'rgba(74,156,93,0.2)', border: '1px solid rgba(74,156,93,0.4)', color: '#7ddb8a' }
              : toast.type === 'error'
                ? { background: 'rgba(196,75,75,0.2)', border: '1px solid rgba(196,75,75,0.4)', color: '#e88484' }
                : { background: 'rgba(201,164,75,0.2)', border: '1px solid rgba(201,164,75,0.4)', color: '#e0c878' }),
          }}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
