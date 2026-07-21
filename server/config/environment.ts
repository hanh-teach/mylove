export type EnvironmentType = 'development' | 'staging' | 'production';

export class Environment {
  /**
   * Returns the current application environment level.
   */
  public static get current(): EnvironmentType {
    const env = (process.env.NODE_ENV || 'development').toLowerCase().trim();
    if (env === 'production' || env === 'prod') {
      return 'production';
    }
    if (env === 'staging' || env === 'stage') {
      return 'staging';
    }
    return 'development';
  }

  /**
   * Helper to check if current environment is Development
   */
  public static get isDevelopment(): boolean {
    return this.current === 'development';
  }

  /**
   * Helper to check if current environment is Staging
   */
  public static get isStaging(): boolean {
    return this.current === 'staging';
  }

  /**
   * Helper to check if current environment is Production
   */
  public static get isProduction(): boolean {
    return this.current === 'production';
  }
}
