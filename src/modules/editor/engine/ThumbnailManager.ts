export class ThumbnailManager {
  private worker: Worker | null = null;
  private readonly WIDTH = 512;
  private readonly HEIGHT = 512;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      const workerCode = `
        self.onmessage = async (e) => {
          const { id, type, data, width, height } = e.data;
          if (type === 'generate') {
            try {
              if (typeof OffscreenCanvas === 'undefined') {
                throw new Error('OffscreenCanvas not supported');
              }
              const canvas = new OffscreenCanvas(width, height);
              const ctx = canvas.getContext('2d');
              if (!ctx) throw new Error('Could not get 2D context');

              // Fill canvas background
              ctx.fillStyle = data?.background || data?.backgroundColor || '#ffffff';
              ctx.fillRect(0, 0, width, height);

              const layers = data?.layers || data?.elements || (Array.isArray(data) ? data : []);

              for (const layer of layers) {
                if (layer.visible === false) continue;

                ctx.save();
                ctx.globalAlpha = typeof layer.opacity === 'number' ? layer.opacity : 1;

                const x = layer.x || 0;
                const y = layer.y || 0;
                const w = layer.width || 100;
                const h = layer.height || 100;

                if (layer.rotation) {
                  ctx.translate(x + w / 2, y + h / 2);
                  ctx.rotate((layer.rotation * Math.PI) / 180);
                  ctx.translate(-w / 2, -h / 2);
                } else {
                  ctx.translate(x, y);
                }

                const layerType = layer.type || 'shape';
                if (layerType === 'image' || layerType === 'decor' || layerType === 'sticker') {
                  const imgSrc = layer.src || layer.url || layer.imageUrl;
                  let loaded = false;
                  if (imgSrc) {
                    try {
                      const res = await fetch(imgSrc);
                      const blob = await res.blob();
                      const bitmap = await createImageBitmap(blob);
                      ctx.drawImage(bitmap, 0, 0, w, h);
                      loaded = true;
                    } catch (err) {}
                  }
                  if (!loaded) {
                    ctx.fillStyle = '#e2e8f0';
                    ctx.fillRect(0, 0, w, h);
                  }
                } else if (layerType === 'text') {
                  ctx.fillStyle = layer.metadata?.color || layer.color || layer.fill || '#000000';
                  const fontSize = layer.metadata?.fontSize || layer.fontSize || 16;
                  const fontFamily = layer.metadata?.fontFamily || layer.metadata?.fontStyle || layer.fontFamily || 'sans-serif';
                  const fontWeight = layer.metadata?.fontWeight || layer.fontWeight || 'normal';
                  const textVal = layer.metadata?.text || layer.text || layer.content || '';
                  ctx.font = \`\${fontWeight} \${fontSize}px \${fontFamily}\`;
                  ctx.textBaseline = 'top';
                  ctx.fillText(textVal, 0, 0, w);
                } else {
                  ctx.fillStyle = layer.fill || layer.color || layer.backgroundColor || '#cbd5e1';
                  ctx.fillRect(0, 0, w, h);
                }

                ctx.restore();
              }

              const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
              const reader = new FileReaderSync();
              const dataUrl = reader.readAsDataURL(blob);

              self.postMessage({ id, status: 'success', dataUrl });
            } catch (error) {
              self.postMessage({ id, status: 'error', error: error ? error.message : 'Render failed' });
            }
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      console.warn('Web Workers not supported, falling back to main thread async.');
    }
  }

  private async renderThumbnailMainThread(sceneData: any, width: number, height: number): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');

    ctx.fillStyle = sceneData?.background || sceneData?.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const layers = sceneData?.layers || sceneData?.elements || (Array.isArray(sceneData) ? sceneData : []);

    for (const layer of layers) {
      if (layer.visible === false) continue;

      ctx.save();
      ctx.globalAlpha = typeof layer.opacity === 'number' ? layer.opacity : 1;

      const x = layer.x || 0;
      const y = layer.y || 0;
      const w = layer.width || 100;
      const h = layer.height || 100;

      if (layer.rotation) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.translate(-w / 2, -h / 2);
      } else {
        ctx.translate(x, y);
      }

      const layerType = layer.type || 'shape';
      if (layerType === 'image' || layerType === 'decor' || layerType === 'sticker') {
        const imgSrc = layer.src || layer.url || layer.imageUrl;
        let loaded = false;
        if (imgSrc) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imgSrc;
            });
            ctx.drawImage(img, 0, 0, w, h);
            loaded = true;
          } catch (e) {}
        }
        if (!loaded) {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(0, 0, w, h);
        }
      } else if (layerType === 'text') {
        ctx.fillStyle = layer.metadata?.color || layer.color || layer.fill || '#000000';
        const fontSize = layer.metadata?.fontSize || layer.fontSize || 16;
        const fontFamily = layer.metadata?.fontFamily || layer.metadata?.fontStyle || layer.fontFamily || 'sans-serif';
        const fontWeight = layer.metadata?.fontWeight || layer.fontWeight || 'normal';
        const textVal = layer.metadata?.text || layer.text || layer.content || '';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'top';
        ctx.fillText(textVal, 0, 0, w);
      } else {
        ctx.fillStyle = layer.fill || layer.color || layer.backgroundColor || '#cbd5e1';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();
    }

    return canvas.toDataURL('image/webp', 0.8);
  }

  /**
   * Generates a 512x512 WebP thumbnail in the background.
   */
  public async generateThumbnail(sceneData: any): Promise<string> {
    if (!this.worker) {
      return this.renderThumbnailMainThread(sceneData, this.WIDTH, this.HEIGHT);
    }

    return new Promise((resolve) => {
      const taskId = `thumb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === taskId) {
          this.worker?.removeEventListener('message', handleMessage);
          if (e.data.status === 'success') {
            resolve(e.data.dataUrl);
          } else {
            // Fallback on worker error
            this.renderThumbnailMainThread(sceneData, this.WIDTH, this.HEIGHT)
              .then(resolve)
              .catch(() => resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='));
          }
        }
      };

      this.worker.addEventListener('message', handleMessage);
      this.worker.postMessage({
        id: taskId,
        type: 'generate',
        data: sceneData,
        width: this.WIDTH,
        height: this.HEIGHT
      });
    });
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
