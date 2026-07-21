export interface PromptTemplateData {
  id: string;
  name: string;
  version: string;
  system?: string;
  developer?: string;
  user: string;
  defaults?: Record<string, string>;
}

export class PromptTemplate {
  constructor(public data: PromptTemplateData) {}

  public get id() { return this.data.id; }
  public get version() { return this.data.version; }
  
  public getSystem() { return this.data.system || ''; }
  public getDeveloper() { return this.data.developer || ''; }
  public getUser() { return this.data.user; }
}
