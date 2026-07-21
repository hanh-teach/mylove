export interface PromptVersion {
  id: string;
  templateId: string;
  version: string; // SemVer
  status: 'draft' | 'published' | 'archived';
  provider: string;
  supportedModels: string[];
  language: string;
  tags: string[];
  variables: string[];
  template: {
    system?: string;
    developer?: string;
    user: string;
  };
  examples: any[];
  expectedOutput: string;
  validationRules: any;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  changelog: string;
  metadata: Record<string, any>;
}
