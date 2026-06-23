import React, { useMemo } from 'react';
import { Text } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS } from '../../constants';
import { TITLE_FONTS } from '../../constants/fonts';

const TitleLayer: React.FC = () => {
  const title = useCardStore((s) => s.title);
  const faction = useCardStore((s) => s.faction);
  const titleColor = useCardStore((s) => s.titleColor);
  const titleFontId = useCardStore((s) => s.titleFont);
  const layout = useCardStore((s) => s.layout);
  const isLord = useCardStore((s) => s.isLord);

  const fontFamily = useMemo(() => {
    const font = TITLE_FONTS.find((f) => f.id === titleFontId);
    return font?.family || "'Noto Serif SC', serif";
  }, [titleFontId]);

  const color = useMemo(() => {
    if (titleColor !== '#FFFFFF') return titleColor;
    return isLord ? '#D4A843' : FACTION_COLORS[faction].text;
  }, [titleColor, faction, isLord]);

  const displayTitle = title || '称号';

  return (
    <Text
      name="title-layer"
      x={0}
      y={layout.titleY}
      width={420}
      text={displayTitle}
      fontSize={layout.titleFontSize}
      fontFamily={fontFamily}
      fill={title ? color : 'rgba(255,255,255,0.2)'}
      align="center"
      fontStyle="bold"
      letterSpacing={4}
      listening={true}
    />
  );
};

export default TitleLayer;
