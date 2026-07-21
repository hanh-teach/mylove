export type ClientEnvironmentType = 'development' | 'staging' | 'production';

export class ClientEnvironment {
  /**
   * Retrieves the current client-side execution environment stage.
   * Maps Vite modes to standard corporate stages.
   */
  public static get current(): ClientEnvironmentType {
    const mode = (import.meta.env.MODE || 'development').toLowerCase().trim();
    if (mode === 'production' || mode === 'prod') {
      return 'production';
    }
    if (mode === 'staging' || mode === 'stage' || import.meta.env.VITE_USER_NODE_ENV === 'staging') {
      return 'staging';
    }
    return 'development';
  }

  /**
   * Check if frontend is running in Development mode
   */
  public static get isDevelopment(): boolean {
    return this.current === 'development';
  }

  /**
   * Check if frontend is running in Staging mode
   */
  public static get isStaging(): boolean {
    return this.current === 'staging';
  }

  /**
   * Check if frontend is running in Production mode
   */
  public static get isProduction(): boolean {
    return this.current === 'production';
  }
}
