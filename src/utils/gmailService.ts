// Utility service for sending emails directly via Google Gmail API (OAuth 2.0)

declare global {
  interface Window {
    google?: any;
  }
}

export const DEFAULT_GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  '911300080172-fr6ljjltmrdtq85cskj7sclg1hhb41eg.apps.googleusercontent.com';

/**
 * Dynamically loads the Google Identity Services (GIS) library script.
 */
export async function loadGoogleGsiScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return;
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Không thể tải Google Identity Services SDK. Vui lòng kiểm tra kết nối mạng.'));
    document.head.appendChild(script);
  });
}

/**
 * Encodes an email message into RFC 2822 base64url format required by Gmail API.
 */
export function createRawBase64Email(to: string, subject: string, body: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body
  ];
  const message = messageParts.join('\r\n');
  
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Requests a Google OAuth access token using GIS token client popup.
 */
export async function requestGmailAccessToken(clientId: string): Promise<string> {
  await loadGoogleGsiScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google OAuth SDK chưa sẵn sàng.');
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'https://www.googleapis.com/auth/gmail.send',
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(`Xác thực Google thất bại: ${response.error_description || response.error}`));
            return;
          }
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Không nhận được Access Token từ Google.'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(`Lỗi khởi tạo OAuth Google: ${err.message || 'Hủy thao tác'}`));
        }
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
}

/**
 * Sends an email directly using the Gmail REST API (v1).
 */
export async function sendEmailViaGmailApi(accessToken: string, to: string, subject: string, body: string): Promise<any> {
  const rawBase64 = createRawBase64Email(to, subject, body);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64 }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errorMessage = errorJson.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Gửi email qua Gmail API thất bại: ${errorMessage}`);
  }

  return await response.json();
}
