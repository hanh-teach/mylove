import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // If running in SSR or test env without DOM, dompurify might need jsdom.
    // isomorphic-dompurify handles this, but since we installed dompurify,
    // we can just return it or rely on jsdom in vitest.
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 's', 'u'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}

export function extractPlainText(html: string): string {
  if (typeof window === 'undefined') return html; // Fallback for non-browser
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch (e) {
    return html;
  }
}

export function migrateLegacyContent(content: string): string {
  if (!content) return '';
  
  // If it already has HTML tags (like <p>, <br>, <strong>), it's either new data or already migrated.
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  
  // Convert plain text with newlines to HTML
  // \n\n -> multiple paragraphs
  // \n -> <br>
  const paragraphs = content.split(/\n\n+/);
  if (paragraphs.length > 1) {
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }
  
  // If no \n\n, but has \n, just replace with <br>
  return content.replace(/\n/g, '<br>');
}
