import React from 'react';
import { Heart, Star, Smile, Gift, Sparkles, Cake, Users, Flower2, Music, VolumeX, Coffee, TreePine, Flower, Leaf } from 'lucide-react';
import { FontStyleType, DecorType, SceneType, FontRegistryItem } from '../types';

// Placeholder for missing assets
const coupleImg = undefined;
const bouquetImg = undefined;
const balloonImg = undefined;
const letterImg = undefined;
const birdsImg = undefined;

export const fontRegistry: Record<FontStyleType, FontRegistryItem> = {
  playfair: { label: 'Sang trọng', class: 'font-playfair', name: 'Playfair Display', sample: 'Love Note 2026' },
  lobster: { label: 'Nổi bật', class: 'font-lobster', name: 'Lobster', sample: 'Chúc Mừng Hạnh Phúc' },
  merriweather: { label: 'Thanh lịch', class: 'font-merriweather', name: 'Merriweather', sample: 'Kỷ niệm khó phai' },
  dancing: { label: 'Nghệ thuật', class: 'font-dancing', name: 'Dancing Script', sample: 'Forever & Always' },
  pacifico: { label: 'Dễ thương', class: 'font-pacifico', name: 'Pacifico', sample: 'Mãi bên nhau nhé' },
  caveat: { label: 'Viết tay', class: 'font-caveat', name: 'Caveat', sample: 'Gửi người tôi yêu...' },
  lora: { label: 'Cổ điển', class: 'font-lora', name: 'Lora', sample: 'Những ngày êm đềm' },
  nunito: { label: 'Hiện đại', class: 'font-nunito', name: 'Nunito', sample: '21 Tháng 7, 2026' },
};

export const musicTracks = [
  { id: 'none', label: 'Tắt nhạc', icon: VolumeX, url: '' },
  { id: 'romantic', label: 'Ấm áp (Piano)', icon: Heart, url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3' },
  { id: 'birthday', label: 'Sinh nhật (Vui tươi)', icon: Gift, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3?filename=happy-birthday-10141.mp3' },
  { id: 'lofi', label: 'Nhẹ nhàng (Lofi)', icon: Coffee, url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-112191.mp3' },
  { id: 'acoustic', label: 'Mộc mạc (Guitar)', icon: TreePine, url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841d1a6170.mp3?filename=gentle-acoustic-guitar-7370.mp3' },
  { id: 'ai-magic', label: 'Giai điệu diệu kỳ', icon: Sparkles, url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c82630a214.mp3?filename=relaxing-ambient-10255.mp3' },
  { id: 'ai-piano', label: 'Piano thư giãn', icon: Music, url: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_5516086f68.mp3?filename=piano-reflection-140889.mp3' }
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
