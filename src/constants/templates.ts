import type { CardTemplate } from '../types/template';

const defaultLayout = {
  // 卡牌属性
  safeMarginTop: 12,
  safeMarginBottom: 18,
  safeMarginLeft: 24,
  safeMarginRight: 24,
  cardCornerRadius: 16,

  // 原画区
  artX: 0, artY: 0, artScale: 1,
  // 姓名区
  nameAreaX: 28, nameAreaY: 76, titleFontSize: 12, nameFontSize: 18,
  // 势力区
  factionX: 20, factionY: 18, factionIconSize: 42,
  factionMarkOffsetX: 0, factionMarkOffsetY: 0,
  // 血槽区
  hpBarX: 76, hpBarY: 22, hpIconSize: 20, hpBarSpacing: 3,
  // 护甲区
  armorBarX: 76, armorBarY: 48, armorIconSize: 15, armorBarSpacing: 3,
  // 技能区
  skillFontSize: 13, skillLineHeight: 18, skillSpacing: 6,
  // 描述区
  descFontSize: 10, descX: 24,
  // 版权区
  copyrightAreaX: 24, copyrightAreaY: 578,
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'new',
    name: '新版UI',
    description: '新版武将卡牌样式',
    dimensions: { width: 420, height: 610 },
    defaultLayout: { ...defaultLayout },
    applicableFactions: ['wei', 'shu', 'wu', 'qun', 'shen', 'jin'],
    supportsDualFaction: true,
  },
  {
    id: 'old',
    name: '老版UI',
    description: '老版武将卡牌样式（即将支持）',
    dimensions: { width: 420, height: 610 },
    defaultLayout: { ...defaultLayout },
    applicableFactions: ['wei', 'shu', 'wu', 'qun', 'shen', 'jin'],
    supportsDualFaction: true,
  },
  {
    id: 'fullart',
    name: '全副UI',
    description: '全幅武将卡牌样式（即将支持）',
    dimensions: { width: 420, height: 610 },
    defaultLayout: { ...defaultLayout },
    applicableFactions: ['wei', 'shu', 'wu', 'qun', 'shen', 'jin'],
    supportsDualFaction: true,
  },
];

export const AVAILABLE_TEMPLATES: string[] = ['new'];
