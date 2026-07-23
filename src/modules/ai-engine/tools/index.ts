import { ToolRegistry } from './ToolRegistry';
import { TextGenerationTool } from './concrete/TextGenerationTool';
import { ImageGenerationTool } from './concrete/ImageGenerationTool';
import { VideoGenerationTool } from './concrete/VideoGenerationTool';
import { SQLiteTool } from './concrete/SQLiteTool';
import { ToastTool } from './concrete/ToastTool';
import { ExportTool } from './concrete/ExportTool';

export * from './AITool';
export * from './PermissionManager';
export * from './ToolRegistry';
export * from './ToolResolver';
export * from './MCPAdapter';

// Automatically register all core platform tools
ToolRegistry.register(new TextGenerationTool());
ToolRegistry.register(new ImageGenerationTool());
ToolRegistry.register(new VideoGenerationTool());
ToolRegistry.register(new SQLiteTool());
ToolRegistry.register(new ToastTool());
ToolRegistry.register(new ExportTool());

