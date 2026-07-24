import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Palette, 
  FileSignature, 
  ChevronRight, 
  Upload, 
  Image as ImageIcon,
  User,
  Type,
  Trash2,
  Check
} from 'lucide-react';
import { Project } from '../../modules/workspace/Project';

interface ProjectDashboardProps {
  project: Project;
  onNavigateToModule: (module: string) => void;
  onUpdateProject: (updates: Partial<Project>) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  project, 
  onNavigateToModule,
  onUpdateProject
}) => {
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  const [category, setCategory] = useState(project.category || 'Thiệp Cưới');
  const [recipient, setRecipient] = useState(project.content?.recipient || 'Gửi người thương yêu');
  const [scene, setScene] = useState(project.content?.scene || 'rose');
  const [fontStyle, setFontStyle] = useState(project.content?.fontStyle || 'dancing');
  const [uploadedImages, setUploadedImages] = useState<string[]>(project.content?.uploadedImages || [
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
  ]);

  // Design scene options
  const scenes = [
    { id: 'rose', label: 'Hồng lãng mạn (Rose)', color: 'bg-rose-100 border-rose-200 text-rose-700' },
    { id: 'sunset', label: 'Hoàng hôn ấm áp (Sunset)', color: 'bg-amber-100 border-amber-200 text-amber-700' },
    { id: 'sky', label: 'Bầu trời đêm (Sky)', color: 'bg-indigo-100 border-indigo-200 text-indigo-700' },
    { id: 'forest', label: 'Khu rừng xanh (Forest)', color: 'bg-emerald-100 border-emerald-200 text-emerald-700' },
    { id: 'garden', label: 'Sân vườn nắng (Garden)', color: 'bg-teal-100 border-teal-200 text-teal-700' },
    { id: 'sakura', label: 'Anh đào rơi (Sakura)', color: 'bg-pink-100 border-pink-200 text-pink-700' },
    { id: 'plain', label: 'Cổ điển tối giản (Classic)', color: 'bg-slate-100 border-slate-200 text-slate-700' }
  ];

  // Font options
  const fonts = [
    { id: 'dancing', label: 'Viết tay mộc mạc', preview: 'Dancing Script', class: 'font-dancing' },
    { id: 'pacifico', label: 'Nghệ thuật bay bổng', preview: 'Pacifico', class: 'font-pacifico' },
    { id: 'playfair', label: 'Sang trọng cổ điển', preview: 'Playfair Display', class: 'font-serif' },
    { id: 'lora', label: 'Trang trọng nhã nhặn', preview: 'Lora Serif', class: 'font-lora' },
    { id: 'caveat', label: 'Ghi chú tự nhiên', preview: 'Caveat Notes', class: 'font-caveat' },
    { id: 'nunito', label: 'Thân thiện dễ mến', preview: 'Nunito Round', class: 'font-nunito' }
  ];

  const handleSaveAndGenerate = () => {
    // 1. Update project details in the global context
    onUpdateProject({
      title,
      description,
      category,
      content: {
        ...project.content,
        title,
        recipient,
        scene,
        fontStyle,
        uploadedImages,
        // Reset or initialize empty message so AI is triggered fresh
        message: project.content?.message || ''
      }
    });

    // 2. Set generating flag in window context so AIStudio can read it as auto-trigger
    (window as any).LNOS_autoTriggerAI = true;

    // 3. Navigate directly to AI view
    onNavigateToModule('aistudio');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 px-4 sm:px-6 select-none animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-2 mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-rose-600">
          <Heart size={14} className="fill-rose-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Thông Tin Dự Án</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
          Thiết Lập Chi Tiết Thiệp
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Khai báo những thông tin nguyên bản nhất về buổi lễ và phong cách mong muốn để AI bắt đầu dệt nên những câu chúc đầy chiều sâu cảm xúc.
        </p>
      </div>

      {/* DETAILED INPUT FORM */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* ROW 1: TITLE & RECIPIENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileSignature size={14} className="text-slate-400" />
              Tên Project Thiệp
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Thiệp cưới Lan & Minh"
              className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              Đối Tượng Nhận Thiệp (Recipient)
            </label>
            <input 
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Ví dụ: Người thương yêu, Quý khách mời, Bạn bè..."
              className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* ROW 2: CATEGORY & DESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} className="text-slate-400" />
              Loại Lễ Kỷ Niệm
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="Thiệp Cưới">Thiệp Cưới (Wedding)</option>
              <option value="Sinh Nhật">Sinh Nhật (Birthday)</option>
              <option value="Kỷ Niệm">Lễ Kỷ Niệm (Anniversary)</option>
              <option value="Lời Chúc">Lời Cảm Ơn / Lời Chúc</option>
              <option value="Giáng Sinh">Giáng Sinh & Năm Mới</option>
            </select>
          </div>

          <div className="md:col-span-8 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileSignature size={14} className="text-slate-400" />
              Chủ Đề & Câu Chuyện Của Bạn (Ý tưởng chính)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ví dụ: Một đám cưới mộc mạc bên bãi biển cát trắng, ngập tràn nắng hoàng hôn ấm áp và tiếng guitar mộc mạc..."
              className="w-full px-4.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* ROW 3: STYLE SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Palette size={14} className="text-slate-400" />
            Phong Cách & Không Gian (Visual Style)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scenes.map((sc) => {
              const isSelected = scene === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setScene(sc.id)}
                  className={`p-4 rounded-2xl text-left border text-xs font-bold transition-all relative flex flex-col justify-between h-20 ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-[1.02]' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="opacity-90">{sc.label}</span>
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-rose-500 text-white p-0.5 rounded-full">
                      <Check size={10} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 4: FONT SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Type size={14} className="text-slate-400" />
            Kiểu Chữ Biểu Cảm (Typography)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fonts.map((f) => {
              const isSelected = fontStyle === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontStyle(f.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-[1.01]' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className={`text-[10px] opacity-70 mt-0.5 ${f.class}`}>
                      {f.preview}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="bg-rose-500 text-white p-0.5 rounded-full shrink-0 ml-2">
                      <Check size={10} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 5: INTEGRATED MEMORY IMAGES */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} className="text-slate-400" />
            Album Ảnh Kỷ Niệm (Media Assets)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Image cards */}
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-3xs">
                <img src={img} alt={`Kỷ niệm ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {/* Upload block */}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300 transition-all flex flex-col items-center justify-center p-4 cursor-pointer gap-1.5 text-center">
              <Upload size={18} className="text-slate-400" />
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tải ảnh lên</div>
              <div className="text-[9px] text-slate-400">JPG, PNG chất lượng</div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* ROW 6: CHIEF AI TRIGGER CTA BUTTON */}
        <div className="pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={!title.trim() || !description.trim()}
            onClick={handleSaveAndGenerate}
            className={`w-full py-4.5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-3 ${
              title.trim() && description.trim()
                ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-lg active:scale-[0.99] cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Sparkles size={18} className="text-rose-400 animate-pulse" />
            Sáng Tạo Thiệp Bằng AI ✨
          </button>
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest mt-3">
            Hệ thống AI của LoveNote sẽ soạn thảo nội dung dạt dào cảm xúc dựa trên tư liệu trên.
          </p>
        </div>

      </div>

    </div>
  );
};
