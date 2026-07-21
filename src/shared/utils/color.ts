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

export function replaceOklchInString(val: string): string {
  if (!val || typeof val !== 'string') return val;
  
  // Replace OKLCH
  const oklchRegex = /oklch\(\s*([\d.%\-]+)[\s,]+([\d.%\-]+)[\s,]+([\d.%\-]+(?:deg)?)(?:\s*[\/\s,]\s*([\d.%\-]+))?\s*\)/gi;
  let result = val.replace(oklchRegex, (match, lStr, cStr, hStr, aStr) => {
    let l = parseFloat(lStr);
    if (lStr.includes('%')) l = l / 100;
    let c = parseFloat(cStr);
    if (cStr.includes('%')) c = c / 100;
    let h = parseFloat(hStr);
    let a = 1;
    if (aStr) {
      a = parseFloat(aStr);
      if (aStr.includes('%')) a = a / 100;
    }
    return oklchToRgb(l, c, h, a);
  });

  // Replace OKLAB
  const oklabRegex = /oklab\(\s*([\d.%\-]+)[\s,]+([\d.%\-]+)[\s,]+([\d.%\-]+)(?:\s*[\/\s,]\s*([\d.%\-]+))?\s*\)/gi;
  result = result.replace(oklabRegex, (match, lStr, aStrVal, bStrVal, alphaStr) => {
    let l = parseFloat(lStr);
    if (lStr.includes('%')) l = l / 100;
    let aVal = parseFloat(aStrVal);
    if (aStrVal.includes('%')) aVal = aVal / 100;
    let bVal = parseFloat(bStrVal);
    if (bStrVal.includes('%')) bVal = bVal / 100;
    let alpha = 1;
    if (alphaStr) {
      alpha = parseFloat(alphaStr);
      if (alphaStr.includes('%')) alpha = alpha / 100;
    }
    return oklabToRgb(l, aVal, bVal, alpha);
  });

  return result;
}
