import React, { useMemo } from 'react';
import { Group, Circle, Text } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS, FACTION_NAMES } from '../../constants';
import type { FactionId } from '../../types';

const FactionLayer: React.FC = () => {
  const faction = useCardStore((s) => s.faction);
  const subFaction = useCardStore((s) => s.subFaction);
  const layout = useCardStore((s) => s.layout);
  const isLord = useCardStore((s) => s.isLord);

  const mainColor = useMemo(() => {
    const fc = FACTION_COLORS[faction];
    return isLord ? '#D4A843' : fc.primary;
  }, [faction, isLord]);

  const subColor = useMemo(() => {
    if (!subFaction) return null;
    return FACTION_COLORS[subFaction].primary;
  }, [subFaction]);

  const mainName = FACTION_NAMES[faction];
  const subName = subFaction ? FACTION_NAMES[subFaction] : null;

  const { factionIconX, factionIconY, factionIconSize } = layout;

  return (
    <Group listening={false}>
      {/* 主势力图标背景 */}
      <Circle
        x={factionIconX + factionIconSize / 2}
        y={factionIconY + factionIconSize / 2}
        radius={factionIconSize / 2}
        fill={mainColor}
        opacity={0.9}
        shadowColor={mainColor}
        shadowBlur={8}
        shadowOpacity={0.4}
      />
      {/* 主势力文字 */}
      <Text
        x={factionIconX}
        y={factionIconY}
        width={factionIconSize}
        height={factionIconSize}
        text={mainName}
        fontSize={factionIconSize * 0.5}
        fontFamily="'Noto Serif SC', serif"
        fontStyle="bold"
        fill="#FFFFFF"
        align="center"
        verticalAlign="middle"
      />

      {/* 副势力图标（双势力时） */}
      {subFaction && subColor && (
        <>
          <Circle
            x={factionIconX + factionIconSize + 4 + factionIconSize * 0.6 / 2}
            y={factionIconY + factionIconSize / 2}
            radius={factionIconSize * 0.6 / 2}
            fill={subColor}
            opacity={0.85}
            shadowColor={subColor}
            shadowBlur={6}
            shadowOpacity={0.3}
          />
          <Text
            x={factionIconX + factionIconSize + 4}
            y={factionIconY + factionIconSize * 0.2}
            width={factionIconSize * 0.6}
            height={factionIconSize * 0.6}
            text={subName!}
            fontSize={factionIconSize * 0.32}
            fontFamily="'Noto Serif SC', serif"
            fontStyle="bold"
            fill="#FFFFFF"
            align="center"
            verticalAlign="middle"
          />
        </>
      )}

      {/* 主公开关标识 */}
      {isLord && (
        <Text
          x={factionIconX - 4}
          y={factionIconY + factionIconSize + 6}
          text="主"
          fontSize={14}
          fontFamily="'Noto Serif SC', serif"
          fontStyle="bold"
          fill="#D4A843"
          width={factionIconSize + 8}
          align="center"
        />
      )}
    </Group>
  );
};

export default FactionLayer;
