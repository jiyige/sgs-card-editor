import React from 'react';
import Accordion from './Accordion';
import { Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';

const StatsPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.stats);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const hp = useCardStore((s) => s.hp);
  const maxHp = useCardStore((s) => s.maxHp);
  const armor = useCardStore((s) => s.armor);
  const isLord = useCardStore((s) => s.isLord);
  const updateField = useCardStore((s) => s.updateField);
  const toggleLord = useCardStore((s) => s.toggleLord);

  return (
    <Accordion
      id="stats"
      title="属性设置"
      expanded={expanded}
      onToggle={() => togglePanel('stats')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      }
    >
      {/* 体力值 */}
      <div className="form-group">
        <label className="form-group__label">体力值 / 体力上限</label>
        <div className="form-inline" style={{ gap: 12 }}>
          <div className="form-number">
            <button
              className="form-number__btn"
              onClick={() => updateField('hp', Math.max(0, hp - 1))}
            >
              -
            </button>
            <span className="form-number__value">{hp}</span>
            <button
              className="form-number__btn"
              onClick={() => updateField('hp', Math.min(maxHp, hp + 1))}
            >
              +
            </button>
          </div>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <div className="form-number">
            <button
              className="form-number__btn"
              onClick={() => updateField('maxHp', Math.max(1, Math.max(hp, maxHp - 1)))}
            >
              -
            </button>
            <span className="form-number__value">{maxHp}</span>
            <button
              className="form-number__btn"
              onClick={() => updateField('maxHp', Math.min(10, maxHp + 1))}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 护甲值 */}
      <div className="form-group">
        <label className="form-group__label">护甲值</label>
        <div className="form-number">
          <button
            className="form-number__btn"
            onClick={() => updateField('armor', Math.max(0, armor - 1))}
          >
            -
          </button>
          <span className="form-number__value">{armor}</span>
          <button
            className="form-number__btn"
            onClick={() => updateField('armor', Math.min(10, armor + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* 主公 */}
      <div className="form-group">
        <Checkbox checked={isLord} onChange={toggleLord} label="是否为主公" />
      </div>
    </Accordion>
  );
};

export default StatsPanel;
