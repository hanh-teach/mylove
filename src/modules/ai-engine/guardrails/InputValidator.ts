export class InputValidator {
  public validate(prompt: string): boolean {
    return prompt.length > 0 && prompt.length < 8192;
  }
}

export const inputValidator = new InputValidator();
