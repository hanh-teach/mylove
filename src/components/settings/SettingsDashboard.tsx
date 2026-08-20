import React, { useState, useEffect } from 'react';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { useTheme } from '../shell/ThemeContext';
import { useLanguage } from '../shell/LanguageContext';
import { 
  useCurrentUser, 
  useWorkspaces, 
  useActiveWorkspaceId, 
  useWorkspaceZustandStore 
} from '../../modules/workspace/WorkspaceZustandStore';
import { isOwnerUser, hasSupabaseStoragePermission } from '../../shared/utils/authPermissions';
import { validateSupabaseKeyRole } from '../../shared/utils/supabaseKeyValidator';
import { SUPPORT_CONTACT_EMAILS } from '../../config/contact';
import { 
  Settings, 
  BrainCircuit, 
  Bell, 
  Globe, 
  Palette, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  LogOut, 
  Trash2, 
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  X,
  Database,
  Lock,
  Crown,
  ShieldAlert,
  Copy,
  Check,
  Upload,
  Camera,
  CameraOff,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize2,
  Sliders,
  Contrast
} from 'lucide-react';

type SettingsSection = 'profile' | 'general' | 'ai' | 'notifications' | 'privacy' | 'supabase';

const translations = {
  vi: {
    title: 'Cài đặt hệ thống',
    subtitle: 'Quản lý tài khoản và thiết lập ứng dụng của bạn.',
    sections: {
      profile: 'Hồ sơ cá nhân',
      general: 'Tổng quan',
      ai: 'Cài đặt AI',
      notifications: 'Thông báo',
      privacy: 'Bảo mật',
      supabase: 'Supabase Storage'
    },
    profile: {
      edit: 'Chỉnh sửa ảnh',
      accountInfo: 'Thông tin tài khoản',
      unnamed: 'Chưa đặt tên',
      noEmail: 'Chưa cập nhật email',
      newMember: 'Thành viên mới'
    },
    general: {
      theme: 'Chủ đề ứng dụng',
      themeDesc: 'Chọn giao diện hiển thị phù hợp với bạn.',
      themes: { light: 'Sáng', dark: 'Tối', system: 'Hệ thống', highContrast: 'Tương phản cao' },
      lang: 'Ngôn ngữ hiển thị',
      langDesc: 'Thay đổi ngôn ngữ chính của giao diện.'
    },
    ai: {
      title: 'Trợ lý AI Chủ động',
      desc: 'AI sẽ tự động đưa ra các gợi ý và nhắc nhở thông minh.',
      beta: 'Tính năng AI đang ở phiên bản Beta',
      betaDesc: 'Chúng tôi liên tục cải thiện khả năng phản hồi và độ chính xác của AI.'
    },
    notifications: {
      app: 'Thông báo trong ứng dụng',
      appDesc: 'Nhận thông báo đẩy ngay trên màn hình.',
      email: 'Thông báo qua Email',
      emailDesc: 'Gửi báo cáo và cập nhật quan trọng vào hộp thư.'
    },
    privacy: {
      title: 'Bảo mật tài khoản',
      desc: 'Quản lý cách dữ liệu của bạn được bảo vệ.',
      "2fa": 'Xác thực 2 lớp (2FA)',
      statusActive: 'Đã kích hoạt',
      statusInactive: 'Chưa kích hoạt',
      danger: 'Vùng nguy hiểm',
      dangerDesc: 'Các hành động này có thể làm mất dữ liệu vĩnh viễn.',
      deleteBtn: 'XÓA TOÀN BỘ DỮ LIỆU DỰ ÁN'
    },
    supabaseSettings: {
      title: 'Kết nối Supabase Storage vĩnh viễn',
      desc: 'Cấu hình URL và API Key dự án Supabase của bạn để tải lên và lưu trữ ảnh trực tiếp an toàn.',
      urlLabel: 'Supabase Project URL',
      keyLabel: 'Supabase Anon / Service Key',
      bucketLabel: 'Storage Bucket Name',
      saveBtn: 'Lưu Cấu Hình Supabase',
      sqlTitle: 'Mã lệnh SQL thiết đặt nhanh (Chạy trong Supabase SQL Editor)',
      sqlDesc: 'Sao chép đoạn mã SQL này và dán vào Supabase SQL Editor để tự động tạo Bucket và phân quyền Public Read/Upload:',
      copySql: 'Sao chép SQL',
      copied: 'Đã sao chép!'
    },
    save: 'Lưu thay đổi',
    saving: 'Đang lưu...',
    success: 'Cài đặt đã được lưu thành công!'
  },
  en: {
    title: 'System Settings',
    subtitle: 'Manage your account and application preferences.',
    sections: {
      profile: 'Profile',
      general: 'General',
      ai: 'AI Settings',
      notifications: 'Notifications',
      privacy: 'Security',
      supabase: 'Supabase Storage'
    },
    profile: {
      edit: 'Change Photo',
      accountInfo: 'Account Information',
      unnamed: 'Unnamed User',
      noEmail: 'No email provided',
      newMember: 'New Member'
    },
    general: {
      theme: 'App Theme',
      themeDesc: 'Choose the interface appearance that suits you.',
      themes: { light: 'Light', dark: 'Dark', system: 'System', highContrast: 'High Contrast' },
      lang: 'Display Language',
      langDesc: 'Change the primary language of the interface.'
    },
    ai: {
      title: 'Proactive AI Assistant',
      desc: 'AI will automatically provide smart suggestions and reminders.',
      beta: 'AI Features are in Beta',
      betaDesc: 'We are continuously improving AI response accuracy.'
    },
    notifications: {
      app: 'In-app Notifications',
      appDesc: 'Receive push notifications directly on screen.',
      email: 'Email Notifications',
      emailDesc: 'Send reports and updates to your inbox.'
    },
    privacy: {
      title: 'Account Security',
      desc: 'Manage how your data is protected.',
      "2fa": 'Two-Factor Auth (2FA)',
      statusActive: 'Activated',
      statusInactive: 'Not activated',
      danger: 'Danger Zone',
      dangerDesc: 'These actions may result in permanent data loss.',
      deleteBtn: 'DELETE ALL PROJECT DATA'
    },
    supabaseSettings: {
      title: 'Permanent Supabase Storage Connection',
      desc: 'Configure your Supabase project URL and API key to securely upload and store images.',
      urlLabel: 'Supabase Project URL',
      keyLabel: 'Supabase Anon / Service Key',
      bucketLabel: 'Storage Bucket Name',
      saveBtn: 'Save Supabase Config',
      sqlTitle: 'Quick SQL Setup Script (Run in Supabase SQL Editor)',
      sqlDesc: 'Copy this SQL code snippet and paste it into the Supabase SQL Editor to automatically create the bucket and public permissions:',
      copySql: 'Copy SQL',
      copied: 'Copied!'
    },
    save: 'Save Changes',
    saving: 'Saving...',
    success: 'Settings saved successfully!'
  }
};

export const SettingsDashboard: React.FC = () => {
  const { mode: theme, setMode: setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const currentUser = useCurrentUser();
  const updateCurrentUser = useWorkspaceZustandStore(state => state.updateCurrentUser);
  const workspaces = useWorkspaces();
  const activeWorkspaceId = useActiveWorkspaceId();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  const [aiEnabled, setAiEnabled] = useState(() => {
    const saved = localStorage.getItem('lovenote-ai-assist-enabled');
    return saved === null ? true : saved === 'true';
  });
  
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('lovenote-email-notif-enabled');
    return saved === 'true';
  });
  
  const [appNotifications, setAppNotifications] = useState(() => {
    const saved = localStorage.getItem('lovenote-app-notif-enabled');
    return saved === null ? true : saved === 'true';
  });

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('lovenote_supabase_url') || (import.meta as any).env?.VITE_DEFAULT_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('lovenote_supabase_key') || '');
  const [supabaseBucket, setSupabaseBucket] = useState(() => localStorage.getItem('lovenote_supabase_bucket') || 'love-note-assets');
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  // Camera & Image Adjustment States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Image editing/filter states
  const [editorTab, setEditorTab] = useState<'adjust' | 'filters'>('adjust');
  const [imageBrightness, setImageBrightness] = useState(100); // 50 - 150
  const [imageContrast, setImageContrast] = useState(100); // 50 - 150
  const [imageGrayscale, setImageGrayscale] = useState(false);
  const [imageSketch, setImageSketch] = useState(false);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước ảnh vượt quá 10MB. Vui lòng chọn tệp ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCropImageSrc(dataUrl);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setEditorTab('adjust');
        setImageBrightness(100);
        setImageContrast(100);
        setImageGrayscale(false);
        setImageSketch(false);
        setIsCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // clear to allow uploading same file
  };

  const handleStartEditing = () => {
    if (currentUser.avatarUrl) {
      setCropImageSrc(currentUser.avatarUrl);
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      setEditorTab('adjust');
      setImageBrightness(100);
      setImageContrast(100);
      setImageGrayscale(false);
      setImageSketch(false);
      setIsCropModalOpen(true);
    } else {
      avatarInputRef.current?.click();
    }
  };

  const openCameraModal = async () => {
    setIsCameraModalOpen(true);
    setIsCameraLoading(true);
    setIsCameraActive(false);
    setCameraError(null);
    
    // Give modal animation a chance to complete before requesting hardware
    setTimeout(async () => {
      try {
        let stream: MediaStream;
        
        // Try requesting user front camera with wide resolutions (ideal: 1280x720)
        // High compatibility config: don't force exact dimensions to avoid OverconstrainedError on Windows/Laptops
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch (err1) {
          console.warn('Primary camera constraints failed, attempting fallback resolution:', err1);
          try {
            // Lower-res fallback with standard user-facing
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'user' },
              audio: false
            });
          } catch (err2) {
            console.warn('User camera fallback failed, attempting basic default video track:', err2);
            // Universal fallback: just get any video input device that is connected
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          }
        }

        setCameraStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Some browsers/devices require calling play() explicitly
          videoRef.current.muted = true;
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsCameraLoading(false);
                  setIsCameraActive(true);
                })
                .catch((playErr) => {
                  console.error('Play error:', playErr);
                  setCameraError(
                    language === 'vi' 
                      ? 'Không thể phát video tự động. Vui lòng thử lại.' 
                      : 'Unable to autoplay video. Please try again.'
                  );
                  setIsCameraLoading(false);
                });
            }
          };
        } else {
          // If videoRef is not available immediately, poll for it
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (videoRef.current && stream) {
              clearInterval(interval);
              videoRef.current.srcObject = stream;
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => {
                  setIsCameraLoading(false);
                  setIsCameraActive(true);
                })
                .catch(e => {
                  console.error(e);
                  setIsCameraLoading(false);
                });
            } else if (attempts > 20) {
              clearInterval(interval);
              setIsCameraLoading(false);
              setCameraError(
                language === 'vi' 
                  ? 'Không tìm thấy khung hình hiển thị camera.' 
                  : 'Camera display frame not found.'
              );
            }
          }, 100);
        }
      } catch (err: any) {
        console.error('Không thể truy cập camera:', err);
        setIsCameraLoading(false);
        
        let detailedMsg = language === 'vi'
          ? 'Không thể kết nối với Camera. Vui lòng kiểm tra cáp, ổ cắm hoặc quyền truy cập.'
          : 'Could not connect to camera. Please check your cable, connection, or permissions.';
          
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          detailedMsg = language === 'vi'
            ? 'Quyền truy cập Camera bị chặn. Vui lòng nhấn vào biểu tượng Ổ khóa hoặc Camera trên thanh địa chỉ trình duyệt của bạn để cho phép cấp quyền.'
            : 'Camera access blocked. Please click the Lock or Camera icon in your browser address bar to grant permission.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          detailedMsg = language === 'vi'
            ? 'Không tìm thấy thiết bị Camera nào được kết nối với máy tính/điện thoại của bạn.'
            : 'No camera device found connected to your computer/phone.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          detailedMsg = language === 'vi'
            ? 'Camera đang bị sử dụng bởi một ứng dụng khác (như Zoom, Teams, Zalo, v.v.). Vui lòng tắt các ứng dụng đó rồi thử lại.'
            : 'Camera is currently in use by another application (Zoom, Teams, Zalo, etc.). Please close those apps and try again.';
        }
        setCameraError(detailedMsg);
      }
    }, 250);
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
    setIsCameraActive(false);
    setIsCameraLoading(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraActive) return;
    const video = videoRef.current;
    
    try {
      const canvas = document.createElement('canvas');
      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      
      // We want to capture a square from the video stream
      const size = Math.min(videoWidth, videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Crop the center square of the video stream
        const sx = (videoWidth - size) / 2;
        const sy = (videoHeight - size) / 2;
        
        // Since the video is mirrored transform -scale-x-100 in CSS, we mirror it on canvas to match perfectly
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        closeCameraModal();
        
        setCropImageSrc(dataUrl);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setEditorTab('adjust');
        setImageBrightness(100);
        setImageContrast(100);
        setImageGrayscale(false);
        setImageSketch(false);
        setIsCropModalOpen(true);
      }
    } catch (err) {
      console.error('Lỗi khi chụp hình:', err);
      alert('Không thể chụp hình từ nguồn video này. Vui lòng tải ảnh từ máy tính.');
    }
  };

  // Drag handlers for cropping
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setCropOffset({ x: newX, y: newY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - cropOffset.x, y: touch.clientY - cropOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setCropOffset({ x: newX, y: newY });
  };

  const applyPencilSketch = (canvasCtx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = canvasCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      
      // 1. Convert to Grayscale
      const grayscale = new Uint8ClampedArray(width * height);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayscale[i / 4] = gray;
      }
      
      // 2. Compute edge detection and blend with texture
      const output = new Uint8ClampedArray(data.length);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const gray = grayscale[y * width + x];
          
          const grayRight = x < width - 1 ? grayscale[y * width + (x + 1)] : gray;
          const grayDown = y < height - 1 ? grayscale[(y + 1) * width + x] : gray;
          
          const diff = Math.abs(gray - grayRight) + Math.abs(gray - grayDown);
          
          // Sketch line mapping
          let sketchValue = 255 - Math.min(255, diff * 4.0);
          
          // Blend with original grayscale shading to keep photographic depth
          sketchValue = (sketchValue * 0.7) + (gray * 0.3);
          sketchValue = Math.max(0, Math.min(255, sketchValue));
          
          output[idx] = sketchValue;     // R
          output[idx + 1] = sketchValue; // G
          output[idx + 2] = sketchValue; // B
          output[idx + 3] = data[idx + 3]; // Keep alpha
        }
      }
      
      for (let i = 0; i < data.length; i++) {
        data[i] = output[i];
      }
      canvasCtx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.error('Pencil sketch calculation error:', e);
    }
  };

  const handleSaveCroppedImage = () => {
    if (!cropImageSrc) return;

    const img = new Image();
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 400; // Output resolution
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Clear background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Apply filters directly to canvas context
        let filterStr = `brightness(${imageBrightness}%) contrast(${imageContrast}%)`;
        if (imageGrayscale) {
          filterStr += ' grayscale(100%)';
        }
        ctx.filter = filterStr;

        // Natural dimensions
        const nw = img.naturalWidth || 400;
        const nh = img.naturalHeight || 400;

        // Calculate base "cover" scale to match how browser renders min-width/height: 100%
        const baseScale = Math.max(240 / nw, 240 / nh);
        const baseW = nw * baseScale;
        const baseH = nh * baseScale;

        // Now calculate image coordinates in the 240px preview viewport space
        const previewW = baseW * cropZoom;
        const previewH = baseH * cropZoom;

        // Centered position + user drag offsets
        const previewX = 120 + cropOffset.x - previewW / 2;
        const previewY = 120 + cropOffset.y - previewH / 2;

        // Scale everything up to the high-res 400x400 canvas space
        const scaleFactor = targetSize / 240;
        const canvasX = previewX * scaleFactor;
        const canvasY = previewY * scaleFactor;
        const canvasW = previewW * scaleFactor;
        const canvasH = previewH * scaleFactor;

        ctx.drawImage(img, canvasX, canvasY, canvasW, canvasH);

        // Apply pencil sketch on top of the rendered high-res image
        if (imageSketch) {
          ctx.filter = 'none';
          applyPencilSketch(ctx, targetSize, targetSize);
        }

        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        updateCurrentUser({ avatarUrl: finalDataUrl });

        setIsCropModalOpen(false);
        setCropImageSrc(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    };
  };

  // Persist toggles
  useEffect(() => {
    localStorage.setItem('lovenote-ai-assist-enabled', String(aiEnabled));
    window.dispatchEvent(new Event('lovenote-ai-settings-changed'));
  }, [aiEnabled]);

  useEffect(() => {
    localStorage.setItem('lovenote-email-notif-enabled', String(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem('lovenote-app-notif-enabled', String(appNotifications));
  }, [appNotifications]);

  const t = translations[language];

  const navItems = [
    { id: 'profile', label: t.sections.profile, icon: User },
    { id: 'general', label: t.sections.general, icon: Globe },
    { id: 'supabase', label: t.sections.supabase, icon: Database },
    { id: 'ai', label: t.sections.ai, icon: BrainCircuit },
    { id: 'notifications', label: t.sections.notifications, icon: Bell },
    { id: 'privacy', label: t.sections.privacy, icon: ShieldCheck },
  ];

  const handleSaveSupabase = () => {
    setSupabaseError(null);
    const cleanKey = supabaseKey.trim();
    const validation = validateSupabaseKeyRole(cleanKey);
    if (!validation.isValid) {
      setSupabaseError(validation.error || 'Vui lòng sử dụng Anon Key thay thế.');
      return;
    }

    localStorage.setItem('lovenote_supabase_url', supabaseUrl.trim());
    localStorage.setItem('lovenote_supabase_key', cleanKey);
    localStorage.setItem('lovenote_supabase_bucket', supabaseBucket.trim() || 'love-note-assets');
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleCopySql = () => {
    const sqlCode = `-- 1. Tạo bucket lưu trữ ảnh cho NoteMe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('${supabaseBucket || 'love-note-assets'}', '${supabaseBucket || 'love-note-assets'}', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Cho phép truy cập Public Read (Xem ảnh không cần đăng nhập)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = '${supabaseBucket || 'love-note-assets'}');

-- 3. Cho phép upload ảnh từ ứng dụng
DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
CREATE POLICY "Allow Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = '${supabaseBucket || 'love-note-assets'}');`;

    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const Toggle = ({ active, onToggle, label }: { active: boolean; onToggle: () => void; label?: string }) => (
    <button 
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      aria-label={label || (active ? 'Bật' : 'Tắt')}
      aria-pressed={active}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ease-in-out shrink-0 ${active ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'translate-x-7' : 'translate-x-1'}`}></div>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] bg-surface-elevated relative transition-colors duration-300">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-text-main text-surface px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="font-bold text-sm">{t.success}</span>
        </div>
      )}

      {/* Sidebar / Mobile Top Navigation */}
      <div className="w-full md:w-72 bg-surface border-b md:border-b-0 md:border-r border-border-base p-3 sm:p-6 flex flex-col shrink-0 transition-colors duration-300 sticky top-0 md:relative z-20 pb-12 md:pb-16">
        <div className="mb-2.5 md:mb-8 px-1 sm:px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-rose-200 shrink-0">
              <Settings size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <Typography variant="title" className="font-black text-text-main text-sm sm:text-xl">{t.title}</Typography>
              <Typography variant="body-sm" className="text-text-muted font-medium text-xs hidden sm:block">{t.subtitle}</Typography>
            </div>
          </div>
          {/* Active section title badge on mobile */}
          <span className="sm:hidden text-xs font-bold px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full border border-rose-200/50">
            {navItems.find(i => i.id === activeSection)?.label}
          </span>
        </div>

        <nav className="flex md:flex-col justify-between sm:justify-start gap-1 sm:gap-2 pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                title={item.label}
                aria-label={item.label}
                className={`flex-1 sm:flex-initial flex items-center justify-center sm:justify-between px-2 sm:px-3.5 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-rose-500 text-white md:bg-rose-50 md:text-rose-700 dark:md:bg-rose-900/20 dark:md:text-rose-400 shadow-sm font-bold' 
                    : 'text-text-muted hover:bg-surface-elevated hover:text-text-main font-semibold'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3.5">
                  <Icon size={18} className={isActive ? 'text-white md:text-rose-600' : 'text-text-muted group-hover:text-text-main'} />
                  <span className="text-xs sm:text-sm tracking-tight hidden sm:inline">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-rose-400 hidden md:block" />}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 md:pt-6 border-t border-border-subtle hidden md:block mt-auto mb-8">
          <button 
            onClick={() => {
              localStorage.removeItem('lovenote_user_email');
              localStorage.removeItem('lovenote_user_name');
              useWorkspaceZustandStore.getState().updateCurrentUser({
                email: '',
                name: 'Khách hàng',
                role: 'Chưa đăng nhập'
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              window.dispatchEvent(new CustomEvent('open-auth-modal'));
            }}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-text-muted hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all font-bold text-sm cursor-pointer"
          >
            <LogOut size={20} />
            {language === 'vi' ? 'Đăng xuất' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 pb-36 md:pb-28 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Section Header */}
          <div className="space-y-1 sm:space-y-2 border-b border-border-base pb-4 sm:pb-6">
            <Typography variant="h2" className="text-xl sm:text-3xl font-black text-text-main tracking-tight">
              {navItems.find(i => i.id === activeSection)?.label}
            </Typography>
            <Typography variant="body" className="text-text-muted font-medium text-xs sm:text-sm">
              {t.subtitle}
            </Typography>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {activeSection === 'profile' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card padding="md" className="border-border-base shadow-sm hover:shadow-md transition-shadow duration-300">
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    accept="image/*" 
                    onChange={handleAvatarFileChange} 
                    className="hidden" 
                  />
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                    <div className="relative group shrink-0">
                      <div 
                        onClick={handleStartEditing}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-gradient-to-tr from-rose-500 to-amber-400 p-1 cursor-pointer hover:opacity-95 transition-all shadow-md group-hover:scale-105"
                        title={language === 'vi' ? 'Bấm để chỉnh sửa hoặc tải ảnh đại diện' : 'Click to edit or upload avatar'}
                      >
                        <div className="w-full h-full rounded-[24px] bg-surface flex items-center justify-center text-rose-600 font-black text-2xl overflow-hidden border-2 border-white dark:border-slate-800">
                          <img 
                            src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name || 'Felix')}`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={openCameraModal}
                        className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-transform cursor-pointer"
                        title={language === 'vi' ? 'Mở máy ảnh chụp hình trực tiếp' : 'Open camera to take photo'}
                      >
                        <Camera size={14} />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Typography variant="h3" className="font-black text-text-main text-lg sm:text-xl">
                          {currentUser.name || t.profile.unnamed}
                        </Typography>
                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black rounded-lg uppercase tracking-wider">Premium</span>
                      </div>
                      <Typography variant="body-sm" className="text-text-muted font-bold text-xs sm:text-sm">
                        {currentUser.role || t.profile.newMember}
                      </Typography>
                      <button 
                        type="button"
                        onClick={handleStartEditing}
                        className="text-rose-600 dark:text-rose-400 text-xs font-bold hover:underline block cursor-pointer mt-0.5 text-left sm:text-left"
                      >
                        {language === 'vi' ? 'Chỉnh sửa ảnh' : 'Change photo'}
                      </button>
                      <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                        <button 
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                        >
                          <Upload size={13} />
                          Tải ảnh thật từ máy tính
                        </button>
                        {currentUser.avatarUrl && (
                          <button 
                            type="button"
                            onClick={() => {
                              updateCurrentUser({ avatarUrl: undefined });
                              localStorage.removeItem('lovenote_user_avatar');
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold underline cursor-pointer"
                          >
                            Xóa ảnh
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card padding="md" className="border-border-subtle shadow-sm space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-text-muted">
                      <Mail size={16} />
                      <Typography variant="body-sm" className="font-bold uppercase tracking-widest text-[10px]">Email Address</Typography>
                    </div>
                    <Typography variant="body" className="font-bold text-text-main text-xs sm:text-sm break-all">
                      {currentUser.email || t.profile.noEmail}
                    </Typography>
                  </Card>
                  <Card padding="md" className="border-border-subtle shadow-sm space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 text-text-muted">
                      <User size={16} />
                      <Typography variant="body-sm" className="font-bold uppercase tracking-widest text-[10px]">Username</Typography>
                    </div>
                    <Typography variant="body" className="font-bold text-text-main text-xs sm:text-sm">
                      {currentUser.email ? currentUser.email.split('@')[0] : (currentUser.name && currentUser.name !== 'Chưa đặt tên' ? currentUser.name.toLowerCase().replace(/\s+/g, '.') : 'chua.dat.ten')}
                    </Typography>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'general' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1">
                    <Typography variant="body" className="font-bold text-text-main text-sm sm:text-base">{t.general.theme}</Typography>
                    <Typography variant="body-sm" className="text-text-muted text-xs sm:text-sm">{t.general.themeDesc}</Typography>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    {[
                      { id: 'light', label: t.general.themes.light, icon: Sun },
                      { id: 'dark', label: t.general.themes.dark, icon: Moon },
                      { id: 'system', label: t.general.themes.system, icon: Monitor },
                      { id: 'high-contrast', label: t.general.themes.highContrast, icon: Contrast }
                    ].map(mode => (
                      <button 
                        key={mode.id} 
                        onClick={() => setTheme(mode.id as any)}
                        className={`px-2 sm:px-4 py-3 sm:py-5 border rounded-2xl sm:rounded-3xl transition-all text-xs sm:text-sm font-bold flex flex-col items-center gap-2 sm:gap-3 ${
                          theme === mode.id 
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 shadow-inner ring-1 ring-rose-500' 
                            : 'border-border-base hover:border-rose-200 bg-surface text-text-muted hover:text-rose-600 dark:hover:text-rose-400'
                        }`}
                      >
                        <mode.icon size={20} className={theme === mode.id ? 'text-rose-500' : 'text-text-muted opacity-50'} />
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border-subtle" />

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1">
                    <Typography variant="body" className="font-bold text-text-main text-sm sm:text-base">{t.general.lang}</Typography>
                    <Typography variant="body-sm" className="text-text-muted text-xs sm:text-sm">{t.general.langDesc}</Typography>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button 
                        onClick={() => setLanguage('vi')}
                        className={`px-4 sm:px-6 py-3 sm:py-4 border rounded-2xl sm:rounded-3xl transition-all text-xs sm:text-sm font-bold flex items-center justify-center gap-3 ${
                          language === 'vi' 
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 shadow-inner ring-1 ring-rose-500' 
                            : 'border-border-base hover:border-rose-200 bg-surface text-text-muted'
                        }`}
                      >
                        <span className="text-lg sm:text-xl">🇻🇳</span>
                        Tiếng Việt
                      </button>
                      <button 
                        onClick={() => setLanguage('en')}
                        className={`px-4 sm:px-6 py-3 sm:py-4 border rounded-2xl sm:rounded-3xl transition-all text-xs sm:text-sm font-bold flex items-center justify-center gap-3 ${
                          language === 'en' 
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 shadow-inner ring-1 ring-rose-500' 
                            : 'border-border-base hover:border-rose-200 bg-surface text-text-muted'
                        }`}
                      >
                        <span className="text-lg sm:text-xl">🇺🇸</span>
                        English
                      </button>
                    </div>
                    {language === 'en' && (
                      <p className="text-[10px] text-rose-500 italic font-medium px-2">
                        * Giao diện đang được dịch dần sang tiếng Anh, một số phần vẫn hiển thị tiếng Việt
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'supabase' && (() => {
              const canEditSupabase = hasSupabaseStoragePermission(currentUser.role, currentUser.email);
              return (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {!canEditSupabase && (
                    <div className="p-5 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/5 rounded-2xl border border-amber-500/30 dark:border-amber-500/20 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 mt-0.5">
                          <Lock size={18} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            Giới hạn quyền Cấu hình Supabase Storage
                          </h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            Tài khoản người dùng <strong>"{currentUser.email || 'Khách'}"</strong> không được phép thay đổi Địa chỉ lưu trữ Supabase và API Key của hệ thống.
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                            Để được mở khóa đầy đủ chức năng, vui lòng liên hệ <strong>Tài khoản chủ qua Gmail: <a href={`mailto:${SUPPORT_CONTACT_EMAILS[0]}`} className="text-rose-600 dark:text-rose-400 font-bold underline">{SUPPORT_CONTACT_EMAILS[0]}</a></strong> để được thêm email của bạn vào mục <strong>Authentication của Supabase</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-3">
                        <a 
                          href={`mailto:${SUPPORT_CONTACT_EMAILS[0]}?subject=Y%EA%83%B0u%20c%EA%A7%A5u%20th%C3%AAm%20T%C3%A0i%20kho%E1%BA%A3n%20v%C3%A0o%20Supabase%20Authentication`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Mail size={14} />
                          Liên hệ {SUPPORT_CONTACT_EMAILS[0]}
                        </a>
                      </div>
                    </div>
                  )}

                  <Card padding="lg" className="border-border-base shadow-sm space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="title" className="font-black text-text-main text-base sm:text-lg">{t.supabaseSettings.title}</Typography>
                        {canEditSupabase ? (
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                            <Crown size={12} /> Full Owner Access
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                            <Lock size={12} /> Locked for Standard Users
                          </span>
                        )}
                      </div>
                      <Typography variant="body" className="text-text-muted text-xs sm:text-sm">{t.supabaseSettings.desc}</Typography>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">{t.supabaseSettings.urlLabel}</label>
                        <input 
                          type="text" 
                          disabled={!canEditSupabase}
                          value={supabaseUrl} 
                          onChange={(e) => {
                            setSupabaseUrl(e.target.value);
                            setSupabaseError(null);
                          }}
                          placeholder="https://xxxxx.supabase.co"
                          className={`w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none transition-all ${
                            canEditSupabase 
                              ? 'bg-surface-elevated border-border-base text-text-main focus:ring-2 focus:ring-rose-500' 
                              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                          }`}
                        />
                        <p className="text-[10px] text-text-muted mt-1 leading-normal font-medium">
                          Nhập URL dự án Supabase của bạn (ví dụ: https://xxxxx.supabase.co).
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">{t.supabaseSettings.keyLabel}</label>
                        <input 
                          type="password" 
                          disabled={!canEditSupabase}
                          value={supabaseKey} 
                          onChange={(e) => {
                            setSupabaseKey(e.target.value);
                            setSupabaseError(null);
                          }}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className={`w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none transition-all ${
                            canEditSupabase 
                              ? 'bg-surface-elevated border-border-base text-text-main focus:ring-2 focus:ring-rose-500' 
                              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                          }`}
                        />
                        <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1 leading-normal font-medium">
                          ⚠️ <b>CHỈ</b> nhập Anon/Public Key (Settings &rarr; API &rarr; anon public trong Supabase Dashboard). <b>TUYỆT ĐỐI KHÔNG</b> nhập Service Role Key &mdash; key đó có toàn quyền và không được để lộ ra trình duyệt.
                        </p>
                        {(() => {
                          const validation = supabaseKey ? validateSupabaseKeyRole(supabaseKey) : { isValid: true };
                          if (!validation.isValid) {
                            return (
                              <p className="text-[11px] text-red-500 dark:text-red-400 font-bold mt-1">
                                {validation.error}
                              </p>
                            );
                          }
                          return null;
                        })()}
                        {supabaseError && (
                          <p className="text-[11px] text-red-500 dark:text-red-400 font-bold mt-1">
                            {supabaseError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-main uppercase tracking-wider">{t.supabaseSettings.bucketLabel}</label>
                        <input 
                          type="text" 
                          disabled={!canEditSupabase}
                          value={supabaseBucket} 
                          onChange={(e) => setSupabaseBucket(e.target.value)}
                          placeholder="love-note-assets"
                          className={`w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none transition-all ${
                            canEditSupabase 
                              ? 'bg-surface-elevated border-border-base text-text-main focus:ring-2 focus:ring-rose-500' 
                              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500 cursor-not-allowed opacity-80'
                          }`}
                        />
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={handleSaveSupabase}
                          disabled={!canEditSupabase || isSaving || !validateSupabaseKeyRole(supabaseKey).isValid}
                          className={`px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-2 ${
                            (canEditSupabase && validateSupabaseKeyRole(supabaseKey).isValid) 
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20' 
                              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-70 shadow-none'
                          }`}
                        >
                          {!canEditSupabase && <Lock size={14} />}
                          {isSaving ? 'Đang lưu...' : t.supabaseSettings.saveBtn}
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* SQL Quick Setup Section */}
                  <Card padding="lg" className="border-border-base shadow-sm space-y-4 bg-slate-900 text-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Typography variant="title" className="font-black text-rose-400 text-sm sm:text-base">{t.supabaseSettings.sqlTitle}</Typography>
                        <Typography variant="body" className="text-slate-300 text-xs">{t.supabaseSettings.sqlDesc}</Typography>
                      </div>
                      <button 
                        onClick={handleCopySql}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 shadow transition-all"
                      >
                        {copiedSql ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                        {copiedSql ? t.supabaseSettings.copied : t.supabaseSettings.copySql}
                      </button>
                    </div>

                    <div className="p-4 bg-black/60 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
{`-- 1. Tạo bucket lưu trữ ảnh cho NoteMe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('${supabaseBucket || 'love-note-assets'}', '${supabaseBucket || 'love-note-assets'}', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Cho phép truy cập Public Read (Xem ảnh không cần đăng nhập)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = '${supabaseBucket || 'love-note-assets'}');

-- 3. Cho phép upload ảnh từ ứng dụng
DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
CREATE POLICY "Allow Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = '${supabaseBucket || 'love-note-assets'}');`}
                    </div>
                  </Card>
                </div>
              );
            })()}

            {activeSection === 'ai' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between p-4 sm:p-6 bg-text-main text-surface rounded-2xl sm:rounded-[32px] shadow-xl border border-white/10 gap-3">
                  <div className="space-y-0.5 sm:space-y-1">
                    <Typography variant="body" className="font-black text-rose-400 text-xs sm:text-base">{t.ai.title}</Typography>
                    <Typography variant="body-sm" className="text-text-muted text-[11px] sm:text-xs leading-snug">{t.ai.desc}</Typography>
                  </div>
                  <Toggle active={aiEnabled} onToggle={() => setAiEnabled(!aiEnabled)} label="Hỗ trợ AI" />
                </div>

                <div className="p-5 sm:p-8 bg-rose-50 dark:bg-rose-900/10 rounded-2xl sm:rounded-[40px] border border-rose-100 dark:border-rose-900/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform hidden sm:block">
                    <BrainCircuit size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-surface rounded-2xl text-rose-600 flex items-center justify-center shadow-md shrink-0">
                      <BrainCircuit size={24} />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="title" className="font-black text-rose-900 dark:text-rose-100 text-base sm:text-lg">{t.ai.beta}</Typography>
                      <Typography variant="body" className="text-rose-700/80 dark:text-rose-300/80 leading-relaxed font-medium text-xs sm:text-sm">{t.ai.betaDesc}</Typography>
                      <div className="pt-2">
                        <button className="px-4 py-2 bg-surface text-rose-600 dark:text-rose-400 rounded-xl text-xs font-black shadow-sm hover:shadow-md transition-all">
                          Gửi phản hồi cho AI
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'notifications' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {[
                  { id: 'app', title: t.notifications.app, desc: t.notifications.appDesc, active: appNotifications, toggle: () => setAppNotifications(!appNotifications) },
                  { id: 'email', title: t.notifications.email, desc: t.notifications.emailDesc, active: emailNotifications, toggle: () => setEmailNotifications(!emailNotifications), footnote: 'Tính năng gửi email đang được phát triển. Lựa chọn của bạn sẽ được lưu lại và áp dụng khi tính năng này ra mắt.' }
                ].map((item) => (
                  <div key={item.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between p-4 sm:p-6 bg-surface rounded-2xl sm:rounded-[32px] border border-border-subtle hover:border-rose-100 dark:hover:border-rose-900/30 transition-all group shadow-sm gap-3">
                      <div className="space-y-0.5 sm:space-y-1">
                        <Typography variant="body" className="font-black text-text-main text-xs sm:text-base">{item.title}</Typography>
                        <Typography variant="body-sm" className="text-text-muted text-[11px] sm:text-xs font-medium leading-snug">{item.desc}</Typography>
                      </div>
                      <Toggle active={item.active} onToggle={item.toggle} label={item.title} />
                    </div>
                    {item.footnote && (
                      <Typography variant="body-sm" className="px-4 sm:px-6 text-[10px] text-text-muted italic font-medium">
                        * {item.footnote}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1">
                    <Typography variant="body" className="font-bold text-text-main text-sm sm:text-base">{t.privacy.title}</Typography>
                    <Typography variant="body-sm" className="text-text-muted font-medium text-xs sm:text-sm">{t.privacy.desc}</Typography>
                  </div>
                  <button 
                    onClick={async () => {
                      const nextStatus = !currentUser.twoFactorEnabled;
                      updateCurrentUser({ twoFactorEnabled: nextStatus });
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                      
                      try {
                        await fetch('/api/auth/2fa/toggle', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: currentUser.email, enabled: nextStatus })
                        });
                      } catch (err) {
                        console.error('Lỗi lưu cấu hình 2FA:', err);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 sm:p-5 bg-surface border border-border-base rounded-2xl sm:rounded-[28px] hover:border-emerald-300 dark:hover:border-emerald-900/30 transition-all shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <ShieldCheck size={18} />
                      </div>
                      <span className="font-black text-xs sm:text-sm text-text-main">{t.privacy["2fa"]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] sm:text-xs font-bold ${currentUser.twoFactorEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted'}`}>
                        {currentUser.twoFactorEnabled ? t.privacy.statusActive : t.privacy.statusInactive}
                      </span>
                      <ChevronRight size={14} className="text-text-muted opacity-30" />
                    </div>
                  </button>
                </div>

                <div className="h-px bg-border-subtle" />

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1">
                    <Typography variant="body" className="font-black text-rose-600 uppercase tracking-widest text-[11px] sm:text-xs">{t.privacy.danger}</Typography>
                    <Typography variant="body-sm" className="text-text-muted font-medium text-xs">{t.privacy.dangerDesc}</Typography>
                  </div>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full group px-4 sm:px-6 py-4 sm:py-6 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 font-black rounded-2xl sm:rounded-[32px] border border-rose-100 dark:border-rose-900/30 hover:bg-rose-600 hover:text-white transition-all text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <Trash2 size={18} className="group-hover:animate-bounce" />
                    {t.privacy.deleteBtn}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Camera Modal */}
          {isCameraModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-surface max-w-lg w-full rounded-3xl sm:rounded-[40px] shadow-2xl border border-border-base overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-border-subtle flex items-center justify-between">
                  <div>
                    <Typography variant="h3" className="font-black text-text-main text-lg">
                      {language === 'vi' ? 'Chụp ảnh đại diện mới' : 'Take profile picture'}
                    </Typography>
                    <Typography variant="body-sm" className="text-text-muted text-xs">
                      {language === 'vi' ? 'Nhìn thẳng vào camera và bấm nút để chụp hình của bạn' : 'Look straight into the camera and snap your photo'}
                    </Typography>
                  </div>
                  <button 
                    onClick={closeCameraModal}
                    className="p-2 hover:bg-surface-elevated rounded-full text-text-muted transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Camera Viewport */}
                <div className="relative aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    controls={false}
                    className={`absolute w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                  
                  {/* Loading overlay */}
                  {isCameraLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white gap-3 p-4">
                      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold text-slate-300">
                        {language === 'vi' ? 'Đang kết nối camera...' : 'Connecting camera...'}
                      </span>
                    </div>
                  )}

                  {/* Error state */}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-center p-6 sm:p-8">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                        <CameraOff size={24} />
                      </div>
                      <span className="text-sm font-black text-white mb-2">
                        {language === 'vi' ? 'Không thể mở máy ảnh' : 'Unable to access camera'}
                      </span>
                      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
                        {cameraError}
                      </p>
                      <button
                        type="button"
                        onClick={openCameraModal}
                        className="px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-xl hover:bg-rose-700 transition-all cursor-pointer shadow-md"
                      >
                        {language === 'vi' ? 'Thử lại' : 'Retry'}
                      </button>
                    </div>
                  )}

                  {/* Circular Overlay Grid */}
                  {isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[240px] h-[240px] rounded-full border-4 border-dashed border-rose-500/60 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]" />
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-6 sm:p-8 bg-surface-elevated flex flex-col items-center gap-4">
                  <div className="flex gap-4 w-full">
                    <button
                      type="button"
                      onClick={closeCameraModal}
                      className="flex-1 py-3 bg-surface border border-border-base text-text-muted font-black rounded-2xl hover:bg-surface-elevated transition-all text-sm cursor-pointer"
                    >
                      {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!isCameraActive}
                      className={`flex-1 py-3 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        isCameraActive 
                          ? 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95' 
                          : 'bg-slate-200 dark:bg-slate-800 text-text-muted opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Camera size={18} />
                      {language === 'vi' ? 'Chụp ảnh ngay' : 'Capture Photo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Crop / Reposition Modal */}
          {isCropModalOpen && cropImageSrc && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-surface max-w-md w-full rounded-3xl sm:rounded-[40px] shadow-2xl border border-border-base overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-border-subtle flex items-center justify-between">
                  <div>
                    <Typography variant="h3" className="font-black text-text-main text-lg">
                      {language === 'vi' ? 'Bộ biên tập ảnh đại diện' : 'Avatar Photo Editor'}
                    </Typography>
                    <Typography variant="body-sm" className="text-text-muted text-xs">
                      {language === 'vi' ? 'Căn chỉnh kích thước và áp dụng hiệu ứng lọc độc đáo' : 'Adjust positioning, zoom and apply creative photo filters'}
                    </Typography>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCropModalOpen(false);
                      setCropImageSrc(null);
                    }}
                    className="p-2 hover:bg-surface-elevated rounded-full text-text-muted transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drag Frame Area */}
                <div className="p-6 flex flex-col items-center bg-slate-950/5 relative overflow-hidden">
                  <div 
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUpOrLeave}
                    className="w-[240px] h-[240px] rounded-full overflow-hidden relative border-4 border-white dark:border-slate-800 shadow-xl bg-slate-900 cursor-move select-none"
                    style={{ touchAction: 'none' }}
                  >
                    <img 
                      ref={imageRef}
                      src={cropImageSrc}
                      alt="Crop Source"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px)) scale(${cropZoom})`,
                        transformOrigin: 'center center',
                        maxWidth: 'none',
                        pointerEvents: 'none',
                        minWidth: '100%',
                        minHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        filter: `brightness(${imageBrightness}%) contrast(${imageContrast}%)` + 
                          (imageGrayscale ? ' grayscale(100%)' : '') + 
                          (imageSketch ? ' grayscale(100%) contrast(300%) brightness(130%)' : '')
                      }}
                    />
                  </div>
                  
                  {/* Instruction overlay */}
                  <div className="mt-4 text-center">
                    <span className="text-xs font-bold text-text-muted flex items-center gap-1.5 justify-center">
                      <Maximize2 size={12} className="text-rose-500 animate-pulse" />
                      {language === 'vi' ? 'Nhấp giữ và kéo ảnh hoặc chạm để căn chỉnh vị trí' : 'Click & drag or touch to adjust position'}
                    </span>
                  </div>
                </div>

                {/* Editor Tabs switcher */}
                <div className="flex border-t border-b border-border-subtle bg-surface-elevated/40">
                  <button
                    type="button"
                    onClick={() => setEditorTab('adjust')}
                    className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                      editorTab === 'adjust'
                        ? 'border-rose-600 text-rose-600 bg-surface'
                        : 'border-transparent text-text-muted hover:text-text-main hover:bg-surface/50'
                    }`}
                  >
                    <Sliders size={14} />
                    {language === 'vi' ? 'Căn chỉnh & Thu phóng' : 'Position & Zoom'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('filters')}
                    className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                      editorTab === 'filters'
                        ? 'border-rose-600 text-rose-600 bg-surface'
                        : 'border-transparent text-text-muted hover:text-text-main hover:bg-surface/50'
                    }`}
                  >
                    <Palette size={14} />
                    {language === 'vi' ? 'Bộ lọc & Màu sắc' : 'Filters & Colors'}
                  </button>
                </div>

                {/* Control Panel Area */}
                <div className="p-6 bg-surface-elevated space-y-6">
                  {editorTab === 'adjust' ? (
                    /* Zoom Control Section */
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center text-xs font-bold text-text-muted">
                        <span>{language === 'vi' ? 'Độ phóng đại' : 'Zoom Level'}</span>
                        <span className="text-rose-600 font-black">{Math.round(cropZoom * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setCropZoom(prev => Math.max(1, prev - 0.1))}
                          className="p-1.5 hover:bg-surface rounded-lg text-text-muted transition-colors cursor-pointer"
                          title="Thu nhỏ"
                        >
                          <ZoomOut size={16} />
                        </button>
                        <input 
                          type="range"
                          min="1"
                          max="3"
                          step="0.01"
                          value={cropZoom}
                          onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                          className="flex-1 accent-rose-600 h-1.5 bg-border-base rounded-lg cursor-pointer"
                        />
                        <button 
                          type="button"
                          onClick={() => setCropZoom(prev => Math.min(3, prev + 0.1))}
                          className="p-1.5 hover:bg-surface rounded-lg text-text-muted transition-colors cursor-pointer"
                          title="Phóng to"
                        >
                          <ZoomIn size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Filters & Enhancements Section */
                    <div className="space-y-5 animate-in fade-in duration-200">
                      {/* Filter style buttons */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-text-muted">
                          {language === 'vi' ? 'Hiệu ứng bộ lọc' : 'Creative filters'}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setImageGrayscale(false);
                              setImageSketch(false);
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              !imageGrayscale && !imageSketch
                                ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/30'
                                : 'bg-surface border-border-base text-text-muted hover:border-text-muted'
                            }`}
                          >
                            {language === 'vi' ? 'Mặc định' : 'Default'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageGrayscale(true);
                              setImageSketch(false);
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              imageGrayscale && !imageSketch
                                ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/30'
                                : 'bg-surface border-border-base text-text-muted hover:border-text-muted'
                            }`}
                          >
                            {language === 'vi' ? 'Trắng đen' : 'Black & White'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageGrayscale(false);
                              setImageSketch(true);
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              imageSketch
                                ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/30'
                                : 'bg-surface border-border-base text-text-muted hover:border-text-muted'
                            }`}
                          >
                            {language === 'vi' ? 'Vẽ bút chì' : 'Pencil Sketch'}
                          </button>
                        </div>
                      </div>

                      {/* Sliders for Brightness and Contrast */}
                      <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-text-muted">
                            <span>{language === 'vi' ? 'Độ sáng / tối' : 'Brightness'}</span>
                            <span className="text-rose-600 font-black">{imageBrightness}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            step="1"
                            value={imageBrightness}
                            onChange={(e) => setImageBrightness(parseInt(e.target.value))}
                            className="w-full accent-rose-600 h-1.5 bg-border-base rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-text-muted">
                            <span>{language === 'vi' ? 'Độ tương phản' : 'Contrast'}</span>
                            <span className="text-rose-600 font-black">{imageContrast}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            step="1"
                            value={imageContrast}
                            onChange={(e) => setImageContrast(parseInt(e.target.value))}
                            className="w-full accent-rose-600 h-1.5 bg-border-base rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action buttons */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCropModalOpen(false);
                        setCropImageSrc(null);
                      }}
                      className="flex-1 py-3 bg-surface border border-border-base text-text-muted font-black rounded-2xl hover:bg-surface-elevated transition-all text-sm cursor-pointer"
                    >
                      {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCroppedImage}
                      className="flex-1 py-3 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={18} />
                      {language === 'vi' ? 'Áp dụng' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
              <div className="bg-surface max-w-md w-full rounded-3xl sm:rounded-[40px] shadow-2xl border border-border-base p-5 sm:p-8 space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center">
                    <AlertTriangle size={28} />
                  </div>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="p-2 hover:bg-surface-elevated rounded-full text-text-muted transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Typography variant="title" className="font-black text-text-main text-lg sm:text-xl">Xác nhận xóa dữ liệu?</Typography>
                  <Typography variant="body" className="text-text-muted leading-relaxed text-xs sm:text-sm">
                    Hành động này sẽ xóa vĩnh viễn toàn bộ kỉ niệm, dự án và thiết lập trong workspace này. <span className="text-rose-500 font-black">Hành động này không thể hoàn tác.</span>
                  </Typography>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Typography variant="body-sm" className="font-bold text-text-muted text-xs">
                      Vui lòng gõ <span className="text-text-main font-black underline italic">XOA</span> hoặc tên Workspace <span className="text-rose-600 font-black italic">"{activeWorkspace?.name}"</span> để xác nhận:
                    </Typography>
                    <input 
                      type="text" 
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="XOA hoặc tên Workspace"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-surface-elevated border border-border-base rounded-2xl text-text-main font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all uppercase text-xs sm:text-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 py-3 sm:py-4 bg-surface-elevated text-text-muted font-black rounded-2xl hover:bg-border-subtle transition-all text-xs sm:text-sm"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      disabled={deleteConfirmText !== 'XOA' && deleteConfirmText !== activeWorkspace?.name}
                      onClick={() => {
                        if (activeWorkspace) {
                          useWorkspaceZustandStore.getState().removeWorkspace(activeWorkspace.id);
                          window.location.reload(); // Refresh to clear everything
                        }
                      }}
                      className={`flex-1 py-3 sm:py-4 bg-rose-600 text-white font-black rounded-2xl transition-all shadow-lg text-xs sm:text-sm ${
                        (deleteConfirmText === 'XOA' || deleteConfirmText === activeWorkspace?.name) ? 'hover:bg-rose-700 active:scale-95' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      Xác nhận xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="fixed bottom-16 md:bottom-0 left-0 md:left-72 right-0 bg-surface/95 backdrop-blur-md border-t border-border-subtle p-3 sm:p-4 md:p-6 flex justify-end z-30 shadow-xl transition-colors duration-300">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-text-main text-surface font-black rounded-xl sm:rounded-2xl hover:bg-text-main/90 transition-all shadow-xl active:scale-95 flex items-center gap-3 justify-center text-xs sm:text-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-surface/20 border-t-surface rounded-full animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {t.save}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;

