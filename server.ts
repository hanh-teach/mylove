import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { errorHandler } from './server/middlewares/errorHandler';
import { createCorsOptionsDelegate } from './server/middlewares/corsPolicy';
import videoRoutes from './server/routes/videoRoutes';
import authRoutes from './server/routes/authRoutes';
import aiRoutes from './server/routes/aiRoutes';
import { requireAuth } from './server/middlewares/requireAuth';
import { requireOwner } from './server/middlewares/requireOwner';
import { validateAIWrite } from './server/validators/aiValidator';
import { aiWriteRateLimiter } from './server/middlewares/rateLimiters';
import { requestLoggerMiddleware, logger } from './server/services/loggerService';
import { collabInviteRepository } from './server/repositories/collabInviteRepository';
import { contactRequestRepository } from './server/repositories/contactRequestRepository';

dotenv.config();

import { simulateWriting } from './server/utils/aiUtils';
import { validateSupabaseKeyRole } from './src/shared/utils/supabaseKeyValidator';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.set('trust proxy', 1);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors(createCorsOptionsDelegate()));

app.use(express.json());
app.use(cookieParser());
app.use(requestLoggerMiddleware);

// API Route for video generation using videoRoutes
app.use('/api', videoRoutes);
// API Route for authentication
app.use('/api/auth', authRoutes);
// API Route for AI Services (TTS, Image Gen, Poem Gen)
app.use('/api/ai', aiRoutes);

const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => req.ip || '127.0.0.1'
});

const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => req.ip || '127.0.0.1',
  message: { success: false, error: 'Quá nhiều yêu cầu liên hệ từ IP này, vui lòng thử lại sau.' }
});

// API Route for Supabase Storage Upload proxy
import { createClient } from '@supabase/supabase-js';

app.post('/api/supabase/upload', requireAuth, uploadRateLimiter, async (req, res) => {
  try {
    const { fileBase64, fileName, mimeType, supabaseUrl: clientUrl, supabaseKey: clientKey, supabaseBucket } = req.body;
    
    // Check if client supplied custom supabaseKey and reject if it is a service_role key
    if (clientKey) {
      const validation = validateSupabaseKeyRole(clientKey);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: validation.error || 'Không chấp nhận service_role key do client gửi lên.' });
      }
    }

    // Determine target URL and key: prefer client anon key if valid, otherwise server configured keys
    let url = process.env.SUPABASE_URL;
    let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (clientUrl && clientKey) {
      try {
        new URL(clientUrl);
        url = clientUrl;
        key = clientKey;
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid custom Supabase URL provided.' });
      }
    }

    const bucket = supabaseBucket || process.env.SUPABASE_BUCKET || 'love-note-assets';

    if (!url || !key) {
      return res.status(500).json({ success: false, error: 'Supabase URL and Key are not configured on server.' });
    }

    if (!fileBase64 || !fileName) {
      return res.status(400).json({ success: false, error: 'Missing file data or file name.' });
    }

    const allowedMimePrefixes = ['image/', 'video/', 'audio/'];
    const allowedExactMimes = ['application/pdf'];
    const isValidMime = mimeType && (allowedMimePrefixes.some(p => mimeType.startsWith(p)) || allowedExactMimes.includes(mimeType));
    if (!isValidMime) {
      return res.status(400).json({ success: false, error: 'Định dạng file không được phép.' });
    }

    let base64Data = fileBase64;
    if (fileBase64.includes(';base64,')) {
      base64Data = fileBase64.split(';base64,')[1];
    }
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 20 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'Kích thước file vượt quá giới hạn 20MB.' });
    }

    const supabase = createClient(url, key);

    const fileExt = fileName.split('.').pop() || 'png';
    const uniqueFileName = `noteme_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, buffer, {
        contentType: mimeType || 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return res.json({
      success: true,
      publicUrl: publicData.publicUrl
    });
  } catch (err: any) {
    console.error('Server Supabase upload error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error during upload' });
  }
});

// API Route for Gmail API Send Proxy
app.post('/api/gmail/send', async (req, res) => {
  try {
    const { accessToken, to, subject, body } = req.body;
    if (!accessToken || !to || !subject || !body) {
      return res.status(400).json({ success: false, error: 'Thiếu tham số bắt buộc (accessToken, to, subject, body).' });
    }

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      body
    ];
    const rawMessage = messageParts.join('\r\n');
    const rawBase64 = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawBase64 }),
    });

    if (!gmailRes.ok) {
      const errJson = await gmailRes.json().catch(() => ({}));
      return res.status(gmailRes.status).json({
        success: false,
        error: errJson.error?.message || `Lỗi Gmail API HTTP ${gmailRes.status}`
      });
    }

    const data = await gmailRes.json();
    return res.json({ success: true, messageId: data.id, threadId: data.threadId });
  } catch (err: any) {
    console.error('Server Gmail send error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi hệ thống khi gửi email qua Gmail API' });
  }
});

// --- Server-side Collaboration Invites & Realtime Sync Store ---

// Get invitations for a project or all
app.get('/api/collaboration/invites', requireAuth, async (req, res) => {
  const { projectId } = req.query;
  const allInvites = await collabInviteRepository.getInvites();
  const currentUserId = req.user?.userId;
  const currentUserEmail = req.user?.email ? req.user.email.toLowerCase() : '';
  const isSystemOwner = req.user?.role === 'owner';

  if (projectId) {
    const projectInvites = allInvites.filter(i => i.projectId === String(projectId));
    const projectOwnerUserId = projectInvites.find(i => i.ownerUserId)?.ownerUserId;

    const isProjectOwner = isSystemOwner || (currentUserId && projectOwnerUserId === currentUserId);
    const isCollaborator = projectInvites.some(i => i.email.toLowerCase() === currentUserEmail);

    if (!isProjectOwner && !isCollaborator && projectInvites.length > 0) {
      return res.status(403).json({ success: false, error: 'Forbidden: Bạn không có quyền xem lời mời của project này' });
    }

    return res.json({ success: true, invites: projectInvites });
  }

  if (isSystemOwner) {
    return res.json({ success: true, invites: allInvites });
  }

  const userFiltered = allInvites.filter(i =>
    (currentUserId && i.ownerUserId === currentUserId) ||
    (currentUserEmail && i.email.toLowerCase() === currentUserEmail)
  );
  return res.json({ success: true, invites: userFiltered });
});

// Register or update an invitation
app.post('/api/collaboration/invites', requireAuth, async (req, res) => {
  const { inviteId, projectId, email, name, role, status } = req.body;
  if (!inviteId || !projectId) {
    return res.status(400).json({ success: false, error: 'inviteId and projectId are required' });
  }

  const result = await collabInviteRepository.saveInvite({
    inviteId,
    projectId,
    email,
    name,
    role,
    status,
    currentUserId: req.user?.userId,
    isSystemOwner: req.user?.role === 'owner'
  });

  if (result.forbidden) {
    return res.status(403).json({ success: false, error: result.error });
  }

  return res.json({ success: true, invite: result.invite });
});

// Accept an invitation from link
app.post('/api/collaboration/accept-invite', requireAuth, async (req, res) => {
  const { inviteId, projectId } = req.body;
  if (!inviteId && !projectId) {
    return res.status(400).json({ success: false, error: 'inviteId or projectId is required' });
  }

  const result = await collabInviteRepository.acceptInvite({
    inviteId,
    projectId,
    userEmail: req.user?.email,
    userName: req.user?.name,
    isSystemOwner: req.user?.role === 'owner'
  });

  if (result.error) {
    return res.status(result.status).json({ success: false, error: result.error });
  }

  return res.json({ success: true, invite: result.invite });
});

// API Route for contact requests / registration list
app.get('/api/contact-requests', requireAuth, requireOwner, async (req, res) => {
  try {
    const requests = await contactRequestRepository.getContactRequests();
    return res.json({ success: true, requests });
  } catch (err: any) {
    console.error('Error reading contact requests:', err);
    return res.json({ success: true, requests: [] });
  }
});

app.post('/api/contact-requests', contactRateLimiter, async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const { requests } = await contactRequestRepository.saveContactRequest(email, name);
    return res.json({ success: true, message: 'Request saved successfully', requests });
  } catch (err: any) {
    console.error('Error saving contact request:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route for AI Writing Assistant (Sprint 50)
app.post('/api/ai/write', aiWriteRateLimiter, validateAIWrite, async (req, res, next) => {
  const { action, text, tone = 'romantic', language = 'Vietnamese', model } = req.body;
  
  // Resolve model to a valid Gemini model based on the guidelines and establish fallback order
  const fallbackSequence: string[] = [];
  const requestedModel = model || 'gemini-3.6-flash';

  if (requestedModel === 'gemini-3.1-pro-preview' || requestedModel === 'gemini-3.1-pro' || requestedModel.includes('3.1 Pro')) {
    fallbackSequence.push('gemini-3.1-pro-preview', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  } else if (requestedModel === 'gemini-3.6-flash' || requestedModel.includes('3.6 Flash')) {
    fallbackSequence.push('gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  } else if (requestedModel === 'gemini-3.5-flash' || requestedModel.includes('3.5 Flash')) {
    fallbackSequence.push('gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  } else if (requestedModel === 'gemini-3.5-flash-lite' || requestedModel.includes('3.5 Flash Lite')) {
    fallbackSequence.push('gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  } else if (requestedModel === 'gemini-3.1-flash-lite' || requestedModel.includes('3.1 Flash Lite')) {
    fallbackSequence.push('gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  } else {
    fallbackSequence.push('gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b');
  }

  let lastUsedModel = fallbackSequence[0] || 'gemini-3.6-flash';

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('GEMINI_API_KEY not configured, using intelligent simulation for writing assistant.');
      return res.json({
        success: true,
        result: simulateWriting(action, text, tone),
        isSimulated: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    const prompt = getWritingPrompt(action, text, tone, language);

    let resultText: string | null = null;
    let actualUsedModel: string | null = null;
    let fallbackErrors: string[] = [];

    // Cascading execution: Try models in sequence to prevent Quota Exhaustion crashes
    for (const currentModel of fallbackSequence) {
      try {
        lastUsedModel = currentModel;
        console.log(`[AI Write Pipeline] Attempting generation with model: ${currentModel}`);
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
        });

        if (response.text) {
          resultText = response.text.trim();
          actualUsedModel = currentModel;
          console.log(`[AI Write Pipeline] Successfully generated content using: ${currentModel}`);
          break; // Stop falling back once success is achieved
        }
      } catch (err: any) {
        const errMsg = err.message || 'Unknown error';
        console.warn(`[AI Write Pipeline Warning] Model ${currentModel} failed: ${errMsg}`);
        fallbackErrors.push(`${currentModel}: ${errMsg}`);
      }
    }

    if (resultText !== null) {
      // Clean residual prompt tags or metadata before returning
      const cleaned = resultText
        .replace(/\[[^\]]+\]/g, '')
        .replace(/^[*\-\u2022]?\s*(Cảm xúc chủ đạo|Phong cách thể hiện|Độ dài mong muốn|Ngôn ngữ|Mẫu thiết kế|Đối tượng|Dịp đặc biệt|Action|Target Text|Input Context):.*$/gm, '')
        .replace(/^[*\-\u2022]?\s*Chi tiết bổ sung từ người dùng:\s*/gm, '')
        .replace(/Hãy sáng tạo\s*dành cho\s*vào dịp\s*\.?/gi, '')
        .replace(/\(\d+\s*từ\)/gi, '')
        .trim();

      return res.json({
        success: true,
        result: cleaned || resultText,
        modelUsed: actualUsedModel
      });
    }

    // If we've run through all fallback models and none succeeded, throw an error
    throw new Error(`All Gemini fallback models exhausted. Details: [${fallbackErrors.join(' | ')}]`);

  } catch (error: any) {
    logger.exception(error, {
      traceId: req.traceId || 'N/A',
      user: (req.headers['x-user-email'] as string) || 'anonymous',
      module: 'AIWriteAssistant',
      api: 'POST /api/ai/write',
      calledModel: lastUsedModel,
      originalError: error.message
    });

    // If AI fails completely, fallback to simulation instead of 500 error
    console.log(`[AI Write Pipeline Fallback] All AI models failed. Using simulation fallback.`);
    return res.json({
      success: true,
      result: simulateWriting(action, text, tone),
      warning: error.message,
      isSimulated: true
    });
  }
});

function getWritingPrompt(action: string, text: string, tone: string, language: string): string {
  const toneDesc = {
    romantic: 'lãng mạn, ngọt ngào, sâu lắng, tràn ngập tình yêu',
    cute: 'đáng yêu, dễ thương, trong sáng, tinh nghịch',
    formal: 'trang trọng, tinh tế, chân thành, lịch sự',
    funny: 'vui vẻ, hài hước, dí dỏm, mang lại tiếng cười',
    emotional: 'xúc động, sâu sắc, chân thật, chạm đến trái tim',
  }[tone as keyof typeof toneDesc] || 'lãng mạn';

  const systemInstructions = `You are an elite, highly professional creative writer specializing in personalized love letters, anniversary notes, and greeting cards.
The input you receive contains structured context inside square brackets (like Preset, Author & Target, Timeline, Active Memory) followed by the [Target Text].
Your task is to rewrite, improve, expand, or fix the Target Text based on the action requested, fully incorporating the context details (like the couple's names, timeline milestones, and memories) naturally into the writing.

CRITICAL RULES:
1. Output ONLY the beautifully written, polished letter/card content itself.
2. Absolutely DO NOT include any introductory sentences (like "Here is your letter:"), no extra conversational comments, and no explanation.
3. Absolutely DO NOT repeat, leak, or include any bracketed instructions, tags, or metadata (such as "[Preset: ...]", "[Author & Target: ...]", "[Timeline: ...]", "[Target Text: ...]") in your final response.
4. Output directly in ${language}.
5. Match the requested tone: ${toneDesc}.`;

  switch (action) {
    case 'improve':
      return `${systemInstructions}\n\nAction: IMPROVE the Target Text to make it flow beautifully, keeping the core meaning but raising emotional resonance.\n\nInput Context and Text:\n${text}`;
    case 'rewrite':
      return `${systemInstructions}\n\nAction: REWRITE the Target Text completely to fit the preset style and enhance the depth of expression.\n\nInput Context and Text:\n${text}`;
    case 'shorten':
      return `${systemInstructions}\n\nAction: SHORTEN the Target Text to make it very concise, sweet, and punchy while keeping its emotional heart.\n\nInput Context and Text:\n${text}`;
    case 'expand':
      return `${systemInstructions}\n\nAction: EXPAND the Target Text into a rich, poetic narrative with beautiful metaphors and deep affection.\n\nInput Context and Text:\n${text}`;
    case 'grammar':
      return `${systemInstructions}\n\nAction: FIX GRAMMAR, spelling, and typos in the Target Text, polishing it for perfect presentation while retaining the voice.\n\nInput Context and Text:\n${text}`;
    case 'translate':
      return `${systemInstructions}\n\nAction: TRANSLATE the Target Text accurately and poetically to ${language === 'Vietnamese' ? 'English' : 'Vietnamese'}.\n\nInput Context and Text:\n${text}`;
    case 'generate':
      return `${systemInstructions}\n\nAction: GENERATE fresh, heartfelt romantic content based on the provided requirements.\n\nInput Context and Text:\n${text}`;
    default:
      return `${systemInstructions}\n\nAction: Polish and improve the following writing:\n${text}`;
  }
}

// Setup Vite dev server or static file serving
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || distIndexExists;

  if (isProduction && distIndexExists) {
    app.use(express.static(distPath, {
      maxAge: '1d'
    }));

    app.get('*', (req, res, next) => {
      // API routes should proceed to 404 handler or error handler
      if (req.path.startsWith('/api')) {
        return next();
      }
      // Don't fallback to index.html for missing static file requests (.js, .css, .png, etc.)
      if (path.extname(req.path)) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(404).send('File not found');
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  // Final error handling middleware
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);

    if (!process.env.OWNER_EMAILS || !process.env.OWNER_EMAILS.trim()) {
      const warningMessage = `⚠️ CẢNH BÁO: Biến môi trường OWNER_EMAILS chưa được cấu hình — hệ thống hiện KHÔNG có tài khoản owner nào. Vui lòng set OWNER_EMAILS trong .env trước khi deploy production.`;
      if (process.env.NODE_ENV === 'production') {
        logger.warn('[Security] OWNER_EMAILS is not configured in production environment!');
        console.error('\x1b[31m%s\x1b[0m', warningMessage);
      } else {
        console.warn('\x1b[33m%s\x1b[0m', warningMessage);
      }
    }
  });
}

startServer();
