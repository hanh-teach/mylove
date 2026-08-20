import React, { ComponentType, lazy, LazyExoticComponent } from 'react';
import { safeSessionStorage } from './safeStorage';

export type PreloadableComponent<T extends ComponentType<any>> = LazyExoticComponent<T> & {
  preload: () => Promise<any>;
};

function resolveComponentExport(module: any, componentName?: string): { default: any } {
  if (!module) {
    throw new Error(`Module ${componentName || 'dynamic'} resolved to empty`);
  }
  // Standard default export
  if (module.default) {
    return { default: module.default };
  }
  // Named export matching componentName
  if (componentName && module[componentName]) {
    return { default: module[componentName] };
  }
  // Search for first function or object export
  const keys = Object.keys(module);
  for (const key of keys) {
    if (typeof module[key] === 'function' || (typeof module[key] === 'object' && module[key]?.$$typeof)) {
      return { default: module[key] };
    }
  }
  return { default: module };
}

/**
 * Wraps React.lazy with retry capability and graceful handling for dynamic chunk load errors
 * (e.g., when a new deployment updates the asset chunk hashes or network fluctuations occur).
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | any>,
  componentName?: string
): PreloadableComponent<T> {
  const load = async (): Promise<{ default: T }> => {
    let pageHasAlreadyBeenForceRefreshed = false;
    try {
      pageHasAlreadyBeenForceRefreshed = JSON.parse(
        safeSessionStorage.getItem(`retry_lazy_${componentName || 'chunk'}`) || 'false'
      );
    } catch {
      pageHasAlreadyBeenForceRefreshed = false;
    }

    try {
      const module = await componentImport();
      if (componentName) {
        safeSessionStorage.setItem(`retry_lazy_${componentName}`, 'false');
      }
      return resolveComponentExport(module, componentName) as { default: T };
    } catch (error: any) {
      console.warn(`[lazyWithRetry] Lỗi nạp module ${componentName || 'dynamic'}:`, error);

      // Check if error is chunk load failure or dynamic import fetch failure
      const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Importing a module script failed') ||
        error?.name === 'ChunkLoadError' ||
        error?.message?.includes('Loading chunk');

      if (isChunkError && !pageHasAlreadyBeenForceRefreshed && typeof window !== 'undefined') {
        safeSessionStorage.setItem(`retry_lazy_${componentName || 'chunk'}`, 'true');
        window.location.reload();
        return new Promise(() => {}); // Wait for reload
      }

      // If we already refreshed or cannot refresh, retry once directly after 200ms
      await new Promise((resolve) => setTimeout(resolve, 200));
      try {
        const retryModule = await componentImport();
        return resolveComponentExport(retryModule, componentName) as { default: T };
      } catch (retryError) {
        console.error(`[lazyWithRetry] Thử lại nạp module ${componentName || 'dynamic'} thất bại:`, retryError);
        throw retryError;
      }
    }
  };

  const LazyComponent = lazy(load) as PreloadableComponent<T>;
  LazyComponent.preload = componentImport;
  return LazyComponent;
}


