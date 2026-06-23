import React from 'react';
import Accordion from './Accordion';
import { Input, TextArea } from '../ui';
import { useCardStore, useUIStore } from '../../store';

const ExtraPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.extra);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const copyright = useCardStore((s) => s.copyright);
  const artist = useCardStore((s) => s.artist);
  const flavor = useCardStore((s) => s.flavor);
  const updateField = useCardStore((s) => s.updateField);

  return (
    <Accordion
      id="extra"
      title="额外信息"
      expanded={expanded}
      onToggle={() => togglePanel('extra')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 5v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      }
    >
      <div className="form-group">
        <label className="form-group__label">版权信息</label>
        <Input
          value={copyright}
          onChange={(v) => updateField('copyright', v)}
          placeholder="如: (C) 2024 Sanguosha"
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">画师名称</label>
        <Input
          value={artist}
          onChange={(v) => updateField('artist', v)}
          placeholder="输入画师名称"
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">武将评价 / 引言</label>
        <TextArea
          value={flavor}
          onChange={(v) => updateField('flavor', v)}
          placeholder="输入武将评价或经典台词"
          rows={2}
        />
      </div>
    </Accordion>
  );
};

export default ExtraPanel;
