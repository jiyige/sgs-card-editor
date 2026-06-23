import React, { useRef } from 'react';
import { Button } from '../ui';
import { useCardStore, useArtStore, useUIStore } from '../../store';
import { saveAs } from 'file-saver';

const AppHeader: React.FC = () => {
  const exportData = useCardStore((s) => s.exportData);
  const importData = useCardStore((s) => s.importData);
  const resetAll = useCardStore((s) => s.resetAll);
  const addToast = useUIStore((s) => s.addToast);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `sgs-card-${Date.now()}.json`);
    addToast('项目导出成功', 'success');
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importData(data);
        addToast('项目导入成功', 'success');
      } catch {
        addToast('导入失败：无效的JSON文件', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportImage = async () => {
    const stageEl = document.querySelector('.konvajs-content canvas') as HTMLCanvasElement;
    if (!stageEl) {
      addToast('导出失败：未找到预览画布', 'error');
      return;
    }
    try {
      const dataUrl = stageEl.toDataURL('image/png');
      saveAs(dataUrl, `sgs-card-${Date.now()}.png`);
      addToast('卡牌图片导出成功', 'success');
    } catch {
      addToast('导出失败', 'error');
    }
  };

  const handleReset = () => {
    resetAll();
    addToast('已重置所有数据', 'info');
  };

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* 装饰龙纹 SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C8 2 4 6 4 10c0 3 2 5 4 6-1-2-1-4 0-6 1 2 2 4 2 6 0-2 1-4 2-6 1 2 1 4 0 6 2-1 4-3 4-6 0-4-4-8-8-8z"
            fill="var(--color-accent)"
            opacity="0.8"
          />
          <circle cx="12" cy="16" r="1.5" fill="var(--color-accent)" />
        </svg>
        <h1 className="app-header__title">三国杀卡牌编辑器</h1>
      </div>

      <div className="app-header__actions">
        <Button variant="ghost" size="sm" onClick={handleImportJSON}>
          导入
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExportJSON}>
          导出JSON
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExportImage}>
          导出图片
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          重置
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </header>
  );
};

export default AppHeader;
