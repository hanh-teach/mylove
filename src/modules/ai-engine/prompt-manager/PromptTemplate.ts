import { PromptVersion } from './PromptVersion';

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  versions: PromptVersion[];
  activeVersionId: string;
}
