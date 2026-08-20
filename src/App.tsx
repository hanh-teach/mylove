/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, ComponentType, Suspense } from 'react';
import { Heart, Flower, Leaf, Star, Smile, Gift, Sparkles, Cake, Users, Flower2, RotateCcw, Music, Type, Settings, PenTool, Check, Palette, Plus, Minus, VolumeX, Coffee, TreePine, Video, Loader2, Play, Download, AlertCircle, Film, Clock, Wand2, Folder, Share2, Scissors, Snowflake, Trash2, Search, SmilePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { prepareClonedDocForHtml2Canvas, captureElementToCanvas, applyResolvedColorsToClone, getIconSvgMarkup, getExportCanvas } from './modules/export/ExportHelper';
import { triggerFileDownload, shareFile, toProxiedMediaUrl, isLikelyImageUrl, prefetchImageAsBase64 } from './modules/export/downloadUtils';
import { videoRendererEngine } from './modules/export/VideoRendererEngine';
import { BackgroundMusicPlayer } from './components/audio/BackgroundMusicPlayer';
import { AISidebar } from './components/ai/AISidebar';
import { EntityType } from './modules/relationship/types';
import { ApplicationShell } from './app/AppShell/ApplicationShell';
import { AppTabType } from './types';
import { cleanAIGeneratedText } from './utils/textCleaner';
import { ProjectWorkspaceProvider, useProjectWorkspace, Project } from './modules/workspace';
import { ProjectSidebar } from './components/workspace/ProjectSidebar';
import { ProjectCommandCenter } from './components/workspace/ProjectCommandCenter';
import { collaborationService } from './modules/collaboration/CollaborationService';
import { lazyWithRetry } from './shared/utils/lazyWithRetry';
import { TabErrorBoundary } from './components/common/TabErrorBoundary';
import { DashboardSkeleton } from './components/common/DashboardSkeleton';

// Dynamic Code-Splitting: Lazy Loaded Dashboards, Modals & Overlays
const StudioEditor = lazyWithRetry(() => import('./components/editor/StudioEditor'), 'StudioEditor');
const MemoryDashboard = lazyWithRetry(() => import('./components/memory/MemoryDashboard'), 'MemoryDashboard');
const RelationshipTimelineView = lazyWithRetry(() => import('./components/timeline/RelationshipTimelineView'), 'RelationshipTimelineView');
const PeopleView = lazyWithRetry(() => import('./components/entities/PeopleView'), 'PeopleView');
const PlacesView = lazyWithRetry(() => import('./components/entities/PlacesView'), 'PlacesView');
const GraphView = lazyWithRetry(() => import('./components/relationship/GraphView'), 'GraphView');
const RelatedContentPanel = lazyWithRetry(() => import('./components/relationship/RelatedContentPanel'), 'RelatedContentPanel');
const AIStudioDashboard = lazyWithRetry(() => import('./components/ai-studio/AIStudioDashboard'), 'AIStudioDashboard');
const MediaLibraryPanel = lazyWithRetry(() => import('./components/asset/MediaLibraryPanel'), 'MediaLibraryPanel');
const KnowledgeDashboard = lazyWithRetry(() => import('./components/knowledge/KnowledgeDashboard'), 'KnowledgeDashboard');
const AutomationDashboard = lazyWithRetry(() => import('./components/automation/AutomationDashboard'), 'AutomationDashboard');
const SettingsDashboard = lazyWithRetry(() => import('./components/settings/SettingsDashboard'), 'SettingsDashboard');
const WorkspaceDashboard = lazyWithRetry(() => import('./modules/workspace/WorkspaceDashboard'), 'WorkspaceDashboard');
const ProjectDashboard = lazyWithRetry(() => import('./components/workspace/ProjectDashboard'), 'ProjectDashboard');
const CollaborationDashboard = lazyWithRetry(() => import('./components/collaboration/CollaborationDashboard'), 'CollaborationDashboard');
const SyncDashboard = lazyWithRetry(() => import('./components/sync/SyncDashboard'), 'SyncDashboard');
const PluginManagerDashboard = lazyWithRetry(() => import('./components/plugins/PluginManagerDashboard'), 'PluginManagerDashboard');
const DesignSystemPlayground = lazyWithRetry(() => import('./modules/debug/DesignSystemPlayground'), 'DesignSystemPlayground');

const ExportStudioModal = lazyWithRetry(() => import('./components/editor/export/ExportStudioModal'), 'ExportStudioModal');
const AudioTrimmerModal = lazyWithRetry(() => import('./components/audio/AudioTrimmerModal'), 'AudioTrimmerModal');
const CommandCenter = lazyWithRetry(() => import('./components/automation/CommandCenter'), 'CommandCenter');
const UniversalSearchOverlay = lazyWithRetry(() => import('./components/search/UniversalSearchOverlay'), 'UniversalSearchOverlay');
import { FRAME_SHAPES, FRAME_SHAPE_MAP, getFrameStyle, GlobalFrameSvgDefs, FrameShapeType, getFramedPhotoUrl } from './shared/constants/frameShapes';
import { hasVideoExportPermission } from './shared/utils/authPermissions';
import { useWorkspaceZustandStore } from './modules/workspace/WorkspaceZustandStore';
import { SUPPORT_CONTACT_EMAILS } from './config/contact';

import { ComposingInput, ComposingTextarea } from './shared/components/ComposingInput';

import coupleImg from './assets/images/couple_romantic_icon_1783908155583.jpg';
import bouquetImg from './assets/images/romantic_bouquet_icon_1783908168429.jpg';
import balloonImg from './assets/images/romantic_heart_balloon_1783908331745.jpg';
import letterImg from './assets/images/love_letter_envelope_1783908344094.jpg';
import birdsImg from './assets/images/love_birds_1783908354466.jpg';

type SceneType = 'rose' | 'garden' | 'forest' | 'sunset' | 'ocean' | 'sakura' | 'sky' | 'plain';
type BgStyleType = 'solid' | 'floating' | 'hearts' | 'grid' | 'blobs';
type FontStyleType = 'playfair' | 'dancing' | 'pacifico' | 'caveat' | 'lora' | 'nunito' | 'lobster' | 'merriweather';
type DecorType = 'Heart' | 'Star' | 'Smile' | 'Gift' | 'Sparkles' | 'Cake' | 'Users' | 'Flower2' | 'Couple' | 'Bouquet' | 'Balloon' | 'Letter' | 'Birds';

const fontRegistry: Record<FontStyleType, { label: string; class: string; name: string; sample: string }> = {
  playfair: { label: 'Sang trọng', class: 'font-playfair', name: 'Playfair Display', sample: 'Love Note 2026' },
  lobster: { label: 'Nổi bật', class: 'font-lobster', name: 'Lobster', sample: 'Chúc Mừng Hạnh Phúc' },
  merriweather: { label: 'Thanh lịch', class: 'font-merriweather', name: 'Merriweather', sample: 'Kỷ niệm khó phai' },
  dancing: { label: 'Nghệ thuật', class: 'font-dancing', name: 'Dancing Script', sample: 'Forever & Always' },
  pacifico: { label: 'Dễ thương', class: 'font-pacifico', name: 'Pacifico', sample: 'Mãi bên nhau nhé' },
  caveat: { label: 'Viết tay', class: 'font-caveat', name: 'Caveat', sample: 'Gửi người tôi yêu...' },
  lora: { label: 'Cổ điển', class: 'font-lora', name: 'Lora', sample: 'Những ngày êm đềm' },
  nunito: { label: 'Hiện đại', class: 'font-nunito', name: 'Nunito', sample: '21 Tháng 7, 2026' },
};

const musicTracks = [
  { id: 'none', label: 'Tắt nhạc', icon: VolumeX, url: '' },
  { id: 'romantic', label: 'Ấm áp (Piano)', icon: Heart, url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3' },
  { id: 'birthday', label: 'Sinh nhật (Vui tươi)', icon: Gift, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a7315b.mp3?filename=happy-birthday-10141.mp3' },
  { id: 'lofi', label: 'Nhẹ nhàng (Lofi)', icon: Coffee, url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-112191.mp3' },
  { id: 'acoustic', label: 'Mộc mạc (Guitar)', icon: TreePine, url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841d1a6170.mp3?filename=gentle-acoustic-guitar-7370.mp3' },
  { id: 'ai-magic', label: 'Giai điệu diệu kỳ', icon: Sparkles, url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c82630a214.mp3?filename=relaxing-ambient-10255.mp3' },
  { id: 'ai-piano', label: 'Piano thư giãn', icon: Music, url: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_5516086f68.mp3?filename=piano-reflection-140889.mp3' }
];

const decorRegistry: Record<DecorType, { type: 'icon' | 'image', content: ComponentType<any> | string }> = {
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

const EMOJI_CATEGORIES = [
  {
    category: 'Tình yêu & Trái tim 💖',
    items: ['💖', '🥰', '🌹', '💘', '💌', '🌸', '🎁', '💍', '🎀', '🕯️', '🧸', '🍾', '🥂', '🦋', '✨', '👑', '💎', '💐', '🥳', '💗', '💒', '🦄', '🌟', '🎈', '🕊️']
  },
  {
    category: 'Biểu cảm & Cảm xúc 🥰',
    items: ['🥰', '😍', '😘', '🤩', '🥳', '🥺', '😊', '🤗', '💖', '✨', '🔥', '💫', '🎉', '🎊', '❤️', '💕', '💞', '💓', '💗']
  },
  {
    category: 'Hoa, Quà & Lễ hội 🌹',
    items: ['🌹', '🌸', '🌺', '🌻', '🌷', '💐', '🌾', '🎁', '🎂', '🍰', '🧁', '🎈', '🎉', '🥂', '🍾', '🕯️', '💌', '🧸', '🎀', '👑']
  }
];

const sceneConfig: Record<SceneType, { bg: string; text: string; secondary: string; accent: string; button: string; icon: React.ReactNode }> = {
  rose: { bg: 'bg-rose-100', text: 'text-rose-950', secondary: 'text-rose-900', accent: 'text-rose-500', button: 'bg-rose-600', icon: <Flower className="text-rose-400" /> },
  garden: { bg: 'bg-emerald-100', text: 'text-emerald-950', secondary: 'text-emerald-900', accent: 'text-emerald-500', button: 'bg-emerald-700', icon: <Leaf className="text-emerald-400" /> },
  forest: { bg: 'bg-emerald-900', text: 'text-emerald-50', secondary: 'text-emerald-200', accent: 'text-emerald-400', button: 'bg-emerald-700', icon: <Flower className="text-emerald-300" /> },
  sunset: { bg: 'bg-orange-200', text: 'text-orange-950', secondary: 'text-orange-900', accent: 'text-orange-500', button: 'bg-orange-700', icon: <Sparkles className="text-orange-400" /> },
  ocean: { bg: 'bg-blue-200', text: 'text-blue-950', secondary: 'text-blue-900', accent: 'text-blue-500', button: 'bg-blue-700', icon: <Star className="text-blue-400" /> },
  sakura: { bg: 'bg-pink-200', text: 'text-pink-950', secondary: 'text-pink-900', accent: 'text-pink-500', button: 'bg-pink-700', icon: <Flower2 className="text-pink-400" /> },
  sky: { bg: 'bg-sky-200', text: 'text-sky-950', secondary: 'text-sky-900', accent: 'text-sky-500', button: 'bg-sky-700', icon: <Smile className="text-sky-400" /> },
  plain: { bg: 'bg-white', text: 'text-slate-900', secondary: 'text-slate-700', accent: 'text-slate-400', button: 'bg-slate-800', icon: <Heart className="text-slate-400" /> },
};

const textColors = [
  { id: 'default', label: 'Mặc định', textClass: '', secondaryClass: '' },
  { id: 'red', label: 'Đỏ', textClass: 'text-red-600', secondaryClass: 'text-red-500' },
  { id: 'pink', label: 'Hồng', textClass: 'text-pink-600', secondaryClass: 'text-pink-500' },
  { id: 'purple', label: 'Tím', textClass: 'text-purple-600', secondaryClass: 'text-purple-500' },
  { id: 'blue', label: 'Xanh dương', textClass: 'text-blue-600', secondaryClass: 'text-blue-500' },
  { id: 'emerald', label: 'Xanh ngọc', textClass: 'text-emerald-700', secondaryClass: 'text-emerald-600' },
  { id: 'slate', label: 'Đen', textClass: 'text-slate-800', secondaryClass: 'text-slate-700' },
  { id: 'white', label: 'Trắng', textClass: 'text-white', secondaryClass: 'text-white/90' },
];

const FramedPhotoRender: React.FC<{
  src: string;
  frameShape: FrameShapeType;
  animate?: any;
  transition?: any;
  className?: string;
  objectFit?: 'cover' | 'contain';
}> = ({ src, frameShape, animate, transition, className = "w-32 h-32 sm:w-44 sm:h-44 object-contain", objectFit = 'cover' }) => {
  const [framedSrc, setFramedSrc] = useState<string>(src);

  useEffect(() => {
    let active = true;
    getFramedPhotoUrl(src, frameShape, 400, objectFit).then((url) => {
      if (active) setFramedSrc(url);
    });
    return () => {
      active = false;
    };
  }, [src, frameShape, objectFit]);

  return (
    <motion.div
      animate={animate}
      transition={transition}
      className="flex flex-col items-center overflow-visible transition-all duration-300"
    >
      <img
        src={framedSrc}
        alt="Ảnh từ Soạn thảo"
        className={`${className} transition-all duration-300 pointer-events-none drop-shadow-md`}
        draggable={false}
        crossOrigin="anonymous"
      />
    </motion.div>
  );
};

const DEFAULT_FALLBACK_PROJECT: Project = {
  id: 'proj-default',
  title: 'Dự án mặc định',
  description: 'Dự án thiệp mặc định',
  template: 'card',
  category: 'personal',
  status: 'draft',
  version: '1.0.0',
  progress: 0,
  favorite: false,
  themeColor: 'rose',
  icon: '💖',
  content: {
    title: '',
    message: '',
    placedItems: [],
    scene: 'rose',
    bgStyle: 'solid',
    fontStyle: 'playfair',
    textColor: 'default'
  },
  createdAt: 0,
  updatedAt: 0,
  lifecyclePhase: 'idea',
  health: 'good',
  healthStatus: {
    content: 100,
    media: 100,
    timeline: 100,
    overall: 'good'
  },
  insight: {
    totalMemories: 0,
    totalAssets: 0,
    totalEvents: 0,
    aiDrafts: 0,
    manualDrafts: 0,
    completionPrediction: 'N/A'
  },
  checklist: [],
  recentActivity: [],
  coachSuggestions: [],
  priorityTasks: [],
  dailyFocus: [],
  workspaceInsights: [],
  productivity: {
    weeklyProjects: 0,
    weeklyHours: 0,
    newMemories: 0,
    aiAssists: 0,
    completedProjects: 0
  },
  intelligenceSettings: {
    showInsights: false,
    showProductivity: false,
    showSmartReminders: false,
    activeCoach: false
  }
};

function AppContent() {
  const { projects, activeProject, updateActiveProjectContent, updateActiveProject, selectProject } = useProjectWorkspace();

  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [totalHeartsCount, setTotalHeartsCount] = useState(0);
  const [showDate, setShowDate] = useState(false);
  const [placedItems, setPlacedItems] = useState<{ id: number; type: DecorType; x: number; y: number; scale: number; rotation: number; color?: string; animation?: "none" | "float" | "pulse" | "spin" }[]>([]);
  const [scene, setScene] = useState<SceneType>('plain');
  const [bgStyle, setBgStyle] = useState<BgStyleType>('solid');
  const [snowEffect, setSnowEffect] = useState(false);
  const [fontStyle, setFontStyle] = useState<FontStyleType>('playfair');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<any>(musicTracks[0]);
  const [isAudioTrimmerOpen, setIsAudioTrimmerOpen] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [textColor, setTextColor] = useState<string>('default');
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [textSize, setTextSize] = useState(1);
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const mainCardContainerRef = useRef<HTMLDivElement>(null);

  const [decorColor, setDecorColor] = useState<string>('#f43f5e');
  const [selectedDecorId, setSelectedDecorId] = useState<number | null>(null);
  const [decorTab, setDecorTab] = useState<'emojis' | 'stickers' | 'frames'>('emojis');
  const [stickerSearchQuery, setStickerSearchQuery] = useState('');
  const [showStudioEditor, setShowStudioEditor] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState<AppTabType>(() => {
    const saved = sessionStorage.getItem('lovenote_active_tab');
    return (saved as AppTabType) || 'home';
  });

  useEffect(() => {
    sessionStorage.setItem('lovenote_active_tab', activeAppTab);
  }, [activeAppTab]);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          useWorkspaceZustandStore.getState().updateCurrentUser({
            email: data.user.email,
            name: data.user.name,
            role: data.user.role === 'owner' ? 'Tài khoản Chủ (Toàn quyền)' : 'Tài khoản Người dùng'
          });
        }
      })
      .catch(() => {});
  }, []);

  const [activeInvitation, setActiveInvitation] = useState<{
    memberId: string;
    projectId: string;
    projectName: string;
    role: string;
    email: string;
  } | null>(null);
  const [acceptName, setAcceptName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get('inviteId');
    const projectId = params.get('projectId');
    if (inviteId && projectId) {
      const proj = projects.find(p => p.id === projectId);
      const member = proj?.members?.find(m => m.id === inviteId);
      
      const email = member?.email || '';
      const role = member?.role || 'editor';
      const projectName = proj?.title || 'Teacher Card (Dự án nghệ thuật)';
      
      // Auto prefill display name from email
      const defaultName = email ? email.split('@')[0] : 'Cộng tác viên';
      setAcceptName(prev => prev || defaultName);

      setActiveInvitation(prev => {
        if (prev?.memberId === inviteId && prev?.projectId === projectId) {
          return prev;
        }
        return {
          memberId: inviteId,
          projectId,
          projectName,
          role,
          email
        };
      });
    }
  }, [projects]);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoGenerationStep, setVideoGenerationStep] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  // Decided once when the AI result comes back (from the ORIGINAL provider URL, before it gets
  // rewritten to go through /api/media-proxy). Downstream code used to re-derive this by sniffing
  // generatedVideoUrl for a file extension (`.endsWith('.png')`, etc.) — that broke once the URL
  // became `/api/media-proxy?url=...` and no longer ends with a real extension, so we compute it
  // once here and reuse it everywhere instead of re-parsing an ever-changing URL string.
  const [isGeneratedMediaImage, setIsGeneratedMediaImage] = useState(false);
  const [videoGenResult, setVideoGenResult] = useState<any>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isDownloadingRaw, setIsDownloadingRaw] = useState(false);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [isCardExportOpen, setIsCardExportOpen] = useState(false);
  const [exportModalTab, setExportModalTab] = useState<'export' | 'queue' | 'history'>('export');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // AI Wish Suggestions State
  const [isAIWishModalOpen, setIsAIWishModalOpen] = useState(false);
  const [isGeneratingWishes, setIsGeneratingWishes] = useState(false);
  const [aiWishes, setAiWishes] = useState<string[]>([]);

  const generateAIWishes = async () => {
    setIsAIWishModalOpen(true);
    setIsGeneratingWishes(true);
    try {
      const sceneLabelMap: Record<string, string> = {
        rose: 'Hoa hồng & Tình yêu nồng thắm',
        garden: 'Khu vườn kỷ niệm & Bình yên',
        forest: 'Rừng xanh mơ mộng & Sâu lắng',
        sunset: 'Hoàng hôn lãng mạn & Ấm áp',
        ocean: 'Biển cả mênh mông & Vĩnh cửu',
        sakura: 'Hoa anh đào & Ngọt ngào',
        sky: 'Bầu trời hy vọng & Ngàn sao',
        plain: 'Chủ đề mặc định chân thành'
      };
      const sceneTopic = sceneLabelMap[scene] || 'Kỷ niệm lãng mạn';
      const promptText = `Chủ đề dự án: ${title || 'Thiệp Yêu Thương'} (${sceneTopic}). Hãy viết đúng 3 mẫu lời chúc lãng mạn, chân thành, sâu sắc và đong đầy tình cảm. Phân tách 3 mẫu bằng dấu phân cách "---" giữa các mẫu. Không thêm bất kỳ phần giới thiệu hay ghi chú nào khác.`;

      const res = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          text: promptText,
          tone: 'romantic',
          language: 'Vietnamese'
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        let rawWishes = data.result
          .split(/---|\n{2,}/)
          .map((w: string) => w.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter((w: string) => w.length > 5);

        if (rawWishes.length < 3) {
          rawWishes = data.result
            .split(/\n\n+/)
            .map((w: string) => w.trim())
            .filter((w: string) => w.length > 5);
        }
        setAiWishes(rawWishes.slice(0, 3));
      } else {
        throw new Error(data.error || 'Khởi tạo không thành công');
      }
    } catch (err: any) {
      console.error('Lỗi gợi ý lời chúc AI:', err);
      setAiWishes([
        "Anh yêu em không phải vì em là ai, mà vì anh là ai khi ở bên cạnh em. Cảm ơn em đã đến và làm cho cuộc sống của anh tràn ngập màu sắc rực rỡ.",
        "Mỗi ngày trôi qua cùng em đều là một ngày hạnh phúc trọn vẹn nhất. Dù thời gian có trôi đi, tình yêu anh dành cho em vẫn vẹn nguyên như ngày đầu tiên.",
        "Gửi người con gái anh yêu thương nhất: Cảm ơn em đã luôn bao dung, dịu dàng và cùng anh viết nên những trang ký ức thật đẹp. Mãi yêu em!"
      ]);
    } finally {
      setIsGeneratingWishes(false);
    }
  };

  const applyAIWish = (selectedWish: string) => {
    setMessage(selectedWish);
    updateActiveProjectContent({ message: selectedWish });
    setIsAIWishModalOpen(false);
  };

  // Global event listeners for Command Palette and settings trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      
      // Command Palette (Ctrl+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (activeProject) {
          setIsCommandCenterOpen(prev => !prev);
        } else {
          setIsCommandPaletteOpen(prev => !prev);
        }
      }
      
      // Numeric tab shortcuts (Cmd/Ctrl + 1-8)
      if ((e.ctrlKey || e.metaKey) && !isNaN(parseInt(e.key))) {
        const num = parseInt(e.key);
        const tabs: AppTabType[] = ['home', 'editor', 'memory', 'timeline', 'aistudio', 'assets', 'design-system', 'card'];
        if (num >= 1 && num <= tabs.length) {
          e.preventDefault();
          setActiveAppTab(tabs[num - 1]);
        }
      }
    };
    const handleOpenEvent = () => setIsCommandPaletteOpen(true);
    const handleCloseEvent = () => setIsCommandPaletteOpen(false);
    const handleTriggerSettings = () => {
      setShowSettingsMenu(true);
      setActiveAppTab('card');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);
    window.addEventListener('close-command-palette', handleCloseEvent);
    window.addEventListener('trigger-settings', handleTriggerSettings);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
      window.removeEventListener('close-command-palette', handleCloseEvent);
      window.removeEventListener('trigger-settings', handleTriggerSettings);
    };
  }, []);

  // Sync active project state
  useEffect(() => {
    if (activeProject && activeProject.content) {
      if (activeProject.content.title !== undefined) setTitle((activeProject.content.title || '').normalize('NFC'));
      if (activeProject.content.message !== undefined) setMessage((activeProject.content.message || '').normalize('NFC'));
      if (activeProject.content.placedItems) setPlacedItems(activeProject.content.placedItems);
      if (activeProject.content.scene) setScene(activeProject.content.scene as SceneType);
      if (activeProject.content.bgStyle) setBgStyle(activeProject.content.bgStyle as BgStyleType);
      if (activeProject.content.snowEffect !== undefined) setSnowEffect(Boolean(activeProject.content.snowEffect));
      if (activeProject.content.fontStyle) setFontStyle(activeProject.content.fontStyle as FontStyleType);
      if (activeProject.content.textColor) setTextColor(activeProject.content.textColor);
      if (activeProject.content.musicTrack) {
        const found = musicTracks.find(m => m.id === activeProject.content.musicTrack?.id);
        if (found) setCurrentMusic(found);
      }
    }
  }, [activeProject?.id]);

  const getWordSpacingWidth = (font: FontStyleType) => {
    switch (font) {
      case 'dancing':
        return '0.44em';
      case 'lobster':
        return '0.42em';
      case 'pacifico':
        return '0.40em';
      case 'caveat':
        return '0.38em';
      case 'merriweather':
        return '0.36em';
      case 'playfair':
      case 'lora':
        return '0.34em';
      case 'nunito':
      default:
        return '0.32em';
    }
  };

  const renderSpannedText = (text: string) => {
    if (!text) return null;
    const normalizedText = text.normalize('NFC');
    const wordSpacing = getWordSpacingWidth(fontStyle);
    return normalizedText.split('\n').map((line, lineIdx) => {
      const words = line.split(' ');
      return (
        <span key={`line-${lineIdx}`} className="block">
          {words.map((word, wordIdx) => {
            const isLastWord = wordIdx === words.length - 1;
            return (
              <span 
                key={`word-${lineIdx}-${wordIdx}`} 
                className="inline-block" 
                style={{ 
                  whiteSpace: 'pre-wrap',
                  marginRight: isLastWord ? '0px' : wordSpacing
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      );
    });
  };

  const getMediaAsBase64 = async (url: string, isImage: boolean): Promise<string> => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;

    if (isImage) {
      try {
        const b64 = await prefetchImageAsBase64(url);
        if (b64 && b64.startsWith('data:')) return b64;
      } catch (e) {
        console.warn('[getMediaAsBase64] Lỗi prefetch image:', e);
      }
      return url;
    } else {
      try {
        return await new Promise<string>((resolve, reject) => {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.src = url;
          video.muted = true;
          video.playsInline = true;
          video.currentTime = 0.5;

          const timer = setTimeout(() => {
            cleanup();
            reject(new Error("Video frame snapshot timeout"));
          }, 4000);

          const cleanup = () => {
            clearTimeout(timer);
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('error', onError);
            video.pause();
            video.removeAttribute('src');
            video.load();
          };

          const onSeeked = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth || 1280;
              canvas.height = video.videoHeight || 720;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                cleanup();
                resolve(dataUrl);
                return;
              }
            } catch (e) {
              // ignore
            }
            cleanup();
            reject(new Error("Canvas draw error"));
          };

          const onError = (e: any) => {
            cleanup();
            reject(e);
          };

          video.addEventListener('seeked', onSeeked);
          video.addEventListener('error', onError);
          video.load();
        });
      } catch (e) {
        console.warn('[getMediaAsBase64] Lỗi snapshot video frame:', e);
        return url;
      }
    }
  };

  const getBgDataUrlForExport = async (mediaUrl: string, isImage: boolean): Promise<string> => {
    if (!mediaUrl) return '';
    if (mediaUrl.startsWith('data:')) return mediaUrl;

    if (isImage) {
      try {
        const b64 = await prefetchImageAsBase64(mediaUrl);
        if (b64 && b64.startsWith('data:')) return b64;
      } catch (e) {
        console.warn('Lỗi prefetch background image:', e);
      }
    }

    // Try video frame snapshot if video or fallback
    try {
      return await new Promise<string>((resolve, reject) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;

        const timer = setTimeout(() => {
          cleanup();
          reject(new Error("Video frame timeout"));
        }, 5000);

        const cleanup = () => {
          clearTimeout(timer);
          video.onloadeddata = null;
          video.onseeked = null;
          video.onerror = null;
          video.pause();
          video.remove();
        };

        video.onloadeddata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const cvs = document.createElement('canvas');
            cvs.width = video.videoWidth || 1280;
            cvs.height = video.videoHeight || 720;
            const ctx = cvs.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
              const dUrl = cvs.toDataURL('image/png');
              cleanup();
              resolve(dUrl);
              return;
            }
          } catch (err) {
            // ignore
          }
          cleanup();
          reject(new Error("Canvas draw video failed"));
        };

        video.onerror = (e) => {
          cleanup();
          reject(e);
        };

        video.src = mediaUrl;
        video.load();
      });
    } catch (err) {
      console.warn('Lỗi snapshot frame video background:', err);
      return mediaUrl;
    }
  };

  const renderCardToDirectCanvas = async (
    bgMediaUrl: string,
    isImageMedia: boolean
  ): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not create 2D canvas context");

    // 1. Vibrant thematic gradient background fallback (guarantees NO pitch-black output under any circumstance)
    const sceneGradients: Record<string, [string, string, string]> = {
      rose: ['#fff1f2', '#fecdd3', '#fda4af'],
      garden: ['#ecfdf5', '#a7f3d0', '#6ee7b7'],
      forest: ['#064e3b', '#047857', '#10b981'],
      sunset: ['#fff7ed', '#fed7aa', '#fdba74'],
      ocean: ['#f0f9ff', '#bae6fd', '#7dd3fc'],
      sakura: ['#fdf2f8', '#fbcfe8', '#f472b6'],
      sky: ['#f0f9ff', '#e0f2fe', '#bae6fd'],
      plain: ['#ffffff', '#f8fafc', '#f1f5f9'],
    };
    const [c1, c2, c3] = sceneGradients[scene] || sceneGradients.rose;
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, c1);
    grad.addColorStop(0.5, c2);
    grad.addColorStop(1, c3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    let mediaDrawn = false;

    // 2. First attempt: grab frame directly from currently rendered DOM container (<video> or <img>)
    const domContainer = document.getElementById('generated-card-container') || document.getElementById('main-card-container');
    if (domContainer) {
      const domVideo = domContainer.querySelector('video') as HTMLVideoElement | null;
      const domImg = domContainer.querySelector('img') as HTMLImageElement | null;

      if (domVideo && domVideo.videoWidth > 0 && domVideo.readyState >= 2) {
        try {
          ctx.drawImage(domVideo, 0, 0, 1280, 720);
          mediaDrawn = true;
        } catch (err) {
          console.warn('[renderCardToDirectCanvas] Direct DOM video capture error:', err);
        }
      } else if (domImg && (domImg.naturalWidth > 0 || domImg.complete)) {
        try {
          ctx.drawImage(domImg, 0, 0, 1280, 720);
          mediaDrawn = true;
        } catch (err) {
          console.warn('[renderCardToDirectCanvas] Direct DOM img capture error:', err);
        }
      }
    }

    // 3. Fallback: if DOM element wasn't drawn, load media from URL (seeking past initial 0s black keyframe for videos)
    if (!mediaDrawn && bgMediaUrl) {
      try {
        if (isImageMedia || bgMediaUrl.startsWith('data:image') || bgMediaUrl.startsWith('blob:') || isLikelyImageUrl(bgMediaUrl)) {
          let b64 = bgMediaUrl;
          if (!b64.startsWith('data:') && !b64.startsWith('blob:')) {
            b64 = await prefetchImageAsBase64(bgMediaUrl);
          }
          if (b64) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = b64;
            });

            if (img.width > 0 && img.height > 0) {
              const imgRatio = img.width / img.height;
              const canvasRatio = 1280 / 720;
              let dw = 1280, dh = 720, dx = 0, dy = 0;
              if (imgRatio > canvasRatio) {
                dh = 720;
                dw = 720 * imgRatio;
                dx = (1280 - dw) / 2;
              } else {
                dw = 1280;
                dh = 1280 / imgRatio;
                dy = (720 - dh) / 2;
              }
              ctx.drawImage(img, dx, dy, dw, dh);
              mediaDrawn = true;
            }
          }
        } else {
          // Video background fallback via temporary video element (seek to 0.5s to bypass black 0s keyframe!)
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.playsInline = true;
          video.src = bgMediaUrl;

          await new Promise<void>((resolve) => {
            const timeout = setTimeout(() => resolve(), 3500);
            video.onloadeddata = () => {
              video.currentTime = 0.5; // Seek past black keyframe
            };
            video.onseeked = () => {
              clearTimeout(timeout);
              resolve();
            };
            video.onerror = () => {
              clearTimeout(timeout);
              resolve();
            };
            video.load();
          });

          if (video.videoWidth > 0) {
            ctx.drawImage(video, 0, 0, 1280, 720);
            mediaDrawn = true;
          }
        }
      } catch (e) {
        console.warn('[renderCardToDirectCanvas] Offscreen media draw failed:', e);
      }
    }

    // 4. Verify center pixel isn't pitch black; if black, re-apply scenic gradient background
    try {
      const centerPixel = ctx.getImageData(640, 360, 1, 1).data;
      if (centerPixel[0] === 0 && centerPixel[1] === 0 && centerPixel[2] === 0) {
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);
      }
    } catch (e) {
      // ignore tainted canvas check
    }

    // 5. Resolve Typography & Text Colors
    const fontFamilies: Record<string, string> = {
      playfair: '"Playfair Display", serif',
      dancing: '"Dancing Script", cursive',
      pacifico: '"Pacifico", cursive',
      caveat: '"Caveat", cursive',
      lora: '"Lora", serif',
      nunito: '"Nunito", sans-serif',
    };

    const textColorsMap: Record<string, string> = {
      white: '#FFFFFF',
      rose: '#E11D48',
      gold: '#D97706',
      dark: '#1E293B',
      purple: '#9333EA',
      emerald: '#059669',
      slate: '#1E293B',
      red: '#DC2626',
      pink: '#DB2777',
      blue: '#2563EB',
    };

    const chosenFont = fontFamilies[fontStyle] || fontFamilies.playfair;
    let chosenTextColor = textColorsMap[textColor];
    if (!chosenTextColor || textColor === 'default') {
      chosenTextColor = '#FFFFFF';
    }

    // 6. Render Title & Message Text
    const rawTitle = videoGenResult?.details?.title || title || '';
    const rawMessage = videoGenResult?.details?.message || message || '';

    const cleanTitle = rawTitle.replace(/<\/?[^>]+(>|$)/g, '').trim();
    const cleanMessage = rawMessage.replace(/<\/?[^>]+(>|$)/g, '').trim();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawTextWithShadow = (text: string, x: number, y: number, fontCss: string) => {
      ctx.save();
      ctx.font = fontCss;
      ctx.fillStyle = chosenTextColor;

      // Primary drop shadow for strong contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      ctx.fillText(text, x, y);

      // Secondary outline fill for crispness
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(text, x, y);

      ctx.restore();
    };

    if (cleanTitle) {
      const titleFont = `bold 48px ${chosenFont}`;
      drawTextWithShadow(cleanTitle, 640, cleanMessage ? 280 : 360, titleFont);
    }

    if (cleanMessage) {
      const msgFont = `500 28px ${chosenFont}`;
      ctx.font = msgFont;
      const words = cleanMessage.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 960 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const startY = cleanTitle ? 360 : 360 - ((lines.length - 1) * 22);
      lines.forEach((line, idx) => {
        drawTextWithShadow(line, 640, startY + (idx * 44), msgFont);
      });
    }
    ctx.restore();

    // 7. Render Decor Stickers
    for (const item of placedItems) {
      const decor = decorRegistry[item.type];
      if (!decor) continue;

      const displayX = 640 + (item.x * 1.1);
      const displayY = 360 + (item.y * 1.1);
      const scale = item.scale || 1;
      const rotation = item.rotation || 0;
      const itemColor = item.color || chosenTextColor;

      ctx.save();
      ctx.translate(displayX, displayY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      if (decor.type === 'image' && typeof decor.content === 'string') {
        try {
          let imgSrc = decor.content;
          if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('blob:')) {
            const b64 = await prefetchImageAsBase64(imgSrc);
            if (b64 && b64.startsWith('data:')) imgSrc = b64;
          }
          const decorImg = new Image();
          decorImg.crossOrigin = 'anonymous';
          await new Promise<void>((res) => {
            decorImg.onload = () => res();
            decorImg.onerror = () => res();
            decorImg.src = imgSrc;
          });
          if (decorImg.width > 0) {
            ctx.drawImage(decorImg, -28, -28, 56, 56);
          }
        } catch (e) {
          // ignore
        }
      } else {
        try {
          const svgMarkup = getIconSvgMarkup(item.type, itemColor);
          const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const svgImg = new Image();
          await new Promise<void>((res) => {
            svgImg.onload = () => res();
            svgImg.onerror = () => res();
            svgImg.src = svgUrl;
          });
          if (svgImg.width > 0) {
            ctx.drawImage(svgImg, -24, -24, 48, 48);
          }
          URL.revokeObjectURL(svgUrl);
        } catch (e) {
          // ignore
        }
      }
      ctx.restore();
    }

    return canvas;
  };

  const downloadAnimatedCardVideo = async () => {
    setIsExportingImage(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context");

      // Attempt to capture video stream and record via MediaRecorder
      if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
        return await downloadCompleteCardImage('download');
      }

      // Pre-load all sticker image assets before running the recording loop
      const decorImagesMap = new Map<string, HTMLImageElement>();
      for (const item of placedItems) {
        const decor = decorRegistry[item.type];
        if (!decor || decorImagesMap.has(item.type)) continue;

        if (decor.type === 'image' && typeof decor.content === 'string') {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            img.src = (item as any)._prefetchedContent || (decor.content as string);
          });
          if (img.width > 0) {
            decorImagesMap.set(item.type, img);
          }
        } else if (decor.type === 'icon') {
          const itemColor = sceneConfig[scene as SceneType]?.accent?.replace('text-', '') || 'rose-500';
          const svgMarkup = getIconSvgMarkup(item.type, itemColor);
          const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            img.src = svgUrl;
          });
          if (img.width > 0) {
            decorImagesMap.set(item.type, img);
          }
          URL.revokeObjectURL(svgUrl);
        }
      }

      // Load background video/image element
      let bgMedia: HTMLVideoElement | HTMLImageElement | null = null;
      const domContainer = document.getElementById('generated-card-container') || document.getElementById('main-card-container');
      if (domContainer) {
        const domVideo = domContainer.querySelector('video') as HTMLVideoElement | null;
        const domImg = domContainer.querySelector('img') as HTMLImageElement | null;
        if (domVideo && domVideo.readyState >= 2) {
          bgMedia = domVideo;
        } else if (domImg && domImg.complete) {
          bgMedia = domImg;
        }
      }

      if (!bgMedia && generatedVideoUrl) {
        if (isGeneratedMediaImage || generatedVideoUrl.startsWith('data:image') || isLikelyImageUrl(generatedVideoUrl)) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            img.src = generatedVideoUrl;
          });
          if (img.width > 0) bgMedia = img;
        } else {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.src = generatedVideoUrl;
          await new Promise<void>((res) => {
            const t = setTimeout(res, 3500);
            video.onloadeddata = () => {
              video.currentTime = 0.5;
            };
            video.onseeked = () => {
              clearTimeout(t);
              res();
            };
            video.onerror = () => {
              clearTimeout(t);
              res();
            };
            video.load();
          });
          if (video.videoWidth > 0) {
            video.play().catch(() => {});
            bgMedia = video;
          }
        }
      }

      const stream = canvas.captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }));
        };
        recorder.onerror = (err) => reject(err);
      });

      recorder.start();

      // Record 3.5 seconds loop with animated frame updates
      const fps = 30;
      const durationSec = 3.5;
      const totalFrames = Math.floor(fps * durationSec);
      const frameDelay = 1000 / fps;

      // Theme background gradient
      const sceneGradients: Record<string, [string, string, string]> = {
        rose: ['#fff1f2', '#fecdd3', '#fda4af'],
        garden: ['#ecfdf5', '#a7f3d0', '#6ee7b7'],
        forest: ['#064e3b', '#047857', '#10b981'],
        sunset: ['#fff7ed', '#fed7aa', '#fdba74'],
        ocean: ['#f0f9ff', '#bae6fd', '#7dd3fc'],
        sakura: ['#fdf2f8', '#fbcfe8', '#f472b6'],
        sky: ['#f0f9ff', '#e0f2fe', '#bae6fd'],
        plain: ['#ffffff', '#f8fafc', '#f1f5f9'],
      };
      const [c1, c2, c3] = sceneGradients[scene] || sceneGradients.rose;
      const fontFamilies: Record<string, string> = {
        playfair: '"Playfair Display", serif',
        dancing: '"Dancing Script", cursive',
        pacifico: '"Pacifico", cursive',
        caveat: '"Caveat", cursive',
        lora: '"Lora", serif',
        nunito: '"Nunito", sans-serif',
      };
      const chosenFont = fontFamilies[fontStyle] || fontFamilies.playfair;

      const rawTitle = videoGenResult?.details?.title || title || '';
      const rawMessage = videoGenResult?.details?.message || message || '';
      const cleanTitle = rawTitle.replace(/<\/?[^>]+(>|$)/g, '').trim();
      const cleanMessage = rawMessage.replace(/<\/?[^>]+(>|$)/g, '').trim();

      for (let frame = 0; frame < totalFrames; frame++) {
        const timeSec = frame / fps;

        // Fill background gradient
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        grad.addColorStop(0, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(1, c3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);

        // Draw media
        if (bgMedia) {
          try {
            if (bgMedia instanceof HTMLVideoElement && bgMedia.readyState >= 2) {
              ctx.drawImage(bgMedia, 0, 0, 1280, 720);
            } else if (bgMedia instanceof HTMLImageElement && bgMedia.complete) {
              ctx.drawImage(bgMedia, 0, 0, 1280, 720);
            }
          } catch (e) {
            // ignore
          }
        }

        // Draw animated title and message text
        const textFloatY = Math.sin(timeSec * 2.5) * 5;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const drawShadowText = (txt: string, x: number, y: number, fontCss: string) => {
          ctx.save();
          ctx.font = fontCss;
          ctx.fillStyle = '#FFFFFF';

          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 16;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillText(txt, x, y + textFloatY);

          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          ctx.fillText(txt, x, y + textFloatY);

          ctx.restore();
        };

        if (cleanTitle) {
          const titleFont = `bold 48px ${chosenFont}`;
          ctx.font = titleFont;
          const words = cleanTitle.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 1080 && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) lines.push(currentLine);

          const startY = cleanMessage ? 280 : 360 - ((lines.length - 1) * 30);
          lines.forEach((line, index) => {
            drawShadowText(line, 640, startY + (index * 60), titleFont);
          });
        }
        
        if (cleanMessage) {
          const msgFont = `28px ${chosenFont}`;
          ctx.font = msgFont;
          const words = cleanMessage.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 1080 && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) lines.push(currentLine);

          const startY = cleanTitle ? 400 : 360 - ((lines.length - 1) * 18);
          lines.forEach((line, index) => {
            drawShadowText(line, 640, startY + (index * 36), msgFont);
          });
        }
        ctx.restore();

        // Draw decor with motion
        for (const item of placedItems) {
          const decor = decorRegistry[item.type];
          if (!decor) continue;

          let animOffsetX = 0, animOffsetY = 0, animScale = item.scale || 1, animRotate = item.rotation || 0;
          if (item.animation === 'float') {
            animOffsetY = Math.sin(timeSec * 3 + item.x) * 10;
            animOffsetX = Math.cos(timeSec * 2 + item.y) * 5;
          } else if (item.animation === 'pulse') {
            animScale *= (1 + Math.sin(timeSec * 5) * 0.15);
          } else if (item.animation === 'spin') {
            animRotate += (timeSec * 120) % 360;
          }

          ctx.save();
          const cx = 640 + (item.x * 1.1) + animOffsetX;
          const cy = 360 + (item.y * 1.1) + animOffsetY;
          ctx.translate(cx, cy);
          ctx.rotate((animRotate * Math.PI) / 180);
          ctx.scale(animScale, animScale);

          if (decor.type === 'image' && typeof decor.content === 'string') {
            const preloadedImg = decorImagesMap.get(item.type);
            if (preloadedImg && preloadedImg.complete && preloadedImg.width > 0) {
              ctx.shadowColor = 'rgba(0,0,0,0.4)';
              ctx.shadowBlur = 8;
              ctx.drawImage(preloadedImg, -28, -28, 56, 56);
            }
          }
          ctx.restore();
        }

        await new Promise((res) => setTimeout(res, frameDelay));
      }

      recorder.stop();
      const videoBlob = await recordPromise;

      if (videoBlob && videoBlob.size > 0) {
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const filename = `thiep-dong-hoan-chinh-${Date.now()}.${ext}`;
        await triggerFileDownload(videoBlob, filename);
      } else {
        await downloadCompleteCardImage('download');
      }

    } catch (err: any) {
      console.error('Lỗi khi ghi video thiệp:', err);
      // Fallback to static image download
      await downloadCompleteCardImage('download');
    } finally {
      setIsExportingImage(false);
    }
  };

  const downloadAnimatedCardGif = async () => {
    setIsExportingImage(true);
    try {
      const gifBlob = await videoRendererEngine.renderGif({
        title: videoGenResult?.details?.title || title || 'Thiệp Yêu Thương',
        message: videoGenResult?.details?.message || message || '',
        scene,
        fontStyle,
        placedItems,
        photoUrl: activeProject?.content?.photoUrl || undefined,
        aspectRatio: '16:9',
        fps: 15,
        durationSec: 3.0,
        particleEffect: snowEffect ? 'snow' : (scene === 'sakura' ? 'sakura' : 'heart'),
      });
      await triggerFileDownload(gifBlob, `thiep-dong-lovenote-${Date.now()}.gif`);
    } catch (err: any) {
      console.error('Lỗi khi xuất ảnh GIF động:', err);
      alert('Không thể tạo ảnh GIF động: ' + (err?.message || 'Vui lòng thử lại'));
    } finally {
      setIsExportingImage(false);
    }
  };

  const downloadCompleteCardImage = async (mode: 'download' | 'share' = 'download') => {
    const setBusy = mode === 'share' ? setIsSharingImage : setIsExportingImage;
    setBusy(true);

    try {
      const isImg = isGeneratedMediaImage || (generatedVideoUrl ? (generatedVideoUrl.startsWith('data:') || isLikelyImageUrl(generatedVideoUrl)) : true);

      let canvas: HTMLCanvasElement | null = null;
      
      // If we are exporting from the AI Video Modal, html2canvas will fail to capture the video frame reliably.
      // We must use our custom canvas renderer designed specifically for this.
      if (generatedVideoUrl) {
        try {
          canvas = await renderCardToDirectCanvas(generatedVideoUrl, isImg);
        } catch (e) {
          console.warn('[downloadCompleteCardImage] renderCardToDirectCanvas failed:', e);
        }
      }

      // Standard HTML2Canvas capture for normal UI elements if we don't have a generated AI video
      if (!canvas) {
        const targetEl = document.getElementById('generated-card-container') || 
                         document.getElementById('main-card-container') || 
                         document.getElementById('card-preview-artboard');

        if (targetEl) {
          try {
            canvas = await captureElementToCanvas(targetEl as HTMLElement, {
              scale: 2,
              useCORS: true,
              allowTaint: false,
              backgroundColor: '#ffffff',
            });
          } catch (captureErr) {
            console.warn('[downloadCompleteCardImage] Direct DOM element capture failed, fallback to getExportCanvas:', captureErr);
          }
        }

        if (!canvas) {
          try {
            canvas = await getExportCanvas(
              { title, message, scene, fontStyle, bgStyle, placedItems },
              { format: 'png', quality: 'high', orientation: 'landscape' } as any,
              (targetEl as HTMLElement) || undefined
            );
          } catch (exportErr) {
            console.warn('[downloadCompleteCardImage] getExportCanvas failed, fallback to renderCardToDirectCanvas:', exportErr);
          }
        }
      }

      // Final fallback
      if (!canvas) {
        canvas = await renderCardToDirectCanvas(generatedVideoUrl || '', isImg);
      }

      let blob: Blob | null = null;
      if (canvas) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas!.toBlob((b) => resolve(b), 'image/png', 1.0);
        });
      }

      if (!blob) {
        // Direct fallback canvas if canvas.toBlob failed due to any reason
        const fallbackCanvas = await renderCardToDirectCanvas('', true);
        blob = await new Promise<Blob | null>((resolve) => {
          fallbackCanvas.toBlob((b) => resolve(b), 'image/png', 1.0);
        });
      }

      if (!blob) {
        throw new Error("Không thể tạo dữ liệu hình ảnh thiệp.");
      }

      const filename = `thiep-hoan-chinh-${Date.now()}.png`;

      if (mode === 'share') {
        const shared = await shareFile(blob, filename, { title: 'Thiệp yêu thương', text: 'Mình gửi bạn một tấm thiệp từ NoteMe!' });
        if (!shared) {
          await triggerFileDownload(blob, filename);
        }
      } else {
        await triggerFileDownload(blob, filename);
      }
    } catch (error: any) {
      console.error("Lỗi khi kết xuất ảnh thiệp hoàn chỉnh:", error);
      // Fallback rescue: generate baseline card directly and trigger download
      try {
        const fallbackCanvas = await renderCardToDirectCanvas('', true);
        const fallbackBlob = await new Promise<Blob | null>((resolve) => {
          fallbackCanvas.toBlob((b) => resolve(b), 'image/png', 1.0);
        });
        if (fallbackBlob) {
          await triggerFileDownload(fallbackBlob, `thiep-chuc-mung-${Date.now()}.png`);
        }
      } catch (e) {
        console.error("Lỗi cấp 2 khi tải thiệp:", e);
      }
    } finally {
      setBusy(false);
    }
  };

  const downloadRawAiFile = async () => {
    if (!generatedVideoUrl) return;
    setIsDownloadingRaw(true);
    try {
      const filename = isGeneratedMediaImage ? "greeting-card-raw.png" : "greeting-card-raw.mp4";

      const response = await fetch(generatedVideoUrl);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const blob = await response.blob();
      await triggerFileDownload(blob, filename);
    } catch (err: any) {
      console.error('[downloadRawAiFile] Lỗi khi fetch file gốc, thử fallback tải trực tiếp:', err);
      const filename = isGeneratedMediaImage ? "greeting-card-raw.png" : "greeting-card-raw.mp4";
      try {
        await triggerFileDownload(generatedVideoUrl, filename);
      } catch (fallbackErr) {
        window.open(generatedVideoUrl, '_blank');
      }
    } finally {
      setIsDownloadingRaw(false);
    }
  };

  const generateVideo = async () => {
    const currentUser = useWorkspaceZustandStore.getState().currentUser;
    const huggingKey = localStorage.getItem('lovenote_huggingface_api_key');
    
    if (!hasVideoExportPermission(currentUser?.email, huggingKey)) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
      alert(`Tài khoản người dùng chuẩn bị giới hạn quyền "Xuất Video Animation". Vui lòng nhập API Key Hugging Face của bạn hoặc liên hệ Tài khoản chủ (${SUPPORT_CONTACT_EMAILS[0]}) để được hỗ trợ mở khóa toàn quyền.`);
      return;
    }

    setIsVideoGenerating(true);
    setGeneratedVideoUrl(null);
    setIsGeneratedMediaImage(false);
    setVideoGenResult(null);
    setVideoGenerationStep(0);
    setIsVideoModalOpen(true);

    const stepIntervals = [1500, 2000, 1500, 2000];
    for (let i = 0; i < 4; i++) {
      setVideoGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, stepIntervals[i]));
    }

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          scene,
          bgStyle,
          musicTrack: currentMusic,
          placedItems
        })
      });

      let result = await response.json();

      // If the response is 202 Accepted, start polling the task status
      if (response.status === 202 || result.taskId) {
        const taskId = result.taskId;
        const statusUrl = result.statusUrl || `/api/tasks/${taskId}`;
        let taskCompleted = false;
        let pollCount = 0;
        const maxPolls = 40; // 40 * 3 seconds = 120 seconds maximum timeout

        while (!taskCompleted && pollCount < maxPolls) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          pollCount++;

          const statusRes = await fetch(statusUrl);
          if (statusRes.ok) {
            const taskData = await statusRes.json();
            if (taskData.status === 'completed') {
              result = taskData.result;
              taskCompleted = true;
            } else if (taskData.status === 'failed') {
              throw new Error(taskData.error || "Quá trình tạo video thất bại.");
            }
          } else {
            console.warn(`Lỗi khi kiểm tra trạng thái tác vụ: ${statusRes.status}`);
          }
        }

        if (!taskCompleted) {
          throw new Error("Không nhận được phản hồi tạo video trong thời gian cho phép (Hết giờ).");
        }
      }

      if (result && result.success) {
        // Decide image-vs-video from the ORIGINAL provider URL (before it gets rewritten below) —
        // once rewritten it's a /api/media-proxy?url=... string with no usable file extension.
        setIsGeneratedMediaImage(isLikelyImageUrl(result.videoUrl));
        // Rewrite the provider's CDN URL to go through our same-origin proxy. Setting it here
        // (once, at the source) means every downstream consumer — the live <video>/<img>
        // preview, the html2canvas export ("Tải Thiệp Có Chữ"), the Web Share sheet, and
        // downloadRawAiFile() — automatically gets a same-origin resource with no further
        // changes needed. See downloadUtils.ts:toProxiedMediaUrl for the full "why".
        setGeneratedVideoUrl(toProxiedMediaUrl(result.videoUrl));
        setVideoGenResult(result);
      } else {
        throw new Error((result && result.error) || "Không thể tạo video.");
      }
    } catch (err: any) {
      console.error(err);
      setVideoGenResult({
        success: false,
        error: err.message || "Lỗi kết nối đến máy chủ."
      });
    } finally {
      setIsVideoGenerating(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        (settingsMenuRef.current && settingsMenuRef.current.contains(target)) ||
        (target instanceof Element && target.closest('.keep-open'))
      ) {
        return;
      }
      setShowSettingsMenu(false);
      setShowPalette(false);
      setShowMusicMenu(false);
      setShowTextColorMenu(false);
      setShowTextSizeMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Idle preload priority tabs to ensure instant navigation with zero lag on mobile and desktop
    if (typeof window !== 'undefined') {
      const schedulePreload = () => {
        WorkspaceDashboard.preload?.();
        MemoryDashboard.preload?.();
        RelationshipTimelineView.preload?.();
      };
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(schedulePreload, { timeout: 2000 });
      } else {
        setTimeout(schedulePreload, 1500);
      }
    }
  }, []);

  const today = new Date();
  const [title, setTitle] = useState("Nhập chủ đề");
  const [message, setMessage] = useState("Vào Tùy chỉnh để thiết lập nhé!");
  const baseConfig = sceneConfig[scene];
  const chosenColor = textColors.find(c => c.id === textColor);
  const config = (chosenColor && chosenColor.id !== 'default') 
    ? { ...baseConfig, text: chosenColor.textClass, secondary: chosenColor.secondaryClass }
    : baseConfig;

  const addHeart = () => {
    setTotalHeartsCount(prev => prev + 12);
    setShowDate(true);
    let i = 0;
    const count = 12;
    const interval = setInterval(() => {
      const t = (2 * Math.PI / count) * i;
      
      // Responsive scale
      const isMobile = window.innerWidth < 640;
      const scale = isMobile ? 8 : 15; 
      
      const x = 16 * Math.sin(t) ** 3;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const id = Date.now() + Math.floor(Math.random() * 100000) + i;
      setHearts(prev => [...prev, { id, x: x * scale, y: y * scale }]);
      
      i++;
      if (i >= count) clearInterval(interval);
    }, 150); // Faster interval for appearance
  };

  const resetHearts = () => {
    setTotalHeartsCount(0);
    setHearts([]);
    setShowDate(false);
  };

  const addDecor = (type: DecorType) => {
    let defaultAnim: "none" | "float" | "pulse" | "spin" = "none";
    if (['Heart', 'Balloon', 'Birds'].includes(type)) defaultAnim = "float";
    else if (['Star', 'Sparkles', 'Smile'].includes(type)) defaultAnim = "pulse";
    else if (['Flower2', 'Cake'].includes(type)) defaultAnim = "spin";
    setPlacedItems(prev => [...prev, { id: Date.now() + Math.floor(Math.random() * 100000), type, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth / 2 : 200), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight / 2 : 200), scale: 1, rotation: 0, color: decorColor, animation: defaultAnim }]);
  };

  const removeDecor = (id: number) => {
    setPlacedItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAllDecor = () => {
    setPlacedItems([]);
  };

  const addEmojiDecor = (emojiChar: string) => {
    setPlacedItems(prev => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 100000),
        type: 'Heart',
        emoji: emojiChar,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth / 3 : 150) + 30,
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight / 3 : 150) + 30,
        scale: 1.2,
        rotation: 0,
        animation: 'float'
      } as any
    ]);
  };

  const scaleDecor = (id: number, delta: number) => {
    setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, scale: Math.max(0.5, Math.min(3, item.scale + delta)) } : item));
  };

  const rotateDecor = (id: number, delta: number) => {
    setPlacedItems(prev => prev.map(item => item.id === id ? { ...item, rotation: item.rotation + delta } : item));
  };

  const cycleAnimation = (id: number) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const animations: ("none" | "float" | "pulse" | "spin")[] = ["none", "float", "pulse", "spin"];
      const currentIndex = animations.indexOf(item.animation || "none");
      const nextAnimation = animations[(currentIndex + 1) % animations.length];
      return { ...item, animation: nextAnimation };
    }));
  };

  const cycleFrameShape = (id: number | string) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const currentShape = (item as any).frameShape || 'rounded';
      const currentIndex = FRAME_SHAPES.indexOf(currentShape as FrameShapeType);
      const nextShape = FRAME_SHAPES[(currentIndex + 1) % FRAME_SHAPES.length];
      return { ...item, frameShape: nextShape };
    }));
  };

  const cycleScene = () => {
    const scenes: SceneType[] = ['rose', 'garden', 'forest', 'sunset', 'ocean', 'sakura', 'sky', 'plain'];
    const currentIndex = scenes.indexOf(scene);
    setScene(scenes[(currentIndex + 1) % scenes.length]);
  };

  const cycleBgStyle = () => {
    const styles: BgStyleType[] = ['solid', 'floating', 'hearts', 'grid', 'blobs'];
    const currentIndex = styles.indexOf(bgStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setBgStyle(nextStyle);
    updateActiveProjectContent({ bgStyle: nextStyle });
  };

  const toggleSnowEffect = () => {
    setSnowEffect(prev => {
      const next = !prev;
      updateActiveProjectContent({ snowEffect: next });
      return next;
    });
  };

  const cycleFont = () => {
    const fonts: FontStyleType[] = ['playfair', 'dancing', 'pacifico', 'caveat', 'lora', 'nunito', 'lobster', 'merriweather'];
    const currentIndex = fonts.indexOf(fontStyle);
    setFontStyle(fonts[(currentIndex + 1) % fonts.length]);
  };

  // One Click Resume - Save state
  useEffect(() => {
    if (activeProject && activeAppTab !== 'home') {
      if (activeProject.lastState?.tab !== activeAppTab) {
        updateActiveProject({
          lastState: {
            tab: activeAppTab,
          }
        });
      }
    }
  }, [activeAppTab, activeProject?.id, activeProject?.lastState?.tab]);

  // One Click Resume - Load state
  useEffect(() => {
    if (activeProject && activeProject.lastState?.tab && activeAppTab === 'project-dashboard') {
      // If we just opened the project dashboard, we could automatically redirect to last tab
      // but the user might want to see the dashboard first.
      // Let's make it a button on the dashboard instead or just auto-redirect if they "Open" from workspace.
    }
  }, [activeProject?.id]);

  const [relatedPanelInfo, setRelatedPanelInfo] = useState<{ id: string, type: EntityType } | null>(null);

  const isProjectMode = activeAppTab !== 'home' && !!activeProject;

  return (
    <>
      <ApplicationShell
        activeTab={activeAppTab}
        onSelectTab={(tab) => setActiveAppTab(tab)}
        sidebarOverride={isProjectMode ? (
          <ProjectSidebar 
            activeTab={activeAppTab}
            onTabChange={setActiveAppTab}
            onBackToWorkspace={() => setActiveAppTab('home')}
            projectTitle={activeProject?.title || 'Dự án'}
            projectIcon={activeProject?.icon || '📁'}
          />
        ) : undefined}
        onOpenStudioEditor={() => setActiveAppTab('editor')}
        onOpenSettings={() => {
          setShowSettingsMenu(true);
          setActiveAppTab('card');
        }}
        showSettingsMenu={showSettingsMenu}
        onToggleSettingsMenu={() => setShowSettingsMenu(!showSettingsMenu)}
        bgStyle={bgStyle}
        cycleBgStyle={cycleBgStyle}
        fontStyle={fontStyle}
        cycleFont={cycleFont}
        currentMusic={currentMusic}
        musicTracks={musicTracks}
        setCurrentMusic={setCurrentMusic}
        showMusicMenu={showMusicMenu}
        setShowMusicMenu={setShowMusicMenu}
        textColor={textColor}
        textColors={textColors}
        setTextColor={setTextColor}
        showTextColorMenu={showTextColorMenu}
        setShowTextColorMenu={setShowTextColorMenu}
        textSize={textSize}
        setTextSize={setTextSize}
        showTextSizeMenu={showTextSizeMenu}
        setShowTextSizeMenu={setShowTextSizeMenu}
        showPalette={showPalette}
        setShowPalette={setShowPalette}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        generateVideo={generateVideo}
        updateActiveProjectContent={updateActiveProjectContent}
      >
      <div 
        id="main-card-container"
        ref={mainCardContainerRef}
        className={`min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center ${config.bg} p-6 relative overflow-hidden transition-colors duration-500`}
        onClick={() => setSelectedDecorId(null)}
      >
        <div data-html2canvas-ignore="true">
          <AISidebar 
            onOpenExport={activeAppTab === 'card' ? (tab) => {
              setExportModalTab(tab);
              setIsCardExportOpen(true);
            } : undefined}
          />
        </div>
        <div data-html2canvas-ignore="true">
          <BackgroundMusicPlayer
            currentTrack={currentMusic}
            onSelectTrack={setCurrentMusic}
            tracks={musicTracks}
          />
        </div>

        <TabErrorBoundary tabName={activeAppTab} onReset={() => setActiveAppTab('home')}>
          <Suspense fallback={<DashboardSkeleton variant={activeAppTab === 'editor' ? 'editor' : 'default'} />}>
            {activeAppTab === 'home' && (
              <WorkspaceDashboard
                onNavigateTab={(tab) => setActiveAppTab(tab as AppTabType)}
                onOpenNewMemory={() => setActiveAppTab('memory')}
                onOpenNewTimeline={() => setActiveAppTab('timeline')}
                onContinueEditing={() => setActiveAppTab('editor')}
              />
            )}

            {activeAppTab === 'project-dashboard' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-8 px-6 bg-surface overflow-y-auto z-10 flex flex-col">
                {activeProject ? (
                  <div className="max-w-7xl mx-auto w-full">
                    <ProjectDashboard 
                      project={activeProject}
                      onNavigateToModule={setActiveAppTab as any}
                      onUpdateProject={updateActiveProject}
                    />
                  </div>
                ) : (
                  <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                      <Folder size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Chưa chọn dự án</h2>
                    <p className="text-slate-500 mb-6 text-sm">Vui lòng chọn một dự án từ Dashboard để xem chi tiết.</p>
                    <button 
                      onClick={() => setActiveAppTab('home')}
                      className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors"
                    >
                      Quay lại Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeAppTab === 'settings' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] bg-surface z-10 -m-6 sm:m-0">
                <SettingsDashboard />
              </div>
            )}

            <ProjectCommandCenter 
              isOpen={isCommandCenterOpen}
              onClose={() => setIsCommandCenterOpen(false)}
              project={activeProject!}
              onAction={(action, payload) => {
                if (action === 'open-editor') setActiveAppTab('editor');
                if (action === 'open-memory') setActiveAppTab('memory');
                // ... handle other actions
              }}
            />

            {activeAppTab === 'assets' && (
              <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col z-10 bg-surface">
                <MediaLibraryPanel />
              </div>
            )}

            {activeAppTab === 'memory' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-gradient-to-b from-rose-50/50 via-surface to-pink-50/30 overflow-y-auto z-10">
                <MemoryDashboard onOpenRelated={(id) => setRelatedPanelInfo({ id, type: 'memory' })} />
              </div>
            )}

            {activeAppTab === 'timeline' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-gradient-to-b from-rose-50/50 via-surface to-pink-50/30 overflow-y-auto z-10">
                <RelationshipTimelineView />
              </div>
            )}

            {activeAppTab === 'aistudio' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-gradient-to-b from-rose-50/50 via-surface to-pink-50/30 overflow-y-auto z-10">
                <AIStudioDashboard
                  onOpenInEditor={(text) => {
                    const cleanedText = cleanAIGeneratedText(text);
                    setMessage(cleanedText);
                    setActiveAppTab('editor');
                  }}
                  onNavigateTab={(tab) => {
                    if (tab === 'home' || tab === 'card' || tab === 'memory' || tab === 'timeline' || tab === 'aistudio' || tab === 'editor') {
                      setActiveAppTab(tab);
                    }
                  }}
                />
              </div>
            )}

            {activeAppTab === 'people' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <PeopleView />
              </div>
            )}

            {activeAppTab === 'places' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <PlacesView />
              </div>
            )}

            {activeAppTab === 'knowledge' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <KnowledgeDashboard 
                  projectId={activeProject?.id || projects[0]?.id || 'proj-default'} 
                  project={activeProject || projects[0]}
                  onNavigateToModule={setActiveAppTab as any}
                />
              </div>
            )}

            {activeAppTab === 'automation' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <AutomationDashboard />
              </div>
            )}

            {activeAppTab === 'collaboration' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <div className="max-w-7xl mx-auto">
                  <CollaborationDashboard 
                    project={activeProject || projects[0] || DEFAULT_FALLBACK_PROJECT} 
                    onNavigateToModule={setActiveAppTab as any} 
                    onUpdateProject={updateActiveProject} 
                  />
                </div>
              </div>
            )}

            {activeAppTab === 'sync' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <SyncDashboard />
              </div>
            )}

            {activeAppTab === 'plugins' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] py-6 px-2 sm:px-6 bg-surface overflow-y-auto z-10">
                <PluginManagerDashboard />
              </div>
            )}

            {activeAppTab === 'graph' && (
              <div className="w-full h-[calc(100vh-3.5rem)] z-10">
                <GraphView />
              </div>
            )}

            <RelatedContentPanel 
              isOpen={!!relatedPanelInfo}
              entityId={relatedPanelInfo?.id || ''}
              entityType={relatedPanelInfo?.type || 'memory'}
              onClose={() => setRelatedPanelInfo(null)}
              onNavigate={(type, id) => {
                // Handle cross-linking navigation
                console.log('Navigating to', type, id);
              }}
            />

            {activeAppTab === 'design-system' && (
              <div className="w-full min-h-[calc(100vh-3.5rem)] bg-surface overflow-y-auto z-10">
                <DesignSystemPlayground />
              </div>
            )}

            {activeAppTab === 'editor' && (
              <div className="w-full h-[calc(100vh-3.5rem)] relative z-10">
                <StudioEditor
                  initialTitle={title}
                  initialMessage={message}
                  initialPlacedItems={placedItems}
                  scene={scene}
                  bgStyle={bgStyle}
                  fontStyle={fontStyle}
                  textColor={textColor}
                  onClose={() => setActiveAppTab('card')}
                  onSyncToCard={(newTitle, newMsg, newItems) => {
                    setTitle(newTitle);
                    setMessage(newMsg);
                    if (Array.isArray(newItems)) {
                      const validItems = newItems.filter(item => item && (item.type in decorRegistry || item.url || item.imageUrl || item.type === 'image'));
                      if (validItems.length > 0) {
                        setPlacedItems(validItems);
                      }
                    }
                    setActiveAppTab('card');
                  }}
                />
              </div>
            )}
          </Suspense>
        </TabErrorBoundary>

        {activeAppTab === 'card' && (
          <>
      {/* Decorative background elements */}
      {bgStyle === 'floating' && (
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div 
              key={`float-bg-${i}`} 
              className="absolute"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ 
                y: [0, -40, 0],
                x: [0, 30, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {config.icon}
            </motion.div>
          ))}
        </div>
      )}

      {bgStyle === 'hearts' && (
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={`heart-bg-${i}`} 
              className="absolute text-rose-500"
              style={{ left: `${Math.random() * 100}%`, bottom: '-10%' }}
              animate={{ 
                y: ['0vh', '-110vh'],
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear'
              }}
            >
              <Heart size={20 + Math.random() * 40} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}

      {bgStyle === 'grid' && (
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
      )}

      {bgStyle === 'blobs' && (
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden blur-3xl">
          <motion.div 
            className="absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-rose-300 rounded-full mix-blend-multiply" 
            animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }} 
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} 
          />
          <motion.div 
            className="absolute top-1/4 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply" 
            animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }} 
            transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} 
          />
          <motion.div 
            className="absolute bottom-10 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply" 
            animate={{ x: [0, 50, 0], y: [0, -100, 0], scale: [1, 1.3, 1] }} 
            transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} 
          />
        </div>
      )}

      {/* Snowfall Effect Layer */}
      {snowEffect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-15" aria-hidden="true">
          {Array.from({ length: 36 }).map((_, i) => {
            const size = 7 + (i % 5) * 3.5;
            const isFlakeIcon = i % 3 === 0;
            const leftPos = (i * 2.8 + (i % 7) * 3.7) % 100;
            const duration = 6.5 + (i % 6) * 2;
            const delay = (i * 0.35) % 7;
            const sway = 16 + (i % 4) * 10;

            return (
              <motion.div
                key={`snow-flake-${i}`}
                className="absolute text-white select-none pointer-events-none"
                style={{
                  left: `${leftPos}%`,
                  top: '-8%',
                  opacity: 0.65 + (i % 4) * 0.1,
                }}
                animate={{
                  y: ['0vh', '112vh'],
                  x: [0, sway, -sway, 0],
                  rotate: [0, (i % 2 === 0 ? 1 : -1) * 360],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: 'linear',
                }}
              >
                {isFlakeIcon ? (
                  <Snowflake size={size} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.85)]" />
                ) : (
                  <div 
                    className="rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" 
                    style={{ width: `${Math.max(4, size * 0.6)}px`, height: `${Math.max(4, size * 0.6)}px` }} 
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Text Content */}
      <div className="text-center z-10" style={{ transform: `scale(${textSize})`, transformOrigin: 'center' }}>
        {isEditing ? (
          <div className="relative w-full">
            <div data-export-text-content="true" className="absolute inset-0 opacity-0 pointer-events-none flex flex-col items-center justify-center">
              <h1 className={`text-5xl md:text-7xl ${fontRegistry[fontStyle].class} ${config.text} mb-4 transition-all leading-tight`}>
                {renderSpannedText(title)}
              </h1>
              <p className={`text-3xl md:text-4xl ${fontRegistry[fontStyle].class} ${config.secondary} mb-8 transition-all leading-relaxed`}>
                {renderSpannedText(message)}
              </p>
            </div>
            <div data-html2canvas-ignore="true" className="w-full">
              <ComposingInput 
                value={title} 
                onChange={(e: any) => setTitle(e.target.value.normalize('NFC'))} 
                onFocus={(e: any) => e.target.select()}
                className={`text-4xl md:text-6xl ${fontRegistry[fontStyle].class} ${config.text} mb-4 bg-white/20 border-2 border-dashed border-rose-300/30 rounded-lg p-2 w-full text-center focus:outline-none focus:border-rose-500/50 transition-all`} 
                placeholder="Nhập tiêu đề..."
              />
              <ComposingTextarea 
                value={message} 
                onChange={(e: any) => setMessage(e.target.value.normalize('NFC'))} 
                onFocus={(e: any) => e.target.select()}
                className={`text-2xl md:text-3xl ${fontRegistry[fontStyle].class} ${config.secondary} mb-3 bg-white/20 border-2 border-dashed border-rose-300/30 rounded-lg p-2 w-full text-center focus:outline-none focus:border-rose-500/50 transition-all resize-y`} 
                placeholder="Nhập lời nhắn..."
              />
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={generateAIWishes}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  title="Tự động tạo 3 mẫu lời chúc lãng mạn bằng Gemini AI"
                >
                  <Sparkles size={14} className="text-amber-200 animate-pulse" />
                  <span>Gợi ý lời chúc bằng AI</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className={`text-5xl md:text-7xl ${fontRegistry[fontStyle].class} ${config.text} mb-4 transition-all leading-tight ${title === "Nhập chủ đề" ? "opacity-60" : ""}`}>
              {renderSpannedText(title)}
            </h1>
            <p className={`text-3xl md:text-4xl ${fontRegistry[fontStyle].class} ${config.secondary} mb-8 transition-all leading-relaxed ${message === "Hãy vào Tùy chỉnh để cài đặt." ? "opacity-60" : ""}`}>
              {renderSpannedText(message)}
            </p>
          </>
        )}
      </div>

      {/* Global SVG Definitions for Frame Shapes */}
      <GlobalFrameSvgDefs />

      {/* Placed decor items & custom photos */}
      {placedItems.map(item => {
        const decor = decorRegistry[item.type as keyof typeof decorRegistry];
        const customImg = (item as any).url || (item as any).imageUrl || (decor?.type === 'image' ? (decor.content as string) : null);
        if (!decor && !customImg) return null;
        
        const frameShape = (item as any).frameShape || 'rounded';
        const shapeConfig = FRAME_SHAPE_MAP[frameShape as FrameShapeType] || FRAME_SHAPE_MAP.rounded;
        const frameStyle = getFrameStyle(frameShape as FrameShapeType);

        const currentAnimate = item.animation === 'float' ? { y: [0, -20, 0], x: [0, 10, -10, 0] } :
                              item.animation === 'pulse' ? { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] } :
                              item.animation === 'spin' ? { rotate: [0, 360] } :
                              {};
        const currentTransition = item.animation === 'float' ? { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } :
                                 item.animation === 'pulse' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } :
                                 item.animation === 'spin' ? { duration: 4, repeat: Infinity, ease: 'linear' as const } :
                                 {};

        return (
          <motion.div
            key={item.id}
            drag
            dragMomentum={false}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelectedDecorId(item.id);
            }}
            onClick={(e) => e.stopPropagation()}
            onDragEnd={(_, info) => {
              setPlacedItems(prev => prev.map(p => p.id === item.id ? { ...p, x: p.x + info.offset.x, y: p.y + info.offset.y } : p));
            }}
            initial={{ x: item.x, y: item.y, scale: item.scale, rotate: item.rotation }}
            animate={{ x: item.x, y: item.y, scale: item.scale, rotate: item.rotation }}
            className={`absolute cursor-move group z-50`}
          >
            {(item as any).emoji ? (
              <motion.div
                animate={currentAnimate}
                transition={currentTransition}
                className={`text-5xl sm:text-6xl drop-shadow-md select-none transition-all p-1 ${selectedDecorId === item.id ? 'ring-2 ring-rose-500/90 ring-offset-2 ring-offset-transparent rounded-2xl scale-[1.03]' : ''}`}
              >
                {(item as any).emoji}
              </motion.div>
            ) : customImg ? (
              <div className={selectedDecorId === item.id ? 'ring-2 ring-rose-500/90 ring-offset-2 ring-offset-transparent rounded-2xl' : ''}>
                <FramedPhotoRender
                  src={customImg}
                  frameShape={frameShape as FrameShapeType}
                  animate={currentAnimate}
                  transition={currentTransition}
                  className={decor ? "w-20 h-20 sm:w-24 sm:h-24 object-contain" : "w-32 h-32 sm:w-44 sm:h-44 object-contain"}
                  objectFit={decor ? 'contain' : 'cover'}
                />
              </div>
            ) : decor?.type === 'icon' ? (
              <motion.div 
                className={`${item.color ? "" : config.accent} ${selectedDecorId === item.id ? 'ring-2 ring-rose-500/90 ring-offset-2 ring-offset-transparent rounded-2xl p-1' : ''}`} 
                style={item.color ? { color: item.color } : {}}
                animate={currentAnimate}
                transition={currentTransition}
              >
                <decor.content size={48} />
              </motion.div>
            ) : null}

            {/* Touch-friendly Floating Action Bar for Selected Sticker */}
            <div 
              data-html2canvas-ignore="true" 
              className={`absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-rose-200/80 shadow-xl z-60 transition-all ${selectedDecorId === item.id ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); scaleDecor(item.id, 0.2); }} 
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-rose-900/40 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90" 
                title="Phóng to (+)"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); scaleDecor(item.id, -0.2); }} 
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-rose-900/40 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90" 
                title="Thu nhỏ (-)"
              >
                <Minus size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); rotateDecor(item.id, 15); }} 
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-rose-900/40 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90" 
                title="Xoay 15° (↻)"
              >
                <RotateCcw size={15} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); cycleFrameShape(item.id); }} 
                className="w-8 h-8 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90" 
                title={`Dáng khung: ${shapeConfig.label}`}
              >
                {shapeConfig.icon}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); cycleAnimation(item.id); }} 
                className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90" 
                title={`Hiệu ứng: ${item.animation || 'Tĩnh'}`}
              >
                <Sparkles size={15} className="text-emerald-600" />
              </button>
              <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
              <button 
                onClick={(e) => { e.stopPropagation(); removeDecor(item.id); }} 
                className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90 shadow-sm" 
                title="Xóa sticker"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* Background Music Engine */}
      <div data-html2canvas-ignore="true">
        <BackgroundMusicPlayer currentTrack={currentMusic} />
      </div>

      {/* Top Customization Toolbar (Directly under Header when Tùy Chỉnh is active) */}
      <AnimatePresence>
        {showSettingsMenu && (
          <motion.div 
            data-html2canvas-ignore="true"
            ref={settingsMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 lg:top-[72px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-md text-slate-800"
          >
            {/* Primary Toolbar Row */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar">
              {/* 1. Heart Counter (Bắn tim) */}
              <button 
                onClick={addHeart} 
                className="p-2 sm:p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all flex items-center gap-1.5 justify-center font-bold shrink-0 border border-rose-200 cursor-pointer active:scale-95 shadow-xs"
                title="Bắn tim (+1)"
              >
                <Heart size={18} className="text-rose-500 fill-rose-500 animate-pulse" />
                <span className="text-xs font-extrabold text-rose-700">{totalHeartsCount}</span>
              </button>

              {/* 2. Reset Hearts (Mũi tên vòng tròn) */}
              <button 
                onClick={resetHearts} 
                className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center justify-center shrink-0 border border-slate-200 cursor-pointer active:scale-95 shadow-xs"
                title="Đặt lại lượt thả tim"
              >
                <RotateCcw size={18} className="text-slate-600" />
              </button>

              {/* 3. Change Scene (Đổi cảnh) */}
              <button 
                onClick={cycleScene} 
                className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all flex items-center justify-center shrink-0 border border-emerald-200 cursor-pointer active:scale-95 shadow-xs"
                title="Đổi phông cảnh / chủ đề"
              >
                <Leaf size={18} className="text-emerald-600" />
              </button>

              <div className="h-6 w-[1px] bg-slate-200 shrink-0 my-auto mx-0.5" />

              {/* 4. BG Style (B1) */}
              <button 
                onClick={cycleBgStyle} 
                className="p-2 sm:p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition-all flex items-center justify-center shrink-0 border border-purple-200 cursor-pointer active:scale-95 shadow-xs"
                title={`Đổi kiểu nền (Hiện tại: ${bgStyle})`}
              >
                <Sparkles size={18} className="text-purple-500" />
              </button>

              {/* 4.5. Snow Effect (Hiệu ứng tuyết rơi) */}
              <button 
                onClick={toggleSnowEffect} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  snowEffect 
                    ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold ring-2 ring-sky-400/30' 
                    : 'bg-sky-50/70 hover:bg-sky-100 text-sky-700 border-sky-200'
                }`}
                title={snowEffect ? "Tắt hiệu ứng tuyết rơi" : "Bật hiệu ứng tuyết rơi nhẹ (Mùa đông & Lễ hội)"}
              >
                <Snowflake size={18} className={`${snowEffect ? 'text-sky-600 animate-spin' : 'text-sky-500'}`} style={{ animationDuration: '12s' }} />
              </button>

              {/* 5. Font Style (B2) */}
              <button 
                onClick={() => {
                  setShowFontMenu(!showFontMenu);
                  setShowMusicMenu(false);
                  setShowTextColorMenu(false);
                  setShowTextSizeMenu(false);
                  setShowPalette(false);
                }} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  showFontMenu 
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold ring-2 ring-indigo-400/30' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}
                title={`Chọn phông chữ (${fontRegistry[fontStyle]?.name || fontStyle})`}
              >
                <Type size={18} className="text-indigo-600" />
              </button>

              {/* 6. Music Selection (B3) */}
              <button 
                onClick={() => {
                  setShowMusicMenu(!showMusicMenu);
                  setShowFontMenu(false);
                  setShowTextColorMenu(false);
                  setShowTextSizeMenu(false);
                  setShowPalette(false);
                }} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  showMusicMenu || currentMusic.id !== 'none' 
                    ? 'bg-violet-100 text-violet-800 border-violet-300 font-bold ring-2 ring-violet-400/30' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={`Nhạc nền (${currentMusic.label})`}
              >
                <Music size={18} className="text-violet-600" />
              </button>

              {/* 7. Text Color (B4) */}
              <button 
                onClick={() => {
                  setShowTextColorMenu(!showTextColorMenu);
                  setShowFontMenu(false);
                  setShowMusicMenu(false);
                  setShowTextSizeMenu(false);
                  setShowPalette(false);
                }} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  showTextColorMenu || textColor !== 'default' 
                    ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold ring-2 ring-amber-400/30' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Đổi màu chữ"
              >
                <Palette size={18} className="text-amber-500" />
              </button>

              {/* 8. Text Size (B5) */}
              <button 
                onClick={() => {
                  setShowTextSizeMenu(!showTextSizeMenu);
                  setShowFontMenu(false);
                  setShowMusicMenu(false);
                  setShowTextColorMenu(false);
                  setShowPalette(false);
                }} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  showTextSizeMenu || textSize !== 1 
                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold ring-2 ring-rose-400/30' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={`Tăng/giảm cỡ chữ (${Math.round(textSize * 100)}%)`}
              >
                <Wand2 size={18} className="text-rose-600" />
              </button>

              {/* 9. Decor / Họa tiết (B6) */}
              <button 
                onClick={() => {
                  setShowPalette(!showPalette);
                  setShowFontMenu(false);
                  setShowMusicMenu(false);
                  setShowTextColorMenu(false);
                  setShowTextSizeMenu(false);
                }} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  showPalette 
                    ? 'bg-pink-100 text-pink-800 border-pink-300 font-bold ring-2 ring-pink-400/30' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Chèn họa tiết trang trí"
              >
                <Flower size={18} className="text-pink-500" />
              </button>

              {/* 10. Edit text toggle (B7) */}
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 border cursor-pointer shadow-xs active:scale-95 ${
                  isEditing 
                    ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold ring-2 ring-blue-400/30' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={isEditing ? "Đã bật sửa chữ - Bấm để khóa" : "Sửa chữ trực tiếp"}
              >
                {isEditing ? <Check size={18} className="text-emerald-600" /> : <PenTool size={18} className="text-blue-500" />}
              </button>

              {/* 10.5. AI Wish Suggestion (Gợi ý lời chúc bằng AI) */}
              <button 
                onClick={generateAIWishes} 
                className="px-2.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium text-xs transition-all flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 gap-1.5"
                title="Gợi ý 3 mẫu lời chúc lãng mạn bằng AI Gemini dựa trên chủ đề hiện tại"
              >
                <Sparkles size={16} className="text-amber-200" />
                <span className="hidden md:inline font-bold">Gợi ý lời chúc AI</span>
              </button>

              <div className="h-6 w-[1px] bg-slate-200 shrink-0 my-auto mx-0.5" />

              {/* 11. Studio 4.0 */}
              <button 
                onClick={() => setShowStudioEditor(true)} 
                className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white transition-all flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95"
                title="Mở Studio 4.0 để sửa thiệp chi tiết"
              >
                <Sparkles size={18} />
              </button>

              {/* 12. Tạo Video */}
              <button 
                onClick={generateVideo} 
                className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all flex items-center justify-center shrink-0 border border-emerald-200 cursor-pointer active:scale-95 shadow-xs"
                title="Xuất video animation"
              >
                <Video size={18} className="text-emerald-600" />
              </button>
            </div>

            {/* Sub-toolbar Panels (Unclipped secondary rows) */}
            <AnimatePresence mode="wait">
              {/* Font Style Sub-panel with live typography preview */}
              {showFontMenu && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-50/95 border-t border-indigo-100 px-3 py-2.5 text-xs shadow-inner"
                >
                  <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-950 flex items-center gap-1.5 text-xs">
                        <Type size={14} className="text-indigo-600" /> Xem trước & Chọn phông chữ thiệp:
                      </span>
                      <button
                        type="button"
                        onClick={cycleFont}
                        className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer"
                        title="Chuyển nhanh sang phông kế tiếp"
                      >
                        <RotateCcw size={11} /> Đổi nhanh
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {(Object.entries(fontRegistry) as [FontStyleType, typeof fontRegistry[FontStyleType]][]).map(([key, config]) => {
                        const isSelected = fontStyle === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setFontStyle(key);
                              updateActiveProjectContent({ fontStyle: key });
                            }}
                            className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer flex flex-col justify-between border min-w-[130px] sm:min-w-[155px] ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 scale-[1.02]'
                                : 'bg-white hover:bg-indigo-50/90 text-slate-800 border-indigo-200/90 shadow-2xs hover:border-indigo-300'
                            }`}
                            title={`Áp dụng phông ${config.name} (${config.label})`}
                          >
                            <div className="flex items-center justify-between gap-1 w-full">
                              <div className="flex flex-col">
                                <span className={`text-[11px] font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                  {config.name}
                                </span>
                                <span className={`text-[9px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                  {config.label}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-white text-indigo-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                                  ✓
                                </span>
                              )}
                            </div>

                            {/* Visual typography sample preview */}
                            <div className="mt-1.5 pt-1 border-t border-black/5 flex items-baseline gap-1.5 overflow-hidden">
                              <span className={`text-base font-bold leading-none ${config.class} ${isSelected ? 'text-indigo-100' : 'text-indigo-600'}`}>
                                Aa
                              </span>
                              <span className={`text-xs leading-none truncate ${config.class} ${isSelected ? 'text-white/95' : 'text-slate-700'}`}>
                                {config.sample}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Music Sub-panel */}
              {showMusicMenu && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-violet-50/90 border-t border-violet-100 px-3 py-2 text-xs"
                >
                  <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="font-semibold text-violet-900 shrink-0 flex items-center gap-1">
                      <Music size={14} /> Nhạc nền:
                    </span>
                    {musicTracks.map(track => (
                      <button
                        key={track.id}
                        onClick={() => {
                          const isSelected = currentMusic.id === track.id;
                          const updated = isSelected 
                            ? { ...track, trimStart: currentMusic.trimStart, trimDuration: currentMusic.trimDuration } 
                            : track;
                          setCurrentMusic(updated);
                          updateActiveProjectContent({ musicTrack: updated });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentMusic.id === track.id
                            ? 'bg-violet-600 text-white font-bold shadow-xs'
                            : 'bg-white hover:bg-violet-100 text-violet-950 border border-violet-200'
                        }`}
                      >
                        <track.icon size={13} />
                        <span>{track.label}</span>
                      </button>
                    ))}

                    {currentMusic.id !== 'none' && (
                      <button
                        type="button"
                        onClick={() => setIsAudioTrimmerOpen(true)}
                        className="ml-auto shrink-0 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        title="Cắt & chọn đoạn nhạc nền điệp khúc"
                      >
                        <Scissors size={13} />
                        <span>✂️ Cắt đoạn nhạc ({currentMusic.trimStart || 0}s - {(currentMusic.trimStart || 0) + (currentMusic.trimDuration || 30)}s)</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Text Color Sub-panel */}
              {showTextColorMenu && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/90 border-t border-amber-100 px-3 py-2 text-xs"
                >
                  <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="font-semibold text-amber-900 shrink-0 flex items-center gap-1">
                      <Palette size={14} /> Chọn màu chữ:
                    </span>
                    {textColors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setTextColor(color.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                          textColor === color.id
                            ? 'bg-amber-600 text-white font-bold shadow-xs'
                            : 'bg-white hover:bg-amber-100 text-slate-800 border border-amber-200'
                        }`}
                      >
                        <span>{color.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Text Size Sub-panel */}
              {showTextSizeMenu && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50/90 border-t border-rose-100 px-3 py-2 text-xs"
                >
                  <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <span className="font-semibold text-rose-900 shrink-0">Cỡ chữ:</span>
                    <button
                      onClick={() => setTextSize(prev => Math.max(0.5, +(prev - 0.1).toFixed(1)))}
                      className="p-1.5 bg-white hover:bg-rose-200 text-rose-800 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                      title="Giảm"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="font-bold text-rose-950 min-w-[50px] text-center text-sm">
                      {Math.round(textSize * 100)}%
                    </span>
                    <button
                      onClick={() => setTextSize(prev => Math.min(2.5, +(prev + 0.1).toFixed(1)))}
                      className="p-1.5 bg-white hover:bg-rose-200 text-rose-800 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                      title="Tăng"
                    >
                      <Plus size={15} />
                    </button>
                    <div className="flex gap-1.5 ml-2">
                      {[0.8, 1, 1.25, 1.5, 2].map(preset => (
                        <button
                          key={preset}
                          onClick={() => setTextSize(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            textSize === preset 
                              ? 'bg-rose-600 text-white font-bold' 
                              : 'bg-white hover:bg-rose-100 text-rose-900 border border-rose-200'
                          }`}
                        >
                          {Math.round(preset * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Decor & Emoji Studio Panel */}
              {showPalette && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-pink-50/95 border-t border-pink-100 px-3 py-3 text-xs shadow-inner"
                >
                  <div className="max-w-7xl mx-auto flex flex-col gap-3">
                    {/* Header & Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200/80 pb-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <span className="font-bold text-pink-950 flex items-center gap-1 text-xs shrink-0 mr-1">
                          <SmilePlus size={15} className="text-pink-600" /> Sticker & Emoji Studio:
                        </span>
                        <button
                          type="button"
                          onClick={() => setDecorTab('emojis')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            decorTab === 'emojis'
                              ? 'bg-pink-600 text-white shadow-xs'
                              : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
                          }`}
                        >
                          <span>🥰 Emoji Lãng Mạn</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDecorTab('stickers')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            decorTab === 'stickers'
                              ? 'bg-pink-600 text-white shadow-xs'
                              : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
                          }`}
                        >
                          <span>✨ Sticker & Họa Tiết</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDecorTab('frames')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            decorTab === 'frames'
                              ? 'bg-pink-600 text-white shadow-xs'
                              : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
                          }`}
                        >
                          <span>🖼️ Dáng Khung</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-pink-200 shadow-2xs">
                          <span className="text-[11px] text-slate-600 font-medium">Màu Icon:</span>
                          <input type="color" value={decorColor} onChange={e => setDecorColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 p-0" />
                        </div>
                        {placedItems.length > 0 && (
                          <button onClick={clearAllDecor} className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 px-2.5 py-1 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1">
                            <Trash2 size={12} /> Xóa tất cả ({placedItems.length})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Input Filter */}
                    <div className="relative w-full max-w-sm">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={stickerSearchQuery}
                        onChange={e => setStickerSearchQuery(e.target.value)}
                        placeholder="Tìm Emoji hoặc Sticker (ví dụ: tim, hoa, quà, chim, bánh...)..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 shadow-2xs"
                      />
                    </div>

                    {/* Content View Based on Tab */}
                    {decorTab === 'emojis' && (
                      <div className="flex flex-col gap-2 max-h-20 overflow-y-auto pr-1 custom-scrollbar">
                        {EMOJI_CATEGORIES.map((cat, idx) => {
                          const filtered = cat.items.filter(e => !stickerSearchQuery || e.includes(stickerSearchQuery));
                          if (filtered.length === 0) return null;
                          return (
                            <div key={idx} className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-pink-900">{cat.category}:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {filtered.map((emojiChar, eIdx) => (
                                  <button
                                    key={eIdx}
                                    type="button"
                                    onClick={() => addEmojiDecor(emojiChar)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white hover:bg-pink-100 border border-pink-200/90 text-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-2xs cursor-pointer"
                                    title={`Thêm ${emojiChar} vào thiệp`}
                                  >
                                    {emojiChar}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {decorTab === 'stickers' && (
                      <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pt-1 pr-1 custom-scrollbar">
                        {(Object.keys(decorRegistry) as DecorType[])
                          .filter(t => !stickerSearchQuery || t.toLowerCase().includes(stickerSearchQuery.toLowerCase()))
                          .map(type => {
                            const decor = decorRegistry[type];
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => addDecor(type)}
                                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-pink-100 rounded-lg cursor-pointer border border-pink-200 shadow-2xs hover:scale-105 active:scale-95 transition-all"
                                title={`Thêm ${type} vào thiệp`}
                              >
                                {decor.type === 'icon' ? (
                                  <div style={{ color: decorColor }}><decor.content size={16} /></div>
                                ) : (
                                  <img src={decor.content as string} alt={type} className="w-5 h-5 object-contain" />
                                )}
                                <span className="text-[10px] font-semibold text-slate-700">{type}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}

                    {decorTab === 'frames' && (
                      <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pt-1 pr-1 custom-scrollbar">
                        {FRAME_SHAPES.map(shapeKey => {
                          const conf = FRAME_SHAPE_MAP[shapeKey];
                          return (
                            <button
                              key={shapeKey}
                              type="button"
                              onClick={() => {
                                if (selectedDecorId) {
                                  cycleFrameShape(selectedDecorId);
                                } else if (placedItems.length > 0) {
                                  cycleFrameShape(placedItems[placedItems.length - 1].id);
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-purple-50 rounded-lg cursor-pointer border border-purple-200 shadow-2xs hover:scale-105 active:scale-95 transition-all text-[10px] font-bold text-purple-900"
                              title={`Áp dụng khung ${conf.label}`}
                            >
                              <span className="text-sm">{conf.icon}</span>
                              <span>{conf.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute text-rose-500`}
            style={{ 
              left: `calc(50% + ${heart.x}px)`, 
              top: `calc(50% + ${heart.y}px)` 
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <Heart size={32} fill="currentColor" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      </>
      )}

      {/* Video Generation Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative overflow-hidden border border-rose-100 flex flex-col items-center text-center"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <Film className="text-rose-500 animate-pulse" size={24} />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Trình tạo Video AI</h3>
              </div>

              {isVideoGenerating ? (
                <div className="py-8 flex flex-col items-center justify-center w-full">
                  <div className="relative w-20 h-20 mb-6">
                    <Loader2 className="w-20 h-20 text-rose-500 animate-spin absolute" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-8 h-8 text-rose-400 animate-bounce" />
                    </div>
                  </div>

                  {/* Step status */}
                  <div className="space-y-3 w-full max-w-xs text-left">
                    {[
                      "Phân tích bố cục & vật trang trí",
                      "Sáng tác nhạc nền AI (10s - 20s)",
                      "Biên dịch hiệu ứng chuyển động",
                      "Kết xuất video HD Agnes AI"
                    ].map((stepText, idx) => {
                      const isDone = idx < videoGenerationStep;
                      const isCurrent = idx === videoGenerationStep;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-white' :
                            isCurrent ? 'bg-rose-500 text-white animate-pulse' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className={`text-sm font-medium ${
                            isDone ? 'text-emerald-600 line-through' :
                            isCurrent ? 'text-gray-900 font-semibold' :
                            'text-gray-400'
                          }`}>
                            {stepText}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-8 text-xs text-gray-400 animate-pulse">
                    Vui lòng đợi trong giây lát, quá trình tạo video có thể mất từ 10 - 20 giây...
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  {videoGenResult && videoGenResult.success ? (
                    <div className="w-full flex flex-col items-center">
                      <div id="generated-card-container" className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-gray-100 mb-4 relative flex items-center justify-center">
                        {(videoGenResult.simulation || videoGenResult.isSimulated) && (
                          <div className="absolute top-3 inset-x-3 z-50 bg-amber-500/95 backdrop-blur-sm border border-amber-400 text-white rounded-xl p-3 shadow-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-500">
                            <AlertCircle size={20} className="shrink-0 mt-0.5 text-white" />
                            <div className="text-left">
                              <p className="text-sm font-bold mb-0.5">Bản xem trước - chưa dùng AI thật</p>
                              <p className="text-xs text-amber-50 leading-relaxed">Hình ảnh tĩnh xem trước từ nội dung thiệp của bạn (dịch vụ AI video hiện không khả dụng).</p>
                            </div>
                          </div>
                        )}
                        {generatedVideoUrl && (
                          isGeneratedMediaImage || generatedVideoUrl.startsWith('data:')
                        ) ? (
                          <div className="w-full h-full overflow-hidden absolute inset-0">
                            <img
                              src={generatedVideoUrl}
                              crossOrigin={!generatedVideoUrl || generatedVideoUrl.startsWith('data:') || generatedVideoUrl.startsWith('blob:') ? undefined : "anonymous"}
                              alt="AI generated greeting card"
                              className="w-full h-full object-cover animate-kenburns"
                            />
                          </div>
                        ) : (
                          <video
                            src={generatedVideoUrl || ""}
                            crossOrigin={!generatedVideoUrl || generatedVideoUrl.startsWith('data:') || generatedVideoUrl.startsWith('blob:') ? undefined : "anonymous"}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover absolute inset-0"
                          />
                        )}

                        {/* HIGH QUALITY OVERLAY FOR TEXT AND DECOR */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 z-10 overflow-hidden select-none">
                          <div className="text-center w-full max-w-full scale-75 sm:scale-90 transition-transform origin-center">
                            <h1 className={`text-2xl sm:text-3xl font-bold ${fontRegistry[fontStyle].class} ${config.text} mb-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] leading-tight`}>
                              {renderSpannedText(title)}
                            </h1>
                            <p className={`text-base sm:text-lg font-medium ${fontRegistry[fontStyle].class} ${config.secondary} drop-shadow-[0_1.5px_3px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)] leading-relaxed`}>
                              {renderSpannedText(message)}
                            </p>
                          </div>
                        </div>

                        {/* Overlay Placed Items */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-20">
                          {snowEffect && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                              {Array.from({ length: 18 }).map((_, i) => (
                                <motion.div
                                  key={`modal-snow-${i}`}
                                  className="absolute text-white"
                                  style={{
                                    left: `${(i * 5.8) % 100}%`,
                                    top: '-10%',
                                    opacity: 0.7,
                                  }}
                                  animate={{
                                    y: ['0%', '110%'],
                                    x: [0, 8, -8, 0],
                                  }}
                                  transition={{
                                    duration: 5 + (i % 4) * 1.5,
                                    repeat: Infinity,
                                    delay: (i * 0.3) % 4,
                                    ease: 'linear',
                                  }}
                                >
                                  {i % 2 === 0 ? <Snowflake size={10} className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]" /> : <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {placedItems.map(item => {
                            const decor = decorRegistry[item.type];
                            if (!decor) return null;

                            const currentAnimate = item.animation === 'float' ? { y: [0, -10, 0], x: [0, 5, -5, 0] } :
                                                  item.animation === 'pulse' ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1] } :
                                                  item.animation === 'spin' ? { rotate: [0, 360] } :
                                                  {};
                            const currentTransition = item.animation === 'float' ? { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } :
                                                     item.animation === 'pulse' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } :
                                                     item.animation === 'spin' ? { duration: 4, repeat: Infinity, ease: 'linear' as const } :
                                                     {};

                            // Scale down coordinate mapping for the preview box (relative coordinates starting from the center)
                            const scaleFactor = 0.35; 
                            const displayX = item.x * scaleFactor;
                            const displayY = item.y * scaleFactor;

                            return (
                              <motion.div
                                key={`preview-${item.id}`}
                                initial={{ x: displayX, y: displayY, scale: item.scale * 0.45, rotate: item.rotation }}
                                animate={{ x: displayX, y: displayY, scale: item.scale * 0.45, rotate: item.rotation }}
                                className="absolute"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                }}
                              >
                                {decor.type === 'icon' ? (
                                  <motion.div 
                                    className={item.color ? "" : config.accent} 
                                    style={item.color ? { color: item.color } : {}}
                                    animate={currentAnimate}
                                    transition={currentTransition}
                                  >
                                    <decor.content size={24} />
                                  </motion.div>
                                ) : (
                                  <motion.div 
                                    animate={currentAnimate}
                                    transition={currentTransition}
                                    className="bg-white/95 p-1 rounded-lg shadow-md border border-white flex items-center justify-center"
                                  >
                                    <img 
                                      src={decor.content as string} 
                                      alt={item.type} 
                                      className="w-10 h-10 object-contain" 
                                      draggable={false} 
                                      crossOrigin="anonymous"
                                    />
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mode details */}
                      {videoGenResult.simulation ? (
                        <div className="w-full mb-6">
                          {videoGenResult.apiKeyConfigured ? (
                            <div className="bg-rose-50 border border-rose-200 text-rose-950 rounded-2xl p-4 text-xs text-left flex items-start gap-3">
                              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                              <div className="flex-1">
                                <p className="font-bold text-rose-800 mb-1">Đã nhận mã API nhưng kết nối đến Agnes AI thất bại</p>
                                <p className="text-rose-700 leading-relaxed mb-2">
                                  Hệ thống đã nhận diện được mã API <b>AGNES_API_KEY</b> của bạn trong phần Cài đặt (Secrets), nhưng các cuộc gọi thử tới server của Agnes AI đã gặp sự cố.
                                </p>
                                {videoGenResult.warning && (
                                  <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100 font-mono text-[11px] text-rose-900 break-words leading-normal max-h-32 overflow-y-auto mb-2">
                                    <strong className="text-rose-950 font-semibold">Chi tiết lỗi: </strong>
                                    {videoGenResult.warning}
                                  </div>
                                )}
                                <p className="text-[11px] text-rose-600 font-medium">
                                  👉 <b>Hướng xử lý:</b> Hãy kiểm tra lại tính chính xác của mã khóa API của bạn trong menu Cài đặt (Secrets) ở góc trên bên phải. Đồng thời, đảm bảo tài khoản Agnes AI của bạn đang hoạt động bình thường và còn đủ lượt gọi.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl p-4 text-xs text-left flex items-start gap-3">
                              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold mb-1">Chế độ Xem trước (Chưa có API Key)</p>
                                <p className="text-amber-800 leading-relaxed mb-2">
                                  Tính năng xuất video đã sẵn sàng! Để kết xuất video thật, hãy điền mã API của bạn với tên <b>AGNES_API_KEY</b> (và cấu hình thêm <b>AGNES_API_BASE</b> nếu cần) trong menu Cài đặt (Secrets) ở góc trên bên phải.
                                </p>
                                <div className="bg-white/60 p-2 rounded-lg font-mono text-[10px] text-amber-900 space-y-1">
                                  <div>• Tiêu đề: {videoGenResult.details?.title}</div>
                                  <div>• Lời chúc: {videoGenResult.details?.message}</div>
                                  <div>• Nhạc nền: {videoGenResult.details?.music}</div>
                                  <div>• Decor: {videoGenResult.details?.decorCount} vật dụng</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 text-xs text-left mb-6 flex items-start gap-3">
                          <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-800 mb-1">Đã kết xuất thành công qua Agnes AI!</p>
                            <p className="text-emerald-700">Video của bạn đã được lưu và sẵn sàng tải về.</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 w-full flex-wrap">
                        <button
                          onClick={() => setIsVideoModalOpen(false)}
                          className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
                        >
                          Đóng
                        </button>

                        {generatedVideoUrl && (
                          <button
                            onClick={() => downloadCompleteCardImage('share')}
                            disabled={isSharingImage}
                            className="flex-1 py-3 px-4 bg-white border-2 border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-75"
                          >
                            {isSharingImage ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang chuẩn bị...
                              </>
                            ) : (
                              <>
                                <Share2 size={16} />
                                Chia sẻ
                              </>
                            )}
                          </button>
                        )}

                        {generatedVideoUrl && (
                          <button
                            onClick={downloadAnimatedCardVideo}
                            disabled={isExportingImage}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 disabled:opacity-75"
                            title="Tải về video/ảnh động hoàn chỉnh bao gồm nhạc, nền và chữ lời chúc"
                          >
                            {isExportingImage ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang ghi video động...
                              </>
                            ) : (
                              <>
                                <Video size={16} />
                                Tải Video Thiệp Có Chữ
                              </>
                            )}
                          </button>
                        )}

                        {generatedVideoUrl && (
                          <button
                            onClick={downloadAnimatedCardGif}
                            disabled={isExportingImage}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 disabled:opacity-75"
                            title="Tải về ảnh động GIF nhẹ 1-2MB để gửi qua Zalo, Messenger, WhatsApp"
                          >
                            {isExportingImage ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang tạo GIF...
                              </>
                            ) : (
                              <>
                                <Sparkles size={16} />
                                Tải GIF Động Nhẹ
                              </>
                            )}
                          </button>
                        )}

                        {generatedVideoUrl && (
                          <button
                            onClick={() => downloadCompleteCardImage('download')}
                            disabled={isExportingImage}
                            className="flex-1 py-3 px-4 bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
                            title="Tải về ảnh tĩnh định dạng PNG có đầy đủ chữ và trang trí"
                          >
                            <Sparkles size={16} className="text-rose-500" />
                            Tải Ảnh Tĩnh Có Chữ
                          </button>
                        )}

                        {generatedVideoUrl && (
                          <button
                            onClick={downloadRawAiFile}
                            disabled={isDownloadingRaw}
                            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-800/10 disabled:opacity-75"
                          >
                            {isDownloadingRaw ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang chuẩn bị...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                Tải File Gốc AI
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Không thể kết nối dịch vụ tạo video</p>
                      <p className="text-xs text-gray-500 max-w-xs mb-6">
                        {videoGenResult?.error || "Đã xảy ra lỗi không xác định khi yêu cầu kết xuất video."}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsVideoModalOpen(false)}
                          className="py-2.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={generateVideo}
                          className="py-2.5 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm transition-colors"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Studio Editor 4.0 Overlay */}
      {showStudioEditor && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        }>
          <StudioEditor
            initialTitle={title}
            initialMessage={message}
            initialPlacedItems={placedItems}
            scene={scene}
            bgStyle={bgStyle}
            fontStyle={fontStyle}
            textColor={textColor}
            onClose={() => setShowStudioEditor(false)}
            onSyncToCard={(newTitle, newMsg, newItems) => {
              setTitle(newTitle);
              setMessage(newMsg);
              if (Array.isArray(newItems)) {
                const validItems = newItems.filter(item => item && (item.type in decorRegistry || item.url || item.imageUrl || item.type === 'image'));
                if (validItems.length > 0) {
                  setPlacedItems(validItems);
                }
              }
              updateActiveProjectContent({
                title: newTitle,
                message: newMsg,
                ...(Array.isArray(newItems) ? { placedItems: newItems } : {}),
              });
              setShowStudioEditor(false);
            }}
          />
        </Suspense>
      )}
      </div>
      {isCommandPaletteOpen && (
        <Suspense fallback={null}>
          <UniversalSearchOverlay
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectResult={(result) => {
              // Handle navigation based on result type
              if (result.type === 'project') setActiveAppTab('project-dashboard');
              else if (result.type === 'memory') setActiveAppTab('memory');
              else if ((result.type as string) === 'automation') setActiveAppTab('aistudio');
            }}
          />
        </Suspense>
      )}
      {isCommandCenterOpen && (
        <Suspense fallback={null}>
          <CommandCenter 
            isOpen={isCommandCenterOpen}
            onClose={() => setIsCommandCenterOpen(false)}
          />
        </Suspense>
      )}
      {isCardExportOpen && (
        <Suspense fallback={null}>
          <ExportStudioModal
            isOpen={isCardExportOpen}
            onClose={() => setIsCardExportOpen(false)}
            initialTab={exportModalTab}
            mainCardRef={mainCardContainerRef}
            projectData={{
              title,
              message,
              placedItems,
              bgStyle,
              fontStyle,
              textColor,
              scene,
              textSize,
              activeProject
            }}
          />
        </Suspense>
      )}
    <AnimatePresence>
      {activeInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/95 dark:bg-slate-900/95 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-rose-100 dark:border-rose-950/50 p-8 text-center relative"
          >
            {/* Romantic Sparkles decor background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-100/50 dark:bg-rose-950/20 rounded-full blur-3xl -z-10" />
            
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100 dark:border-rose-900/30">
              <Heart className="animate-pulse" size={32} fill="currentColor" />
            </div>

            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Thư Mời Cộng Tác 💌
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
              Bạn nhận được lời mời tham gia dự án nghệ thuật từ Chủ hệ thống NoteMe.
            </p>

            <div className="bg-rose-50/50 dark:bg-rose-950/10 p-5 rounded-2xl border border-rose-100/60 dark:border-rose-950/30 my-6 text-left space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">Dự án mời</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 block">{activeInvitation.projectName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">Vai trò cộng tác</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{activeInvitation.role}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">Email được mời</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate block">{activeInvitation.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-1.5">Tên hiển thị của bạn</label>
                <input
                  type="text"
                  value={acceptName}
                  onChange={(e) => setAcceptName(e.target.value)}
                  placeholder="Nhập tên của bạn (ví dụ: Phương Nguyễn)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm font-semibold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.history.replaceState({}, '', window.location.pathname);
                    }
                    setActiveInvitation(null);
                  }}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => {
                    const finalName = acceptName.trim() || activeInvitation.email.split('@')[0] || 'Cộng tác viên';
                    
                    // 0. Notify server API so Owner's browser updates status in real-time
                    fetch('/api/collaboration/accept-invite', {
                      method: 'POST',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        inviteId: activeInvitation.memberId,
                        projectId: activeInvitation.projectId,
                        email: activeInvitation.email,
                        name: finalName
                      })
                    }).catch(err => console.error('Error syncing acceptance to server:', err));

                    // 1. Update member role and permissions to 'active'
                    const proj = projects.find(p => p.id === activeInvitation.projectId);
                    if (proj && proj.members) {
                      const memberObj = proj.members.find(m => m.id === activeInvitation.memberId);
                      collaborationService.updateMemberRoleAndPermissions(
                        activeInvitation.projectId,
                        activeInvitation.memberId,
                        activeInvitation.role as any,
                        memberObj?.permissions || { view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: false },
                        'active',
                        finalName
                      );
                    } else {
                      // Add member directly if project exists or ensure member registered
                      try {
                        collaborationService.addMember(
                          activeInvitation.projectId,
                          activeInvitation.email,
                          finalName,
                          activeInvitation.role as any,
                          undefined,
                          'active',
                          activeInvitation.email
                        );
                      } catch {
                        // Ignore if project not ready in local storage
                      }
                    }

                    // 2. Log in simulated collaborator
                    useWorkspaceZustandStore.getState().updateCurrentUser({
                      email: activeInvitation.email,
                      name: finalName,
                      role: `Cộng tác viên (${activeInvitation.role})`
                    });

                    // 3. Select project and open collaboration panel
                    selectProject(activeInvitation.projectId);
                    setActiveAppTab('collaboration');

                    // 4. Clear search params
                    if (typeof window !== 'undefined') {
                      window.history.replaceState({}, '', window.location.pathname);
                    }

                    // 5. Success
                    alert(`Tuyệt vời! Bạn đã tham gia cộng tác thành công dự án "${activeInvitation.projectName}" với tên "${finalName}"!`);
                    setActiveInvitation(null);
                  }}
                  className="flex-1 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Đồng ý & Tham gia
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
      {isAudioTrimmerOpen && (
        <Suspense fallback={null}>
          <AudioTrimmerModal
            isOpen={isAudioTrimmerOpen}
            onClose={() => setIsAudioTrimmerOpen(false)}
            track={currentMusic}
            onSaveTrim={(trimStart, trimDuration) => {
              const updated = {
                ...currentMusic,
                trimStart,
                trimDuration
              };
              setCurrentMusic(updated);
              updateActiveProjectContent({ musicTrack: updated });
            }}
          />
        </Suspense>
      )}

      {/* AI Wish Suggestion Modal */}
      <AnimatePresence>
        {isAIWishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-rose-100 dark:border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setIsAIWishModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-rose-500 rounded-2xl text-white shadow-md">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Gợi ý Lời Chúc AI Gemini
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sáng tạo tự động theo chủ đề: <span className="font-semibold text-rose-500">{title || 'Thiệp Yêu Thương'}</span> ({scene})
                  </p>
                </div>
              </div>

              {isGeneratingWishes ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 size={36} className="text-rose-500 animate-spin" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Gemini AI đang sáng tạo 3 mẫu lời chúc lãng mạn...
                  </p>
                  <p className="text-xs text-slate-400">Vui lòng đợi trong giây lát</p>
                </div>
              ) : (
                <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-1">
                  {aiWishes.map((wish, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-2xl bg-rose-50/60 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/50 transition-all group relative flex flex-col justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Mẫu lời chúc {index + 1}</span>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
                        "{wish}"
                      </p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => applyAIWish(wish)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <Check size={14} />
                          <span>Áp dụng mẫu này</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={generateAIWishes}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Tạo 3 mẫu khác</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ApplicationShell>
    </>
  );
}

export default function App() {
  return (
    <ProjectWorkspaceProvider>
      <AppContent />
    </ProjectWorkspaceProvider>
  );
}
