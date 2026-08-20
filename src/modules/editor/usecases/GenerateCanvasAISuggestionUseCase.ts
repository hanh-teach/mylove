import { CanvasAIService } from '../services/CanvasAIService';
import { CanvasLayerMetadataUseCase } from './CanvasLayerMetadataUseCase';
import { ILayer } from '../LayerTypes';

export class GenerateCanvasAISuggestionUseCase {
  static async execute(
    targetLayer: ILayer,
    onUpdateLayer: (id: string, updates: Partial<ILayer>) => void
  ): Promise<void> {
    // 1. Set generating status
    const pendingUpdates = CanvasLayerMetadataUseCase.setAISuggestionState(
      targetLayer,
      'generating',
      'Agnes AI đang tạo gợi ý...'
    );
    onUpdateLayer(targetLayer.id, pendingUpdates);

    // 2. Call service
    const promptText = targetLayer.metadata?.prompt || 'Chúc người thương';
    const result = await CanvasAIService.generateSuggestion({ prompt: promptText });

    // 3. Set result status
    const successUpdates = CanvasLayerMetadataUseCase.setAISuggestionState(
      targetLayer,
      'success',
      result.suggestion,
      result.isSimulated
    );
    onUpdateLayer(targetLayer.id, successUpdates);
  }
}
