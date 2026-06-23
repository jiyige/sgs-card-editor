import React, { useMemo } from 'react';
import { Group, Circle, Text, Rect } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS } from '../../constants';

const HpLayer: React.FC = () => {
  const hp = useCardStore((s) => s.hp);
  const maxHp = useCardStore((s) => s.maxHp);
  const armor = useCardStore((s) => s.armor);
  const faction = useCardStore((s) => s.faction);
  const layout = useCardStore((s) => s.layout);

  const factionColor = FACTION_COLORS[faction].primary;

  const hpIcons = useMemo(() => {
    const icons: { x: number; y: number; filled: boolean; type: 'hp' | 'armor' }[] = [];

    // HP 勾玉（第一行）
    const hpRowY = layout.hpY;
    const totalHpIcons = Math.min(maxHp, 8);
    const hpPerRow = 5;

    for (let i = 0; i < totalHpIcons; i++) {
      const row = Math.floor(i / hpPerRow);
      const col = i % hpPerRow;
      icons.push({
        x: layout.hpX + col * (layout.hpIconSize + layout.hpIconSize * 0.15),
        y: hpRowY + row * (layout.hpIconSize + 4),
        filled: i < hp,
        type: 'hp',
      });
    }

    // 护甲（HP下方）
    if (armor > 0) {
      const armorY = hpRowY + Math.ceil(totalHpIcons / hpPerRow) * (layout.hpIconSize + 4) + 4;
      const armorPerRow = 5;
      for (let i = 0; i < Math.min(armor, 10); i++) {
        const col = i % armorPerRow;
        icons.push({
          x: layout.armorX + col * (layout.armorIconSize + 3),
          y: armorY,
          filled: true,
          type: 'armor',
        });
      }
    }

    return icons;
  }, [hp, maxHp, armor, layout]);

  return (
    <Group listening={false}>
      {hpIcons.map((icon, idx) => {
        if (icon.type === 'hp') {
          return (
            <Group key={`hp-${idx}`}>
              {/* 勾玉形状用圆形 + 内部高光模拟 */}
              <Circle
                x={icon.x + layout.hpIconSize / 2}
                y={icon.y + layout.hpIconSize / 2}
                radius={layout.hpIconSize / 2}
                fill={icon.filled ? factionColor : 'transparent'}
                stroke={icon.filled ? factionColor : 'rgba(255,255,255,0.15)'}
                strokeWidth={1.5}
              />
              {icon.filled && (
                <Circle
                  x={icon.x + layout.hpIconSize / 2 - 3}
                  y={icon.y + layout.hpIconSize / 2 - 4}
                  radius={layout.hpIconSize * 0.2}
                  fill="rgba(255,255,255,0.4)"
                />
              )}
            </Group>
          );
        }
        // 护甲图标（菱形）
        return (
          <Rect
            key={`armor-${idx}`}
            x={icon.x}
            y={icon.y}
            width={layout.armorIconSize}
            height={layout.armorIconSize}
            fill="#8B7355"
            stroke="#A08060"
            strokeWidth={1}
            cornerRadius={2}
            rotation={45}
            offsetX={0}
            offsetY={0}
          />
        );
      })}
    </Group>
  );
};

export default HpLayer;
