
import { idbAdapter } from './IndexedDbAdapter';

const MIGRATION_FLAG = 'lovenote_idb_migrated_v1';

export const FIXED_KEYS = [
  'ai_assist_enabled',
  'lovenote_active_workflow_session',
  'lovenote-ai-assist-enabled',
  'lovenote-app-notif-enabled',
  'lovenote_draft_fallback',
  'lovenote-email-notif-enabled',
  'lovenote_generation_history',
  'lovenote-language',
  'love_note_memories_v2',
  'lovenote_people',
  'lovenote_places',
  'love_note_recent_commands',
  'lovenote_relationships',
  'lovenote-theme-mode',
  'love_note_timeline_ai_sources_v1',
  'lovenote_versions_fallback',
  'love_note_project_assets_v59',
  'love_note_tags_v2',
  'love_note_collections_v2',
  'love_note_studio_timeline_items_v1',
  'love_note_studio_timelines_v1',
  'lovenote_active_project_id_v58',
  'lovenote_dismissed_duplicates_v1',
  'lovenote_dismissed_suggestions_v1',
  'lovenote_ai_memory',
  'lovenote_agent_plans',
  'lovenote_agent_activity',
  'lovenote_command_history',
  'lovenote_automations',
  'lovenote_search_history',
  'lovenote_saved_searches',
  'lovenote_workspace_projects_v58',
  'lovenote_smart_templates',
  'lovenote_knowledge_items',
  'canvas_favorite_templates_v1',
  'canvas_recent_templates_v1',
  'lovenote_drafts_v4',
  'lovenote_active_draft_id_v4',
  'love_note_editor_draft_v4',
  'love_note_editor_ignore_draft',
  'lovenote_last_screen_v4',
  'lovenote_ai_studio_draft',
];

export async function migrateLocalStorageToIndexedDb(): Promise<void> {
  if (localStorage.getItem(MIGRATION_FLAG) === 'true') {
    return;
  }

  try {
    // 1. Migrate Fixed Keys
    for (const key of FIXED_KEYS) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        await idbAdapter.set(key, value);
      }
    }

    // 2. Migrate Dynamic Pattern Keys
    const allKeys = Object.keys(localStorage);
    const dynamicPatterns = ['lovenote_runtime_session_', 'timeline_draft_data_'];
    
    for (const key of allKeys) {
      if (dynamicPatterns.some(pattern => key.startsWith(pattern))) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          await idbAdapter.set(key, value);
        }
      }
    }

    // 3. Mark as migrated
    localStorage.setItem(MIGRATION_FLAG, 'true');
    console.log('Migration to IndexedDB completed successfully.');
  } catch (error) {
    console.error('Migration to IndexedDB failed:', error);
    // Keep using localStorage if migration fails
  }
}
