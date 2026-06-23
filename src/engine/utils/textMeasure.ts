let measureCanvas: HTMLCanvasElement | null = null;

function getMeasureCtx(): CanvasRenderingContext2D {
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
  }
  const ctx = measureCanvas.getContext('2d')!;
  return ctx;
}

export function measureTextWidth(text: string, font: string): number {
  const ctx = getMeasureCtx();
  ctx.font = font;
  return ctx.measureText(text).width;
}

export function wrapText(text: string, maxWidth: number, font: string): string[] {
  const ctx = getMeasureCtx();
  ctx.font = font;
  const lines: string[] = [];

  const paragraphs = text.split('\n');
  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    let currentLine = '';
    for (const char of paragraph) {
      const testLine = currentLine + char;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export function measureLines(text: string, maxWidth: number, font: string): number {
  return wrapText(text, maxWidth, font).length;
}
