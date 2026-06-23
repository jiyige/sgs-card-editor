import React, { useMemo } from 'react';
import { Text } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS } from '../../constants';
import { NAME_FONTS } from '../../constants/fonts';

const NameLayer: React.FC = () => {
  const name = useCardStore((s) => s.name);
  const faction = useCardStore((s) => s.faction);
  const nameColor = useCardStore((s) => s.nameColor);
  const nameFontId = useCardStore((s) => s.nameFont);
  const layout = useCardStore((s) => s.layout);
  const isLord = useCardStore((s) => s.isLord);

  const fontFamily = useMemo(() => {
    const font = NAME_FONTS.find((f) => f.id === nameFontId);
    return font?.family || "'Noto Serif SC', serif";
  }, [nameFontId]);

  const color = useMemo(() => {
    if (nameColor !== '#FFFFFF') return nameColor;
    return isLord ? '#D4A843' : FACTION_COLORS[faction].text;
  }, [nameColor, faction, isLord]);

  const displayName = name || '武将名';

  // 金色渐变效果用 shadow 模拟
  const shadowColor = isLord ? 'rgba(212, 168, 67, 0.4)' : undefined;

  return (
    <Text
      name="name-layer"
      x={0}
      y={layout.nameY}
      width={420}
      text={displayName}
      fontSize={layout.nameFontSize}
      fontFamily={fontFamily}
      fill={name ? color : 'rgba(255,255,255,0.2)'}
      align="center"
      fontStyle="bold"
      letterSpacing={6}
      shadowColor={shadowColor}
      shadowBlur={shadowColor ? 8 : 0}
      listening={true}
    />
  );
};

export default NameLayer;
