import React from 'react';
import Accordion from './Accordion';
import { Select } from '../ui';
import { useCardStore, useUIStore } from '../../store';
import { TITLE_FONTS, NAME_FONTS } from '../../constants/fonts';

const AppearancePanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.appearance);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const titleFont = useCardStore((s) => s.titleFont);
  const titleColor = useCardStore((s) => s.titleColor);
  const nameFont = useCardStore((s) => s.nameFont);
  const nameColor = useCardStore((s) => s.nameColor);
  const borderColor = useCardStore((s) => s.borderColor);
  const updateField = useCardStore((s) => s.updateField);

  return (
    <Accordion
      id="appearance"
      title="外观设置"
      expanded={expanded}
      onToggle={() => togglePanel('appearance')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      }
    >
      <div className="form-group">
        <label className="form-group__label">称号字体</label>
        <Select
          value={titleFont}
          onChange={(v) => updateField('titleFont', v)}
          options={TITLE_FONTS.map((f) => ({ value: f.id, label: f.name }))}
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">称号颜色</label>
        <div className="form-inline">
          <input
            type="color"
            value={titleColor}
            onChange={(e) => updateField('titleColor', e.target.value)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              padding: 2,
              background: 'transparent',
            }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{titleColor}</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-group__label">武将名字体</label>
        <Select
          value={nameFont}
          onChange={(v) => updateField('nameFont', v)}
          options={NAME_FONTS.map((f) => ({ value: f.id, label: f.name }))}
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">武将名颜色</label>
        <div className="form-inline">
          <input
            type="color"
            value={nameColor}
            onChange={(e) => updateField('nameColor', e.target.value)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              padding: 2,
              background: 'transparent',
            }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{nameColor}</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-group__label">自定义边框颜色（留空使用势力默认色）</label>
        <div className="form-inline">
          <input
            type="color"
            value={borderColor || '#000000'}
            onChange={(e) => updateField('borderColor', e.target.value === '#000000' ? '' : e.target.value)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              padding: 2,
              background: 'transparent',
            }}
          />
          <button
            onClick={() => updateField('borderColor', '')}
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            重置
          </button>
        </div>
      </div>
    </Accordion>
  );
};

export default AppearancePanel;
