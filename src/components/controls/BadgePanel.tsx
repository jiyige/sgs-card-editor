import React, { useRef } from 'react';
import Accordion from './Accordion';
import { Button } from '../ui';
import { useCardStore, useUIStore } from '../../store';

const BUILTIN_BADGES = [
  { id: 'new', label: 'NEW', color: '#4a9c5d' },
  { id: 'hot', label: 'HOT', color: '#c44b4b' },
  { id: 'sp', label: 'SP', color: '#c9a44b' },
  { id: 'limit', label: '限', color: '#7b4fa0' },
  { id: 'test', label: '测', color: '#4b8bc4' },
  { id: 'god', label: '神', color: '#d4a843' },
];

const BadgePanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.badge);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const badge = useCardStore((s) => s.badge);
  const updateField = useCardStore((s) => s.updateField);
  const addToast = useUIStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectBuiltinBadge = (badgeId: string) => {
    updateField('badge', { ...badge, type: 'builtin', builtinId: badgeId });
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField('badge', { ...badge, type: 'custom', customImage: reader.result as string });
      addToast('角标上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  const clearBadge = () => {
    updateField('badge', { ...badge, type: 'builtin', builtinId: '', customImage: undefined });
  };

  return (
    <Accordion
      id="badge"
      title="角标设置"
      expanded={expanded}
      onToggle={() => togglePanel('badge')}
      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 8 6-8H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
    >
      <div className="form-group">
        <label className="form-group__label">内置角标</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {BUILTIN_BADGES.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBuiltinBadge(b.id)}
              style={{
                padding: '6px 14px', borderRadius: 6,
                border: badge.builtinId === b.id ? `2px solid ${b.color}` : '1px solid var(--color-border)',
                background: badge.builtinId === b.id ? `${b.color}22` : 'var(--color-bg-tertiary)',
                color: badge.builtinId === b.id ? b.color : 'var(--color-text-muted)',
                fontSize: '0.8rem', fontWeight: badge.builtinId === b.id ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="form-group__hint">角标显示在底部势力编号旁边</div>
      </div>

      <div className="form-group">
        <label className="form-group__label">自定义角标</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>上传图片</Button>
          {badge.type === 'custom' && badge.customImage && (
            <div style={{ width: 32, height: 32, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--color-accent)' }}>
              <img src={badge.customImage} alt="badge" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
        </div>
      </div>

      {(badge.builtinId || badge.customImage) && (
        <div style={{ marginTop: 12 }}>
          <Button variant="danger" size="sm" onClick={clearBadge}>清除角标</Button>
        </div>
      )}
    </Accordion>
  );
};

export default BadgePanel;
