import React from 'react';
import { Group, Text } from 'react-konva';
import { useCardStore } from '../../store';

const CopyrightLayer: React.FC = () => {
  const copyright = useCardStore((s) => s.copyright);
  const artist = useCardStore((s) => s.artist);
  const flavor = useCardStore((s) => s.flavor);
  const layout = useCardStore((s) => s.layout);

  const hasContent = copyright || artist || flavor;

  return (
    <Group listening={false}>
      {flavor && (
        <Text
          x={20}
          y={layout.copyrightY - 40}
          width={380}
          text={flavor}
          fontSize={9}
          fontFamily="'Noto Serif SC', serif"
          fill="rgba(255,255,255,0.3)"
          align="center"
          fontStyle="italic"
        />
      )}
      {copyright && (
        <Text
          x={20}
          y={layout.copyrightY - 16}
          width={380}
          text={copyright}
          fontSize={layout.copyrightFontSize}
          fontFamily="'Noto Sans SC', sans-serif"
          fill="rgba(255,255,255,0.25)"
          align="center"
        />
      )}
      {artist && (
        <Text
          x={20}
          y={layout.copyrightY}
          width={380}
          text={`画师: ${artist}`}
          fontSize={layout.copyrightFontSize}
          fontFamily="'Noto Sans SC', sans-serif"
          fill="rgba(255,255,255,0.25)"
          align="center"
        />
      )}
    </Group>
  );
};

export default CopyrightLayer;
