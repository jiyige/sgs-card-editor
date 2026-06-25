import type { FactionColorMap, FactionId } from '../types';

export const FACTION_COLORS: FactionColorMap = {
  wei:   { primary: '#5479B2', secondary: '#3A5A8C', text: '#FFFFFF' },
  shu:   { primary: '#C43B3B', secondary: '#8B2020', text: '#FFFFFF' },
  wu:    { primary: '#4A8C3F', secondary: '#2D5A24', text: '#FFFFFF' },
  qun:   { primary: '#8C8C8C', secondary: '#5C5C5C', text: '#FFFFFF' },
  shen:  { primary: '#D4A843', secondary: '#9A7B2C', text: '#1A1A1A' },
  jin:   { primary: '#7B4FA0', secondary: '#4A2D6B', text: '#FFFFFF' },
};

export const FACTION_NAMES: Record<FactionId, string> = {
  wei: '魏',
  shu: '蜀',
  wu: '吴',
  qun: '群',
  shen: '神',
  jin: '晋',
};

export const FACTION_PREFIX: Record<FactionId, string> = {
  wei: 'WEI',
  shu: 'SHU',
  wu: 'WU',
  qun: 'QUN',
  shen: 'LE',
  jin: 'JIN',
};

export const FACTION_ORDER: FactionId[] = ['wei', 'shu', 'wu', 'qun', 'shen', 'jin'];
