import { describe, it, expect } from 'vitest';
import { VersionManager } from './VersionManager';

describe('VersionManager - JSON Patch Validation', () => {
  const manager = new VersionManager();

  it('should successfully apply a valid patch', () => {
    const state = { title: 'Old Title', count: 5 };
    const patches = [
      { op: 'replace', path: '/title', value: 'New Title' },
      { op: 'add', path: '/description', value: 'Cool app' }
    ];

    const result = (manager as any).applyDiff(state, patches);
    expect(result).toEqual({ title: 'New Title', count: 5, description: 'Cool app' });
  });

  it('should throw clear error on invalid patch structure (missing op)', () => {
    const patches = [
      { path: '/title', value: 'New Title' }
    ];

    expect(() => {
      (manager as any).validatePatches(patches);
    }).toThrow("[VersionManager] Validation failed: Patch at index 0 is missing an 'op' string");
  });

  it('should throw clear error on invalid patch structure (invalid op)', () => {
    const patches = [
      { op: 'destroy', path: '/title', value: 'New Title' }
    ];

    expect(() => {
      (manager as any).validatePatches(patches);
    }).toThrow("[VersionManager] Validation failed: Patch at index 0 has invalid op 'destroy'");
  });

  it('should throw clear error on missing path', () => {
    const patches = [
      { op: 'replace', value: 'New Title' }
    ];

    expect(() => {
      (manager as any).validatePatches(patches);
    }).toThrow("[VersionManager] Validation failed: Patch at index 0 has invalid or missing 'path'");
  });

  it('should throw clear error on missing value for add/replace ops', () => {
    const patches = [
      { op: 'replace', path: '/title' }
    ];

    expect(() => {
      (manager as any).validatePatches(patches);
    }).toThrow("[VersionManager] Validation failed: Patch at index 0 of op 'replace' is missing 'value' field");
  });

  it('should throw clear error on missing or invalid from path for move/copy ops', () => {
    const patches = [
      { op: 'move', path: '/title', from: 'title' }
    ];

    expect(() => {
      (manager as any).validatePatches(patches);
    }).toThrow("[VersionManager] Validation failed: Patch at index 0 of op 'move' is missing or invalid 'from' path");
  });
});
