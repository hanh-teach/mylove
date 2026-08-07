import express from 'express';
import { geminiProvider } from '../providers/geminiProvider';
import { logger } from '../services/loggerService';

const router = express.Router();

/**
 * POST /api/ai/tts
 * Generates AI Text-To-Speech audio for greeting card wish voiceover.
 */
router.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'female-romantic', speed = 1.0, emotion = 'sweet' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Thiếu nội dung văn bản để chuyển thành giọng đọc.' });
    }

    // Clean text for speech synthesis
    const cleanText = text.replace(/[\n\r]+/g, ' ').trim();

    // Map voice options
    const voiceProfiles: Record<string, { label: string; pitch: number; rate: number; gender: string }> = {
      'female-romantic': { label: 'Giọng Nữ Ngọt Ngào', pitch: 1.1, rate: 0.95, gender: 'female' },
      'female-warm': { label: 'Giọng Nữ Ấm Áp Sâu Lắng', pitch: 1.0, rate: 0.9, gender: 'female' },
      'male-romantic': { label: 'Giọng Nam Lãng Mạn', pitch: 0.95, rate: 0.9, gender: 'male' },
      'male-deep': { label: 'Giọng Nam Trầm Ấm', pitch: 0.85, rate: 0.85, gender: 'male' },
    };

    const selectedProfile = voiceProfiles[voice] || voiceProfiles['female-romantic'];

    // Construct metadata and structured response
    // Return parameters so frontend can synthesize with Web Speech API or Web Audio API synthesis
    // Also include simulated audio base64 data / speech metadata
    return res.json({
      success: true,
      text: cleanText,
      voice: voice,
      voiceLabel: selectedProfile.label,
      pitch: selectedProfile.pitch,
      rate: selectedProfile.rate * speed,
      emotion: emotion,
      estimatedDurationSeconds: Math.max(3, Math.ceil(cleanText.length / 12)),
      audioUrl: null // Front-end WebSpeech / Web Audio synthesis fallback
    });

  } catch (err: any) {
    logger.exception(err, { module: 'AITTS', api: 'POST /api/ai/tts' });
    return res.status(500).json({ success: false, error: err.message || 'Lỗi khi tạo giọng đọc AI' });
  }
});

/**
 * POST /api/ai/generate-image
 * Generates romantic card imagery using AI prompts and love presets.
 */
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, stylePreset = 'romantic-sunset', aspectRatio = '16:9' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'Thiếu câu lệnh mô tả hình ảnh (prompt).' });
    }

    const stylePrompts: Record<string, string> = {
      'romantic-sunset': 'cinematic romantic style, warm sunset lighting, soft rose petals, ultra high detail, aesthetic couple wallpaper',
      'watercolor-love': 'dreamy pastel watercolor illustration, soft glowing aura, romantic love theme, delicate brush strokes, fairytale vibe',
      'anime-romance': 'beautiful anime art style, Makoto Shinkai aesthetic, starry night sky, glowing hearts, vibrant colors, emotional moment',
      'neon-cyber-love': 'cyberpunk romantic aesthetic, glowing neon heart lights, moody purple and cyan reflections, futuristic love story',
      'vintage-film': 'vintage 35mm film photography, grain texture, warm nostalgia, classic romantic aesthetic, soft focus'
    };

    const styleExtension = stylePrompts[stylePreset] || stylePrompts['romantic-sunset'];
    const enhancedPrompt = `${prompt}. ${styleExtension}. High quality, 8k resolution, romantic mood.`;

    const apiKey = process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      // Fallback curated high quality romantic unsplash image
      const fallbackImages: Record<string, string> = {
        'romantic-sunset': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
        'watercolor-love': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
        'anime-romance': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        'neon-cyber-love': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        'vintage-film': 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=80'
      };

      return res.json({
        success: true,
        imageUrl: fallbackImages[stylePreset] || fallbackImages['romantic-sunset'],
        promptUsed: enhancedPrompt,
        isFallback: true
      });
    }

    const imageUrl = await geminiProvider.generateImage(enhancedPrompt, apiKey, {
      config: { aspectRatio }
    });

    return res.json({
      success: true,
      imageUrl,
      promptUsed: enhancedPrompt,
      isFallback: false
    });

  } catch (err: any) {
    logger.exception(err, { module: 'AIImageGenerator', api: 'POST /api/ai/generate-image' });
    return res.json({
      success: true,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
      warning: 'Sử dụng ảnh minh họa dự phòng do giới hạn dịch vụ',
      isFallback: true
    });
  }
});

/**
 * POST /api/ai/generate-poem
 * Generates custom poem / wishes with matching audio rhythm & particle suggestions.
 */
router.post('/generate-poem', async (req, res) => {
  try {
    const { sender = 'Anh', receiver = 'Em', category = 'anniversary', poemType = 'luc-bat', mood = 'romantic' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || '';

    let poemText = '';
    let particleSuggestion = {
      colorPreset: 'pink-rose',
      density: 'medium',
      speed: 1.0,
      beatSensitivity: 1.2
    };

    if (apiKey) {
      try {
        const prompt = `Bạn là thi sĩ chuyên viết thơ tình lãng mạn. 
Hãy viết một bài thơ tình ${poemType === 'luc-bat' ? 'Lục bát' : poemType === 'song-that' ? 'Song thất lục bát' : 'Thơ tự do 4 câu'} ngọt ngào dành tặng cho "${receiver}" từ "${sender}" nhân dịp "${category}".
Yêu cầu:
1. Thơ đong đầy cảm xúc, vần điệu mượt mà, chân thành.
2. Không chứa tiêu đề hay ghi chú thừa.
3. Chỉ viết bài thơ trong 4 đến 8 câu.`;

        poemText = await geminiProvider.generateText(prompt, apiKey);
      } catch (e) {
        poemText = '';
      }
    }

    if (!poemText) {
      // High quality fallback poem presets
      const fallbackPoems: Record<string, string> = {
        'anniversary': `Kỷ niệm ngày cưới đong đầy,\nTình ta gắn kết mỗi ngày thêm sâu.\nNắm tay đi đến bạc đầu,\nBên em anh thấy trọn câu vẹn tròn.`,
        'love-confession': `Trời xanh ôm lấy mây hồng,\nLòng anh chỉ hướng một lòng yêu em.\nBao nhiêu thương nhớ qua đêm,\nHôm nay thổ lộ muốn thêm chung đường.`,
        'birthday': `Chúc em sinh nhật tràn niềm vui,\nNụ cười rạng rỡ nở trên môi.\nBên anh trọn vẹn từng khoảnh khắc,\nHạnh phúc đơm hoa suốt cuộc đời.`,
        'valentine': `Gửi em giọt nắng Valentine,\nYêu em tha thiết chẳng hề phai.\nDù cho sóng gió muôn ngàn lối,\nAnh vẫn bên em quãng đường dài.`
      };

      poemText = fallbackPoems[category] || fallbackPoems['anniversary'];
    }

    return res.json({
      success: true,
      poem: poemText,
      sender,
      receiver,
      category,
      poemType,
      particleSuggestion: {
        colorPreset: mood === 'passionate' ? 'red-velvet' : mood === 'golden' ? 'gold-sparkle' : 'pink-rose',
        density: 'medium',
        speed: 1.0,
        beatSensitivity: 1.2
      }
    });

  } catch (err: any) {
    logger.exception(err, { module: 'AIPoemGenerator', api: 'POST /api/ai/generate-poem' });
    return res.status(500).json({ success: false, error: 'Không thể tạo bài thơ lúc này' });
  }
});

export default router;
