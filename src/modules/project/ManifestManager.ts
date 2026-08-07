import { projectStore } from './ProjectStore';
import { sceneStore } from '../scene/SceneStore';
import { assetStore } from '../asset/AssetStore';
import { ProjectManifest } from './ManifestModel';

export class ManifestManager {
  /**
   * Tạo tệp manifest đầy đủ cho một project.
   */
  public generateManifest(projectId: string): ProjectManifest {
    const project = projectStore.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const scenes = sceneStore.getScenes(projectId);
    
    // Lấy danh sách asset được sử dụng bởi các scene này
    const allAssets = assetStore.getAssets();
    const projectAssets = allAssets.filter(asset => 
      asset.usedBy && asset.usedBy.some(entityId => 
        entityId === projectId || scenes.some(s => s.id === entityId)
      )
    );

    return {
      version: '1.0.0',
      project,
      scenes,
      assets: projectAssets,
      fonts: [], // Có thể mở rộng để lấy font từ store riêng
      animations: [], // Có thể mở rộng
      metadata: {
        lastModified: Date.now(),
        editorVersion: '1.0.0',
      },
    };
  }

  /**
   * Nhập (Import) một project từ manifest vào hệ thống.
   */
  public loadFromManifest(manifest: ProjectManifest): void {
    // 1. Lưu Project metadata
    projectStore.addProject(manifest.project);

    // 2. Lưu Assets (tránh duplicate dựa trên hash)
    manifest.assets.forEach(asset => {
      const existing = assetStore.getAssetByHash(asset.hash);
      if (!existing) {
        assetStore.addAsset(asset);
      }
    });

    // 3. Lưu Scenes
    manifest.scenes.forEach(scene => {
      sceneStore.addScene(scene);
    });

    // Tự động đặt làm project hiện tại
    projectStore.setActiveProject(manifest.project.id);
    
    console.log(`Project "${manifest.project.title}" loaded successfully from manifest.`);
  }

  /**
   * Xuất manifest dưới dạng tệp JSON để tải về hoặc gửi lên server.
   */
  public exportAsJSON(projectId: string): string {
    const manifest = this.generateManifest(projectId);
    return JSON.stringify(manifest, null, 2);
  }
}

export const manifestManager = new ManifestManager();
