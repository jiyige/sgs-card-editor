export type FactionId = 'wei' | 'shu' | 'wu' | 'qun' | 'shen' | 'jin';

export interface FactionColor {
  primary: string;
  secondary: string;
  text: string;
}

export type FactionColorMap = Record<FactionId, FactionColor>;
