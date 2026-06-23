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
            titleFont: state.titleFont,
            titleColor: state.titleColor,
            nameFont: state.nameFont,
            nameColor: state.nameColor,
            borderColor: state.borderColor,
            copyright: state.copyright,
            artist: state.artist,
            flavor: state.flavor,
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

  // 首次加载时恢复
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sgs_current_project');
      if (raw) {
        const data = JSON.parse(raw);
        useCardStore.getState().importData(data);
      }
    } catch {}
  }, []);
}
