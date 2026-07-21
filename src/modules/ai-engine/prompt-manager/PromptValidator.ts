import { PromptVersion } from './PromptVersion';

export class PromptValidator {
  public validate(version: PromptVersion, variables: Record<string, string>): boolean {
    // Check if all required variables are present
    for (const variable of version.variables) {
      if (!variables[variable]) {
        console.error(`[PromptValidator] Missing variable: ${variable}`);
        return false;
      }
    }
    return true;
  }
}

export const promptValidator = new PromptValidator();
