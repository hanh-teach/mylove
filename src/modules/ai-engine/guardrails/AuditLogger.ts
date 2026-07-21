export class AuditLogger {
  public log(data: any) {
    console.log('[Audit]', JSON.stringify(data));
  }
}

export const auditLogger = new AuditLogger();
