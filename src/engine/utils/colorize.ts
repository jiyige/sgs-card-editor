export function colorizeBorder(
  borderImage: HTMLImageElement,
  color: string,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 先填充目标颜色
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // 使用 multiply 混合模式绘制灰度边框
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(borderImage, 0, 0, width, height);

  // 重置
  ctx.globalCompositeOperation = 'source-over';

  return canvas;
}

export function generateBorderImage(
  color: string,
  width: number,
  height: number,
  radius: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 外边框
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  roundedRect(ctx, 2, 2, width - 4, height - 4, radius);
  ctx.stroke();

  // 内边框（较细）
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  roundedRect(ctx, 8, 8, width - 16, height - 16, radius - 4);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 装饰角
  drawCornerDecorations(ctx, color, width, height, radius);

  return canvas;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCornerDecorations(
  ctx: CanvasRenderingContext2D,
  color: string,
  w: number,
  h: number,
  r: number
) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;

  const cornerSize = 16;
  const margin = 6;

  // 左上角
  ctx.fillRect(margin, margin, cornerSize, 2);
  ctx.fillRect(margin, margin, 2, cornerSize);

  // 右上角
  ctx.fillRect(w - margin - cornerSize, margin, cornerSize, 2);
  ctx.fillRect(w - margin - 2, margin, 2, cornerSize);

  // 左下角
  ctx.fillRect(margin, h - margin - 2, cornerSize, 2);
  ctx.fillRect(margin, h - margin - cornerSize, 2, cornerSize);

  // 右下角
  ctx.fillRect(w - margin - cornerSize, h - margin - 2, cornerSize, 2);
  ctx.fillRect(w - margin - 2, h - margin - cornerSize, 2, cornerSize);

  ctx.globalAlpha = 1;
}
