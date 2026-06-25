// 树形对象类型定义

export type ObjType =
  | 'card' | 'art' | 'nameArea' | 'title' | 'personName'
  | 'faction' | 'factionBg' | 'factionMark'
  | 'hpBar' | 'hpIcon' | 'hpText'
  | 'armorBar' | 'armorIcon'
  | 'skillArea' | 'skillNameBg' | 'skillName' | 'skillDesc'
  | 'descArea' | 'copyrightArea' | 'copyrightText' | 'artistText'
  | 'numberText' | 'badgeMark';

export type HAlign = 'left' | 'right';
export type LayoutMode = 'horizontal' | 'vertical' | 'bottomUp' | 'custom';

// 基础对象
export interface BaseObj {
  id: string;
  type: ObjType;
  x: number;
  y: number;
  hAlign?: HAlign;
  visible: boolean;
  children?: CardObj[];
  draggable?: boolean;
  selectable?: boolean;
  maxWidth?: number;       // 最大宽度（用于换行计算）
}

// 文字对象
export interface TextObj extends BaseObj {
  kind: 'text';
  text: string;
  fontSize?: number;
  fontFamily: string;
  fontStyle?: string;
  fill: string;
  vertical?: boolean;
  charSpacing?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  shadowColor?: string;
  shadowBlur?: number;
  textX?: number;          // 文字相对自身位置的X微调
  textY?: number;          // 文字相对自身位置的Y微调
  width?: number;          // 文字框宽度
}

// 图片对象
export interface ImageObj extends BaseObj {
  kind: 'image';
  src?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  clipRadius?: number;
}

// 形状对象
export interface ShapeObj extends BaseObj {
  kind: 'shape';
  shape: 'rect' | 'circle' | 'polygon' | 'arrow';
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  rotation?: number;
  opacity?: number;
}

// 容器对象
export interface ContainerObj extends BaseObj {
  kind: 'container';
  layout: LayoutMode;
  itemSpacing: number;
  autoLayout: boolean;
  width?: number;
  height?: number;
}

// 卡牌根节点属性
export interface CardObj extends BaseObj {
  kind?: 'container';
  // 卡牌特有属性
  cardWidth?: number;
  cardHeight?: number;
  safeMarginTop?: number;
  safeMarginBottom?: number;
  safeMarginLeft?: number;
  safeMarginRight?: number;
  cornerRadius?: number;
  borderColor?: string;
}

export type AnyCardObj = TextObj | ImageObj | ShapeObj | ContainerObj;

// 属性面板字段
export interface PropertyField {
  key: string;
  label: string;
  type: 'number' | 'range' | 'text' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  layoutKey?: string;  // 对应 layout 中的字段名
}
