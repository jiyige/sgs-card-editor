import React, { useRef, useState } from 'react';
import Accordion from './Accordion';
import { Button } from '../ui';
import { useArtStore, useUIStore } from '../../store';

const ArtPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.art);
  const togglePanel = useUIStore((s) => s.togglePanel);

  const currentArt = useArtStore((s) => s.currentArt);
  const artLibrary = useArtStore((s) => s.artLibrary);
  const setCurrentArt = useArtStore((s) => s.setCurrentArt);
  const addToLibrary = useArtStore((s) => s.addToLibrary);
  const removeFromLibrary = useArtStore((s) => s.removeFromLibrary);
  const selectFromLibrary = useArtStore((s) => s.selectFromLibrary);
  const addToast = useUIStore((s) => s.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLargePreview, setShowLargePreview] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('请选择图片文件', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addToLibrary(dataUrl, file.name);
      addToast('原画上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('upload-zone--dragging');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('upload-zone--dragging');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('upload-zone--dragging');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addToLibrary(dataUrl, file.name);
      addToast('原画上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Accordion
      id="art"
      title="原画管理"
      expanded={expanded}
      onToggle={() => togglePanel('art')}
      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="5" cy="6" r="1" fill="currentColor" /><path d="M2 11l4-4 3 3 3-3 2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    >
      {/* 上传区域 */}
      <div
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg className="upload-zone__icon" viewBox="0 0 48 48" fill="none">
          <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="upload-zone__text">点击或拖拽上传原画</span>
        <span className="upload-zone__hint">支持 JPG、PNG、WebP 格式</span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>

      {/* 当前原画 - 缩略图预览 */}
      {currentArt && (
        <div style={{ marginTop: 12 }}>
          <div className="form-inline form-inline--between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>当前原画</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" size="sm" onClick={() => setShowLargePreview(true)}>查看大图</Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentArt(null)}>清除</Button>
            </div>
          </div>
          <div
            style={{
              width: 120,
              height: 80,
              borderRadius: 6,
              overflow: 'hidden',
              border: '1px solid var(--color-border-accent)',
              cursor: 'pointer',
            }}
            onClick={() => setShowLargePreview(true)}
          >
            <img src={currentArt} alt="当前原画缩略图" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      )}

      {/* 原画库 */}
      {artLibrary.length > 0 && (
        <div>
          <label className="form-group__label" style={{ marginTop: 12 }}>原画库 ({artLibrary.length})</label>
          <div className="art-gallery">
            {artLibrary.map((entry) => (
              <div
                key={entry.id}
                className={`art-gallery__item ${currentArt === entry.dataUrl ? 'art-gallery__item--active' : ''}`}
                onClick={() => selectFromLibrary(entry.id)}
              >
                <img src={entry.dataUrl} alt={entry.name} />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromLibrary(entry.id); }}
                  style={{
                    position: 'absolute', top: 2, right: 2, width: 18, height: 18,
                    borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none',
                    color: '#e88484', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="删除"
                >x</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 大图预览弹窗 */}
      {showLargePreview && currentArt && (
        <div
          onClick={() => setShowLargePreview(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, cursor: 'pointer',
          }}
        >
          <img
            src={currentArt}
            alt="原画大图预览"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          />
        </div>
      )}
    </Accordion>
  );
};

export default ArtPanel;
