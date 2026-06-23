import React, { useMemo } from 'react';
import { Rect, Line, Group } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS } from '../../constants';
import type { FactionId } from '../../types';

const BorderLayer: React.FC = () => {
  const faction = useCardStore((s) => s.faction);
  const template = useCardStore((s) => s.template);
  const customColor = useCardStore((s) => s.borderColor);
  const isLord = useCardStore((s) => s.isLord);

  const borderColor = useMemo(() => {
    if (customColor) return customColor;
    const fc = FACTION_COLORS[faction];
    return isLord ? '#D4A843' : fc.primary;
  }, [faction, customColor, isLord]);

  const secondaryColor = useMemo(() => {
    const fc = FACTION_COLORS[faction];
    return isLord ? '#9A7B2C' : fc.secondary;
  }, [faction, isLord]);

  const cardW = 420;
  const cardH = 610;
  const radius = 16;

  return (
    <Group listening={false}>
      {/* 卡牌背景 */}
      <Rect
        x={0}
        y={0}
        width={cardW}
        height={cardH}
        fill="#1a1520"
        cornerRadius={radius}
        shadowColor="#000"
        shadowBlur={20}
        shadowOpacity={0.5}
        shadowOffset={{ x: 0, y: 4 }}
      />

      {/* 外边框 */}
      <Rect
        x={2}
        y={2}
        width={cardW - 4}
        height={cardH - 4}
        stroke={borderColor}
        strokeWidth={3}
        cornerRadius={radius}
        fillEnabled={false}
      />

      {/* 内边框 */}
      <Rect
        x={8}
        y={8}
        width={cardW - 16}
        height={cardH - 16}
        stroke={secondaryColor}
        strokeWidth={1}
        cornerRadius={radius - 4}
        fillEnabled={false}
        opacity={0.6}
      />

      {/* 顶部分割线（原画与信息区之间） */}
      <Line
        points={[20, 355, cardW - 20, 355]}
        stroke={borderColor}
        strokeWidth={1}
        opacity={0.4}
        dash={[4, 4]}
      />

      {/* 底部分割线（技能区与版权区之间） */}
      <Line
        points={[20, 565, cardW - 20, 565]}
        stroke={borderColor}
        strokeWidth={1}
        opacity={0.3}
        dash={[4, 4]}
      />

      {/* 角落装饰 - 左上 */}
      <Line points={[16, 28, 16, 16, 28, 16]} stroke={borderColor} strokeWidth={2} opacity={0.5} />
      {/* 角落装饰 - 右上 */}
      <Line points={[cardW - 28, 16, cardW - 16, 16, cardW - 16, 28]} stroke={borderColor} strokeWidth={2} opacity={0.5} />
      {/* 角落装饰 - 左下 */}
      <Line points={[16, cardH - 28, 16, cardH - 16, 28, cardH - 16]} stroke={borderColor} strokeWidth={2} opacity={0.5} />
      {/* 角落装饰 - 右下 */}
      <Line points={[cardW - 28, cardH - 16, cardW - 16, cardH - 16, cardW - 16, cardH - 28]} stroke={borderColor} strokeWidth={2} opacity={0.5} />
    </Group>
  );
};

export default BorderLayer;
