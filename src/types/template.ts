import { FactionId } from './faction';
import { LayoutParams } from './layout';

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  dimensions: { width: number; height: number };
  defaultLayout: LayoutParams;
  applicableFactions: FactionId[];
  supportsDualFaction: boolean;
}
