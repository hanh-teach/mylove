import { PrintProfile } from './PrintTypes';

export class PrintProfileRegistry {
  private static profiles = new Map<string, PrintProfile>();

  static {
    // Default profiles
    this.register({
      id: 'default',
      name: 'Default Office',
      paper: { size: 'a4', orientation: 'portrait' },
      margins: { type: 'normal', top: 25.4, bottom: 25.4, left: 25.4, right: 25.4 },
      showBleed: false,
      duplex: false,
      borderless: false,
    });
    this.register({
      id: 'photo',
      name: 'Photo Print',
      paper: { size: 'a4', orientation: 'portrait' },
      margins: { type: 'none', top: 0, bottom: 0, left: 0, right: 0 },
      showBleed: true,
      duplex: false,
      borderless: true,
    });
    this.register({
      id: 'pdf',
      name: 'Export to PDF',
      paper: { size: 'a4', orientation: 'portrait' },
      margins: { type: 'narrow', top: 12.7, bottom: 12.7, left: 12.7, right: 12.7 },
      showBleed: false,
      duplex: false,
      borderless: false,
    });
  }

  public static register(profile: PrintProfile) {
    this.profiles.set(profile.id, profile);
  }

  public static get(id: string): PrintProfile | undefined {
    return this.profiles.get(id);
  }

  public static getAll(): PrintProfile[] {
    return Array.from(this.profiles.values());
  }
}
