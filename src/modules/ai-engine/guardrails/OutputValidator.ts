export class OutputValidator {
  public validate(response: string): boolean {
    return response.length > 0;
  }
}

export const outputValidator = new OutputValidator();
