import { TemplateConfig, TemplateRegistry } from './TemplateRegistry';
import { ThemeRegistry } from '../theme/ThemeRegistry';
import { Project } from '../workspace/Project';
import { projectService } from '../workspace/ProjectService';

const FAVORITES_KEY = 'canvas_favorite_templates_v1';
const RECENTS_KEY = 'canvas_recent_templates_v1';

export class TemplateService {
  /**
   * Get list of favorite template IDs
   */
  public static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Toggle favorite status of a template
   */
  public static toggleFavorite(templateId: string): string[] {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(templateId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(templateId);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  }

  /**
   * Get list of recently used template IDs
   */
  public static getRecents(): string[] {
    try {
      const stored = localStorage.getItem(RECENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add a template ID to recently used (limit to max 5 items)
   */
  public static addRecent(templateId: string): string[] {
    let recents = this.getRecents();
    // Remove if exists to push to front
    recents = recents.filter(id => id !== templateId);
    recents.unshift(templateId);
    // Limit to 5
    if (recents.length > 5) {
      recents = recents.slice(0, 5);
    }
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    return recents;
  }

  /**
   * Search templates by query string (checks name, category, subcategory, tags)
   */
  public static search(query: string): TemplateConfig[] {
    const all = TemplateRegistry.getAll();
    if (!query.trim()) return all;
    
    const q = query.toLowerCase().trim();
    return all.filter(tmpl => 
      tmpl.name.toLowerCase().includes(q) ||
      tmpl.category.toLowerCase().includes(q) ||
      tmpl.subcategory.toLowerCase().includes(q) ||
      tmpl.description.toLowerCase().includes(q) ||
      tmpl.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  /**
   * Instantiates a new project based on a template configuration
   */
  public static createProjectFromTemplate(
    templateId: string,
    customTitle?: string
  ): Project {
    const tmpl = TemplateRegistry.getById(templateId);
    const theme = ThemeRegistry.getById(tmpl.themeId);
    
    const projectTitle = customTitle?.trim() || `My ${tmpl.subcategory}`;
    
    // Choose a nice default icon for the project based on subcategory
    let icon = '📁';
    if (tmpl.subcategory === 'Journal' || tmpl.subcategory === 'Diary' || tmpl.subcategory === 'Daily Notes') icon = '📖';
    else if (tmpl.subcategory === 'Teacher Appreciation' || tmpl.subcategory === 'Graduation') icon = '🎓';
    else if (tmpl.subcategory === 'Certificate') icon = '📜';
    else if (tmpl.subcategory === 'Birthday') icon = '🎂';
    else if (tmpl.subcategory === 'Greeting Card') icon = '💌';
    else if (tmpl.subcategory === 'Family Album') icon = '🌸';
    else if (tmpl.subcategory === 'Thank You Letter') icon = '🤝';
    else if (tmpl.subcategory === 'Invitation') icon = '✉️';
    
    // Create project using Workspace service
    const project = projectService.createProject(
      projectTitle,
      'custom', // general flexible format
      tmpl.category,
      theme.accentColor,
      icon,
      tmpl.description
    );

    // Now enrich project content with the template layers
    // Map template layers so they can be loaded instantly in the Canvas
    const layers = tmpl.layers.map(layer => {
      // Keep layers exactly as defined in the template config
      return {
        ...layer,
        id: layer.id.startsWith('layer_') ? layer.id : `${layer.id}_${Date.now()}`
      };
    });

    // Extract title text and message text if available to populate simple fields as fallback
    const titleLayer = layers.find(l => l.id === 'layer_title');
    const msgLayer = layers.find(l => l.id === 'layer_message');

    const updatedContent = {
      title: titleLayer?.metadata?.text || projectTitle,
      message: msgLayer?.metadata?.text || tmpl.description,
      placedItems: [], // Layers are directly used instead
      scene: theme.scene,
      bgStyle: theme.bgStyle,
      fontStyle: theme.fontStyle,
      textColor: 'default',
    };

    // Update active project with enriched details and layers metadata
    projectService.updateActiveProjectContent(updatedContent);
    projectService.updateActiveProject({
      metadata: {
        templateId: tmpl.id,
        themeId: theme.id,
        layers: layers // This will be loaded by StudioEditor
      }
    });

    // Record usage
    this.addRecent(tmpl.id);

    return projectService.getActiveProject()!;
  }
}
