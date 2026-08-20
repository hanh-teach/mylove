import { Project } from './ProjectModel';
import { Scene } from '../scene/SceneModel';
import { Asset } from '../asset/AssetModel';

export interface ProjectManifest {
  version: string; // Phiên bản của cấu trúc manifest
  project: Project;
  scenes: Scene[];
  assets: Asset[];
  fonts: any[];
  animations: any[];
  metadata: {
    lastModified: number;
    editorVersion: string;
    [key: string]: any;
  };
}
