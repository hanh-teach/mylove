/**
 * Best-effort sniff of whether a media URL points at an image vs. a video, by file extension /
 * `image` substring. Callers should run this against the ORIGINAL provider URL and cache the
 * result — running it against a URL that's been rewritten (e.g. by toProxiedMediaUrl(), which
 * moves the real URL into a `?url=` query param) will not reliably find the extension anymore.
 */
export function isLikelyImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.gif') ||
    lower.includes('image') ||
    lower.startsWith('data:image') ||
    lower.includes('fal.media') ||
    lower.includes('huggingface') ||
    lower.includes('flux')
  );
}

/**
 * Rewrites a remote http(s) media URL (Runway/Agnes AI/Hugging Face/FAL CDN links) to go through
 * our own /api/media-proxy endpoint, so the browser treats it as same-origin.
 *
 * Why: those provider URLs are handed straight to the client and used as a <video>/<img> src.
 * Playing/displaying a cross-origin resource works fine without CORS headers, but READING it
 * back out — exactly what html2canvas's drawImage()-based capture does — requires the resource
 * to have been served with proper Access-Control-Allow-Origin headers, which most of these
 * providers don't send. That's what causes the "Tải Thiệp Có Chữ" / "Xuất & Tải xuống" export to
 * silently fall back to a blank/black frame (see ExportHelper.ts:snapshotVideoElementsForCapture,
 * and its SecurityError-catching fallback). Routing through our own origin sidesteps this
 * entirely — no third-party CORS cooperation needed.
 *
 * data:/blob: URLs (used by the simulated/preview mode, which never leaves the browser) and
 * relative/same-origin URLs are returned unchanged — only third-party absolute http(s) URLs need
 * the proxy.
 */
export function toProxiedMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  try {
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
    if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
      return url;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return url;
    }
    return `/api/media-proxy?url=${encodeURIComponent(parsed.toString())}`;
  } catch {
    // Not a parseable absolute/relative URL (shouldn't normally happen) — pass through as-is.
    return url;
  }
}

/**
 * Converts a Blob | data:/blob:/http(s): URL string into a Blob.
 * Shared by triggerFileDownload() and shareFile().
 */
async function resolveToBlob(blobOrUrl: Blob | string): Promise<Blob | null> {
  if (blobOrUrl instanceof Blob) return blobOrUrl;
  if (typeof blobOrUrl === 'string') {
    try {
      if (blobOrUrl.startsWith('data:') || blobOrUrl.startsWith('blob:') || blobOrUrl.startsWith('http')) {
        const response = await fetch(blobOrUrl);
        if (response.ok) {
          return await response.blob();
        }
      }
    } catch (e) {
      console.warn('[resolveToBlob] Không thể chuyển URL thành Blob:', e);
    }
  }
  return null;
}

function inferMimeAndFilename(blob: Blob, filename: string): { mimeType: string; shareFilename: string } {
  let mimeType = blob.type;
  if (!mimeType) {
    if (filename.endsWith('.png')) mimeType = 'image/png';
    else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (filename.endsWith('.mp4')) mimeType = 'video/mp4';
    else if (filename.endsWith('.webm')) mimeType = 'video/webm';
    else mimeType = 'application/octet-stream';
  }

  let shareFilename = filename;
  if (!shareFilename.includes('.')) {
    if (mimeType === 'image/png') shareFilename += '.png';
    else if (mimeType === 'image/jpeg') shareFilename += '.jpg';
    else if (mimeType === 'video/mp4') shareFilename += '.mp4';
    else if (mimeType === 'video/webm') shareFilename += '.webm';
  }

  return { mimeType, shareFilename };
}

/**
 * Explicit, user-initiated "Share" action — for a dedicated Share button, as opposed to
 * triggerFileDownload() which is for "Download" buttons. Unlike triggerFileDownload(), this is
 * NOT gated to mobile devices: when the person clicks a button literally labelled "Share", the
 * OS-native Share sheet (Windows Share flyout, Android Share sheet, iOS Share sheet...) is the
 * correct and expected result, not a bug.
 *
 * Returns true if the OS share sheet was successfully invoked, false if the browser has no Web
 * Share support (caller should show its own share options instead) or the share failed outright.
 * A user cancelling the share sheet (AbortError) also resolves to false but silently — that's
 * not an error.
 */
export async function shareFile(
  blobOrUrl: Blob | string,
  filename: string,
  meta?: { title?: string; text?: string }
): Promise<boolean> {
  const canShareApi = typeof navigator !== 'undefined' && !!(navigator.share);
  if (!canShareApi) return false;

  const blob = await resolveToBlob(blobOrUrl);
  if (!blob) return false;

  const { mimeType, shareFilename } = inferMimeAndFilename(blob, filename);

  try {
    const file = new File([blob], shareFilename, { type: mimeType });
    const shareData: ShareData = {
      files: [file],
      title: meta?.title || shareFilename,
      text: meta?.text || 'NoteMe',
    };

    if (navigator.canShare && !navigator.canShare(shareData)) {
      return false;
    }

    await navigator.share(shareData);
    return true;
  } catch (shareError: any) {
    if (shareError.name === 'AbortError') {
      // User closed the share sheet themselves — not an error, just no-op.
      return false;
    }
    console.error('[shareFile] Lỗi khi chia sẻ file:', shareError);
    return false;
  }
}

/**
 * Unifies file download mechanism across NoteMe.
 * Supports both Blob and String URLs/Data URIs.
 * Handles cleaning up object URLs to prevent memory leaks.
 */
export async function triggerFileDownload(blobOrUrl: Blob | string, filename: string): Promise<void> {
  const isStandalone = typeof window !== 'undefined' && (
    (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) || 
    (window.navigator as any).standalone === true
  );
  const isIOS = typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);
  // navigator.share()/canShare() also exist on DESKTOP Chromium browsers now (Edge/Chrome on
  // Windows expose the OS-level "Share" flyout via the Web Share API too — this is exactly the
  // native Windows Share dialog seen in bug reports, not something our own UI renders). Gating
  // only on "does the API exist" therefore hijacks every desktop download click into that OS
  // share sheet. The Web Share fallback was only ever intended for mobile/PWA contexts where a
  // plain `<a download>` click is unreliable (mainly iOS Safari / homescreen PWAs) — so we also
  // require an actual mobile device before attempting it.
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isMobileUA = typeof navigator !== 'undefined' && /Mobi|Tablet/i.test(navigator.userAgent);
  const isMobileDevice = isIOS || isAndroid || isMobileUA;
  const canShare = isMobileDevice && typeof navigator !== 'undefined' && !!(navigator.canShare && navigator.share);

  // 1. If iOS standalone PWA and share is completely unsupported, show clear instructions
  if (isStandalone && isIOS && !canShare) {
    alert("Thiết bị của bạn chưa hỗ trợ tải trực tiếp trong chế độ ứng dụng (PWA standalone). Vui lòng mở app này bằng trình duyệt Safari/Chrome thường (không qua icon màn hình chính) để tải file.");
    return;
  }

  // 2. Fetch or prepare Blob for Web Share API
  const blob = await resolveToBlob(blobOrUrl);

  // 3. Try Web Share API if supported and a Blob is available
  if (blob && canShare) {
    const { mimeType, shareFilename } = inferMimeAndFilename(blob, filename);

    try {
      const file = new File([blob], shareFilename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareFilename,
          text: 'NoteMe'
        });
        console.log('[triggerFileDownload] Đã chia sẻ file thành công bằng Web Share API');
        return;
      }
    } catch (shareError: any) {
      if (shareError.name === 'AbortError') {
        console.log('[triggerFileDownload] Người dùng hủy chia sẻ.');
        return; // Stopped by user, do not fallback to download
      }
      console.error('[triggerFileDownload] Thất bại khi chia sẻ qua Web Share API, thử fallback download:', shareError);
    }
  }

  // 4. Standard fallback: <a download> click mechanism
  let url: string;
  let isTempUrl = false;

  if (blobOrUrl instanceof Blob) {
    url = URL.createObjectURL(blobOrUrl);
    isTempUrl = true;
  } else {
    url = blobOrUrl;
  }

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Essential styling and containment
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Small timeout to allow the browser's download thread to safely initiate
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch (e) {
          // Ignore if already removed
        }
        resolve();
      }, 150);

      if (isTempUrl) {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(url);
            console.log(`[triggerFileDownload] Revoked temporary URL: ${url}`);
          } catch (e) {
            console.error('[triggerFileDownload] Error revoking temporary URL:', e);
          }
        }, 3000);
      }
    });
  } catch (error) {
    console.error('Lỗi khi tải file xuống thông qua triggerFileDownload:', error);
    throw error;
  }
}

/**
 * Prefetches an external image URL and converts it to a base64 Data URI.
 * This prevents tainted canvas errors in html2canvas when rendering cross-origin images.
 */
export async function prefetchImageAsBase64(url: string): Promise<string> {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`[Prefetch] Lỗi tải ảnh CORS bypass từ ${url}:`, err);
    // Fallback to original URL
    return url;
  }
}
