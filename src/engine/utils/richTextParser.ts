import type { RichTextSegment } from '../../types';

export function parseRichText(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let i = 0;

  while (i < text.length) {
    // [b]...[/b]
    if (text.startsWith('[b]', i)) {
      const end = text.indexOf('[/b]', i + 3);
      if (end !== -1) {
        segments.push({ type: 'bold', text: text.slice(i + 3, end) });
        i = end + 4;
        continue;
      }
    }
    // [i]...[/i]
    if (text.startsWith('[i]', i)) {
      const end = text.indexOf('[/i]', i + 3);
      if (end !== -1) {
        segments.push({ type: 'italic', text: text.slice(i + 3, end) });
        i = end + 4;
        continue;
      }
    }
    // [br]
    if (text.startsWith('[br]', i)) {
      segments.push({ type: 'linebreak' });
      i += 4;
      continue;
    }
    // Symbol shortcodes
    if (text.startsWith(':heart:', i)) {
      segments.push({ type: 'symbol', symbol: '\u2665\uFE0F' });
      i += 7;
      continue;
    }
    if (text.startsWith(':spade:', i)) {
      segments.push({ type: 'symbol', symbol: '\u2660\uFE0F' });
      i += 7;
      continue;
    }
    if (text.startsWith(':diamond:', i)) {
      segments.push({ type: 'symbol', symbol: '\u2666\uFE0F' });
      i += 9;
      continue;
    }
    if (text.startsWith(':club:', i)) {
      segments.push({ type: 'symbol', symbol: '\u2663\uFE0F' });
      i += 6;
      continue;
    }

    // Check for raw unicode suit symbols
    if (text[i] === '\u2665' || text[i] === '\u2660' || text[i] === '\u2666' || text[i] === '\u2663') {
      let symbol = text[i];
      if (i + 1 < text.length && text[i + 1] === '\uFE0F') {
        symbol += '\uFE0F';
        i++;
      }
      segments.push({ type: 'symbol', symbol });
      i++;
      continue;
    }

    // Plain text: accumulate until we hit a tag
    let j = i;
    while (j < text.length) {
      if (text[j] === '[' || text[j] === '\u2665' || text[j] === '\u2660' || text[j] === '\u2666' || text[j] === '\u2663') {
        break;
      }
      if (text[j] === ':' && (text.startsWith(':heart:', j) || text.startsWith(':spade:', j) || text.startsWith(':diamond:', j) || text.startsWith(':club:', j))) {
        break;
      }
      j++;
    }
    if (j > i) {
      segments.push({ type: 'text', text: text.slice(i, j) });
      i = j;
    } else {
      i++;
    }
  }

  return segments;
}

export function stripBBCode(text: string): string {
  return text
    .replace(/\[b\]/g, '')
    .replace(/\[\/b\]/g, '')
    .replace(/\[i\]/g, '')
    .replace(/\[\/i\]/g, '')
    .replace(/\[br\]/g, '\n')
    .replace(/:heart:/g, '\u2665')
    .replace(/:spade:/g, '\u2660')
    .replace(/:diamond:/g, '\u2666')
    .replace(/:club:/g, '\u2663');
}
