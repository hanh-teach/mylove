export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  permissions: string[];
  dependencies: string[];
  entry: string;
}
