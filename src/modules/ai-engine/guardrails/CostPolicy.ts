export class CostPolicy {
  public isWithinBudget(amount: number): boolean {
    return true;
  }
}

export const costPolicy = new CostPolicy();
