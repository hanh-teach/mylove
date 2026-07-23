import React from 'react';
import { Heart, Star, Smile, Gift, Sparkles, Cake, Users, Flower2, Music, VolumeX, Coffee, TreePine, Flower, Leaf } from 'lucide-react';
import { FontStyleType, DecorType, SceneType } from '../types';

// Placeholder for missing assets
const coupleImg = undefined;
const bouquetImg = undefined;
const balloonImg = undefined;
const letterImg = undefined;
const birdsImg = undefined;

export const fontRegistry: Record<FontStyleType, { label: string; class: string }> = {
  playfair: { label: 'Sang trọng', class: 'font-playfair' },
  dancing: { label: 'Nghệ thuật', class: 'font-dancing' },
  pacifico: { label: 'Dễ thương', class: 'font-pacifico' },
  caveat: { label: 'Viết tay', class: 'font-caveat' },
  lora: { label: 'Cổ điển', class: 'font-lora' },
  nunito: { label: 'Hiện đại', class: 'font-nunito' },
};

export const musicTracks = [
  { id: 'none', label: 'Tắt nhạc', icon: VolumeX, url: '' },
  { id: 'romantic', label: 'Ấm áp', icon: Heart, url: 'https://archive.org/download/LaCordaDoro-CanonInDMajor/05Pachelbel-CanonInDMajor.mp3' },
  { id: 'birthday', label: 'Sinh nhật', icon: Gift, url: 'https://archive.org/download/HappyBirthdayInstrumentalPianoViaInstrumentals.com.ng/Happy%20Birthday%20Instrumental%20Piano%20via%20instrumentals.com.ng.mp3' },
  { id: 'lofi', label: 'Nhẹ nhàng', icon: Coffee, url: 'https://archive.org/download/lofi-study/lofi-study.mp3' },
  { id: 'acoustic', label: 'Mộc mạc', icon: TreePine, url: 'https://archive.org/download/acoustic-vlog-music-chasing-the-breeze/Acoustic%20Vlog%20Music%20-%20Chasing%20the%20Breeze%20-%20by%20BMNC.mp3' },
  { id: 'ai-magic', label: 'Giai điệu diệu kỳ', icon: Sparkles, url: 'https://archive.org/download/cosmic_dharma_magic_forest_zen_garden/magic_forest.mp3' },
  { id: 'ai-piano', label: 'Piano thư giãn', icon: Music, url: 'https://archive.org/download/elfen-lied-op-lilium-piano-solo/Elfen%20Lied%20OP%20-%20Lilium%20%28Piano%20Solo%29.mp3' }
];

export const decorRegistry: Record<DecorType, { type: 'icon' | 'image', content: any }> = {
  Heart: { type: 'icon', content: Heart },
  Star: { type: 'icon', content: Star },
  Smile: { type: 'icon', content: Smile },
  Gift: { type: 'icon', content: Gift },
  Sparkles: { type: 'icon', content: Sparkles },
  Cake: { type: 'icon', content: Cake },
  Users: { type: 'icon', content: Users },
  Flower2: { type: 'icon', content: Flower2 },
  Couple: { type: 'image', content: coupleImg },
  Bouquet: { type: 'image', content: bouquetImg },
  Balloon: { type: 'image', content: balloonImg },
  Letter: { type: 'image', content: letterImg },
  Birds: { type: 'image', content: birdsImg }
};

export const sceneConfig: Record<SceneType, { bg: string; text: string; secondary: string; accent: string; button: string; icon: React.ReactNode }> = {
  rose: { bg: 'bg-rose-100', text: 'text-rose-950', secondary: 'text-rose-900', accent: 'text-rose-500', button: 'bg-rose-600', icon: React.createElement(Flower, { className: 'text-rose-400' }) },
  garden: { bg: 'bg-emerald-100', text: 'text-emerald-950', secondary: 'text-emerald-900', accent: 'text-emerald-500', button: 'bg-emerald-700', icon: React.createElement(Leaf, { className: 'text-emerald-400' }) },
  forest: { bg: 'bg-emerald-900', text: 'text-emerald-50', secondary: 'text-emerald-200', accent: 'text-emerald-400', button: 'bg-emerald-700', icon: React.createElement(Flower, { className: 'text-emerald-300' }) },
  sunset: { bg: 'bg-orange-200', text: 'text-orange-950', secondary: 'text-orange-900', accent: 'text-orange-500', button: 'bg-orange-700', icon: React.createElement(Sparkles, { className: 'text-orange-400' }) },
  ocean: { bg: 'bg-blue-200', text: 'text-blue-950', secondary: 'text-blue-900', accent: 'text-blue-500', button: 'bg-blue-700', icon: React.createElement(Star, { className: 'text-blue-400' }) },
  sakura: { bg: 'bg-pink-200', text: 'text-pink-950', secondary: 'text-pink-900', accent: 'text-pink-500', button: 'bg-pink-700', icon: React.createElement(Flower2, { className: 'text-pink-400' }) },
  sky: { bg: 'bg-sky-200', text: 'text-sky-950', secondary: 'text-sky-900', accent: 'text-sky-500', button: 'bg-sky-700', icon: React.createElement(Smile, { className: 'text-sky-400' }) },
  plain: { bg: 'bg-white', text: 'text-slate-900', secondary: 'text-slate-700', accent: 'text-slate-400', button: 'bg-slate-800', icon: React.createElement(Heart, { className: 'text-slate-400' }) },
};

export const textColors = [
  { id: 'default', label: 'Mặc định', textClass: '', secondaryClass: '' },
  { id: 'red', label: 'Đỏ', textClass: 'text-red-600', secondaryClass: 'text-red-500' },
  { id: 'pink', label: 'Hồng', textClass: 'text-pink-600', secondaryClass: 'text-pink-500' },
  { id: 'purple', label: 'Tím', textClass: 'text-purple-600', secondaryClass: 'text-purple-500' },
  { id: 'blue', label: 'Xanh dương', textClass: 'text-blue-600', secondaryClass: 'text-blue-500' },
  { id: 'emerald', label: 'Xanh ngọc', textClass: 'text-emerald-700', secondaryClass: 'text-emerald-600' },
  { id: 'slate', label: 'Đen', textClass: 'text-slate-800', secondaryClass: 'text-slate-700' },
  { id: 'white', label: 'Trắng', textClass: 'text-white', secondaryClass: 'text-white/90' },
];
