import React, { useState, useEffect } from 'react';
import { CardPreview } from '../../engine';
import { ControlsSection } from '../controls';
import LayoutPanel from '../controls/LayoutPanel';
import BadgePanel from '../controls/BadgePanel';
import ExtraPanel from '../controls/ExtraPanel';
import { useUIStore } from '../../store';

type LeftPanel = 'form' | 'advanced' | 'layout';

const Workspace: React.FC = () => {
  const previewScale = useUIStore((s) => s.previewScale);
  const setPreviewScale = useUIStore((s) => s.setPreviewScale);
  const interactionMode = useUIStore((s) => s.interactionMode);
  const setInteractionMode = useUIStore((s) => s.setInteractionMode);
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('form');

  useEffect(() => {
    if (interactionMode !== 'none') {
      setLeftPanel('layout');
    }
  }, [interactionMode]);

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    fontSize: '0.85rem',
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
    borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  return (
    <div className="workspace">
      {/* 左侧预览区 */}
      <div className="preview-section">
        <div className="preview-section__canvas-container">
          <CardPreview />
        </div>

        <div style={{
          marginTop: 6, fontSize: '0.72rem', color: 'var(--color-text-muted)',
          textAlign: 'center', minHeight: 16,
        }}>
          {interactionMode === 'art' && '已选中原画 - 滚轮缩放 | 拖拽平移'}
          {interactionMode === 'title' && '已选中称号 - 切换布局微调调整'}
          {interactionMode === 'name' && '已选中武将名 - 切换布局微调调整'}
          {interactionMode === 'none' && '点击卡牌元素可选中'}
        </div>

        <div className="preview-section__toolbar">
          <button className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))} title="缩小">
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" /></svg>
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: 40, textAlign: 'center' }}>
            {Math.round(previewScale * 100)}%
          </span>
          <button className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setPreviewScale(Math.min(3, previewScale + 0.1))} title="放大">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />
          <button className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setInteractionMode('none')} title="取消选中"
            style={{ color: interactionMode !== 'none' ? 'var(--color-accent)' : undefined }}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* 右侧：三标签切换 */}
      <div className="controls-section">
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
          <button style={tabBtnStyle(leftPanel === 'form')} onClick={() => setLeftPanel('form')}>信息填写</button>
          <button style={tabBtnStyle(leftPanel === 'advanced')} onClick={() => setLeftPanel('advanced')}>高级设置</button>
          <button style={tabBtnStyle(leftPanel === 'layout')} onClick={() => setLeftPanel('layout')}>布局微调</button>
        </div>

        {leftPanel === 'form' && <ControlsSection noWrapper />}
        {leftPanel === 'advanced' && (
          <div style={{ paddingBottom: 32 }}>
            <BadgePanel />
            <ExtraPanel />
          </div>
        )}
        {leftPanel === 'layout' && (
          <div style={{ paddingBottom: 32 }}>
            <LayoutPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
