export class QuotaManager {
  public checkQuota(userId: string): boolean {
    return true;
  }
}

export const quotaManager = new QuotaManager();
