import { ThemeConfig, ThemeRegistry } from './ThemeRegistry';

export class ThemeService {
  /**
   * Applies a theme to the canvas configuration and layer collection
   */
  public static applyTheme(
    themeId: string,
    currentCanvasConfig: any,
    currentLayers: any[]
  ): { canvasConfig: any; layers: any[] } {
    const theme = ThemeRegistry.getById(themeId);
    
    // 1. Update general canvas configuration
    const updatedCanvasConfig = {
      ...currentCanvasConfig,
      scene: theme.scene,
      bgStyle: theme.bgStyle,
      fontStyle: theme.fontStyle,
      textColor: 'default', // standard default color handling, let theme classes handle the rest
      themeId: theme.id // save selected theme ID
    };

    // 2. Map and update layers
    let updatedLayers = currentLayers.map((layer) => {
      const updatedLayer = { ...layer };
      
      // Update font style for text layers
      if (layer.type === 'text') {
        updatedLayer.metadata = {
          ...layer.metadata,
          fontStyle: theme.fontStyle,
          color: layer.id === 'layer_title' ? theme.textColor : theme.accentColor,
        };
      }
      
      // Update borders and rounding for images, shapes, tables, memory cards, etc.
      if (layer.type === 'image' || layer.type === 'memory_block') {
        updatedLayer.metadata = {
          ...layer.metadata,
          borderRadius: theme.borderRadius,
          borderStyle: theme.borderStyle,
          borderColor: theme.borderColor,
          borderWidth: theme.borderStyle === 'none' ? 0 : theme.borderWidth,
        };
      }

      if (layer.type === 'shape') {
        updatedLayer.metadata = {
          ...layer.metadata,
          strokeColor: theme.accentColor,
          strokeWidth: theme.borderWidth,
        };
      }

      if (layer.type === 'divider') {
        updatedLayer.metadata = {
          ...layer.metadata,
          dividerStyle: theme.borderStyle === 'double' ? 'double' : (theme.borderStyle === 'none' ? 'solid' : theme.borderStyle),
          color: theme.accentColor,
        };
      }

      return updatedLayer;
    });

    // 3. Update or Add theme header and footer layers
    if (theme.headerText) {
      const hasHeader = updatedLayers.some(l => l.id === 'theme_header');
      if (hasHeader) {
        updatedLayers = updatedLayers.map(l => {
          if (l.id === 'theme_header') {
            return {
              ...l,
              metadata: {
                ...l.metadata,
                text: theme.headerText,
                fontStyle: theme.fontStyle,
                color: theme.accentColor,
              }
            };
          }
          return l;
        });
      } else {
        // Create an elegant small header text layer at the top
        updatedLayers.push({
          id: 'theme_header',
          type: 'text',
          name: 'Theme Header',
          x: 200,
          y: 40,
          width: 600,
          height: 40,
          zIndex: 5,
          metadata: {
            text: theme.headerText,
            fontStyle: theme.fontStyle,
            color: theme.accentColor,
            align: 'center',
            fontSize: 14,
            opacity: 0.8
          }
        });
      }
    } else {
      // Remove header if theme doesn't support it
      updatedLayers = updatedLayers.filter(l => l.id !== 'theme_header');
    }

    if (theme.footerText) {
      const hasFooter = updatedLayers.some(l => l.id === 'theme_footer');
      if (hasFooter) {
        updatedLayers = updatedLayers.map(l => {
          if (l.id === 'theme_footer') {
            return {
              ...l,
              metadata: {
                ...l.metadata,
                text: theme.footerText,
                fontStyle: theme.fontStyle,
                color: theme.accentColor,
              }
            };
          }
          return l;
        });
      } else {
        // Create an elegant small footer text layer at the bottom
        updatedLayers.push({
          id: 'theme_footer',
          type: 'text',
          name: 'Theme Footer',
          x: 200,
          y: 720,
          width: 600,
          height: 40,
          zIndex: 6,
          metadata: {
            text: theme.footerText,
            fontStyle: theme.fontStyle,
            color: theme.accentColor,
            align: 'center',
            fontSize: 12,
            opacity: 0.7
          }
        });
      }
    } else {
      // Remove footer if theme doesn't support it
      updatedLayers = updatedLayers.filter(l => l.id !== 'theme_footer');
    }

    return {
      canvasConfig: updatedCanvasConfig,
      layers: updatedLayers,
    };
  }
}
