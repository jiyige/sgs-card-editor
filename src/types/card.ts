import { FactionId } from './faction';
import { Skill } from './skill';
import { LayoutParams } from './layout';

export type TemplateId = 'standard' | 'god' | 'double';

export interface BadgeConfig {
  type: 'builtin' | 'custom';
  builtinId?: string;
  customImage?: string;
  position: { x: number; y: number };
  scale: number;
}

export interface CardData {
  template: TemplateId;
  faction: FactionId;
  subFaction?: FactionId;
  title: string;
  name: string;
  isLord: boolean;
  hp: number;
  maxHp: number;
  armor: number;
  titleFont: string;
  titleColor: string;
  nameFont: string;
  nameColor: string;
  borderColor: string;
  copyright: string;
  artist: string;
  flavor: string;
  badge: BadgeConfig;
  skills: Skill[];
  layout: LayoutParams;
}
