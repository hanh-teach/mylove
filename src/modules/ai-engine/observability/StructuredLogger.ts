export class StructuredLogger {
  public static log(level: string, message: string, meta: any): void {
    console.log(`[${level}] ${message}`, JSON.stringify(meta));
  }
}
