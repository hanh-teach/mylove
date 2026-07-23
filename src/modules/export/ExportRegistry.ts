import { Exporter, ExportFormat } from './ExportTypes';

export class ExportRegistry {
  private static exporters = new Map<ExportFormat, Exporter>();

  public static register(exporter: Exporter) {
    this.exporters.set(exporter.id, exporter);
  }

  public static get(format: ExportFormat): Exporter | undefined {
    return this.exporters.get(format);
  }

  public static getAll(): Exporter[] {
    return Array.from(this.exporters.values());
  }
}
