import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { requireAuth } from '../middlewares/requireAuth';
import { isOwnerEmail } from '../config/ownerEmails';
import { getJwtSecret } from '../config/jwtSecret';
import { send2FAOtpEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService';
import { authRateLimiter } from '../middlewares/rateLimiters';

const router = Router();

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'];

const setAuthCookie = (res: any, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
};

router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' });
    }

    const existing = userRepository.findByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email này đã được đăng ký trên hệ thống' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = 'user';

    const newUser = userRepository.createUser({
      email: cleanEmail,
      passwordHash,
      name: name || cleanEmail.split('@')[0],
      role
    });

    const secret = getJwtSecret();
    const token = jwt.sign(
      { userId: newUser.userId, email: newUser.email, name: newUser.name, role: newUser.role },
      secret,
      { expiresIn: jwtExpiresIn }
    );

    setAuthCookie(res, token);

    // Gửi email chào mừng tự động qua SMTP
    sendWelcomeEmail(newUser.email, newUser.name).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    return res.json({
      success: true,
      token,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi hệ thống khi đăng ký' });
  }
});

router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập email và mật khẩu' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không chính xác' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không chính xác' });
    }

    // Auto promote to owner if email is in OWNER_EMAILS and role isn't owner yet
    let role = user.role;
    if (isOwnerEmail(cleanEmail) && role !== 'owner') {
      role = 'owner';
      userRepository.updateUser(user.userId, { role: 'owner' });
    }

    // Check if 2FA (Two-Factor Authentication) is enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        // Generate temporary 6-digit OTP code for 2FA
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
        userRepository.updateUser(user.userId, {
          twoFactorTempCode: otp,
          twoFactorTempExpires: expires
        });

        // Send real email OTP via SMTP
        const emailResult = await send2FAOtpEmail(cleanEmail, otp);

        return res.json({
          success: true,
          require2FA: true,
          message: emailResult.simulated
            ? 'Tài khoản đã kích hoạt 2FA. Đã gửi mã OTP đến email của bạn (Chế độ mô phỏng).'
            : 'Mã xác thực OTP 2FA đã được gửi đến email của bạn!',
          twoFactorOtp: otp,
          emailSent: emailResult.sent,
          emailSimulated: emailResult.simulated,
          email: cleanEmail
        });
      } else {
        // Verify 2FA OTP code
        if (
          !user.twoFactorTempCode ||
          user.twoFactorTempCode !== twoFactorCode.trim() ||
          !user.twoFactorTempExpires ||
          Date.now() > user.twoFactorTempExpires
        ) {
          return res.status(400).json({
            success: false,
            error: 'Mã xác thực 2 lớp (OTP 2FA) không chính xác hoặc đã hết hạn.'
          });
        }
        // Valid 2FA OTP! Clear temporary code
        userRepository.updateUser(user.userId, {
          twoFactorTempCode: undefined,
          twoFactorTempExpires: undefined
        });
      }
    }

    const secret = getJwtSecret();
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name, role, twoFactorEnabled: user.twoFactorEnabled || false },
      secret,
      { expiresIn: jwtExpiresIn }
    );

    setAuthCookie(res, token);

    return res.json({
      success: true,
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role,
        twoFactorEnabled: user.twoFactorEnabled || false
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi hệ thống khi đăng nhập' });
  }
});

router.post('/2fa/toggle', async (req, res) => {
  try {
    const { email, enabled } = req.body;
    let targetEmail = email;

    // Check authorization header or body email
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, getJwtSecret());
        if (decoded && decoded.email) {
          targetEmail = decoded.email;
        }
      } catch (e) {}
    }

    if (!targetEmail) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp Email tài khoản' });
    }

    const cleanEmail = targetEmail.trim().toLowerCase();
    const user = userRepository.findByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
    }

    const updated = userRepository.updateUser(user.userId, {
      twoFactorEnabled: !!enabled,
      twoFactorTempCode: undefined,
      twoFactorTempExpires: undefined
    });

    return res.json({
      success: true,
      twoFactorEnabled: !!enabled,
      message: enabled
        ? 'Đã kích hoạt Xác thực 2 lớp (2FA) thành công! Lần đăng nhập tiếp theo sẽ yêu cầu nhập mã xác thực OTP.'
        : 'Đã tắt Xác thực 2 lớp (2FA) thành công.'
    });
  } catch (err: any) {
    console.error('2FA toggle error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi khi bật/tắt 2FA' });
  }
});

router.post('/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập Email để khôi phục mật khẩu' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Tài khoản Email này chưa tồn tại trên hệ thống' });
    }

    // Generate 6-digit OTP code valid for 15 mins
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = Date.now() + 15 * 60 * 1000;

    userRepository.updateUser(user.userId, { resetCode, resetExpires });

    // Send real email OTP via SMTP
    const emailResult = await sendPasswordResetEmail(cleanEmail, resetCode);

    return res.json({
      success: true,
      message: emailResult.simulated
        ? `Mã xác nhận khôi phục đã được khởi tạo! Mã OTP: ${resetCode}`
        : 'Mã xác nhận khôi phục mật khẩu đã được gửi đến email của bạn!',
      resetCode,
      emailSent: emailResult.sent,
      emailSimulated: emailResult.simulated,
      email: cleanEmail
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi xử lý yêu cầu khôi phục' });
  }
});

router.post('/reset-password', authRateLimiter, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, mã OTP và mật khẩu mới là bắt buộc' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Mật khẩu mới phải từ 8 ký tự trở lên' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy tài khoản người dùng' });
    }

    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({ success: false, error: 'Mã xác nhận OTP không đúng' });
    }

    if (!user.resetExpires || Date.now() > user.resetExpires) {
      return res.status(400).json({ success: false, error: 'Mã OTP đã hết hạn (chỉ có hiệu lực trong 15 phút)' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    userRepository.updateUser(user.userId, {
      passwordHash,
      resetCode: undefined,
      resetExpires: undefined
    });

    return res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi đặt lại mật khẩu' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true });
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ success: true, user: req.user });
});

export default router;
