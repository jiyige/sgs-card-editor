import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Rect, Text } from 'react-konva';
import { useArtStore, useCardStore } from '../../store';

const ArtLayer: React.FC = () => {
  const currentArt = useArtStore((s) => s.currentArt);
  const layout = useCardStore((s) => s.layout);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!currentArt) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = currentArt;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentArt]);

  const clipFunc = (ctx: any) => {
    const r = 10;
    const x = layout.artX;
    const y = layout.artY;
    const w = layout.artWidth;
    const h = layout.artHeight;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  if (!image) {
    return (
      <>
        <Rect
          x={layout.artX}
          y={layout.artY}
          width={layout.artWidth}
          height={layout.artHeight}
          fill="#161620"
          cornerRadius={10}
          stroke="#2a2a3a"
          strokeWidth={1}
        />
        <Text
          x={layout.artX}
          y={layout.artY + layout.artHeight / 2 - 20}
          width={layout.artWidth}
          text="点击上传原画"
          fontSize={14}
          fontFamily="'Noto Sans SC', sans-serif"
          fill="rgba(255,255,255,0.15)"
          align="center"
        />
        <Text
          x={layout.artX}
          y={layout.artY + layout.artHeight / 2 + 2}
          width={layout.artWidth}
          text="或选择已有原画"
          fontSize={12}
          fontFamily="'Noto Sans SC', sans-serif"
          fill="rgba(255,255,255,0.1)"
          align="center"
        />
      </>
    );
  }

  return (
    <KonvaImage
      name="art-layer"
      image={image}
      x={layout.artX + layout.artOffsetX}
      y={layout.artY + layout.artOffsetY}
      width={layout.artWidth * layout.artScale}
      height={layout.artHeight * layout.artScale}
      clipFunc={clipFunc}
      listening={true}
    />
  );
};

export default ArtLayer;
