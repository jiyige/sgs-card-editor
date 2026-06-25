import { useEffect, useRef } from 'react';
import { useCardStore } from '../store';

export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // 使用 store.subscribe 在组件外监听变化，避免 selector 返回新对象导致无限渲染
    const unsub = useCardStore.subscribe((state) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          const data = {
            template: state.template,
            faction: state.faction,
            subFaction: state.subFaction,
            title: state.title,
            name: state.name,
            isLord: state.isLord,
            hp: state.hp,
            maxHp: state.maxHp,
            armor: state.armor,
            copyright: state.copyright,
            artist: state.artist,
            flavor: state.flavor,
            factionNumber: state.factionNumber,
            badge: state.badge,
            skills: state.skills,
            layout: state.layout,
          };
          localStorage.setItem('sgs_current_project', JSON.stringify(data));
        } catch {}
      }, 2000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 首次加载时恢复（但强制使用新布局，避免旧缓存的位置错误）
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sgs_current_project');
      if (raw) {
        const data = JSON.parse(raw);
        // 不恢复 layout，强制使用模板默认布局
        delete data.layout;
        // 移除已废弃的字段
        delete data.titleFont;
        delete data.titleColor;
        delete data.nameFont;
        delete data.nameColor;
        delete data.borderColor;
        useCardStore.getState().importData(data);
      }
    } catch {}
  }, []);
}
