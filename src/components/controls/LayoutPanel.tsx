import React from 'react';
import Accordion from './Accordion';
import { useCardStore, useUIStore } from '../../store';

const LayoutPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.layout);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const layout = useCardStore((s) => s.layout);
  const updateLayoutField = useCardStore((s) => s.updateLayoutField);

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: 'var(--color-accent)',
    height: 4,
  };

  return (
    <Accordion
      id="layout"
      title="布局微调"
      expanded={expanded}
      onToggle={() => togglePanel('layout')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      }
    >
      <div className="form-group">
        <label className="form-group__label">
          原画缩放: {Math.round(layout.artScale * 100)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={layout.artScale}
          onChange={(e) => updateLayoutField('artScale', parseFloat(e.target.value))}
          style={sliderStyle}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-group__label">
            原画X偏移: {layout.artOffsetX}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={layout.artOffsetX}
            onChange={(e) => updateLayoutField('artOffsetX', parseInt(e.target.value))}
            style={sliderStyle}
          />
        </div>
        <div className="form-group">
          <label className="form-group__label">
            原画Y偏移: {layout.artOffsetY}
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={layout.artOffsetY}
            onChange={(e) => updateLayoutField('artOffsetY', parseInt(e.target.value))}
            style={sliderStyle}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-group__label">
          称号字号: {layout.titleFontSize}px
        </label>
        <input
          type="range"
          min="14"
          max="36"
          step="1"
          value={layout.titleFontSize}
          onChange={(e) => updateLayoutField('titleFontSize', parseInt(e.target.value))}
          style={sliderStyle}
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">
          武将名字号: {layout.nameFontSize}px
        </label>
        <input
          type="range"
          min="18"
          max="42"
          step="1"
          value={layout.nameFontSize}
          onChange={(e) => updateLayoutField('nameFontSize', parseInt(e.target.value))}
          style={sliderStyle}
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">
          技能字号: {layout.skillFontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="18"
          step="1"
          value={layout.skillFontSize}
          onChange={(e) => updateLayoutField('skillFontSize', parseInt(e.target.value))}
          style={sliderStyle}
        />
      </div>
    </Accordion>
  );
};

export default LayoutPanel;
