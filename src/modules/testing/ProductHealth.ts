export type HealthStatus = 'healthy' | 'warning' | 'error';

export const getModuleStatus = (module: string): HealthStatus => {
  // MOCK: chưa kết nối health-check thật, luôn trả 'healthy'
  return 'healthy';
};
