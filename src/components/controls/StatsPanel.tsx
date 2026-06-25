import React, { useState } from 'react';
import Accordion from './Accordion';
import { Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';
import { FACTION_COLORS } from '../../constants';

const MAX_HP = 15;
const MAX_ARMOR = 5;

const StatsPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.stats);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const hp = useCardStore((s) => s.hp);
  const maxHp = useCardStore((s) => s.maxHp);
  const armor = useCardStore((s) => s.armor);
  const isLord = useCardStore((s) => s.isLord);
  const faction = useCardStore((s) => s.faction);
  const updateField = useCardStore((s) => s.updateField);
  const toggleLord = useCardStore((s) => s.toggleLord);

  const [hoverMaxHp, setHoverMaxHp] = useState(0);
  const [hoverHp, setHoverHp] = useState(0);
  const [hoverArmor, setHoverArmor] = useState(0);

  const factionColor = FACTION_COLORS[faction].primary;
  // 体力值超过5上限时不可编辑
  const hpEditable = maxHp <= 5;

  const renderCircleBar = (
    value: number,
    hoverValue: number,
    onHover: (v: number) => void,
    onClick: (v: number) => void,
    color: string,
    max: number,
    allowZero?: boolean,
    disabled?: boolean,
  ) => {
    const displayValue = hoverValue || value;
    return (
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', opacity: disabled ? 0.4 : 1 }}>
        {Array.from({ length: max }, (_, i) => {
          const v = i + 1;
          const isFilled = v <= displayValue;
          return (
            <button
              key={v}
              disabled={disabled}
              onMouseEnter={() => !disabled && onHover(v)}
              onMouseLeave={() => onHover(0)}
              onClick={() => !disabled && onClick(v)}
              style={{
                width: 20, height: 20, minWidth: 20, borderRadius: '50%',
                border: isFilled ? 'none' : '1px solid rgba(255,255,255,0.25)',
                background: isFilled ? color : 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s',
                opacity: isFilled ? 1 : 0.55,
                padding: 0,
              }}
              title={String(v)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Accordion
      id="stats"
      title="属性设置"
      expanded={expanded}
      onToggle={() => togglePanel('stats')}
      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" /></svg>}
    >
      {/* 体力上限 */}
      <div className="form-group">
        <label className="form-group__label">
          体力上限: <span style={{ color: factionColor, fontWeight: 700 }}>{maxHp}</span>
        </label>
        <div onMouseLeave={() => setHoverMaxHp(0)} style={{ paddingBottom: 4 }}>
          {renderCircleBar(
            maxHp, hoverMaxHp, setHoverMaxHp,
            (v) => {
              updateField('maxHp', v);
              if (hp > v) updateField('hp', v);
              else if (hp < v && hp === maxHp) updateField('hp', v);
            },
            factionColor, MAX_HP,
          )}
        </div>
        <div className="form-group__hint">悬浮选择体力上限（1-15），默认4</div>
      </div>

      {/* 体力值 - 上限超过5不可编辑 */}
      <div className="form-group">
        <label className="form-group__label">
          体力值: <span style={{ color: factionColor, fontWeight: 700 }}>{hp}</span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>/ {maxHp}</span>
          {!hpEditable && <span style={{ color: 'var(--color-text-muted)', marginLeft: 8, fontSize: '0.7rem' }}>(上限&gt;5，自动等于上限)</span>}
        </label>
        <div onMouseLeave={() => setHoverHp(0)} style={{ paddingBottom: 4 }}>
          {renderCircleBar(
            hp, hoverHp, setHoverHp,
            (v) => updateField('hp', Math.min(v, maxHp)),
            factionColor, MAX_HP,
            false, !hpEditable,
          )}
        </div>
        <div className="form-group__hint">
          {hpEditable ? '悬浮选择当前体力值' : '体力上限超过5时自动等于上限'}
        </div>
      </div>

      {/* 护甲值 - 0到5 */}
      <div className="form-group">
        <label className="form-group__label">
          护甲值: <span style={{ color: '#A08060', fontWeight: 700 }}>{armor}</span>
        </label>
        <div onMouseLeave={() => setHoverArmor(0)} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 4 }}>
          {/* 0 按钮 */}
          <button
            onClick={() => updateField('armor', 0)}
            style={{
              width: 20, height: 20, minWidth: 20, borderRadius: '50%',
              border: armor === 0 ? '2px solid #A08060' : '1px solid var(--color-border)',
              background: armor === 0 ? 'transparent' : 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: '0.7rem', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: armor === 0 ? 700 : 400,
            }}
            title="0"
          >
            0
          </button>
          {renderCircleBar(
            armor, hoverArmor, setHoverArmor,
            (v) => updateField('armor', v),
            '#A08060', MAX_ARMOR, true,
          )}
        </div>
        <div className="form-group__hint">点击0可清除护甲，悬浮选择护甲值（0-5）</div>
      </div>

      {/* 主公 */}
      <div className="form-group">
        <Checkbox checked={isLord} onChange={toggleLord} label="是否为主公" />
      </div>
    </Accordion>
  );
};

export default StatsPanel;
