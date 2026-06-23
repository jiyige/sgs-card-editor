import React, { useMemo } from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import { useCardStore } from '../../store';
import { FACTION_COLORS } from '../../constants';
import { parseRichText, stripBBCode } from '../utils/richTextParser';
import { measureTextWidth } from '../utils/textMeasure';
import { SKILL_FONTS } from '../../constants/fonts';

const SkillLayer: React.FC = () => {
  const skills = useCardStore((s) => s.skills);
  const faction = useCardStore((s) => s.faction);
  const layout = useCardStore((s) => s.layout);

  const factionColor = FACTION_COLORS[faction].primary;
  const skillFontFamily = "'Noto Sans SC', sans-serif";

  const maxWidth = 372;

  const skillBlocks = useMemo(() => {
    let currentY = layout.skillStartY;
    const fontSize = layout.skillFontSize;
    const lineHeight = layout.skillLineHeight;
    const font = `${fontSize}px ${skillFontFamily}`;

    return skills.map((skill, idx) => {
      const cleanDesc = stripBBCode(skill.description);
      const lines = wrapText(cleanDesc, maxWidth - 24, font);
      const blockHeight = 24 + lines.length * lineHeight + 12;

      const block = {
        skill,
        index: idx,
        y: currentY,
        height: blockHeight,
        lines,
        fontSize,
        lineHeight,
        font,
        labelText: skill.isDerived ? `${skill.name || '衍生技'} (衍)` : (skill.name || `技能${idx + 1}`),
      };

      currentY += blockHeight + 4;
      return block;
    });
  }, [skills, layout]);

  return (
    <Group listening={false}>
      {skillBlocks.map((block) => (
        <Group key={block.skill.id}>
          {/* 技能背景 */}
          <Rect
            x={12}
            y={block.y}
            width={maxWidth}
            height={block.height}
            fill="rgba(0,0,0,0.2)"
            cornerRadius={6}
            stroke={factionColor}
            strokeWidth={0.5}
            opacity={0.5}
          />

          {/* 技能名称 */}
          <Text
            x={20}
            y={block.y + 4}
            text={block.labelText}
            fontSize={block.fontSize}
            fontFamily={skillFontFamily}
            fontStyle="bold"
            fill={factionColor}
          />

          {/* 衍生技标记 */}
          {block.skill.isDerived && (
            <Rect
              x={20 + measureTextWidth(block.labelText, block.font) + 8}
              y={block.y + 6}
              width={20}
              height={14}
              fill="rgba(180,120,50,0.3)"
              cornerRadius={3}
              stroke="#B47832"
              strokeWidth={0.5}
            />
          )}

          {/* 技能描述 */}
          {block.lines.map((line, lineIdx) => (
            <Text
              key={lineIdx}
              x={20}
              y={block.y + 24 + lineIdx * block.lineHeight}
              text={line}
              fontSize={block.fontSize}
              fontFamily={skillFontFamily}
              fill="rgba(255,255,255,0.75)"
              lineHeight={1.4}
            />
          ))}

          {/* 技能间分割线 */}
          {block.index < skills.length - 1 && (
            <Line
              points={[24, block.y + block.height + 2, maxWidth + 4, block.y + block.height + 2]}
              stroke={factionColor}
              strokeWidth={0.5}
              opacity={0.3}
              dash={[2, 2]}
            />
          )}
        </Group>
      ))}
    </Group>
  );
};

function wrapText(text: string, maxWidth: number, font: string): string[] {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = font;
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  for (const p of paragraphs) {
    if (p === '') { lines.push(''); continue; }
    let current = '';
    for (const ch of p) {
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        lines.push(current);
        current = ch;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export default SkillLayer;
