import React from 'react';
import { CardPreview } from '../../engine';
import { ControlsSection } from '../controls';
import { useUIStore, useCardStore } from '../../store';

const Workspace: React.FC = () => {
  const previewScale = useUIStore((s) => s.previewScale);
  const setPreviewScale = useUIStore((s) => s.setPreviewScale);
  const interactionMode = useUIStore((s) => s.interactionMode);
  const setInteractionMode = useUIStore((s) => s.setInteractionMode);
  const layout = useCardStore((s) => s.layout);
  const updateLayoutField = useCardStore((s) => s.updateLayoutField);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.3, Math.min(3, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div className="workspace">
      {/* 左侧预览区 */}
      <div className="preview-section">
        <div className="preview-section__canvas-container">
          <CardPreview
            scale={0.85}
            onWheel={handleWheel}
          />
        </div>

        {/* 交互状态提示 */}
        <div style={{
          marginTop: 8,
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          minHeight: 20,
        }}>
          {interactionMode === 'art' && '已选中原画 - 滚轮缩放 | 拖拽平移'}
          {interactionMode === 'title' && '已选中称号 - 在布局面板中调节字号'}
          {interactionMode === 'name' && '已选中武将名 - 在布局面板中调节字号'}
          {interactionMode === 'none' && '点击卡牌元素可选中交互'}
        </div>

        {/* 预览工具栏 */}
        <div className="preview-section__toolbar">
          <button
            className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
            title="缩小"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: 40, textAlign: 'center' }}>
            {Math.round(previewScale * 100)}%
          </span>
          <button
            className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setPreviewScale(Math.min(3, previewScale + 0.1))}
            title="放大"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />
          <button
            className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setPreviewScale(1)}
            title="重置缩放"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 2v5h5M14 14v-5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />
          <button
            className="btn btn--icon btn--sm btn--ghost"
            onClick={() => setInteractionMode('none')}
            title="取消选中"
            style={{ color: interactionMode !== 'none' ? 'var(--color-accent)' : undefined }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 右侧表单区 */}
      <ControlsSection />
    </div>
  );
};

export default Workspace;
