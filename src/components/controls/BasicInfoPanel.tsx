import React from 'react';
import Accordion from './Accordion';
import { Input, Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';
import { FACTION_ORDER, FACTION_NAMES, FACTION_COLORS } from '../../constants';
import { CARD_TEMPLATES } from '../../constants/templates';
import type { FactionId } from '../../types';

const BasicInfoPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.basic);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const template = useCardStore((s) => s.template);
  const faction = useCardStore((s) => s.faction);
  const subFaction = useCardStore((s) => s.subFaction);
  const title = useCardStore((s) => s.title);
  const name = useCardStore((s) => s.name);
  const isLord = useCardStore((s) => s.isLord);
  const setTemplate = useCardStore((s) => s.setTemplate);
  const setFaction = useCardStore((s) => s.setFaction);
  const setSubFaction = useCardStore((s) => s.setSubFaction);
  const updateField = useCardStore((s) => s.updateField);
  const toggleLord = useCardStore((s) => s.toggleLord);

  const currentTemplate = CARD_TEMPLATES.find((t) => t.id === template);

  return (
    <Accordion
      id="basic"
      title="基础信息"
      expanded={expanded}
      onToggle={() => togglePanel('basic')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      }
    >
      {/* 模板选择 */}
      <div className="form-group">
        <label className="form-group__label">卡牌模板</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as any)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: template === t.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: template === t.id ? 'rgba(201,164,75,0.1)' : 'var(--color-bg-tertiary)',
                color: template === t.id ? 'var(--color-accent-light)' : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontWeight: template === t.id ? 600 : 400,
              }}
            >
              {t.name}
            </button>
          ))}
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
                width: 44,
                height: 44,
                borderRadius: 10,
                border: faction === f ? `2px solid ${FACTION_COLORS[f].primary}` : '1px solid var(--color-border)',
                background: faction === f ? `${FACTION_COLORS[f].primary}22` : 'var(--color-bg-tertiary)',
                color: faction === f ? FACTION_COLORS[f].primary : 'var(--color-text-muted)',
                fontSize: '1.1rem',
                fontWeight: faction === f ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={FACTION_NAMES[f]}
            >
              {FACTION_NAMES[f]}
            </button>
          ))}
        </div>
      </div>

      {/* 双势力（仅在支持双势力的模板下显示） */}
      {currentTemplate?.supportsDualFaction && (
        <div className="form-group">
          <label className="form-group__label">副势力（可选）</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSubFaction(undefined)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: !subFaction ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: !subFaction ? 'rgba(201,164,75,0.1)' : 'transparent',
                color: !subFaction ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              无
            </button>
            {FACTION_ORDER.map((f) => (
              <button
                key={f}
                onClick={() => setSubFaction(f)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: subFaction === f ? `2px solid ${FACTION_COLORS[f].primary}` : '1px solid var(--color-border)',
                  background: subFaction === f ? `${FACTION_COLORS[f].primary}22` : 'var(--color-bg-tertiary)',
                  color: subFaction === f ? FACTION_COLORS[f].primary : 'var(--color-text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: subFaction === f ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {FACTION_NAMES[f]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 主公开关 */}
      <div className="form-group">
        <Checkbox checked={isLord} onChange={toggleLord} label="是否为主公" />
      </div>

      {/* 称号 */}
      <div className="form-group">
        <label className="form-group__label">武将称号</label>
        <Input
          value={title}
          onChange={(v) => updateField('title', v)}
          placeholder="输入称号，如：武圣"
          maxLength={6}
        />
        <div className="form-group__hint">最多6个字符</div>
      </div>

      {/* 武将名 */}
      <div className="form-group">
        <label className="form-group__label">武将名称</label>
        <Input
          value={name}
          onChange={(v) => updateField('name', v)}
          placeholder="输入武将名，如：关羽"
          maxLength={4}
        />
        <div className="form-group__hint">最多4个字符</div>
      </div>
    </Accordion>
  );
};

export default BasicInfoPanel;
