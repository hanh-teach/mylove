export interface Plugin {
  id: string;
  manifest: any;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
}
