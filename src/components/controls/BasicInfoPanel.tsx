import React from 'react';
import Accordion from './Accordion';
import { Input, Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';
import { FACTION_ORDER, FACTION_NAMES, FACTION_COLORS, FACTION_PREFIX } from '../../constants';
import { CARD_TEMPLATES, AVAILABLE_TEMPLATES } from '../../constants/templates';

const BasicInfoPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.basic);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const template = useCardStore((s) => s.template);
  const faction = useCardStore((s) => s.faction);
  const subFaction = useCardStore((s) => s.subFaction);
  const title = useCardStore((s) => s.title);
  const name = useCardStore((s) => s.name);
  const isLord = useCardStore((s) => s.isLord);
  const factionNumber = useCardStore((s) => s.factionNumber);
  const setTemplate = useCardStore((s) => s.setTemplate);
  const setFaction = useCardStore((s) => s.setFaction);
  const setSubFaction = useCardStore((s) => s.setSubFaction);
  const updateField = useCardStore((s) => s.updateField);
  const toggleLord = useCardStore((s) => s.toggleLord);

  return (
    <Accordion
      id="basic"
      title="基础信息"
      expanded={expanded}
      onToggle={() => togglePanel('basic')}
      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /></svg>}
    >
      {/* 模板选择 */}
      <div className="form-group">
        <label className="form-group__label">卡牌模板</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CARD_TEMPLATES.map((t) => {
            const isAvailable = AVAILABLE_TEMPLATES.includes(t.id);
            const isActive = template === t.id;
            return (
              <button
                key={t.id}
                disabled={!isAvailable}
                onClick={() => setTemplate(t.id as any)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(201,164,75,0.1)' : 'var(--color-bg-tertiary)',
                  color: isActive ? 'var(--color-accent-light)' : isAvailable ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  fontWeight: isActive ? 600 : 400,
                  opacity: isAvailable ? 1 : 0.4,
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 势力选择 */}
      <div className="form-group">
        <label className="form-group__label">武将势力</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {FACTION_ORDER.map((f) => (
            <button
              key={f}
              onClick={() => setFaction(f)}
              style={{
                width: 44, height: 44, borderRadius: 10,
                border: faction === f ? `2px solid ${FACTION_COLORS[f].primary}` : '1px solid var(--color-border)',
                background: faction === f ? `${FACTION_COLORS[f].primary}22` : 'var(--color-bg-tertiary)',
                color: faction === f ? FACTION_COLORS[f].primary : 'var(--color-text-muted)',
                fontSize: '1.1rem', fontWeight: faction === f ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={FACTION_NAMES[f]}
            >
              {FACTION_NAMES[f]}
            </button>
          ))}
        </div>
      </div>

      {/* 副势力 */}
      <div className="form-group">
        <label className="form-group__label">副势力（可选，双势力武将）</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSubFaction(undefined)}
            style={{
              padding: '4px 12px', borderRadius: 6,
              border: !subFaction ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: !subFaction ? 'rgba(201,164,75,0.1)' : 'transparent',
              color: !subFaction ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: '0.75rem', cursor: 'pointer',
            }}
          >
            无
          </button>
          {FACTION_ORDER.map((f) => (
            <button
              key={f}
              onClick={() => setSubFaction(f)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: subFaction === f ? `2px solid ${FACTION_COLORS[f].primary}` : '1px solid var(--color-border)',
                background: subFaction === f ? `${FACTION_COLORS[f].primary}22` : 'var(--color-bg-tertiary)',
                color: subFaction === f ? FACTION_COLORS[f].primary : 'var(--color-text-muted)',
                fontSize: '0.9rem', fontWeight: subFaction === f ? 600 : 400,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {FACTION_NAMES[f]}
            </button>
          ))}
        </div>
      </div>

      {/* 主公开关 */}
      <div className="form-group">
        <Checkbox checked={isLord} onChange={toggleLord} label="是否为主公" />
      </div>

      {/* 称号 */}
      <div className="form-group">
        <label className="form-group__label">武将称号</label>
        <Input value={title} onChange={(v) => updateField('title', v)} placeholder="请输入繁体字，如：武聖" maxLength={6} />
        <div className="form-group__hint">最多6个字符，建议使用繁体字</div>
      </div>

      {/* 武将名 */}
      <div className="form-group">
        <label className="form-group__label">武将名称</label>
        <Input value={name} onChange={(v) => updateField('name', v)} placeholder="请输入繁体字，如：關羽" maxLength={8} />
        <div className="form-group__hint">最多8个字符（含双头武将和&符号），建议使用繁体字</div>
      </div>

      {/* 势力编号 */}
      <div className="form-group">
        <label className="form-group__label">势力编号</label>
        <Input
          value={factionNumber}
          onChange={(v) => updateField('factionNumber', v)}
          placeholder="如：WEI 001"
        />
        <div className="form-group__hint">格式：势力前缀 编号（如 SHU 001）</div>
      </div>
    </Accordion>
  );
};

export default BasicInfoPanel;
