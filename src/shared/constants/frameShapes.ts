import React from 'react';

export type FrameShapeType =
  | 'rounded'
  | 'heart'
  | 'cloud'
  | 'circle'
  | 'ellipse'
  | 'bubble'
  | 'balloon'
  | 'star'
  | 'square';

export const FRAME_SHAPES: FrameShapeType[] = [
  'rounded',
  'heart',
  'cloud',
  'circle',
  'ellipse',
  'bubble',
  'balloon',
  'star',
  'square'
];

export const SVG_MASK_PATHS: Partial<Record<FrameShapeType, string>> = {
  heart: 'M50 88.5 C25 65 5 45 5 27.5 C5 12.5 17.5 3 32.5 3 C41.5 3 47.5 7.5 50 12 C52.5 7.5 58.5 3 67.5 3 C82.5 3 95 12.5 95 27.5 C95 45 75 65 50 88.5 Z',
  cloud: 'M25 80 L75 80 C86.5 80 96 70.5 96 59 C96 48.5 88 39.5 77.5 38.2 C74 21 59 8 41 8 C25 8 11.5 18.5 7 33.5 C2.8 37.5 0 43 0 49.5 C0 66.3 11.2 80 25 80 Z',
  bubble: 'M15 10 H85 C93 10 100 17 100 25 V60 C100 68 93 75 85 75 H45 L20 95 V75 H15 C7 75 0 68 0 60 V25 C0 17 7 10 15 10 Z',
  balloon: 'M50 2 C22 2 0 22 0 48 C0 68 28 84 38 88 V96 C38 98 40 100 42 100 H58 C60 100 62 98 62 96 V88 C72 84 100 68 100 48 C100 22 78 2 50 2 Z',
};

const createSvgMaskUrl = (pathD: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${pathD}" fill="black"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

export const FRAME_SHAPE_MAP: Record<FrameShapeType, { label: string; icon: string }> = {
  rounded: { label: 'Bo tròn', icon: '🖼️' },
  heart: { label: 'Trái tim', icon: '💖' },
  cloud: { label: 'Đám mây', icon: '☁️' },
  circle: { label: 'Hình tròn', icon: '⭕' },
  ellipse: { label: 'Hình Elip', icon: '🥚' },
  bubble: { label: 'Bong bóng', icon: '💬' },
  balloon: { label: 'Khinh khí cầu', icon: '🎈' },
  star: { label: 'Ngôi sao', icon: '⭐' },
  square: { label: 'Hình vuông', icon: '🔳' },
};

export const drawFrameShapePath = (
  ctx: CanvasRenderingContext2D,
  shape: FrameShapeType,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.beginPath();
  if (shape === 'rounded') {
    const r = Math.min(w, h) * 0.12;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }
  } else if (shape === 'square') {
    ctx.rect(x, y, w, h);
  } else if (shape === 'circle') {
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else if (shape === 'ellipse') {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2 * 0.85, 0, 0, Math.PI * 2);
  } else if (shape === 'heart') {
    ctx.moveTo(x + w * 0.5, y + h * 0.885);
    ctx.bezierCurveTo(x + w * 0.25, y + h * 0.65, x + w * 0.05, y + h * 0.45, x + w * 0.05, y + h * 0.275);
    ctx.bezierCurveTo(x + w * 0.05, y + h * 0.125, x + w * 0.175, y + h * 0.03, x + w * 0.325, y + h * 0.03);
    ctx.bezierCurveTo(x + w * 0.415, y + h * 0.03, x + w * 0.475, y + h * 0.075, x + w * 0.5, y + h * 0.12);
    ctx.bezierCurveTo(x + w * 0.525, y + h * 0.075, x + w * 0.585, y + h * 0.03, x + w * 0.675, y + h * 0.03);
    ctx.bezierCurveTo(x + w * 0.825, y + h * 0.03, x + w * 0.95, y + h * 0.125, x + w * 0.95, y + h * 0.275);
    ctx.bezierCurveTo(x + w * 0.95, y + h * 0.45, x + w * 0.75, y + h * 0.65, x + w * 0.5, y + h * 0.885);
  } else if (shape === 'cloud') {
    ctx.moveTo(x + w * 0.25, y + h * 0.80);
    ctx.lineTo(x + w * 0.75, y + h * 0.80);
    ctx.bezierCurveTo(x + w * 0.865, y + h * 0.80, x + w * 0.96, y + h * 0.705, x + w * 0.96, y + h * 0.59);
    ctx.bezierCurveTo(x + w * 0.96, y + h * 0.485, x + w * 0.88, y + h * 0.395, x + w * 0.775, y + h * 0.382);
    ctx.bezierCurveTo(x + w * 0.74, y + h * 0.21, x + w * 0.59, y + h * 0.08, x + w * 0.41, y + h * 0.08);
    ctx.bezierCurveTo(x + w * 0.25, y + h * 0.08, x + w * 0.115, y + h * 0.185, x + w * 0.07, y + h * 0.335);
    ctx.bezierCurveTo(x + w * 0.028, y + h * 0.375, x, y + h * 0.43, x, y + h * 0.495);
    ctx.bezierCurveTo(x, y + h * 0.663, x + w * 0.112, y + h * 0.80, x + w * 0.25, y + h * 0.80);
  } else if (shape === 'bubble') {
    ctx.moveTo(x + w * 0.15, y + h * 0.10);
    ctx.lineTo(x + w * 0.85, y + h * 0.10);
    ctx.bezierCurveTo(x + w * 0.93, y + h * 0.10, x + w, y + h * 0.17, x + w, y + h * 0.25);
    ctx.lineTo(x + w, y + h * 0.60);
    ctx.bezierCurveTo(x + w, y + h * 0.68, x + w * 0.93, y + h * 0.75, x + w * 0.85, y + h * 0.75);
    ctx.lineTo(x + w * 0.45, y + h * 0.75);
    ctx.lineTo(x + w * 0.20, y + h * 0.95);
    ctx.lineTo(x + w * 0.25, y + h * 0.75);
    ctx.lineTo(x + w * 0.15, y + h * 0.75);
    ctx.bezierCurveTo(x + w * 0.07, y + h * 0.75, x, y + h * 0.68, x, y + h * 0.60);
    ctx.lineTo(x, y + h * 0.25);
    ctx.bezierCurveTo(x, y + h * 0.17, x + w * 0.07, y + h * 0.10, x + w * 0.15, y + h * 0.10);
  } else if (shape === 'balloon') {
    ctx.moveTo(x + w * 0.5, y + h * 0.02);
    ctx.bezierCurveTo(x + w * 0.22, y + h * 0.02, x, y + h * 0.22, x, y + h * 0.48);
    ctx.bezierCurveTo(x, y + h * 0.68, x + w * 0.28, y + h * 0.84, x + w * 0.38, y + h * 0.88);
    ctx.lineTo(x + w * 0.38, y + h * 0.96);
    ctx.lineTo(x + w * 0.58, y + h * 0.96);
    ctx.lineTo(x + w * 0.62, y + h * 0.88);
    ctx.bezierCurveTo(x + w * 0.72, y + h * 0.84, x + w, y + h * 0.68, x + w, y + h * 0.48);
    ctx.bezierCurveTo(x + w, y + h * 0.22, x + w * 0.78, y + h * 0.02, x + w * 0.5, y + h * 0.02);
  } else if (shape === 'star') {
    const points = [
      [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
      [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
    ];
    points.forEach(([px, py], i) => {
      const ptX = x + (px / 100) * w;
      const ptY = y + (py / 100) * h;
      if (i === 0) ctx.moveTo(ptX, ptY);
      else ctx.lineTo(ptX, ptY);
    });
  }
  ctx.closePath();
};

export const drawFramedPhotoToCanvas = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  shape: FrameShapeType,
  width: number,
  height: number,
  borderWidth = 12,
  objectFit: 'cover' | 'contain' = 'cover'
) => {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw outer frame (White border background)
  const outerMargin = 4;
  drawFrameShapePath(ctx, shape, outerMargin, outerMargin, width - outerMargin * 2, height - outerMargin * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)';
  ctx.stroke();

  // 2. Draw inner photo area clipped to the shape
  const innerMargin = outerMargin + borderWidth;
  const innerW = width - innerMargin * 2;
  const innerH = height - innerMargin * 2;

  ctx.save();
  drawFrameShapePath(ctx, shape, innerMargin, innerMargin, innerW, innerH);
  ctx.clip();

  const imgW = (img as HTMLImageElement).naturalWidth || img.width || width;
  const imgH = (img as HTMLImageElement).naturalHeight || img.height || height;
  const imgRatio = imgW / imgH;
  const rectRatio = innerW / innerH;

  let sw = imgW;
  let sh = imgH;
  let sx = 0;
  let sy = 0;

  if (objectFit === 'cover') {
    if (imgRatio > rectRatio) {
      sw = imgH * rectRatio;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW / rectRatio;
      sy = (imgH - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, innerMargin, innerMargin, innerW, innerH);
  } else {
    // objectFit === 'contain'
    let dw = innerW;
    let dh = innerH;
    let dx = innerMargin;
    let dy = innerMargin;

    if (imgRatio > rectRatio) {
      dh = innerW / imgRatio;
      dy = innerMargin + (innerH - dh) / 2;
    } else {
      dw = innerH * imgRatio;
      dx = innerMargin + (innerW - dw) / 2;
    }
    ctx.drawImage(img, 0, 0, imgW, imgH, dx, dy, dw, dh);
  }

  ctx.restore();
};

const framedPhotoCache = new Map<string, string>();

export async function getFramedPhotoUrl(
  imageSrc: string,
  shape: FrameShapeType = 'rounded',
  size = 400,
  objectFit: 'cover' | 'contain' = 'cover'
): Promise<string> {
  if (!imageSrc) return '';
  const cacheKey = `${imageSrc.slice(0, 100)}_${shape}_${size}_${objectFit}`;
  if (framedPhotoCache.has(cacheKey)) {
    return framedPhotoCache.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        drawFramedPhotoToCanvas(ctx, img, shape, size, size, Math.round(size * 0.035), objectFit);
        const dataUrl = canvas.toDataURL('image/png');
        framedPhotoCache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (e) {
        console.warn('[getFramedPhotoUrl] Failed to frame photo:', e);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

export const getFrameStyle = (shape?: FrameShapeType): React.CSSProperties => {
  const currentShape = shape || 'rounded';
  const style: React.CSSProperties = {};

  if (currentShape === 'rounded') {
    style.borderRadius = '1rem';
  } else if (currentShape === 'square') {
    style.borderRadius = '0px';
  } else if (currentShape === 'circle') {
    style.borderRadius = '9999px';
    style.clipPath = 'circle(50% at 50% 50%)';
    style.WebkitClipPath = 'circle(50% at 50% 50%)';
  } else if (currentShape === 'ellipse') {
    style.clipPath = 'ellipse(50% 40% at 50% 50%)';
    style.WebkitClipPath = 'ellipse(50% 40% at 50% 50%)';
  } else if (currentShape === 'star') {
    const starPoly = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    style.clipPath = starPoly;
    style.WebkitClipPath = starPoly;
  } else if (SVG_MASK_PATHS[currentShape]) {
    const maskUrl = createSvgMaskUrl(SVG_MASK_PATHS[currentShape]!);
    style.maskImage = maskUrl;
    style.WebkitMaskImage = maskUrl;
    style.maskSize = '100% 100%';
    style.WebkitMaskSize = '100% 100%';
    style.maskRepeat = 'no-repeat';
    style.WebkitMaskRepeat = 'no-repeat';
  }

  return style;
};

export const GlobalFrameSvgDefs: React.FC = () => null;

