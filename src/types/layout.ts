// 树形布局参数 - 每个对象独立的布局配置
export interface LayoutParams {
  // 卡牌属性
  safeMarginTop: number;
  safeMarginBottom: number;
  safeMarginLeft: number;
  safeMarginRight: number;
  cardCornerRadius: number;

  // 原画区
  artX: number;
  artY: number;
  artScale: number;

  // 姓名区（整体）
  nameAreaX: number;
  nameAreaY: number;
  titleFontSize: number;
  nameFontSize: number;

  // 势力区
  factionX: number;
  factionY: number;
  factionIconSize: number;
  factionMarkOffsetX: number;
  factionMarkOffsetY: number;

  // 血槽区
  hpBarX: number;
  hpBarY: number;
  hpIconSize: number;
  hpBarSpacing: number;

  // 护甲区
  armorBarX: number;
  armorBarY: number;
  armorIconSize: number;
  armorBarSpacing: number;

  // 技能区
  skillFontSize: number;
  skillLineHeight: number;
  skillSpacing: number;

  // 描述区
  descFontSize: number;
  descX: number;

  // 版权区
  copyrightAreaX: number;
  copyrightAreaY: number;
}
