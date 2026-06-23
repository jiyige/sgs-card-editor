export interface Skill {
  id: string;
  name: string;
  description: string;
  isDerived: boolean;
}

export interface RichTextSegment {
  type: 'text' | 'bold' | 'italic' | 'linebreak' | 'symbol';
  text?: string;
  symbol?: string;
}
