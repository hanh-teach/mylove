import nodemailer from 'nodemailer';

export interface EmailSendResult {
  sent: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Lazy initialization of Nodemailer SMTP Transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false // Ensure compatibility across hosting providers
    }
  });
}

/**
 * Send 2FA Authentication OTP Email
 */
export async function send2FAOtpEmail(toEmail: string, otpCode: string): Promise<EmailSendResult> {
  const senderName = process.env.SMTP_FROM || '"NoteMe Workspace" <noreply@noteme.app>';
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác thực 2 lớp (2FA) - NoteMe Workspace</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 32px 24px; text-align: center; }
        .otp-box { background: #fff1f2; border: 2px dashed #f43f5e; border-radius: 16px; padding: 20px; margin: 24px 0; display: inline-block; width: 80%; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #e11d48; margin: 0; }
        .notice { font-size: 13px; color: #64748b; line-height: 1.6; }
        .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Xác thực 2 lớp (2FA)</h1>
          <p>NoteMe Workspace - Bảo mật tài khoản</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; color: #334155;">Xin chào,</p>
          <p style="font-size: 14px; color: #475569;">Bạn đang thực hiện đăng nhập vào hệ thống <strong>NoteMe Workspace</strong>. Vui lòng nhập mã OTP dưới đây để hoàn tất xác thực:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
          </div>

          <p class="notice">
            ⏰ Mã OTP này có hiệu lực trong vòng <strong>10 phút</strong>.<br>
            ⚠️ Tuyệt đối không chia sẻ mã này với bất kỳ ai để bảo vệ tài khoản của bạn.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} NoteMe Workspace. Email này được gửi tự động, vui lòng không phản hồi.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n==================================================`);
    console.log(`[SMTP SIMULATION] EMAIL 2FA OTP TO: ${toEmail}`);
    console.log(`[SMTP SIMULATION] CODE: ${otpCode}`);
    console.log(`[SMTP INFO] Đang ở chế độ giả lập gửi Email (Do chưa cấu hình SMTP_HOST/SMTP_USER trong môi trường).`);
    console.log(`==================================================\n`);
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: senderName,
      to: toEmail,
      subject: `[NoteMe] Mã OTP Xác thực 2 lớp (2FA): ${otpCode}`,
      html: htmlContent
    });
    console.log(`[SMTP SUCCESS] Sent 2FA OTP Email to ${toEmail}, MessageID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, simulated: false };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to send 2FA OTP Email to ${toEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * Send Password Reset OTP Email
 */
export async function sendPasswordResetEmail(toEmail: string, otpCode: string): Promise<EmailSendResult> {
  const senderName = process.env.SMTP_FROM || '"NoteMe Workspace" <noreply@noteme.app>';
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Khôi phục Mật khẩu - NoteMe Workspace</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 32px 24px; text-align: center; }
        .otp-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 16px; padding: 20px; margin: 24px 0; display: inline-block; width: 80%; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0284c7; margin: 0; }
        .notice { font-size: 13px; color: #64748b; line-height: 1.6; }
        .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Khôi phục Mật khẩu</h1>
          <p>NoteMe Workspace</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; color: #334155;">Xin chào,</p>
          <p style="font-size: 14px; color: #475569;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${toEmail}</strong>. Nhập mã OTP bên dưới để tiến hành đổi mật khẩu:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
          </div>

          <p class="notice">
            ⏰ Mã OTP có hiệu lực trong <strong>15 phút</strong>.<br>
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc đổi mật khẩu để bảo mật.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} NoteMe Workspace. Email này được gửi tự động.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n==================================================`);
    console.log(`[SMTP SIMULATION] EMAIL RESET PASSWORD OTP TO: ${toEmail}`);
    console.log(`[SMTP SIMULATION] CODE: ${otpCode}`);
    console.log(`[SMTP INFO] Đang ở chế độ giả lập gửi Email (Do chưa cấu hình SMTP_HOST/SMTP_USER trong môi trường).`);
    console.log(`==================================================\n`);
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: senderName,
      to: toEmail,
      subject: `[NoteMe] Mã OTP Khôi phục Mật khẩu: ${otpCode}`,
      html: htmlContent
    });
    console.log(`[SMTP SUCCESS] Sent Password Reset Email to ${toEmail}, MessageID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, simulated: false };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to send Password Reset Email to ${toEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * Send Welcome Email to newly registered user
 */
export async function sendWelcomeEmail(toEmail: string, userName: string): Promise<EmailSendResult> {
  const senderName = process.env.SMTP_FROM || '"Romantic Card App" <noreply@noteme.app>';
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chào mừng bạn đến với Romantic Card Video Generator</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 8px 0 0; opacity: 0.95; font-size: 14px; }
        .content { padding: 32px 24px; text-align: left; line-height: 1.6; color: #334155; }
        .highlight-box { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💖 Chào mừng ${userName}!</h1>
          <p>Tạo thiệp & Video tình yêu lãng mạn chỉ trong vài bước</p>
        </div>
        <div class="content">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Romantic Card Video Generator</strong>!</p>
          <div class="highlight-box">
            ✨ Bạn có thể sử dụng Trợ lý AI, tạo dòng thời gian kỉ niệm, chỉnh sửa bản nhạc nền yêu thích và xuất video chất lượng cao ngay bây giờ!
          </div>
          <p>Chúc bạn tạo nên những món quà kỉ niệm thật ý nghĩa và ngọt ngào!</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Romantic Card Video Generator. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`\n==================================================`);
    console.log(`[SMTP SIMULATION] WELCOME EMAIL TO: ${toEmail} (${userName})`);
    console.log(`[SMTP INFO] Đang ở chế độ giả lập gửi Email (Do chưa cấu hình SMTP_HOST/SMTP_USER).`);
    console.log(`==================================================\n`);
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: senderName,
      to: toEmail,
      subject: `💖 Chào mừng ${userName} đến với Romantic Card Video Generator!`,
      html: htmlContent
    });
    console.log(`[SMTP SUCCESS] Sent Welcome Email to ${toEmail}, MessageID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId, simulated: false };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to send Welcome Email to ${toEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
}
