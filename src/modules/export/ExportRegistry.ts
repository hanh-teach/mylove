import { Exporter, ExportFormat } from './ExportTypes';
import { JsonExporter } from './exporters/JsonExporter';
import { ImageExporter, JpgExporter } from './exporters/ImageExporter';
import { PdfExporter, DocxExporter, HtmlExporter } from './exporters/MockExporters';

export class ExportRegistry {
  private static exporters = new Map<ExportFormat, Exporter>();

  private static ensureDefaults() {
    if (this.exporters.size === 0) {
      this.register(new PdfExporter());
      this.register(new ImageExporter());
      this.register(new JpgExporter());
      this.register(new JsonExporter());
      this.register(new DocxExporter());
      this.register(new HtmlExporter());
    }
  }

  public static register(exporter: Exporter) {
    this.exporters.set(exporter.id, exporter);
  }

  public static get(format: ExportFormat): Exporter | undefined {
    this.ensureDefaults();
    return this.exporters.get(format);
  }

  public static getAll(): Exporter[] {
    this.ensureDefaults();
    return Array.from(this.exporters.values());
  }
}

