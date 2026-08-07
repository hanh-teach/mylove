export function oklabToRgb(l: number, a_val: number, b_val: number, a: number = 1): string {
  // OKLAB to LMS
  const l_ = l + 0.3963377774 * a_val + 0.2158037573 * b_val;
  const m_ = l - 0.1055613458 * a_val - 0.0638541728 * b_val;
  const s_ = l - 0.0894841775 * a_val - 1.2914855480 * b_val;

  // LMS linear
  const l_linear = Math.pow(Math.max(0, l_), 3);
  const m_linear = Math.pow(Math.max(0, m_), 3);
  const s_linear = Math.pow(Math.max(0, s_), 3);

  // LMS linear to Linear sRGB
  const r_linear = +4.0767416621 * l_linear - 3.3077115913 * m_linear + 0.2309699292 * s_linear;
  const g_linear = -1.2684380046 * l_linear + 2.6097574011 * m_linear - 0.3413193965 * s_linear;
  const b_linear = -0.0041960863 * l_linear - 0.7034186147 * m_linear + 1.7076147010 * s_linear;

  // Linear sRGB to standard sRGB (with gamma correction)
  const gamma = (x: number) => {
    return x > 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x;
  };

  const r = Math.min(255, Math.max(0, Math.round(gamma(r_linear) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(gamma(g_linear) * 255)));
  const b = Math.min(255, Math.max(0, Math.round(gamma(b_linear) * 255)));

  if (a === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

export function oklchToRgb(l: number, c: number, h: number, a: number = 1): string {
  // Convert hue to radians
  const hRad = (h * Math.PI) / 180;
  const a_val = c * Math.cos(hRad);
  const b_val = c * Math.sin(hRad);

  return oklabToRgb(l, a_val, b_val, a);
}

// --- Fallback resolver for color functions we can't (or don't want to) hand-roll math for ---
// Tailwind v4 emits things like `color-mix(in oklab, oklch(64.6% .222 41) 50%, transparent)`
// for its `/50` opacity-modifier utilities. html2canvas's own color parser predates CSS Color 4
// and throws on ANY of oklch(), oklab(), color-mix(), lab(), lch(), hwb(). Rather than
// re-implementing color-mix math (which needs correct percentage weighting + interpolation
// color space), we let the browser's native CSS color parser do it via Canvas2D: setting
// ctx.fillStyle to a modern color string and reading back the rasterized pixel always yields
// a plain numeric RGBA, regardless of which exotic function produced it.
let probeCtx: CanvasRenderingContext2D | null | undefined;

function getColorProbeCtx(): CanvasRenderingContext2D | null {
  if (probeCtx !== undefined) return probeCtx;
  try {
    if (typeof document === 'undefined') {
      probeCtx = null;
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      probeCtx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | null;
    }
  } catch (e) {
    probeCtx = null;
  }
  return probeCtx;
}

// --- CSS custom-property ("var(...)") pre-resolver ---
// Tailwind v4's `@theme` tokens (see src/index.css: --color-white, --color-rose-600, ...)
// mean the color-mix()/oklch() strings extracted from cssText still contain literal
// `var(--color-white)` references (cssText reflects the *specified* value, not the
// *computed* one). Canvas2D's `fillStyle` setter has no notion of the CSS cascade —
// it cannot look up a custom property — so `ctx.fillStyle = 'color-mix(in oklab,
// var(--color-white) 60%, transparent)'` is simply REJECTED and silently ignored,
// leaving whatever fillStyle was set right before it. That "before" value is our own
// '#000000' sentinel, which is exactly why translucent boxes (bg-white/60 etc.) were
// rasterizing as solid black instead of being skipped/left alone.
// Fix: resolve var(...) first via a real, attached DOM element (getComputedStyle DOES
// resolve custom properties through the cascade), THEN hand the now-literal color
// string to the canvas trick above for the final oklch/color-mix -> rgb conversion.
let varProbeEl: HTMLDivElement | null | undefined;

function getVarProbeEl(): HTMLDivElement | null {
  if (varProbeEl !== undefined) return varProbeEl;
  try {
    if (typeof document === 'undefined' || !document.body) {
      varProbeEl = null;
    } else {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '-99999px';
      el.style.top = '0';
      el.style.width = '0';
      el.style.height = '0';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);
      varProbeEl = el;
    }
  } catch (e) {
    varProbeEl = null;
  }
  return varProbeEl;
}

function resolveCssVarsToLiteral(colorStr: string): string {
  if (!colorStr.includes('var(')) return colorStr;
  const el = getVarProbeEl();
  if (!el) return colorStr;
  try {
    // Reset first so a var() that fails to resolve doesn't silently reuse a stale value.
    el.style.color = '';
    el.style.color = colorStr;
    const resolved = getComputedStyle(el).color;
    return resolved && !resolved.includes('var(') ? resolved : colorStr;
  } catch (e) {
    return colorStr;
  }
}

/** Resolve ANY valid CSS color string (oklch, oklab, color-mix, lab, lch, hwb, color()...)
 * down to a plain rgb()/rgba() string using the browser's native color parser. */
export function resolveModernColorToRgba(colorStr: string): string {
  const literalColorStr = resolveCssVarsToLiteral(colorStr);

  // Direct mathematical check for oklch(...)
  const oklchMatch = literalColorStr.match(/oklch\(([^)]+)\)/i);
  if (oklchMatch) {
    try {
      const parts = oklchMatch[1].trim().split(/[\s,/]+/);
      if (parts.length >= 3) {
        let l = parts[0].includes('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
        let c = parts[1].includes('%') ? parseFloat(parts[1]) / 100 : parseFloat(parts[1]);
        let h = parseFloat(parts[2]);
        let a = parts[3] !== undefined ? (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
        if (!isNaN(l) && !isNaN(c) && !isNaN(h)) {
          return oklchToRgb(l, c, h, isNaN(a) ? 1 : a);
        }
      }
    } catch (e) {}
  }

  // Direct mathematical check for oklab(...)
  const oklabMatch = literalColorStr.match(/oklab\(([^)]+)\)/i);
  if (oklabMatch) {
    try {
      const parts = oklabMatch[1].trim().split(/[\s,/]+/);
      if (parts.length >= 3) {
        let l = parts[0].includes('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
        let aVal = parts[1].includes('%') ? parseFloat(parts[1]) / 100 : parseFloat(parts[1]);
        let bVal = parts[2].includes('%') ? parseFloat(parts[2]) / 100 : parseFloat(parts[2]);
        let alpha = parts[3] !== undefined ? (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
        if (!isNaN(l) && !isNaN(aVal) && !isNaN(bVal)) {
          return oklabToRgb(l, aVal, bVal, isNaN(alpha) ? 1 : alpha);
        }
      }
    } catch (e) {}
  }

  const ctx = getColorProbeCtx();
  if (!ctx) return colorStr.includes('transparent') ? 'rgba(0,0,0,0)' : 'rgb(255,255,255)';
  try {
    // Reset to a sentinel first so an unparsable string doesn't silently reuse a stale value.
    ctx.fillStyle = '#000000';
    ctx.fillStyle = literalColorStr;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    // If fillStyle was rejected, it will remain #000000 (unless literalColorStr was actually black)
    return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
  } catch (e) {
    // Never return unparsed oklab/oklch/color-mix to html2canvas
    return colorStr.includes('transparent') ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)';
  }
}

const MODERN_COLOR_FN_NAMES = ['color-mix', 'oklch', 'oklab', 'lab', 'lch', 'hwb', 'color', 'light-dark'];

/** Scans for the given function names and replaces each full call (matching parens
 * with proper nesting support, unlike a naive `fn\(([^)]+)\)` regex) via resolveModernColorToRgba. */
function replaceBalancedColorFunctions(input: string): string {
  if (!input || typeof input !== 'string') return input;
  if (!/(color-mix|oklch|oklab|\blab\(|\blch\(|\bhwb\(|\bcolor\()/i.test(input)) return input;

  const lower = input.toLowerCase();
  let result = '';
  let i = 0;
  while (i < input.length) {
    let matchedName: string | null = null;
    for (const name of MODERN_COLOR_FN_NAMES) {
      if (lower.startsWith(name + '(', i)) {
        matchedName = name;
        break;
      }
    }
    if (matchedName) {
      const start = i;
      let depth = 0;
      let j = i + matchedName.length;
      for (; j < input.length; j++) {
        if (input[j] === '(') depth++;
        else if (input[j] === ')') {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
      }
      result += resolveModernColorToRgba(input.slice(start, j));
      i = j;
    } else {
      result += input[i];
      i++;
    }
  }
  return result;
}

export function replaceOklchInString(val: string): string {
  if (!val || typeof val !== 'string') return val;
  if (!/(color-mix|oklch|oklab|\blab\(|\blch\(|\bhwb\(|\bcolor\(|\blight-dark\()/i.test(val)) return val;

  return replaceBalancedColorFunctions(val);
}
