export class EventLogger {
  public static log(event: string, meta: any): void {
    console.log(`[EventLogger] ${event}`, JSON.stringify(meta));
  }
}
