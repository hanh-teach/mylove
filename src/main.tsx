import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/shell/ThemeContext.tsx';
import { LanguageProvider } from './components/shell/LanguageContext.tsx';
import { ToastProvider } from './components/common/Toast.tsx';
import { TabErrorBoundary } from './components/common/TabErrorBoundary.tsx';
import { safeStorage } from './shared/utils/safeStorage.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TabErrorBoundary tabName="Hệ thống">
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TabErrorBoundary>
  </StrictMode>,
);

// Auto reload when dynamic chunks fail to load due to new deployments or network cache mismatch
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Vite Preload Error] Module chunk loading failed, reloading page to fetch latest assets...', event);
  window.location.reload();
});

// Auto-reconnect & wake-up handler when service recovers from sleep / suspension
if (typeof window !== 'undefined') {
  let isCheckingHealth = false;
  const checkServiceHealth = async () => {
    if (isCheckingHealth) return;
    isCheckingHealth = true;
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      if (res.ok) {
        // If we were offline or suspended and recovered, clear any retry flags
        safeStorage.session.removeItem('service_suspended_retry');
      }
    } catch {
      // If service is currently suspended or unreachable, poll every 4s to auto-recover
      setTimeout(checkServiceHealth, 4000);
    } finally {
      isCheckingHealth = false;
    }
  };

  window.addEventListener('online', checkServiceHealth);
}


if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[ServiceWorker] Registration warning:', err);
    });
  });
}

