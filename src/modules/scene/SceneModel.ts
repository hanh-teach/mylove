import { SceneType } from '../../shared/types';

export interface SceneTransition {
  type: 'none' | 'fade' | 'slide' | 'zoom' | 'wipe';
  duration: number; // in milliseconds
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface SceneBackground {
  type: 'solid' | 'gradient' | 'image' | 'video';
  value: string; // color, gradient string, or asset URL
}

export interface SceneAnimation {
  entry?: string;
  exit?: string;
}

export interface SceneAudio {
  assetId: string;
  volume: number;
  loop: boolean;
}

export interface Scene {
  id: string;
  projectId: string;
  name: string;
  duration: number; // in milliseconds (useful for video/slideshow)
  thumbnail: string;
  transition: SceneTransition;
  background: SceneBackground;
  layers: string[]; // Array of Layer IDs
  animation: SceneAnimation;
  music?: SceneAudio;
  voice?: SceneAudio;
  type: SceneType;
  isHidden: boolean;
  isLocked: boolean;
  order: number;
}
