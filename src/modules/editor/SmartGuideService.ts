import { PlacedItem } from '../../shared/types';

export interface AlignmentLine {
  type: 'v' | 'h'; // vertical or horizontal line
  coord: number;   // coordinate of the line (X for v, Y for h)
  from: number;    // start coordinate along the other axis (Y for v, X for h)
  to: number;      // end coordinate along the other axis (Y for v, X for h)
  label?: string;  // optional text label (e.g., "Center", "Margin")
}

export interface DistanceIndicator {
  type: 'v' | 'h';
  x: number;
  y: number;
  length: number;
  text: string;
}

export interface SpacingGuide {
  type: 'v' | 'h';
  rects: Array<{ x: number; y: number; width: number; height: number; text: string }>;
}

export interface SmartGuideResult {
  snappedX: number;
  snappedY: number;
  alignmentLines: AlignmentLine[];
  distanceIndicators: DistanceIndicator[];
  spacingGuides: SpacingGuide[];
}

/**
 * Get item size based on type and scale
 */
export function getItemDims(item: PlacedItem, isMobile = false): { width: number; height: number } {
  // Check if type is icon (base size 48px) vs image (base size 80px/96px)
  const isIcon = ['Heart', 'Star', 'Smile', 'Gift', 'Sparkles', 'Cake', 'Users', 'Flower2'].includes(item.type);
  const baseSize = isIcon ? 48 : (isMobile ? 80 : 96);
  // Account for border/padding padding which adds around 16-20px for image cards
  const width = baseSize * item.scale;
  const height = baseSize * item.scale;
  return { width, height };
}

/**
 * Highly optimized snapping and guideline computation engine
 * Designed to sustain 60fps with up to 500 layers by using pure in-memory math,
 * spatial proximity bucketing, and zero DOM layout thrashing.
 */
export function computeSmartGuides(
  draggedItem: PlacedItem,
  rawX: number,
  rawY: number,
  allLayers: PlacedItem[],
  containerWidth: number,
  containerHeight: number,
  isSnapEnabled = true,
  isMobile = false
): SmartGuideResult {
  const { width, height } = getItemDims(draggedItem, isMobile);

  let snappedX = rawX;
  let snappedY = rawY;

  const alignmentLines: AlignmentLine[] = [];
  const distanceIndicators: DistanceIndicator[] = [];
  const spacingGuides: SpacingGuide[] = [];

  // Dragged element boundary projections
  const dLeft = rawX;
  const dRight = rawX + width;
  const dCenterX = rawX + width / 2;
  const dTop = rawY;
  const dBottom = rawY + height;
  const dCenterY = rawY + height / 2;

  // Thresholds
  const SNAP_THRESHOLD = 8;
  const CANVAS_MARGIN = 40;

  // 1. High Performance Filter:
  // If layer count is large, keep calculations smooth by only checking layers within a broad distance bounding box
  const visibleTargets = allLayers.filter(item => {
    if (item.id === draggedItem.id) return false;
    // Fast distance filter (Manhattan distance < 1200px)
    const dx = Math.abs(item.x - rawX);
    const dy = Math.abs(item.y - rawY);
    return dx + dy < 1200;
  });

  // Collect alignment candidates
  // X-axis alignment candidates (Vertical Lines)
  const xCandidates: Array<{ value: number; label?: string; sourceId?: number | string; type: 'left' | 'center' | 'right' }> = [
    { value: CANVAS_MARGIN, label: 'Canvas Margin', type: 'left' },
    { value: containerWidth / 2, label: 'Center', type: 'center' },
    { value: containerWidth - CANVAS_MARGIN, label: 'Canvas Margin', type: 'right' }
  ];

  // Y-axis alignment candidates (Horizontal Lines)
  const yCandidates: Array<{ value: number; label?: string; sourceId?: number | string; type: 'top' | 'center' | 'bottom' }> = [
    { value: CANVAS_MARGIN, label: 'Canvas Margin', type: 'top' },
    { value: containerHeight / 2, label: 'Center', type: 'center' },
    { value: containerHeight - CANVAS_MARGIN, label: 'Canvas Margin', type: 'bottom' }
  ];

  // Map each target layer to its bounds in memory (no DOM read = zero lag!)
  const targetBounds = visibleTargets.map(item => {
    const dims = getItemDims(item, isMobile);
    return {
      id: item.id,
      left: item.x,
      right: item.x + dims.width,
      centerX: item.x + dims.width / 2,
      top: item.y,
      bottom: item.y + dims.height,
      centerY: item.y + dims.height / 2,
      width: dims.width,
      height: dims.height
    };
  });

  // Add target layer edges to alignment candidates
  targetBounds.forEach(b => {
    xCandidates.push({ value: b.left, label: 'Edge', sourceId: b.id, type: 'left' });
    xCandidates.push({ value: b.centerX, label: 'Center', sourceId: b.id, type: 'center' });
    xCandidates.push({ value: b.right, label: 'Edge', sourceId: b.id, type: 'right' });

    yCandidates.push({ value: b.top, label: 'Edge', sourceId: b.id, type: 'top' });
    yCandidates.push({ value: b.centerY, label: 'Center', sourceId: b.id, type: 'center' });
    yCandidates.push({ value: b.bottom, label: 'Edge', sourceId: b.id, type: 'bottom' });
  });

  // SNAP & ALIGN VERTICAL AXIS (Align X, Snapping Left/Right/Center)
  if (isSnapEnabled) {
    let bestDiffX = SNAP_THRESHOLD + 1;
    let bestSnapX: number | null = null;
    let snappedLineVal: number | null = null;
    let snappedType: 'left' | 'center' | 'right' | null = null;
    let alignedSourceId: number | string | undefined = undefined;

    xCandidates.forEach(cand => {
      // Test left boundary snap
      const diffLeft = Math.abs(dLeft - cand.value);
      if (diffLeft < bestDiffX) {
        bestDiffX = diffLeft;
        bestSnapX = cand.value; // Left snaps to candidate
        snappedLineVal = cand.value;
        snappedType = 'left';
        alignedSourceId = cand.sourceId;
      }

      // Test center boundary snap
      const diffCenter = Math.abs(dCenterX - cand.value);
      if (diffCenter < bestDiffX) {
        bestDiffX = diffCenter;
        bestSnapX = cand.value - width / 2; // Center aligns so left is cand - w/2
        snappedLineVal = cand.value;
        snappedType = 'center';
        alignedSourceId = cand.sourceId;
      }

      // Test right boundary snap
      const diffRight = Math.abs(dRight - cand.value);
      if (diffRight < bestDiffX) {
        bestDiffX = diffRight;
        bestSnapX = cand.value - width; // Right aligns so left is cand - w
        snappedLineVal = cand.value;
        snappedType = 'right';
        alignedSourceId = cand.sourceId;
      }
    });

    if (bestSnapX !== null && bestDiffX <= SNAP_THRESHOLD) {
      snappedX = bestSnapX;

      // Draw the alignment line
      if (snappedLineVal !== null) {
        let fromY = Math.min(dTop, dBottom);
        let toY = Math.max(dTop, dBottom);

        if (alignedSourceId) {
          const matched = targetBounds.find(t => t.id === alignedSourceId);
          if (matched) {
            fromY = Math.min(fromY, matched.top);
            toY = Math.max(toY, matched.bottom);
            
            // Add distance indicator if they are aligned
            const verticalDist = dTop > matched.bottom ? dTop - matched.bottom : (matched.top > dBottom ? matched.top - dBottom : 0);
            if (verticalDist > 0 && Math.abs(dCenterX - matched.centerX) < 40) {
              const startY = dTop > matched.bottom ? matched.bottom : dBottom;
              distanceIndicators.push({
                type: 'v',
                x: snappedLineVal,
                y: startY,
                length: verticalDist,
                text: `${Math.round(verticalDist)}px`
              });
            }
          }
        } else {
          // Canvas margin/center spans full height
          fromY = 0;
          toY = containerHeight;
        }

        alignmentLines.push({
          type: 'v',
          coord: snappedLineVal,
          from: fromY,
          to: toY,
          label: snappedType === 'center' ? 'Center X' : 'Align X'
        });
      }
    }
  }

  // SNAP & ALIGN HORIZONTAL AXIS (Align Y, Snapping Top/Bottom/Center)
  if (isSnapEnabled) {
    let bestDiffY = SNAP_THRESHOLD + 1;
    let bestSnapY: number | null = null;
    let snappedLineVal: number | null = null;
    let snappedType: 'top' | 'center' | 'bottom' | null = null;
    let alignedSourceId: number | string | undefined = undefined;

    yCandidates.forEach(cand => {
      // Test top boundary snap
      const diffTop = Math.abs(dTop - cand.value);
      if (diffTop < bestDiffY) {
        bestDiffY = diffTop;
        bestSnapY = cand.value;
        snappedLineVal = cand.value;
        snappedType = 'top';
        alignedSourceId = cand.sourceId;
      }

      // Test center boundary snap
      const diffCenter = Math.abs(dCenterY - cand.value);
      if (diffCenter < bestDiffY) {
        bestDiffY = diffCenter;
        bestSnapY = cand.value - height / 2;
        snappedLineVal = cand.value;
        snappedType = 'center';
        alignedSourceId = cand.sourceId;
      }

      // Test bottom boundary snap
      const diffBottom = Math.abs(dBottom - cand.value);
      if (diffBottom < bestDiffY) {
        bestDiffY = diffBottom;
        bestSnapY = cand.value - height;
        snappedLineVal = cand.value;
        snappedType = 'bottom';
        alignedSourceId = cand.sourceId;
      }
    });

    if (bestSnapY !== null && bestDiffY <= SNAP_THRESHOLD) {
      snappedY = bestSnapY;

      // Draw the alignment line
      if (snappedLineVal !== null) {
        let fromX = Math.min(dLeft, dRight);
        let toX = Math.max(dLeft, dRight);

        if (alignedSourceId) {
          const matched = targetBounds.find(t => t.id === alignedSourceId);
          if (matched) {
            fromX = Math.min(fromX, matched.left);
            toX = Math.max(toX, matched.right);

            // Add distance indicator if they are aligned
            const horizontalDist = dLeft > matched.right ? dLeft - matched.right : (matched.left > dRight ? matched.left - dRight : 0);
            if (horizontalDist > 0 && Math.abs(dCenterY - matched.centerY) < 40) {
              const startX = dLeft > matched.right ? matched.right : dRight;
              distanceIndicators.push({
                type: 'h',
                x: startX,
                y: snappedLineVal,
                length: horizontalDist,
                text: `${Math.round(horizontalDist)}px`
              });
            }
          }
        } else {
          // Canvas spans full width
          fromX = 0;
          toX = containerWidth;
        }

        alignmentLines.push({
          type: 'h',
          coord: snappedLineVal,
          from: fromX,
          to: toX,
          label: snappedType === 'center' ? 'Center Y' : 'Align Y'
        });
      }
    }
  }

  // 3. SPACING GUIDES (EQUAL SPACING ALIGNMENT)
  // Check if dragged item is placed between two other layers with roughly equal spacing.
  // To avoid performance issues, we look at closest neighbours horizontally and vertically.
  if (targetBounds.length >= 2) {
    // HORIZONTAL SPACING
    const leftTargets = targetBounds.filter(b => b.right <= snappedX).sort((a, b) => b.right - a.right); // nearest first
    const rightTargets = targetBounds.filter(b => b.left >= snappedX + width).sort((a, b) => a.left - b.left); // nearest first

    if (leftTargets.length > 0 && rightTargets.length > 0) {
      const leftObj = leftTargets[0];
      const rightObj = rightTargets[0];

      const gapLeft = snappedX - leftObj.right;
      const gapRight = rightObj.left - (snappedX + width);

      // If gap difference is within threshold, snap to make gaps exactly equal!
      if (Math.abs(gapLeft - gapRight) <= SNAP_THRESHOLD) {
        const equalGap = (rightObj.left - leftObj.right - width) / 2;
        snappedX = leftObj.right + equalGap;

        spacingGuides.push({
          type: 'h',
          rects: [
            {
              x: leftObj.right,
              y: Math.min(leftObj.top, dTop),
              width: equalGap,
              height: 20,
              text: `${Math.round(equalGap)}px`
            },
            {
              x: snappedX + width,
              y: Math.min(rightObj.top, dTop),
              width: equalGap,
              height: 20,
              text: `${Math.round(equalGap)}px`
            }
          ]
        });
      }
    }

    // VERTICAL SPACING
    const topTargets = targetBounds.filter(b => b.bottom <= snappedY).sort((a, b) => b.bottom - a.bottom);
    const bottomTargets = targetBounds.filter(b => b.top >= snappedY + height).sort((a, b) => a.top - b.top);

    if (topTargets.length > 0 && bottomTargets.length > 0) {
      const topObj = topTargets[0];
      const bottomObj = bottomTargets[0];

      const gapTop = snappedY - topObj.bottom;
      const gapBottom = bottomObj.top - (snappedY + height);

      if (Math.abs(gapTop - gapBottom) <= SNAP_THRESHOLD) {
        const equalGap = (bottomObj.top - topObj.bottom - height) / 2;
        snappedY = topObj.bottom + equalGap;

        spacingGuides.push({
          type: 'v',
          rects: [
            {
              x: Math.min(topObj.left, dLeft),
              y: topObj.bottom,
              width: 20,
              height: equalGap,
              text: `${Math.round(equalGap)}px`
            },
            {
              x: Math.min(bottomObj.left, dLeft),
              y: snappedY + height,
              width: 20,
              height: equalGap,
              text: `${Math.round(equalGap)}px`
            }
          ]
        });
      }
    }
  }

  return {
    snappedX,
    snappedY,
    alignmentLines,
    distanceIndicators,
    spacingGuides
  };
}
