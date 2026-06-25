import type { ContainerObj, TextObj, ImageObj, ShapeObj, CardObj } from '../types/engine';
import type { CardData } from '../types/card';
import type { LayoutParams } from '../types/layout';
import { FACTION_COLORS, FACTION_NAMES, FACTION_PREFIX } from '../constants/factions';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/card-dimensions';

const CARD_W = CARD_WIDTH;
const CARD_H = CARD_HEIGHT;

function htmlToPlain(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, '');
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || '';
}

function measureText(text: string, font: string): number {
  if (typeof document === 'undefined') return text.length * 10;
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = font;
  return ctx.measureText(text).width;
}

function wrapText(text: string, maxWidth: number, font: string): string[] {
  if (typeof document === 'undefined') return [text];
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = font;
  const lines: string[] = [];
  for (const p of text.split('\n')) {
    if (p === '') { lines.push(''); continue; }
    let current = '';
    for (const ch of [...p]) {
      if (ctx.measureText(current + ch).width > maxWidth && current) {
        lines.push(current);
        current = ch;
      } else {
        current += ch;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export function buildCardTree(data: CardData): ContainerObj {
  const layout = data.layout;
  const factionColor = FACTION_COLORS[data.faction].primary;
  const isLord = data.isLord;
  const lordGold = '#D4A843';

  const children: CardObj[] = [];

  // 1. 原画区
  children.push(buildArt(data, layout));

  // 2. 边框层
  children.push(buildBorder(data, layout));

  // 3. 势力区
  children.push(buildFaction(data, layout, factionColor, isLord, lordGold));

  // 4. 姓名区
  children.push(buildNameArea(data, layout, isLord, lordGold));

  // 5. 血槽区
  children.push(buildHpBar(data, layout, factionColor));

  // 6. 护甲区
  if (data.armor > 0) {
    children.push(buildArmorBar(data, layout));
  }

  // 7. 底部区域：技能+描述+版权
  const bottomArea = buildBottomArea(data, layout, factionColor);
  if (bottomArea) children.push(bottomArea);

  const root: ContainerObj = {
    id: 'card-root',
    type: 'card',
    kind: 'container',
    x: 0, y: 0,
    visible: true,
    children,
    layout: 'custom',
    itemSpacing: 0,
    autoLayout: false,
    width: CARD_W,
    height: CARD_H,
  };

  return root;
}

function buildArt(data: CardData, layout: LayoutParams): ImageObj {
  return {
    id: 'art',
    type: 'art',
    kind: 'image',
    x: layout.artX,
    y: layout.artY,
    visible: true,
    src: undefined,
    scale: layout.artScale,
    clipRadius: layout.cardCornerRadius,
    draggable: true,
    selectable: true,
  };
}

function buildBorder(data: CardData, layout: LayoutParams): ContainerObj {
  const fc = FACTION_COLORS[data.faction];
  const borderColor = data.isLord ? '#D4A843' : fc.primary;
  const secondaryColor = data.isLord ? '#9A7B2C' : fc.secondary;
  const r = layout.cardCornerRadius;

  const outer: ShapeObj = {
    id: 'border-outer', type: 'card', kind: 'shape',
    shape: 'rect', x: 2, y: 2, width: CARD_W - 4, height: CARD_H - 4,
    fill: 'transparent', stroke: borderColor, strokeWidth: 3, cornerRadius: r,
    visible: true,
  };
  const inner: ShapeObj = {
    id: 'border-inner', type: 'card', kind: 'shape',
    shape: 'rect', x: 8, y: 8, width: CARD_W - 16, height: CARD_H - 16,
    fill: 'transparent', stroke: secondaryColor, strokeWidth: 1, cornerRadius: r - 4,
    opacity: 0.6, visible: true,
  };

  return {
    id: 'border', type: 'card', kind: 'container',
    x: 0, y: 0, visible: true,
    children: [outer, inner],
    layout: 'custom', itemSpacing: 0, autoLayout: false,
  };
}

function buildFaction(data: CardData, layout: LayoutParams, color: string, isLord: boolean, lordGold: string): ContainerObj {
  const iconColor = isLord ? lordGold : color;
  const size = layout.factionIconSize;
  const markFs = Math.round(size * 0.5);

  // 势力背景圆
  const bgCircle: ShapeObj = {
    id: 'faction-bg', type: 'factionBg', kind: 'shape',
    shape: 'circle', x: 0, y: 0, width: size, height: size,
    fill: iconColor, visible: true, opacity: 0.9,
  };

  // 势力文字 - 居中在圆内，加偏移量微调
  const markText: TextObj = {
    id: 'faction-mark', type: 'factionMark', kind: 'text',
    x: 0, y: 0, visible: true,
    text: FACTION_NAMES[data.faction],
    fontSize: markFs,
    fontFamily: "'Noto Serif SC', serif",
    fontStyle: 'bold',
    fill: '#FFFFFF',
    align: 'center',
    width: size,
    height: size,
    textX: layout.factionMarkOffsetX,
    textY: layout.factionMarkOffsetY + Math.round((size - markFs) / 2 - 2),
  };

  const children: CardObj[] = [bgCircle, markText];

  // 副势力
  if (data.subFaction) {
    const subColor = FACTION_COLORS[data.subFaction].primary;
    const subSize = Math.round(size * 0.6);
    const subMarkFs = Math.round(subSize * 0.5);
    const subBg: ShapeObj = {
      id: 'faction-sub-bg', type: 'factionBg', kind: 'shape',
      shape: 'circle', x: size + 4, y: Math.round((size - subSize) / 2),
      width: subSize, height: subSize,
      fill: subColor, visible: true, opacity: 0.85,
    };
    const subMark: TextObj = {
      id: 'faction-sub-mark', type: 'factionMark', kind: 'text',
      x: size + 4, y: Math.round((size - subSize) / 2), visible: true,
      text: FACTION_NAMES[data.subFaction],
      fontSize: subMarkFs,
      fontFamily: "'Noto Serif SC', serif",
      fontStyle: 'bold',
      fill: '#FFFFFF',
      align: 'center',
      width: subSize,
      height: subSize,
      textY: Math.round((subSize - subMarkFs) / 2 - 2),
    };
    children.push(subBg, subMark);
  }

  return {
    id: 'faction', type: 'faction', kind: 'container',
    x: layout.factionX, y: layout.factionY, visible: true,
    children, layout: 'custom', itemSpacing: 0, autoLayout: false,
    selectable: true,
  };
}

function buildNameArea(data: CardData, layout: LayoutParams, isLord: boolean, lordGold: string): ContainerObj {
  const color = isLord ? lordGold : '#FFFFFF';
  const titleChars = [...(data.title || '稱號')];
  const nameChars = [...(data.name || '武將名')];
  const charSpacing = 4;

  const titleFs = layout.titleFontSize;
  const nameFs = layout.nameFontSize;

  // 称号竖排 - 居中对齐到武将名宽度
  const titleText: TextObj = {
    id: 'title', type: 'title', kind: 'text',
    x: Math.round((nameFs - titleFs) / 2), y: 0,
    visible: true,
    text: titleChars.join('\n'),
    fontSize: titleFs,
    fontFamily: "'Noto Serif SC', 'SimSun', serif",
    fontStyle: 'bold',
    fill: data.title ? color : 'rgba(255,255,255,0.2)',
    vertical: true,
    charSpacing,
    align: 'center',
  };

  const titleHeight = titleChars.length * (titleFs + charSpacing);

  const nameText: TextObj = {
    id: 'personName', type: 'personName', kind: 'text',
    x: 0, y: titleHeight + 12,
    visible: true,
    text: nameChars.join('\n'),
    fontSize: nameFs,
    fontFamily: "'Noto Serif SC', 'SimSun', serif",
    fontStyle: 'bold',
    fill: data.name ? color : 'rgba(255,255,255,0.2)',
    vertical: true,
    charSpacing,
    align: 'center',
    shadowColor: isLord ? 'rgba(212,168,67,0.4)' : undefined,
    shadowBlur: isLord ? 6 : 0,
  };

  return {
    id: 'nameArea', type: 'nameArea', kind: 'container',
    x: layout.nameAreaX, y: layout.nameAreaY, visible: true,
    children: [titleText, nameText],
    layout: 'custom', itemSpacing: 0, autoLayout: false,
    draggable: true, selectable: true,
  };
}

function buildHpBar(data: CardData, layout: LayoutParams, color: string): ContainerObj {
  const children: CardObj[] = [];
  const iconSize = layout.hpIconSize;
  const spacing = layout.hpBarSpacing;

  if (data.hp > 8) {
    children.push({
      id: 'hp-icon-0', type: 'hpIcon', kind: 'shape',
      shape: 'circle', x: 0, y: 0, width: iconSize, height: iconSize,
      fill: color, visible: true,
    } as ShapeObj);
    children.push({
      id: 'hp-text', type: 'hpText', kind: 'text',
      x: iconSize + 5, y: 0, visible: true,
      text: `x${data.hp}`,
      fontSize: Math.round(iconSize * 1.1),
      fontFamily: "'Microsoft YaHei', sans-serif",
      fontStyle: 'bold', fill: color,
    } as TextObj);
  } else {
    for (let i = 0; i < data.maxHp; i++) {
      children.push({
        id: `hp-icon-${i}`, type: 'hpIcon', kind: 'shape',
        shape: 'circle',
        x: i * (iconSize + spacing), y: 0,
        width: iconSize, height: iconSize,
        fill: i < data.hp ? color : 'transparent',
        stroke: i < data.hp ? undefined : 'rgba(255,255,255,0.2)',
        strokeWidth: 1, visible: true,
      } as ShapeObj);
    }
  }

  return {
    id: 'hpBar', type: 'hpBar', kind: 'container',
    x: layout.hpBarX, y: layout.hpBarY, visible: true,
    children, layout: 'horizontal', itemSpacing: spacing, autoLayout: true,
    selectable: true,
  };
}

function buildArmorBar(data: CardData, layout: LayoutParams): ContainerObj {
  const children: CardObj[] = [];
  const iconSize = layout.armorIconSize;
  const spacing = layout.armorBarSpacing;

  if (data.armor > 8) {
    children.push({
      id: 'armor-icon-0', type: 'armorIcon', kind: 'shape',
      shape: 'rect', x: 0, y: 0, width: iconSize, height: iconSize,
      fill: '#8B7355', rotation: 45, visible: true,
    } as ShapeObj);
    children.push({
      id: 'armor-text', type: 'hpText', kind: 'text',
      x: iconSize + 5, y: 0, visible: true,
      text: `x${data.armor}`,
      fontSize: Math.round(iconSize * 1.1),
      fontFamily: "'Microsoft YaHei', sans-serif",
      fontStyle: 'bold', fill: '#A08060',
    } as TextObj);
  } else {
    for (let i = 0; i < data.armor; i++) {
      children.push({
        id: `armor-icon-${i}`, type: 'armorIcon', kind: 'shape',
        shape: 'rect',
        x: i * (iconSize + spacing), y: 0,
        width: iconSize, height: iconSize,
        fill: '#8B7355', stroke: '#A08060', strokeWidth: 0.5,
        rotation: 45, visible: true,
      } as ShapeObj);
    }
  }

  return {
    id: 'armorBar', type: 'armorBar', kind: 'container',
    x: layout.armorBarX, y: layout.armorBarY, visible: true,
    children, layout: 'horizontal', itemSpacing: spacing, autoLayout: true,
    selectable: true,
  };
}

// 底部区域：技能+描述+版权，统一管理
function buildBottomArea(data: CardData, layout: LayoutParams, factionColor: string): ContainerObj | null {
  const safeL = layout.safeMarginLeft;
  const safeR = layout.safeMarginRight;
  const safeB = layout.safeMarginBottom;
  const contentWidth = CARD_W - safeL - safeR;

  const children: CardObj[] = [];

  // 版权行 Y 位置
  const copyrightY = CARD_H - safeB - 14;
  // 描述区 Y
  const descY = data.flavor ? copyrightY - 18 : copyrightY;

  // 1. 版权区
  const copyrightArea = buildCopyright(data, layout, safeL, safeR, copyrightY, contentWidth);
  children.push(copyrightArea);

  // 2. 描述区
  if (data.flavor) {
    const descText: TextObj = {
      id: 'descArea', type: 'descArea', kind: 'text',
      x: safeL, y: descY, visible: true,
      text: data.flavor,
      fontSize: layout.descFontSize,
      fontFamily: "'SimSun', serif",
      fontStyle: 'italic',
      fill: 'rgba(255,255,255,0.35)',
      align: 'center',
      width: contentWidth,
      selectable: true,
    };
    children.push(descText);
  }

  // 3. 技能区（从描述区上方开始，从底向上排）
  let bottomY = descY - 8;
  const skillBlocks: CardObj[] = [];

  for (let i = data.skills.length - 1; i >= 0; i--) {
    const skill = data.skills[i];
    const fontSize = layout.skillFontSize;
    const lineHeight = layout.skillLineHeight;
    const nameFont = `'Microsoft YaHei', sans-serif`;
    const descFont = skill.isDerived ? "'SimSun', serif" : "'Microsoft YaHei', sans-serif";

    const nameWidth = measureText(skill.name || `技能${i + 1}`, `bold ${fontSize}px ${nameFont}`);
    const nameBoxWidth = nameWidth + 20;
    const arrowWidth = 10;
    const arrowTotalWidth = nameBoxWidth + arrowWidth;
    const descMaxWidth = contentWidth - arrowTotalWidth - 8;

    const plainDesc = htmlToPlain(skill.description || '');
    const descLines = wrapText(plainDesc, descMaxWidth, `${fontSize}px ${descFont}`);
    const blockHeight = Math.max(24, descLines.length * lineHeight + 8);
    const blockY = bottomY - blockHeight;

    const nameBg: ShapeObj = {
      id: `skill-${i}-nameBg`, type: 'skillNameBg', kind: 'shape',
      shape: 'arrow', x: safeL, y: blockY + 2,
      width: nameBoxWidth, height: 22,
      fill: '#F5E6C8', stroke: factionColor, strokeWidth: 1, cornerRadius: 3,
      visible: true,
    };
    const nameText: TextObj = {
      id: `skill-${i}-name`, type: 'skillName', kind: 'text',
      x: safeL + 10, y: blockY + 2, visible: true,
      text: skill.name || `技能${i + 1}`,
      fontSize, fontFamily: nameFont, fontStyle: 'bold',
      fill: '#1A1A1A', align: 'left',
    };
    const descText: TextObj = {
      id: `skill-${i}-desc`, type: 'skillDesc', kind: 'text',
      x: safeL + arrowTotalWidth + 8, y: blockY + 2, visible: true,
      text: plainDesc,
      fontSize, fontFamily: descFont,
      fill: '#1A1A1A', lineHeight: 1.4,
      maxWidth: descMaxWidth,
    };

    skillBlocks.push({
      id: `skill-${i}`, type: 'skillArea', kind: 'container',
      x: 0, y: 0, visible: true,
      children: [nameBg, nameText, descText],
      layout: 'custom', itemSpacing: 0, autoLayout: false,
      selectable: true,
      maxWidth: contentWidth,
    });

    bottomY = blockY - layout.skillSpacing;
  }

  // 技能块正序加入
  for (let i = skillBlocks.length - 1; i >= 0; i--) {
    children.push(skillBlocks[i]);
  }

  // 半透明势力背景 - 从第一个技能上方到卡牌底部
  if (skillBlocks.length > 0) {
    const firstBlock = skillBlocks[skillBlocks.length - 1] as ContainerObj;
    const firstNameBg = firstBlock.children![0] as ShapeObj;
    const bgTopY = firstNameBg.y - 8;
    const bgHeight = CARD_H - bgTopY - 6;

    const bg: ShapeObj = {
      id: 'bottom-bg', type: 'card', kind: 'shape',
      shape: 'rect', x: 6, y: bgTopY, width: CARD_W - 12, height: bgHeight,
      fill: factionColor, opacity: 0.35, cornerRadius: 4,
      visible: true,
    };
    children.unshift(bg);
  }

  return {
    id: 'bottomArea', type: 'card', kind: 'container',
    x: 0, y: 0, visible: true,
    children, layout: 'custom', itemSpacing: 0, autoLayout: false,
    maxWidth: contentWidth,
  };
}

function buildCopyright(data: CardData, layout: LayoutParams, safeL: number, safeR: number, y: number, contentWidth: number): ContainerObj {
  const children: CardObj[] = [];
  const fontSize = 9;

  // 左侧：版权+画师
  const leftParts: string[] = [];
  if (data.copyright) leftParts.push(data.copyright);
  if (data.artist) leftParts.push(`畫師: ${data.artist}`);

  if (leftParts.length > 0) {
    children.push({
      id: 'copyright-text', type: 'copyrightText', kind: 'text',
      x: 0, y: 0, visible: true,
      text: leftParts.join('  '),
      fontSize, fontFamily: "'SimSun', serif",
      fill: 'rgba(255,255,255,0.35)', align: 'left',
      width: 200,
    } as TextObj);
  }

  // 右侧编号
  children.push({
    id: 'number-text', type: 'numberText', kind: 'text',
    x: contentWidth - 80, y: 0, visible: true,
    text: data.factionNumber || `${FACTION_PREFIX[data.faction]} 001`,
    fontSize, fontFamily: "'SimSun', serif",
    fontStyle: 'bold', fill: 'rgba(255,255,255,0.4)',
    align: 'right', width: 80,
  } as TextObj);

  // 角标
  if (data.badge.type === 'builtin' && data.badge.builtinId) {
    const badgeMap: Record<string, { label: string; color: string }> = {
      'new': { label: 'NEW', color: '#4a9c5d' },
      'hot': { label: 'HOT', color: '#c44b4b' },
      'sp': { label: 'SP', color: '#c9a44b' },
      'limit': { label: '限', color: '#7b4fa0' },
      'test': { label: '测', color: '#4b8bc4' },
      'god': { label: '神', color: '#d4a843' },
    };
    const info = badgeMap[data.badge.builtinId];
    if (info) {
      children.push({
        id: 'badge-rect', type: 'badgeMark', kind: 'shape',
        shape: 'rect', x: contentWidth - 80 - 18, y: 0,
        width: 14, height: 14,
        fill: info.color, cornerRadius: 2, visible: true,
      } as ShapeObj);
      children.push({
        id: 'badge-text', type: 'badgeMark', kind: 'text',
        x: contentWidth - 80 - 18, y: 0, visible: true,
        text: info.label, fontSize: 7,
        fontFamily: "'Microsoft YaHei', sans-serif",
        fontStyle: 'bold', fill: '#FFFFFF',
        align: 'center', width: 14, height: 14,
      } as TextObj);
    }
  }

  return {
    id: 'copyrightArea', type: 'copyrightArea', kind: 'container',
    x: safeL, y: y, visible: true,
    children, layout: 'horizontal', itemSpacing: 8, autoLayout: false,
    selectable: true, maxWidth: contentWidth,
  };
}
