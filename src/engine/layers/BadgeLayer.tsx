import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Rect, Text } from 'react-konva';
import { useCardStore } from '../../store';

const BadgeLayer: React.FC = () => {
  const badge = useCardStore((s) => s.badge);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (badge.type === 'custom' && badge.customImage) {
      const img = new window.Image();
      img.onload = () => setImage(img);
      img.onerror = () => setImage(null);
      img.src = badge.customImage;
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
    setImage(null);
  }, [badge]);

  if (badge.type === 'builtin' && !badge.builtinId) return null;
  if (badge.type === 'custom' && !badge.customImage) return null;

  const size = 40 * badge.scale;

  if (badge.type === 'custom' && image) {
    return (
      <KonvaImage
        image={image}
        x={badge.position.x}
        y={badge.position.y}
        width={size}
        height={size}
        listening={false}
      />
    );
  }

  // 内置角标用简单图形表示
  if (badge.type === 'builtin' && badge.builtinId) {
    return (
      <Rect
        x={badge.position.x}
        y={badge.position.y}
        width={size}
        height={size}
        fill="rgba(212,168,67,0.8)"
        cornerRadius={4}
        stroke="#D4A843"
        strokeWidth={1}
      />
    );
  }

  return null;
};

export default BadgeLayer;
