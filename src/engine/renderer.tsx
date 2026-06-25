import React, { useState, useEffect } from 'react';
import { Group, Rect, Circle, Text, Image as KonvaImage, Shape } from 'react-konva';
import type { CardObj, TextObj, ImageObj, ShapeObj, ContainerObj } from '../types/engine';
import { useUIStore } from '../store';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants';

const CARD_W = CARD_WIDTH;
const CARD_H = CARD_HEIGHT;

export function renderObj(obj: CardObj, parentX: number, parentY: number, onSelect: (id: string) => void): React.ReactNode {
  if (!obj.visible) return null;
  const absX = parentX + obj.x;
  const absY = parentY + obj.y;

  switch (obj.kind) {
    case 'container': return renderContainer(obj, absX, absY, onSelect);
    case 'text': return renderText(obj, absX, absY, onSelect);
    case 'image': return renderImage(obj, absX, absY, onSelect);
    case 'shape': return renderShape(obj, absX, absY, onSelect);
    default: return null;
  }
}

function renderContainer(obj: ContainerObj, absX: number, absY: number, onSelect: (id: string) => void): React.ReactNode {
  return (
    <Group
      key={obj.id}
      x={absX}
      y={absY}
      name={obj.selectable ? obj.id : undefined}
      onClick={obj.selectable ? (e: any) => { e.cancelBubble = true; onSelect(obj.id); } : undefined}
      draggable={obj.draggable || false}
      onDragEnd={obj.draggable ? (e: any) => {
        const node = e.target;
        node.getStage()?.fire('objDrag', { id: obj.id, x: node.x(), y: node.y() });
      } : undefined}
    >
      {obj.children?.map((child) => renderObj(child, 0, 0, onSelect))}
    </Group>
  );
}

function renderText(obj: TextObj, absX: number, absY: number, onSelect: (id: string) => void): React.ReactNode {
  // 竖排文字
  if (obj.vertical) {
    const chars = obj.text.split('\n');
    const fs = obj.fontSize || 14;
    const spacing = obj.charSpacing || 4;
    return (
      <Group
        key={obj.id}
        x={absX + (obj.textX || 0)}
        y={absY + (obj.textY || 0)}
        name={obj.selectable ? obj.id : undefined}
        onClick={obj.selectable ? (e: any) => { e.cancelBubble = true; onSelect(obj.id); } : undefined}
      >
        {chars.map((ch, i) => (
          <Text
            key={i}
            x={0}
            y={i * (fs + spacing)}
            text={ch}
            fontSize={fs}
            fontFamily={obj.fontFamily}
            fontStyle={obj.fontStyle || 'normal'}
            fill={obj.fill}
            align={obj.align || 'center'}
            width={fs}
            shadowColor={obj.shadowColor}
            shadowBlur={obj.shadowBlur || 0}
          />
        ))}
      </Group>
    );
  }

  // 横排文字
  return (
    <Text
      key={obj.id}
      x={absX + (obj.textX || 0)}
      y={absY + (obj.textY || 0)}
      name={obj.selectable ? obj.id : undefined}
      onClick={obj.selectable ? (e: any) => { e.cancelBubble = true; onSelect(obj.id); } : undefined}
      text={obj.text}
      fontSize={obj.fontSize || 14}
      fontFamily={obj.fontFamily}
      fontStyle={obj.fontStyle || 'normal'}
      fill={obj.fill}
      align={obj.align || 'left'}
      lineHeight={obj.lineHeight || 1.4}
      shadowColor={obj.shadowColor}
      shadowBlur={obj.shadowBlur || 0}
      width={obj.width}
      height={obj.height}
      wrap={obj.maxWidth ? 'word' : undefined}
    />
  );
}

function renderImage(obj: ImageObj, absX: number, absY: number, onSelect: (id: string) => void): React.ReactNode {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!obj.src) { setImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = obj.src;
    return () => { img.onload = null; img.onerror = null; };
  }, [obj.src]);

  const scale = obj.scale || 1;

  if (!image) {
    return (
      <Group key={obj.id} x={absX} y={absY}>
        <Rect x={0} y={0} width={CARD_W} height={CARD_H} fill="#161620" cornerRadius={obj.clipRadius || 0} listening={false} />
        <Text x={0} y={CARD_H/2 - 10} width={CARD_W} text="点击上传原画" fontSize={14} fontFamily="'Noto Sans SC', sans-serif" fill="rgba(255,255,255,0.15)" align="center" listening={false} />
      </Group>
    );
  }

  const imgRatio = image.width / image.height;
  const baseWidth = CARD_W * scale;
  const baseHeight = baseWidth / imgRatio;
  const x = (CARD_W - baseWidth) / 2 + (obj.offsetX || 0);
  const y = (obj.offsetY || 0);

  return (
    <Group
      key={obj.id}
      x={absX}
      y={absY}
      clipFunc={obj.clipRadius ? (ctx: any) => {
        const r = obj.clipRadius!;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(CARD_W - r, 0);
        ctx.quadraticCurveTo(CARD_W, 0, CARD_W, r);
        ctx.lineTo(CARD_W, CARD_H - r);
        ctx.quadraticCurveTo(CARD_W, CARD_H, CARD_W - r, CARD_H);
        ctx.lineTo(r, CARD_H);
        ctx.quadraticCurveTo(0, CARD_H, 0, CARD_H - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
      } : undefined}
    >
      <Rect x={0} y={0} width={CARD_W} height={CARD_H} fill="#161620" listening={false} />
      <KonvaImage
        name={obj.id}
        image={image}
        x={x}
        y={y}
        width={baseWidth}
        height={baseHeight}
        draggable={obj.draggable || false}
        onClick={obj.selectable ? (e: any) => { e.cancelBubble = true; onSelect(obj.id); } : undefined}
        onDragEnd={obj.draggable ? (e: any) => {
          const node = e.target;
          node.getStage()?.fire('objDrag', { id: obj.id, x: node.x(), y: node.y() });
        } : undefined}
      />
    </Group>
  );
}

function renderShape(obj: ShapeObj, absX: number, absY: number, onSelect: (id: string) => void): React.ReactNode {
  const commonProps = {
    key: obj.id,
    name: obj.selectable ? obj.id : undefined,
    onClick: obj.selectable ? (e: any) => { e.cancelBubble = true; onSelect(obj.id); } : undefined,
  };

  switch (obj.shape) {
    case 'rect': {
      const rot = obj.rotation || 0;
      return (
        <Rect
          {...commonProps}
          x={rot ? absX + obj.width / 2 : absX}
          y={rot ? absY + obj.height / 2 : absY}
          width={obj.width}
          height={obj.height}
          fill={obj.fill === 'transparent' ? undefined : obj.fill}
          stroke={obj.stroke}
          strokeWidth={obj.strokeWidth}
          cornerRadius={obj.cornerRadius || 0}
          rotation={rot}
          offsetX={rot ? obj.width / 2 : 0}
          offsetY={rot ? obj.height / 2 : 0}
          opacity={obj.opacity ?? 1}
        />
      );
    }
    case 'circle':
      return (
        <Circle
          {...commonProps}
          x={absX + obj.width / 2}
          y={absY + obj.height / 2}
          radius={obj.width / 2}
          fill={obj.fill === 'transparent' ? undefined : obj.fill}
          stroke={obj.stroke}
          strokeWidth={obj.strokeWidth}
          opacity={obj.opacity ?? 1}
        />
      );
    case 'arrow':
      return (
        <Group key={obj.id} x={absX} y={absY}>
          <Rect
            x={0} y={0} width={obj.width} height={obj.height}
            fill={obj.fill} stroke={obj.stroke} strokeWidth={obj.strokeWidth}
            cornerRadius={obj.cornerRadius || 0}
          />
          <Shape
            sceneFunc={(ctx: any, shape: any) => {
              const w = obj.width, h = obj.height, aw = 10;
              ctx.beginPath();
              ctx.moveTo(w, 0);
              ctx.lineTo(w + aw, h / 2);
              ctx.lineTo(w, h);
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill={obj.fill} stroke={obj.stroke} strokeWidth={obj.strokeWidth}
          />
        </Group>
      );
    default:
      return null;
  }
}
