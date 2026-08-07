import { promoteUserToOwner } from '../server/services/promotionService';

const email = process.argv[2];

if (!email) {
  console.error('Lỗi: Vui lòng cung cấp email của tài khoản cần nâng cấp.');
  console.log('Sử dụng: tsx scripts/promoteOwner.ts <email>');
  process.exit(1);
}

const result = promoteUserToOwner(email);

if (result.success) {
  console.log('✅ THÀNH CÔNG:', result.message);
  process.exit(0);
} else {
  console.error('❌ THẤT BẠI:', result.message);
  process.exit(1);
}
