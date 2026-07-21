import { CanvasEngine } from './CanvasEngine';
import { LayerManager } from './LayerManager';
import { HistoryManager } from './HistoryManager';
import { SelectionManager } from './SelectionManager';
import { TransformManager } from './TransformManager';
import { GridManager } from './GridManager';
import { ZoomManager } from './ZoomManager';
import { AutoSaveManager } from './AutoSaveManager';
import { ExportManager } from './ExportManager';
import { ClipboardManager } from './ClipboardManager';
import { ShortcutManager } from './ShortcutManager';
import { PerformanceManager } from './PerformanceManager';
import { PluginManager } from './PluginManager';
import { ThumbnailManager } from './ThumbnailManager';
import { aiFacade, AIFacade } from '../../ai-engine';

export class EditorEngine {
  public canvas: CanvasEngine;
  public layers: LayerManager;
  public history: HistoryManager;
  public selection: SelectionManager;
  public transform: TransformManager;
  public grid: GridManager;
  public zoom: ZoomManager;
  public autoSave: AutoSaveManager;
  public export: ExportManager;
  public clipboard: ClipboardManager;
  public shortcut: ShortcutManager;
  public performance: PerformanceManager;
  public plugin: PluginManager;
  public thumbnail: ThumbnailManager;
  public ai: AIFacade;

  constructor() {
    this.canvas = new CanvasEngine();
    this.layers = new LayerManager();
    this.history = new HistoryManager();
    this.selection = new SelectionManager();
    this.transform = new TransformManager();
    this.grid = new GridManager();
    this.zoom = new ZoomManager();
    this.autoSave = new AutoSaveManager();
    this.export = new ExportManager();
    this.clipboard = new ClipboardManager();
    this.shortcut = new ShortcutManager();
    this.performance = new PerformanceManager();
    this.plugin = new PluginManager();
    this.thumbnail = new ThumbnailManager();
    this.ai = aiFacade;
  }
}
