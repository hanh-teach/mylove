import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';
import { videoRendererEngine } from '../VideoRendererEngine';
import { extractProjectDetails } from '../ExportHelper';

export class VideoExporter implements Exporter {
  id = 'mp4' as const;
  name = 'Video Animation (MP4/WebM)';
  description = 'Xuất video động kèm nhạc nền sống động chuẩn HD 60fps.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const details = extractProjectDetails(data) as any;
      const title = details.title;
      const message = details.message;
      const photoUrl = details.photoUrl || data?.photoUrl;
      const audioUrl = data?.audioUrl || data?.bgMusicUrl;

      const videoBlob = await videoRendererEngine.renderVideo({
        title: title || 'LoveNote Card',
        message: message || '',
        photoUrl: photoUrl || undefined,
        audioUrl: audioUrl || undefined,
        aspectRatio: (options as any).aspectRatio || '16:9',
        resolution: (options as any).resolution || '720p',
        fps: (options as any).fps || 30,
        durationSec: (options as any).durationSec || 4.0,
        particleEffect: (options as any).particleEffect || 'sakura',
      });

      const url = URL.createObjectURL(videoBlob);
      return { success: true, blob: videoBlob, url };
    } catch (error: any) {
      console.error('[VideoExporter] Lỗi khi tạo video:', error);
      return { success: false, error: error?.message || 'Lỗi khi kết xuất video thiệp' };
    }
  }
}

export class WebmExporter implements Exporter {
  id = 'webm' as const;
  name = 'WebM Video';
  description = 'Xuất định dạng WebM tốc độ cao, hỗ trợ trình duyệt hiện đại.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    return new VideoExporter().export(data, options);
  }
}

export class GifExporter implements Exporter {
  id = 'gif' as const;
  name = 'GIF Động (Animated GIF)';
  description = 'Xuất ảnh GIF động nhẹ nhàng, dễ chia sẻ qua Zalo, Messenger, WhatsApp.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const details = extractProjectDetails(data) as any;
      const title = details.title;
      const message = details.message;
      const photoUrl = details.photoUrl || data?.photoUrl;

      const gifBlob = await videoRendererEngine.renderGif({
        title: title || 'LoveNote Card',
        message: message || '',
        photoUrl: photoUrl || undefined,
        aspectRatio: (options as any).aspectRatio || '16:9',
        fps: 15,
        durationSec: (options as any).durationSec || 3.0,
        particleEffect: (options as any).particleEffect || 'sakura',
      });

      const url = URL.createObjectURL(gifBlob);
      return { success: true, blob: gifBlob, url };
    } catch (error: any) {
      console.error('[GifExporter] Lỗi khi tạo GIF:', error);
      return { success: false, error: error?.message || 'Lỗi khi kết xuất ảnh GIF động' };
    }
  }
}
