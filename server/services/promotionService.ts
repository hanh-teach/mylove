import { userRepository } from '../repositories/userRepository';
import { isOwnerEmail } from '../config/ownerEmails';

export function promoteUserToOwner(email: string): { success: boolean; message: string; user?: any } {
  if (!email || !email.trim()) {
    return { success: false, message: 'Email không được để trống.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if the email is in OWNER_EMAILS list
  if (!isOwnerEmail(cleanEmail)) {
    return {
      success: false,
      message: `Email '${cleanEmail}' không nằm trong danh sách OWNER_EMAILS được cấu hình.`
    };
  }

  // Find the user
  const user = userRepository.findByEmail(cleanEmail);
  if (!user) {
    return {
      success: false,
      message: `Tài khoản với email '${cleanEmail}' chưa tồn tại. Vui lòng yêu cầu người dùng tự đăng ký tài khoản user trước, sau đó chạy lại script này.`
    };
  }

  // Promote to owner
  const updatedUser = userRepository.updateUser(user.userId, { role: 'owner' });
  if (!updatedUser) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật vai trò người dùng.'
    };
  }

  return {
    success: true,
    message: `Nâng cấp tài khoản '${cleanEmail}' thành owner thành công.`,
    user: updatedUser
  };
}
