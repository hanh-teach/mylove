import { ExportService } from '../../export/ExportService';
import { ExportOptions } from '../../export/ExportTypes';

export class ExportEditorUseCase {
  static async execute(projectId: string, data: any, options: ExportOptions): Promise<string> {
    return await ExportService.export(projectId, data, options);
  }
}
