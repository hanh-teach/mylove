import { manifestManager } from '../../project/ManifestManager';

export class ContextEngine {
  /**
   * Lấy toàn bộ ngữ cảnh dự án và nén lại thành một chuỗi mô tả cho AI.
   */
  public async getProjectContext(projectId: string): Promise<string> {
    try {
      const manifest = manifestManager.generateManifest(projectId);
      
      // Đơn giản hóa manifest để AI dễ đọc mà không tốn quá nhiều token
      const summary = {
        title: manifest.project.title,
        description: manifest.project.description,
        sceneCount: manifest.scenes.length,
        assetCount: manifest.assets.length,
        tags: manifest.project.tags,
        scenes: manifest.scenes.map(s => ({ name: s.name, type: s.type }))
      };

      return JSON.stringify(summary);
    } catch (e) {
      return 'No project context available.';
    }
  }
}

export const contextEngine = new ContextEngine();
