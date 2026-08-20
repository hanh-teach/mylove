import html2canvas from 'html2canvas';
import { ExportOptions } from './ExportTypes';
import { replaceOklchInString } from '../../shared/utils/color';
import { decorRegistry } from '../../shared/constants';
import { getFramedPhotoUrl } from '../../shared/constants/frameShapes';
import { prefetchImageAsBase64 } from './downloadUtils';

import { extractPlainText } from '../../utils/sanitize';

export interface CaptureOptions {
  scale?: number;
  backgroundColor: string | null;
  useCORS?: boolean;
  allowTaint?: boolean;
  onClone?: (clonedDoc: Document, element: HTMLElement) => void | Promise<void>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scrollX?: number;
  scrollY?: number;
  windowWidth?: number;
  windowHeight?: number;
}

/**
 * html2canvas fundamentally CANNOT rasterize <video> elements — it has no concept of "current
 * video frame" and simply skips them, leaving whatever sits behind exposed (in our card layouts
 * that's the container's own `bg-black`, which is exactly why a video-background card exports as
 * a solid black image with nothing else visible). The fix is to swap every cloned <video> with a
 * plain <img> snapshot of its CURRENT frame (drawn via an offscreen canvas) before html2canvas
 * walks the cloned document.
 */
async function snapshotVideoElementsForCapture(clonedDoc: Document, originalRoot: HTMLElement): Promise<void> {
  const clonedVideos = (clonedDoc && typeof clonedDoc.querySelectorAll === 'function')
    ? Array.from(clonedDoc.querySelectorAll('video'))
    : [];
  if (clonedVideos.length === 0) return;

  const originalVideos = Array.from(originalRoot.querySelectorAll('video')) as HTMLVideoElement[];

  for (let i = 0; i < clonedVideos.length; i++) {
    const clonedVideo = clonedVideos[i] as HTMLVideoElement;
    const originalVideo = originalVideos[i];
    if (!originalVideo) continue;

    try {
      // HAVE_CURRENT_DATA (2) is the minimum readyState where drawImage() actually paints a real
      // decoded frame instead of silently painting nothing (no error — just an empty/transparent
      // draw, which over this app's bg-black containers looks identical to the CORS-tainted
      // failure this function otherwise handles). If autoplay was blocked, or the click happened
      // before the browser finished buffering the first frame, readyState can still be 0/1 here —
      // so give it a brief window to catch up rather than snapshotting a guaranteed-blank frame.
      if (originalVideo.readyState < 2) {
        await Promise.race([
          new Promise<void>((resolve) => {
            const onReady = () => resolve();
            originalVideo.addEventListener('loadeddata', onReady, { once: true });
            originalVideo.addEventListener('canplay', onReady, { once: true });
          }),
          new Promise<void>((resolve) => setTimeout(resolve, 2000)),
        ]);
      }

      const w = originalVideo.videoWidth || originalVideo.clientWidth || 1;
      const h = originalVideo.videoHeight || originalVideo.clientHeight || 1;
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = w;
      frameCanvas.height = h;
      const ctx = frameCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.drawImage(originalVideo, 0, 0, w, h);
      const dataUrl = frameCanvas.toDataURL('image/png');

      const img = clonedDoc.createElement('img');
      img.src = dataUrl;
      if (dataUrl.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.className = clonedVideo.className;
      const styleAttr = clonedVideo.getAttribute('style');
      if (styleAttr) img.setAttribute('style', styleAttr);

      const computed = window.getComputedStyle(originalVideo);
      img.style.objectFit = computed.objectFit;
      img.style.objectPosition = computed.objectPosition;

      clonedVideo.replaceWith(img);
    } catch (e) {
      // Most likely a CORS-tainted frame (drawImage/toDataURL throws SecurityError when the video
      // source doesn't send proper CORS headers). Leave the <video> as-is rather than aborting the
      // whole export — this preserves the previous (blank) behaviour for that one element only.
      console.warn('[ExportHelper] Không thể chụp khung hình video để xuất ảnh (có thể do CORS):', e);
    }
  }
}

/**
 * html2canvas (v1.4.1) does not understand `filter` / `backdrop-filter`. When the element being
 * captured sits *inside* an ancestor that has one of these properties (e.g. our video-generation
 * modal's backdrop: `fixed inset-0 bg-black/60 backdrop-blur-md`), html2canvas's stacking-context
 * handling for that ancestor breaks down and it paints the ancestor's own background colour as a
 * solid, opaque rectangle over the ENTIRE region being captured — which is exactly why exporting
 * `#generated-card-container` (nested inside that backdrop-blur modal) produced a flat black PNG
 * with none of the video/photo, text, or decorations visible, even though the same container
 * looks completely normal on screen.
 *
 * The other export path (`getExportCanvas`) never hits this because it clones its target out to
 * a bare `document.body` child BEFORE capturing, which escapes any blurred/filtered ancestor
 * entirely. Rather than restructure every call site the same way, we neutralize `filter` and
 * `backdrop-filter` on every ancestor of the captured element (up to <body>) inside the cloned
 * document — the ancestors themselves are never part of the visible output, so this is safe and
 * has no effect on the exported image's own content.
 */
function neutralizeAncestorFiltersForCapture(clonedDoc: Document, clonedTarget: HTMLElement): void {
  let node: HTMLElement | null = clonedTarget.parentElement;
  while (node && node !== clonedDoc.body) {
    node.style.setProperty('filter', 'none', 'important');
    node.style.setProperty('backdrop-filter', 'none', 'important');
    node.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
    node.style.setProperty('background', 'none', 'important');
    node.style.setProperty('background-color', 'transparent', 'important');
    node = node.parentElement;
  }
}

/**
 * `captureElementToCanvas` forces the html2canvas clone to render un-scrolled (`scrollX/scrollY:
 * 0`) and instead bakes the live page's scroll offset into the crop `x`/`y` — correct for a
 * normal, in-flow element (its position in an un-scrolled document IS `rect.top + scrollY`), but
 * WRONG for an element that is itself `position: fixed` or sits inside a fixed-position ancestor
 * (like our video-generation modal's `fixed inset-0` backdrop). A fixed element's screen position
 * never moves with scroll, so in the un-scrolled clone it renders at exactly `rect.top`/`rect.left`
 * — adding `scrollY` on top of that, whenever the page happened to be scrolled when the user
 * clicked export, points the crop rectangle at empty space below/past the actual rendered content.
 * html2canvas then simply fills that empty crop region with the solid `backgroundColor` we pass in
 * (`#000000` for this card), which is exactly why the exported PNG came out a single flat black
 * rectangle with no video/photo, text, or decorations — none of which were actually broken, they
 * were just outside the (mis-)cropped area.
 */
function isFixedPositioningInEffect(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node) {
    if (window.getComputedStyle(node).position === 'fixed') return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Unified function to capture an HTMLElement to a canvas using html2canvas.
 * Consolidates cross-origin handling (onclone) and default options.
 */
export async function captureElementToCanvas(
  targetElement: HTMLElement,
  options: CaptureOptions
): Promise<HTMLCanvasElement | null> {
  try {
    // Explicitly pin the capture window to the element's own box. Without this,
    // html2canvas derives its clone-iframe bounds from the live page's scroll
    // position + document size, and an element sitting at a large negative
    // offset (e.g. left: -9999px) can fall outside those bounds entirely,
    // causing "Unable to find element in cloned iframe".
    const rect = targetElement.getBoundingClientRect();
    const elementWidth = options.width ?? (Math.ceil(rect.width) || targetElement.offsetWidth || 1280);
    const elementHeight = options.height ?? (Math.ceil(rect.height) || targetElement.offsetHeight || 720);

    const isStandaloneArtboard = options.x !== undefined || (targetElement.id && (targetElement.id.startsWith('temp-') || targetElement.id.includes('artboard')));

    // Only force custom capture coordinates if explicitly requested or if it's the standalone off-screen artboard.
    // For normal on-screen DOM elements, html2canvas will automatically calculate the correct bounds.
    const customX = options.x !== undefined ? options.x : (isStandaloneArtboard ? 0 : undefined);
    const customY = options.y !== undefined ? options.y : (isStandaloneArtboard ? 0 : undefined);

    const canvas = await html2canvas(targetElement, {
      scale: options.scale ?? 2,
      useCORS: options.useCORS ?? true,
      allowTaint: options.allowTaint ?? false,
      backgroundColor: options.backgroundColor,
      logging: false,
      ...(customX !== undefined && { x: customX }),
      ...(customY !== undefined && { y: customY }),
      width: elementWidth,
      height: elementHeight,
      scrollX: options.scrollX ?? 0,
      scrollY: options.scrollY ?? 0,
      windowWidth: options.windowWidth ?? (isStandaloneArtboard ? elementWidth : Math.max(elementWidth, document.documentElement.clientWidth)),
      windowHeight: options.windowHeight ?? (isStandaloneArtboard ? elementHeight : Math.max(elementHeight, document.documentElement.clientHeight)),
      onclone: async (clonedDoc) => {
        // Enforce exact documentElement & body bounds for standalone artboards to prevent 1/4 viewport scale bugs
        if (isStandaloneArtboard) {
          if (clonedDoc.documentElement) {
            clonedDoc.documentElement.style.cssText = `margin:0px!important;padding:0px!important;width:${elementWidth}px!important;height:${elementHeight}px!important;overflow:hidden!important;transform:none!important;zoom:1!important;`;
          }
          if (clonedDoc.body) {
            clonedDoc.body.style.cssText = `margin:0px!important;padding:0px!important;width:${elementWidth}px!important;height:${elementHeight}px!important;overflow:hidden!important;transform:none!important;zoom:1!important;background-color:${options.backgroundColor || '#000000'}!important;`;
          }
          const clonedArtboard = (targetElement.id && clonedDoc.getElementById(targetElement.id)) || null;
          if (clonedArtboard) {
            clonedArtboard.style.cssText = `position:absolute!important;top:0px!important;left:0px!important;width:${elementWidth}px!important;height:${elementHeight}px!important;margin:0px!important;padding:0px!important;z-index:999999!important;visibility:visible!important;opacity:1!important;transform:none!important;box-sizing:border-box!important;overflow:hidden!important;`;
          }
        }

        // Enforce cross-origin anonymous on images in the cloned DOM to prevent tainted canvas
        const images = (clonedDoc && typeof clonedDoc.getElementsByTagName === 'function')
          ? clonedDoc.getElementsByTagName('img')
          : [];
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const src = (img && typeof img.getAttribute === 'function' ? img.getAttribute('src') : '') || '';
          if (src.startsWith('data:') || src.startsWith('blob:')) {
            if (img && typeof img.removeAttribute === 'function') {
              img.removeAttribute('crossorigin');
            }
          } else {
            if (img && typeof img.setAttribute === 'function') {
              img.setAttribute('crossorigin', 'anonymous');
            }
          }
        }

        // Strip filter/backdrop-filter off every ancestor of the captured element (e.g. a modal's
        // `backdrop-blur-md` overlay) — html2canvas mishandles these and can paint the ancestor's
        // background as a solid opaque block over the whole captured region otherwise. Must run
        // before html2canvas walks the tree. The cloned target is looked up by id (all current
        // call sites always assign one to their captured element).
        const clonedTargetForFilters = (targetElement.id && clonedDoc.getElementById(targetElement.id)) || null;
        if (clonedTargetForFilters) {
          neutralizeAncestorFiltersForCapture(clonedDoc, clonedTargetForFilters);
        }

        // Replace any live <video> backgrounds with a static snapshot of their current frame —
        // html2canvas cannot render <video> at all otherwise (see snapshotVideoElementsForCapture).
        await snapshotVideoElementsForCapture(clonedDoc, targetElement);

        // Sanitize modern CSS color functions (oklab, oklch, color-mix) across all cloned stylesheets
        prepareClonedDocForHtml2Canvas(clonedDoc);

        // Apply resolved computed inline styles onto matching cloned target element
        const clonedTarget = (targetElement.id && clonedDoc.getElementById(targetElement.id)) || null;
        if (clonedTarget) {
          applyResolvedColorsToClone(targetElement, clonedTarget as HTMLElement);
        }

        // Execute additional clone logic if provided (awaited so async onClone callbacks complete
        // before html2canvas starts walking the cloned document)
        if (options.onClone) {
          await options.onClone(clonedDoc, targetElement);
        }
      }
    });
    return canvas;
  } catch (error) {
    console.error('[ExportHelper] Capture failed:', error);
    return null;
  }
}

export function extractProjectDetails(data: any) {
  const title = (
    data?.title ||
    data?.layers?.find((l: any) => l.id === 'layer_title')?.metadata?.text ||
    data?.activeProject?.content?.title ||
    data?.activeProject?.name ||
    data?.document?.title ||
    'NoteMe Document'
  ).normalize('NFC');

  const message = (
    data?.message ||
    data?.layers?.find((l: any) => l.id === 'layer_message')?.metadata?.text ||
    data?.activeProject?.content?.message ||
    data?.document?.blocks?.map((b: any) => extractPlainText(b.content)).join('\n\n') ||
    'Chưa có nội dung.'
  ).normalize('NFC');

  const scene = data?.scene || data?.activeProject?.content?.scene || 'rose';
  const fontStyle = data?.fontStyle || data?.activeProject?.content?.fontStyle || 'playfair';
  const bgStyle = data?.bgStyle || data?.activeProject?.content?.bgStyle || 'floating';
  const placedItems = data?.placedItems || data?.activeProject?.content?.placedItems || [];

  const extraLayers = data?.layers?.filter(
    (l: any) => l.type === 'text' && l.id !== 'layer_title' && l.id !== 'layer_message'
  ) || [];

  return { title, message, scene, fontStyle, bgStyle, placedItems, extraLayers };
}

export function getIconSvgMarkup(type: string, color: string): string {
  const paths: Record<string, string> = {
    Heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
    Star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    Smile: `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`,
    Cake: `<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/>`,
    Sparkles: `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>`,
    Gift: `<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>`,
    Users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    Flower2: `<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v12m-3-3a3 3 0 1 1 3-3m-3 3a3 3 0 1 0 3 3m3-3a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3-3"/>`
  };

  const path = paths[type] || paths.Heart;
  return `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/**
 * The most robust way to neutralize modern CSS color functions (oklch/oklab/color-mix/lab/lch/hwb)
 * for html2canvas: walk every element in the ORIGINAL (live, attached) subtree, read its fully
 * resolved `getComputedStyle` — which the browser has ALREADY resolved through the whole cascade,
 * custom properties (var(...)) included — and copy those resolved values as plain inline styles
 * onto the matching cloned element. This sidesteps prepareClonedDocForHtml2Canvas's fragile
 * stylesheet-cssText-regex approach, which only sees the *specified* value (still containing
 * unresolved `var(--color-white)` etc.) and has no cascade context to resolve it from.
 * originalRoot and clonedRoot must be structurally identical subtrees (clonedRoot === a
 * cloneNode(true) descendant of originalRoot's document), so their `getElementsByTagName('*')`
 * results line up 1:1 by index.
 */
export function applyResolvedColorsToClone(originalRoot: HTMLElement, clonedRoot: HTMLElement) {
  const applyOne = (originalEl: HTMLElement, clonedEl: HTMLElement) => {
    const comp = window.getComputedStyle(originalEl);
    clonedEl.style.color = replaceOklchInString(comp.color);
    clonedEl.style.backgroundColor = replaceOklchInString(comp.backgroundColor);
    clonedEl.style.borderColor = replaceOklchInString(comp.borderColor);
    if (comp.fill && comp.fill !== 'none') clonedEl.style.fill = replaceOklchInString(comp.fill);
    if (comp.stroke && comp.stroke !== 'none') clonedEl.style.stroke = replaceOklchInString(comp.stroke);
    if (comp.backgroundImage && comp.backgroundImage !== 'none') {
      clonedEl.style.backgroundImage = replaceOklchInString(comp.backgroundImage);
    }
    if (comp.boxShadow && comp.boxShadow !== 'none') {
      clonedEl.style.boxShadow = replaceOklchInString(comp.boxShadow);
    }
    // Catch anything still lingering in the (now partly-rewritten) inline style attribute
    const inlineStyle = clonedEl.getAttribute('style');
    if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('oklab') || inlineStyle.includes('color-mix'))) {
      clonedEl.setAttribute('style', replaceOklchInString(inlineStyle));
    }
  };

  try {
    applyOne(originalRoot, clonedRoot);
    const originalEls = originalRoot.getElementsByTagName('*');
    const clonedEls = clonedRoot.getElementsByTagName('*');
    for (let i = 0; i < originalEls.length; i++) {
      const originalEl = originalEls[i] as HTMLElement;
      const clonedEl = clonedEls[i] as HTMLElement;
      if (originalEl && clonedEl) applyOne(originalEl, clonedEl);
    }
  } catch (e) {
    console.warn('[ExportHelper] applyResolvedColorsToClone gặp lỗi, dùng phương án dự phòng (cssText regex):', e);
  }
}

export function prepareClonedDocForHtml2Canvas(clonedDoc: Document) {
  if (!clonedDoc || typeof clonedDoc.querySelectorAll !== 'function') return;
  // 1. Process all existing <style> tags in clonedDoc
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  for (const styleTag of styleTags) {
    if (styleTag.textContent) {
      styleTag.textContent = replaceOklchInString(styleTag.textContent);
    }
    if (styleTag.innerHTML) {
      styleTag.innerHTML = replaceOklchInString(styleTag.innerHTML);
    }
  }

  // 2. Remove / disable ALL <link rel="stylesheet"> tags in clonedDoc.
  // Because all active stylesheet rules from document.styleSheets are extracted, sanitized,
  // and injected in step 3 below, leaving <link rel="stylesheet"> in clonedDoc would cause
  // html2canvas to fetch and parse raw external/bundled CSS files (which contain oklab/oklch) directly.
  const linkTags = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
  for (const linkTag of linkTags) {
    try {
      (linkTag as HTMLLinkElement).disabled = true;
      linkTag.remove();
    } catch (e) {
      // Safeguard
    }
  }

  // 3. Extract CSS rules from active document stylesheets, clean oklch/oklab/color-mix, and inject clean style tag
  try {
    let combinedCss = '';
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            combinedCss += rules[j].cssText + '\n';
          }
        }
      } catch (e) {
        // Cross-origin CSS rules access safeguard
      }
    }
    if (combinedCss) {
      const cleanCss = replaceOklchInString(combinedCss);
      const cleanStyleEl = clonedDoc.createElement('style');
      cleanStyleEl.setAttribute('data-clean-canvas-styles', 'true');
      cleanStyleEl.textContent = cleanCss;
      clonedDoc.head.appendChild(cleanStyleEl);
    }
  } catch (e) {
    // Safeguard
  }

  // 4. Process all inline styles and attributes on elements in clonedDoc
  const allClonedEls = Array.from(clonedDoc.querySelectorAll('*'));
  for (const el of allClonedEls) {
    const htmlEl = el as HTMLElement;
    
    const styleAttr = htmlEl.getAttribute('style');
    if (styleAttr && /(color-mix|oklch|oklab|\blab\(|\blch\(|\bhwb\(|\bcolor\(|\blight-dark\()/i.test(styleAttr)) {
      htmlEl.setAttribute('style', replaceOklchInString(styleAttr));
    }

    if (htmlEl.style && htmlEl.style.length > 0) {
      const style = htmlEl.style;
      for (let i = 0; i < style.length; i++) {
        const propName = style[i];
        const propVal = style.getPropertyValue(propName);
        if (propVal && /(color-mix|oklch|oklab|\blab\(|\blch\(|\bhwb\(|\bcolor\(|\blight-dark\()/i.test(propVal)) {
          style.setProperty(propName, replaceOklchInString(propVal));
        }
      }
    }
  }
}

export async function getExportCanvas(data: any, options: ExportOptions, targetElementFromArg?: HTMLElement): Promise<HTMLCanvasElement> {
  const { title, message, scene, fontStyle, placedItems, extraLayers } = extractProjectDetails(data);

  // Prefetch any external images in placedItems to base64 and pre-frame photos
  const preparedPlacedItems = await Promise.all((placedItems || []).map(async (item: any) => {
    const decor = decorRegistry[item.type as keyof typeof decorRegistry];
    const customUrl = item.url || item.imageUrl;
    const targetSrc = customUrl || (decor && decor.type === 'image' ? (decor.content as string) : null);
    if (targetSrc) {
      try {
        const base64Content = await prefetchImageAsBase64(targetSrc);
        const frameShape = item.frameShape || 'rounded';
        const framedContent = customUrl ? await getFramedPhotoUrl(base64Content, frameShape, 500) : base64Content;
        return { ...item, _prefetchedContent: framedContent };
      } catch (e) {
        console.warn('[getExportCanvas] Lỗi prefetch/frame ảnh sticker/photo:', e);
        return item;
      }
    }
    return item;
  }));

  const sceneHexMap: Record<string, string> = {
    rose: '#ffe4e6',
    garden: '#d1fae5',
    forest: '#064e3b',
    sunset: '#fed7aa',
    ocean: '#bfdbfe',
    sakura: '#fbcfe8',
    sky: '#bae6fd',
    plain: '#ffffff',
  };

  const sceneTextColorMap: Record<string, string> = {
    rose: '#4c0519',
    garden: '#022c22',
    forest: '#ecfdf5',
    sunset: '#431407',
    ocean: '#172554',
    sakura: '#500724',
    sky: '#082f49',
    plain: '#0f172a',
  };

  const currentBgHex = sceneHexMap[scene] || '#ffe4e6';
  const currentTextHex = sceneTextColorMap[scene] || '#4c0519';

  let originalTargetElement = targetElementFromArg || 
    options.targetElement || 
    document.getElementById('card-preview-artboard') || 
    document.getElementById('main-card-container');

  let targetElement: HTMLElement | undefined = undefined;
  let tempCreated = false;
  let computedWidth = 0;
  let computedHeight = 0;

  const isTestEnv = (typeof window !== 'undefined' && window.navigator.userAgent.includes('jsdom')) || 
    (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true'));

  if (originalTargetElement) {
    computedWidth = originalTargetElement.offsetWidth;
    computedHeight = originalTargetElement.offsetHeight;

    if (!computedWidth || !computedHeight) {
      if (options.orientation === 'landscape') {
        computedWidth = 1120;
        computedHeight = 790;
      } else {
        computedWidth = 790;
        computedHeight = 1120;
      }
    }

    if (!isTestEnv) {
      tempCreated = true;
      const cloned = originalTargetElement.cloneNode(true) as HTMLElement;
      cloned.id = 'temp-cloned-export-card-artboard';
      // NOTE: previously positioned at left/top: -9999px. A large negative offset
      // can land outside the bounds html2canvas computes for its internal clone
      // iframe, making it unable to locate the element ("Unable to find element
      // in cloned iframe") and returning a null canvas. Keeping it on-screen at
      // (0,0) but behind everything else (z-index: -1) keeps it invisible to the
      // user while staying inside the capturable window.
      cloned.style.setProperty('position', 'fixed', 'important');
      cloned.style.setProperty('left', '0px', 'important');
      cloned.style.setProperty('top', '0px', 'important');
      cloned.style.setProperty('z-index', '99999', 'important');
      cloned.style.setProperty('pointer-events', 'none', 'important');
      cloned.style.setProperty('width', `${computedWidth}px`, 'important');
      cloned.style.setProperty('height', `${computedHeight}px`, 'important');
      cloned.style.setProperty('background-color', currentBgHex, 'important');
      cloned.style.setProperty('visibility', 'visible', 'important');
      cloned.style.setProperty('opacity', '1', 'important');
      
      cloned.classList.remove('hidden', 'absolute', 'inset-0');
      cloned.style.removeProperty('display');
      cloned.style.setProperty('display', 'flex', 'important');
      
      // Remove hidden class from cloned descendants to make sure they render
      cloned.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));

      // 1. Force the hidden text overlay to be fully visible and in the normal flow
      // before html2canvas even starts, so getComputedStyle sees the right colors.
      cloned.querySelectorAll('[data-export-text-content="true"]').forEach(el => {
        el.classList.remove('absolute', 'inset-0', 'opacity-0', 'pointer-events-none');
        el.classList.add('relative', 'w-full');
        (el as HTMLElement).style.setProperty('opacity', '1', 'important');
        (el as HTMLElement).style.setProperty('visibility', 'visible', 'important');
        (el as HTMLElement).style.setProperty('position', 'relative', 'important');
      });

      // 2. Proactively remove elements that html2canvas will ignore anyway.
      // If we don't do this, applyResolvedColorsToClone will mismatch element indices
      // between our original clone (with inputs) and html2canvas's internal clone (without inputs).
      cloned.querySelectorAll('[data-html2canvas-ignore="true"]').forEach(el => {
        el.remove();
      });
      
      document.body.appendChild(cloned);
      targetElement = cloned;
      
      await new Promise(resolve => setTimeout(resolve, 150));
    } else {
      targetElement = originalTargetElement as HTMLElement;
      tempCreated = false;
    }
  }


  if (!targetElement) {
    tempCreated = true;

    const fontFamilies: Record<string, string> = {
      playfair: '"Playfair Display", serif',
      dancing: '"Dancing Script", cursive',
      pacifico: '"Pacifico", cursive',
      caveat: '"Caveat", cursive',
      lora: '"Lora", serif',
      nunito: '"Nunito", sans-serif',
    };

    const chosenFontFamily = fontFamilies[fontStyle] || fontFamilies.playfair;

    targetElement = document.createElement('div');
    targetElement.id = 'temp-export-card-artboard';
    // Same fix as above: stay at (0,0) and hide via z-index instead of pushing
    // off-screen with a large negative offset, which html2canvas's clone-iframe
    // sizing can fail to capture.
    targetElement.style.position = 'fixed';
    targetElement.style.left = '0px';
    targetElement.style.top = '0px';
    targetElement.style.zIndex = '99999';
    targetElement.style.pointerEvents = 'none';
    targetElement.style.width = options.orientation === 'landscape' ? '1200px' : '850px';
    targetElement.style.height = options.orientation === 'landscape' ? '850px' : '1200px';
    targetElement.style.backgroundColor = currentBgHex;
    targetElement.style.color = currentTextHex;
    targetElement.style.padding = '56px';
    targetElement.style.boxSizing = 'border-box';
    targetElement.style.fontFamily = chosenFontFamily;
    targetElement.style.overflow = 'hidden';
    targetElement.style.display = 'flex';
    targetElement.style.flexDirection = 'column';
    targetElement.style.alignItems = 'center';
    targetElement.style.justifyContent = 'center';

    let watermarkHtml = '';
    if (options.includeWatermark) {
      watermarkHtml = `
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.08; pointer-events: none; transform: rotate(-30deg); font-size: 80px; font-weight: 900; color: ${currentTextHex}; white-space: nowrap; z-index: 30;">
          ${options.watermarkText || 'LOVENOTE'}
        </div>
      `;
    }

    let decorHtml = '';
    if (preparedPlacedItems && preparedPlacedItems.length > 0) {
      decorHtml = preparedPlacedItems.map((item: any) => {
        const decor = decorRegistry[item.type as keyof typeof decorRegistry];
        const customUrl = item.url || item.imageUrl;
        if (!decor && !customUrl) return '';
        const color = item.color || currentTextHex;
        const scale = item.scale || 1;
        const rotation = item.rotation || 0;
        const frameShape = item.frameShape || 'rounded';
        
        let contentMarkup = '';
        if (customUrl) {
          const imgSrc = item._prefetchedContent || customUrl;
          contentMarkup = `<img src="${imgSrc}" crossOrigin="anonymous" style="width: 160px; height: 160px; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));" />`;
        } else if (decor && decor.type === 'image' && decor.content) {
          const imgSrc = item._prefetchedContent || decor.content;
          contentMarkup = `<img src="${imgSrc}" crossOrigin="anonymous" style="width: 54px; height: 54px; object-fit: contain;" />`;
        } else if (decor) {
          contentMarkup = getIconSvgMarkup(item.type, color);
        }

        return `
          <div style="position: absolute; left: ${item.x}px; top: ${item.y}px; transform: translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg); z-index: 25; color: ${color};">
            ${contentMarkup}
          </div>
        `;
      }).join('');
    }

    const svgFrameDefs = `
      <svg width="0" height="0" style="position:absolute; width:0; height:0; pointer-events:none;">
        <defs>
          <clipPath id="frame-heart" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.22 C 0.35,-0.08 0,0.08 0,0.38 C 0,0.65 0.32,0.85 0.5,0.98 C 0.68,0.85 1,0.65 1,0.38 C 1,0.08 0.65,-0.08 0.5,0.22 Z" />
          </clipPath>
          <clipPath id="frame-cloud" clipPathUnits="objectBoundingBox">
            <path d="M 0.25,0.65 C 0.1,0.65 0,0.52 0,0.38 C 0,0.25 0.12,0.15 0.25,0.18 C 0.32,0.05 0.48,-0.02 0.62,0.05 C 0.72,0.02 0.85,0.08 0.9,0.18 C 0.98,0.22 1,0.32 1,0.4 C 1,0.55 0.88,0.65 0.75,0.65 Z" />
          </clipPath>
          <clipPath id="frame-bubble" clipPathUnits="objectBoundingBox">
            <path d="M 0.1,0 C 0.04,0 0,0.06 0,0.12 L 0,0.68 C 0,0.74 0.04,0.8 0.1,0.8 L 0.2,0.8 L 0.1,1 L 0.35,0.8 L 0.9,0.8 C 0.96,0.8 1,0.74 1,0.68 L 1,0.12 C 1,0.06 0.96,0 0.9,0 Z" />
          </clipPath>
          <clipPath id="frame-balloon" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.2,0 0,0.2 0,0.45 C 0,0.68 0.3,0.88 0.45,0.93 L 0.42,1 L 0.58,1 L 0.55,0.93 C 0.7,0.88 1,0.68 1,0.45 C 1,0.2 0.8,0 0.5,0 Z" />
          </clipPath>
          <clipPath id="frame-star" clipPathUnits="objectBoundingBox">
            <polygon points="0.5,0 0.63,0.35 1,0.35 0.7,0.58 0.82,0.95 0.5,0.72 0.18,0.95 0.3,0.58 0,0.35 0.37,0.35" />
          </clipPath>
        </defs>
      </svg>
    `;

    targetElement.innerHTML = `
      ${svgFrameDefs}
      ${watermarkHtml}
      <div style="position: absolute; inset: 0; pointer-events: none; opacity: 0.15; background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 24px 24px;"></div>
      
      <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 720px;">
        <h1 style="font-size: 52px; font-weight: 800; color: ${currentTextHex}; margin-bottom: 24px; font-family: ${chosenFontFamily}; line-height: 1.3;">
          ${title}
        </h1>
        <p style="font-size: 30px; line-height: 1.8; color: ${currentTextHex}; white-space: pre-wrap; text-align: center; font-family: ${chosenFontFamily}; margin-bottom: 24px;">
          ${message}
        </p>
        ${extraLayers.map((l: any) => `
          <div style="width: 100%; max-width: 650px; margin-top: 16px; font-size: 18px; color: ${currentTextHex}; text-align: center; font-family: ${chosenFontFamily};">
            ${l.metadata?.text || ''}
          </div>
        `).join('')}
      </div>

      ${decorHtml}
    `;

    document.body.appendChild(targetElement);
    // Yield to browser rendering before capture to prevent "Unable to find element in cloned iframe"
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {
    const scale = options.quality === 'print' ? 3 : options.quality === 'high' ? 2 : 1.5;
    const exportWidth = computedWidth || (options.orientation === 'landscape' ? 1120 : 790);
    const exportHeight = computedHeight || (options.orientation === 'landscape' ? 790 : 1120);

    const canvas = await captureElementToCanvas(targetElement, {
      scale,
      backgroundColor: currentBgHex,
      x: 0,
      y: 0,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight,
      onClone: (clonedDoc) => {
        const clonedBody = clonedDoc.body;
        if (clonedBody) {
          clonedBody.style.cssText = `margin:0px!important;padding:0px!important;width:${exportWidth}px!important;height:${exportHeight}px!important;overflow:hidden!important;`;
        }

        const targetId = targetElement?.id;
        const clonedTarget = (targetId ? clonedDoc.getElementById(targetId) : null) || 
          clonedDoc.getElementById('card-preview-artboard') || 
          clonedDoc.getElementById('main-card-container');
        if (clonedTarget) {
          const bgMap: Record<string, string> = {
            'bg-rose-100': '#ffe4e6',
            'bg-emerald-100': '#d1fae5',
            'bg-emerald-900': '#064e3b',
            'bg-orange-200': '#fed7aa',
            'bg-blue-200': '#bfdbfe',
            'bg-pink-200': '#fbcfe8',
            'bg-sky-200': '#bae6fd',
            'bg-white': '#ffffff',
          };
          for (const [cls, hex] of Object.entries(bgMap)) {
            if (clonedTarget.classList.contains(cls)) {
              clonedTarget.style.backgroundColor = hex;
              break;
            }
          }

          if (computedWidth && computedHeight) {
            clonedTarget.style.setProperty('width', `${computedWidth}px`, 'important');
            clonedTarget.style.setProperty('height', `${computedHeight}px`, 'important');
          }
          clonedTarget.style.setProperty('visibility', 'visible', 'important');
          clonedTarget.style.setProperty('opacity', '1', 'important');
          clonedTarget.classList.remove('hidden', 'absolute', 'inset-0');
          clonedTarget.style.removeProperty('display');
          clonedTarget.style.setProperty('display', 'flex', 'important');

          clonedTarget.querySelectorAll('.hidden').forEach((el) => {
            el.classList.remove('hidden');
          });

          // Robust per-element color resolution (handles Tailwind v4's color-mix(in oklab,
          // var(--color-*) ...) opacity utilities, which the stylesheet-text regex pass below
          // cannot fully resolve on its own since it has no cascade context for var()).
          applyResolvedColorsToClone(targetElement, clonedTarget as HTMLElement);
        }

        // Convert oklch colors across stylesheets, links, and inline styles
        prepareClonedDocForHtml2Canvas(clonedDoc);
      }
    });

    if (!canvas) {
      console.warn('[getExportCanvas] html2canvas capture returned null, creating fallback 2D canvas');
      return await createFallbackExportCanvas(data, options, exportWidth, exportHeight, currentBgHex, currentTextHex, preparedPlacedItems);
    }

    return canvas;
  } finally {
    if (tempCreated && targetElement && targetElement.parentNode) {
      targetElement.parentNode.removeChild(targetElement);
    }
  }
}

async function createFallbackExportCanvas(
  data: any,
  options: ExportOptions,
  exportWidth: number,
  exportHeight: number,
  currentBgHex: string,
  currentTextHex: string,
  preparedPlacedItems: any[]
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = exportWidth * 2;
  canvas.height = exportHeight * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(2, 2);

  // Fill background
  ctx.fillStyle = currentBgHex;
  ctx.fillRect(0, 0, exportWidth, exportHeight);

  // Draw subtle radial gradient decoration in background
  try {
    const radial = ctx.createRadialGradient(exportWidth / 2, exportHeight / 2, 50, exportWidth / 2, exportHeight / 2, Math.max(exportWidth, exportHeight));
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, exportWidth, exportHeight);
  } catch (e) {}

  const { title, message, fontStyle } = extractProjectDetails(data);
  const fontFamilies: Record<string, string> = {
    playfair: '"Playfair Display", serif',
    dancing: '"Dancing Script", cursive',
    pacifico: '"Pacifico", cursive',
    caveat: '"Caveat", cursive',
    lora: '"Lora", serif',
    nunito: '"Nunito", sans-serif',
  };
  const font = fontFamilies[fontStyle] || fontFamilies.playfair;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title with word wrap & shadow
  const cleanTitle = (title || 'Thiệp Yêu Thương').trim();
  ctx.font = `bold 44px ${font}`;
  ctx.fillStyle = currentTextHex;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillText(cleanTitle, exportWidth / 2, exportHeight * 0.32);

  // Message with robust word wrap
  ctx.font = `24px ${font}`;
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  const rawMessage = (message || '').trim();
  const paragraphs = rawMessage.split('\n');
  const maxLineWidth = exportWidth * 0.75;
  const wrappedLines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      wrappedLines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      wrappedLines.push(currentLine);
    }
  }

  let y = exportHeight * 0.44;
  for (const line of wrappedLines) {
    if (line) {
      ctx.fillText(line, exportWidth / 2, y);
    }
    y += 36;
  }

  // Reset shadow for stickers
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Placed items / stickers / icons / custom photos
  for (const item of preparedPlacedItems || []) {
    const decor = decorRegistry[item.type as keyof typeof decorRegistry];
    const customUrl = item.url || item.imageUrl;
    if (!decor && !customUrl) continue;

    const posX = item.x !== undefined ? (item.x > exportWidth ? exportWidth / 2 + (item.x - 400) : item.x) : exportWidth / 2;
    const posY = item.y !== undefined ? (item.y > exportHeight ? exportHeight / 2 + (item.y - 300) : item.y) : exportHeight / 2;
    const scale = item.scale || 1;
    const rotation = item.rotation || 0;
    const color = item.color || currentTextHex;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    if (customUrl) {
      const frameShape = item.frameShape || 'rounded';
      const imgSrc = item._prefetchedContent || (await getFramedPhotoUrl(customUrl, frameShape, 500));
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = imgSrc;
        });
        if (img.width > 0) {
          ctx.drawImage(img, -70, -70, 140, 140);
        }
      } catch (e) {
        console.warn('[exportToPngCanvas] Error drawing framed photo:', e);
      }
    } else if (decor && decor.type === 'image' && decor.content) {
      const frameShape = item.frameShape || 'rounded';
      const imgSrc = item._prefetchedContent || (await getFramedPhotoUrl(decor.content as string, frameShape, 500, 'contain'));
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = imgSrc;
        });
        if (img.width > 0) {
          ctx.drawImage(img, -28, -28, 56, 56);
        }
      } catch (e) {}
    } else {
      try {
        const svgMarkup = getIconSvgMarkup(item.type, color);
        const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgImg = new Image();
        await new Promise((resolve) => {
          svgImg.onload = resolve;
          svgImg.onerror = resolve;
          svgImg.src = svgUrl;
        });
        if (svgImg.width > 0) {
          ctx.drawImage(svgImg, -24, -24, 48, 48);
        }
        URL.revokeObjectURL(svgUrl);
      } catch (e) {}
    }
    ctx.restore();
  }

  return canvas;
}

export async function getExportCanvasA4(data: any, options: ExportOptions): Promise<HTMLCanvasElement> {
  const { title, message, scene, fontStyle, placedItems } = extractProjectDetails(data);
  
  // A4 paper dimensions at 8 pixels per mm
  const exportWidth = 1680; // 210mm * 8
  const exportHeight = 2376; // 297mm * 8
  
  const canvas = document.createElement('canvas');
  canvas.width = exportWidth;
  canvas.height = exportHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Resolve scene colors
  const sceneHexMap: Record<string, string> = {
    rose: '#ffe4e6',
    garden: '#d1fae5',
    forest: '#064e3b',
    sunset: '#fed7aa',
    ocean: '#bfdbfe',
    sakura: '#fbcfe8',
    sky: '#bae6fd',
    plain: '#ffffff',
  };

  const sceneTextColorMap: Record<string, string> = {
    rose: '#4c0519',
    garden: '#022c22',
    forest: '#ecfdf5',
    sunset: '#431407',
    ocean: '#172554',
    sakura: '#500724',
    sky: '#082f49',
    plain: '#0f172a',
  };

  const currentBgHex = sceneHexMap[scene] || '#ffe4e6';
  const currentTextHex = sceneTextColorMap[scene] || '#4c0519';

  // Fill background
  ctx.fillStyle = currentBgHex;
  ctx.fillRect(0, 0, exportWidth, exportHeight);

  // Draw elegant subtle page border decoration (inset by 15mm = 120px)
  ctx.strokeStyle = currentTextHex + '22'; // 13% opacity
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 120, exportWidth - 240, exportHeight - 240);

  // Define exact standard margins in pixels (Lề Trên 2.5cm, Trái 2.5cm, dưới 2.5cm, phải 2.0cm)
  const marginLeft = 200; // 2.5cm * 8 = 200px
  const marginTop = 200; // 2.5cm * 8 = 200px
  const marginRight = 160; // 2.0cm * 8 = 160px
  const marginBottom = 200; // 2.5cm * 8 = 200px

  const printableWidth = exportWidth - marginLeft - marginRight;

  // Font style lookup
  const fontFamilies: Record<string, string> = {
    playfair: '"Playfair Display", serif',
    dancing: '"Dancing Script", cursive',
    pacifico: '"Pacifico", cursive',
    caveat: '"Caveat", cursive',
    lora: '"Lora", serif',
    nunito: '"Nunito", sans-serif',
  };
  const font = fontFamilies[fontStyle] || fontFamilies.playfair;

  // Draw Title
  const cleanTitle = (title || 'Thiệp Yêu Thương').trim();
  ctx.fillStyle = currentTextHex;
  ctx.textAlign = 'center';
  ctx.font = `bold 44px ${font}`;
  
  // Wrap Title inside printable width
  const titleWords = cleanTitle.split(' ');
  const titleLines: string[] = [];
  let currentTitleLine = '';
  for (const word of titleWords) {
    const testLine = currentTitleLine ? `${currentTitleLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > printableWidth && currentTitleLine) {
      titleLines.push(currentTitleLine);
      currentTitleLine = word;
    } else {
      currentTitleLine = testLine;
    }
  }
  if (currentTitleLine) titleLines.push(currentTitleLine);

  let currentY = marginTop;
  for (const line of titleLines) {
    ctx.fillText(line, marginLeft + printableWidth / 2, currentY);
    currentY += 64; // Title line height
  }

  currentY += 48; // Spacing after title

  // Draw message body
  ctx.textAlign = 'left';
  ctx.font = `30px ${font}`;
  const rawMessage = (message || '').trim();
  const paragraphs = rawMessage.split('\n');

  const messageLineHeight = 48;
  const paragraphSpacing = 32;

  for (const para of paragraphs) {
    if (!para.trim()) {
      currentY += paragraphSpacing;
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';
    const linesToDraw: string[] = [];

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > printableWidth && currentLine) {
        linesToDraw.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      linesToDraw.push(currentLine);
    }

    // Draw paragraph lines
    for (const line of linesToDraw) {
      if (currentY > exportHeight - marginBottom) {
        break; // Guard bottom margin
      }
      ctx.fillText(line, marginLeft, currentY);
      currentY += messageLineHeight;
    }

    currentY += paragraphSpacing;
  }

  // Draw Stickers / Placed Items elegantly at their scaled positions
  for (const item of placedItems || []) {
    const decor = decorRegistry[item.type as keyof typeof decorRegistry];
    const customUrl = item.url || item.imageUrl;
    if (!decor && !customUrl) continue;

    // Scale coordinates to fit the high-res layout nicely
    const posX = item.x !== undefined ? (item.x / 800) * exportWidth : exportWidth / 2;
    const posY = item.y !== undefined ? (item.y / 600) * exportHeight : exportHeight / 2;
    const scale = (item.scale || 1) * 1.5;
    const rotation = item.rotation || 0;
    const color = item.color || currentTextHex;

    // Ensure they don't render off-page
    const clampedX = Math.max(100, Math.min(exportWidth - 100, posX));
    const clampedY = Math.max(100, Math.min(exportHeight - 100, posY));

    ctx.save();
    ctx.translate(clampedX, clampedY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    if (customUrl) {
      const frameShape = item.frameShape || 'rounded';
      const imgSrc = item._prefetchedContent || (await getFramedPhotoUrl(customUrl, frameShape, 500));
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = imgSrc;
        });
        if (img.width > 0) {
          ctx.drawImage(img, -70, -70, 140, 140);
        }
      } catch (e) {
        console.warn('[getExportCanvasA4] Error drawing photo sticker:', e);
      }
    } else if (decor && decor.type === 'image' && decor.content) {
      const frameShape = item.frameShape || 'rounded';
      const imgSrc = item._prefetchedContent || (await getFramedPhotoUrl(decor.content as string, frameShape, 500, 'contain'));
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = imgSrc;
        });
        if (img.width > 0) {
          ctx.drawImage(img, -28, -28, 56, 56);
        }
      } catch (e) {}
    } else {
      try {
        const svgMarkup = getIconSvgMarkup(item.type, color);
        const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgImg = new Image();
        await new Promise((resolve) => {
          svgImg.onload = resolve;
          svgImg.onerror = resolve;
          svgImg.src = svgUrl;
        });
        if (svgImg.width > 0) {
          ctx.drawImage(svgImg, -24, -24, 48, 48);
        }
        URL.revokeObjectURL(svgUrl);
      } catch (e) {}
    }
    ctx.restore();
  }

  return canvas;
}


