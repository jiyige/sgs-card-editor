import React from 'react';
import Accordion from './Accordion';
import { useCardStore, useUIStore } from '../../store';

// 区域选项
const AREA_OPTIONS = [
  { value: 'card-root', label: '卡牌（全局）' },
  { value: 'art', label: '原画区' },
  { value: 'nameArea', label: '姓名区（称号+名称）' },
  { value: 'faction', label: '势力区' },
  { value: 'hpBar', label: '血槽区（勾玉+护甲）' },
  { value: 'skillArea', label: '技能区' },
  { value: 'descArea', label: '描述区（武将评价）' },
  { value: 'copyrightArea', label: '版权/编号区' },
];

// 每个区域的属性配置 - 包含子对象属性
const AREA_PROPERTIES: Record<string, { label: string; groups: { title: string; fields: { key: string; label: string; min: number; max: number; step: number }[] }[] }> = {
  'card-root': {
    label: '卡牌（全局）',
    groups: [
      {
        title: '安全区域',
        fields: [
          { key: 'safeMarginTop', label: '上边距', min: 0, max: 50, step: 1 },
          { key: 'safeMarginBottom', label: '下边距', min: 0, max: 50, step: 1 },
          { key: 'safeMarginLeft', label: '左边距', min: 0, max: 50, step: 1 },
          { key: 'safeMarginRight', label: '右边距', min: 0, max: 50, step: 1 },
        ],
      },
      {
        title: '外观',
        fields: [
          { key: 'cardCornerRadius', label: '圆角', min: 0, max: 30, step: 1 },
        ],
      },
    ],
  },
  'art': {
    label: '原画区',
    groups: [{
      title: '原画设置',
      fields: [
        { key: 'artX', label: 'X坐标', min: -200, max: 200, step: 1 },
        { key: 'artY', label: 'Y坐标', min: -200, max: 200, step: 1 },
        { key: 'artScale', label: '缩放', min: 0.3, max: 3, step: 0.05 },
      ],
    }],
  },
  'nameArea': {
    label: '姓名区（称号+名称）',
    groups: [{
      title: '整体位置',
      fields: [
        { key: 'nameAreaX', label: '整体X', min: 0, max: 200, step: 1 },
        { key: 'nameAreaY', label: '整体Y', min: 0, max: 300, step: 1 },
        { key: 'titleFontSize', label: '称号字号', min: 8, max: 24, step: 1 },
        { key: 'nameFontSize', label: '武将名字号', min: 12, max: 36, step: 1 },
      ],
    }],
  },
  'faction': {
    label: '势力区',
    groups: [{
      title: '势力设置',
      fields: [
        { key: 'factionX', label: '整体X', min: 0, max: 200, step: 1 },
        { key: 'factionY', label: '整体Y', min: 0, max: 200, step: 1 },
        { key: 'factionIconSize', label: '图标大小', min: 20, max: 80, step: 1 },
        { key: 'factionMarkOffsetX', label: '文字X偏移', min: -20, max: 20, step: 1 },
        { key: 'factionMarkOffsetY', label: '文字Y偏移', min: -20, max: 20, step: 1 },
      ],
    }],
  },
  'hpBar': {
    label: '血槽区（勾玉+护甲）',
    groups: [{
      title: '血槽+护甲设置',
      fields: [
        { key: 'hpBarX', label: '血槽X', min: 0, max: 300, step: 1 },
        { key: 'hpBarY', label: '血槽Y', min: 0, max: 200, step: 1 },
        { key: 'hpIconSize', label: '勾玉大小', min: 10, max: 40, step: 1 },
        { key: 'hpBarSpacing', label: '勾玉间距', min: 0, max: 20, step: 1 },
        { key: 'armorBarX', label: '护甲X', min: 0, max: 300, step: 1 },
        { key: 'armorBarY', label: '护甲Y', min: 0, max: 200, step: 1 },
        { key: 'armorIconSize', label: '护甲大小', min: 8, max: 30, step: 1 },
        { key: 'armorBarSpacing', label: '护甲间距', min: 0, max: 20, step: 1 },
      ],
    }],
  },
  'skillArea': {
    label: '技能区',
    groups: [{
      title: '技能设置',
      fields: [
        { key: 'skillFontSize', label: '字号', min: 10, max: 18, step: 1 },
        { key: 'skillLineHeight', label: '行高', min: 14, max: 30, step: 1 },
        { key: 'skillSpacing', label: '技能间距', min: 0, max: 20, step: 1 },
      ],
    }],
  },
  'descArea': {
    label: '描述区（武将评价）',
    groups: [{
      title: '描述设置',
      fields: [
        { key: 'descX', label: 'X坐标', min: 0, max: 200, step: 1 },
        { key: 'descFontSize', label: '字号', min: 8, max: 16, step: 1 },
      ],
    }],
  },
  'copyrightArea': {
    label: '版权/编号区',
    groups: [{
      title: '版权设置',
      fields: [
        { key: 'copyrightAreaX', label: 'X坐标', min: 0, max: 200, step: 1 },
        { key: 'copyrightAreaY', label: 'Y坐标', min: 400, max: 600, step: 1 },
      ],
    }],
  },
};

const LayoutPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.layout);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const selectedObjectId = useUIStore((s) => s.selectedObjectId);
  const setSelectedObjectId = useUIStore((s) => s.setSelectedObjectId);
  const layout = useCardStore((s) => s.layout);
  const updateLayoutField = useCardStore((s) => s.updateLayoutField);

  const sliderStyle: React.CSSProperties = {
    width: '100%', accentColor: 'var(--color-accent)', height: 4,
  };

  // 当前选中的区域，如果没选中或选中的是子对象，映射到父区域
  const getCurrentArea = (): string => {
    if (!selectedObjectId) return '';
    if (selectedObjectId === 'art') return 'art';
    if (selectedObjectId === 'nameArea' || selectedObjectId === 'title' || selectedObjectId === 'personName') return 'nameArea';
    if (selectedObjectId === 'faction' || selectedObjectId.startsWith('faction-')) return 'faction';
    if (selectedObjectId === 'hpBar' || selectedObjectId.startsWith('hp-')) return 'hpBar';
    if (selectedObjectId === 'armorBar' || selectedObjectId.startsWith('armor-')) return 'hpBar';
    if (selectedObjectId.startsWith('skill-') || selectedObjectId === 'bottomArea') return 'skillArea';
    if (selectedObjectId === 'descArea') return 'descArea';
    if (selectedObjectId === 'copyrightArea' || selectedObjectId === 'number-text' || selectedObjectId === 'copyright-text' || selectedObjectId.startsWith('badge-')) return 'copyrightArea';
    if (selectedObjectId === 'card-root') return 'card-root';
    return '';
  };

  const currentArea = getCurrentArea();
  const config = currentArea ? AREA_PROPERTIES[currentArea] : null;

  const handleSelectChange = (value: string) => {
    setSelectedObjectId(value);
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
      {/* 区域切换 select */}
      <div className="form-group">
        <label className="form-group__label">选择区域</label>
        <select
          className="form-select"
          value={currentArea}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="" disabled>请选择区域</option>
          {AREA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 显示选中区域的属性 */}
      {config && (
        <div>
          {config.groups.map((group) => (
            <div key={group.title} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                fontWeight: 600, marginBottom: 8, paddingBottom: 4,
                borderBottom: '1px solid var(--color-border)',
              }}>
                {group.title}
              </div>
              {group.fields.map((field) => (
                <div className="form-group" key={field.key}>
                  <label className="form-group__label">
                    {field.label}: {(() => {
                      const v = layout[field.key as keyof typeof layout];
                      return typeof v === 'number' ? (field.step < 1 ? Math.round(v * 100) / 100 : v) : v;
                    })()}
                  </label>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={layout[field.key as keyof typeof layout] as number}
                    onChange={(e) => updateLayoutField(field.key as any, parseFloat(e.target.value))}
                    style={sliderStyle}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
};

export default LayoutPanel;
