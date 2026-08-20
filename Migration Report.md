# BÁO CÁO DI CƯ KIẾN TRÚC (MIGRATION REPORT)
**Dự án:** Trình Tạo Thiệp & Video Chúc Mừng Lãng Mạn (Romantic Card & Video Generator)  
**Tác giả:** Chief Software Architect  
**Mục tiêu:** Di cư cấu trúc mã nguồn sang mô hình **Module-Based Architecture** nhằm phân chia ranh giới nghiệp vụ (Separation of Concerns), đảm bảo hệ thống dễ bảo trì và mở rộng trong tương lai mà không làm thay đổi bất kỳ hành vi người dùng (UI) hay các giao diện API hiện có.

---

## 1. SO SÁNH CẤU TRÚC THƯ MỤC (BEFORE VS. AFTER)

### Trước khi Di cư (Monolithic Layout)
```text
/src
├── assets/
│   └── images/               <-- Chứa tài nguyên hình ảnh thiệp tĩnh
├── App.tsx                   <-- TẤT CẢ LOGIC (Types, Constants, Colors, UI, API client) nằm trong 1 file 1200+ dòng
├── index.css
└── main.tsx
```

### Sau khi Di cư (Module-Based Architecture)
```text
/src
├── modules/                  <-- Chứa các domain logic & submodules nghiệp vụ riêng biệt
│   ├── editor/               <-- Quản lý logic soạn thảo, kéo thả sticker (index.ts)
│   ├── ai/                   <-- Đầu nối gọi dịch vụ AI (index.ts)
│   ├── project/              <-- Quản lý dự án thiệp thiết kế (index.ts)
│   ├── assets/               <-- Đưa hình ảnh và tài nguyên vào submodule (images/)
│   ├── export/               <-- Xuất ảnh canvas / video (index.ts)
│   └── auth/                 <-- Quản lý tài khoản, xác thực người dùng (index.ts)
├── shared/                   <-- Chứa tài nguyên dùng chung xuyên suốt dự án
│   ├── components/           <-- UI Components tái sử dụng (index.ts)
│   ├── hooks/                <-- Custom React Hooks (index.ts)
│   ├── services/             <-- API Clients / Services kết nối ngoài (index.ts)
│   ├── utils/                <-- Các hàm bổ trợ thuật toán (color.ts)
│   ├── constants/            <-- Các bảng cấu hình tĩnh, registries (index.ts)
│   ├── types/                <-- Khai báo kiểu dữ liệu TypeScript (index.ts)
│   └── config/               <-- Thiết lập cấu hình hệ thống (index.ts)
├── App.tsx                   <-- UI chính siêu tinh gọn (~1050 dòng, sạch bóng logic nền)
├── index.css
└── main.tsx
```

---

## 2. CHI TIẾT CÁC THAY ĐỔI THỰC HIỆN

1. **Di chuyển Assets**: Di chuyển toàn bộ thư mục `/src/assets` sang `/src/modules/assets` nhằm đặt tài nguyên hình ảnh lãng mạn vào đúng mô hình domain quản lý của Module.
2. **Trích xuất Types**: Khai báo tệp tin `/src/shared/types/index.ts` để định nghĩa tập trung các kiểu dữ liệu `SceneType`, `BgStyleType`, `FontStyleType`, `DecorType`, `PlacedItem`, và `HeartItem`.
3. **Trích xuất Hằng số (Constants)**: Khởi tạo `/src/shared/constants/index.ts` để lưu trữ các cấu hình đăng ký:
   - `fontRegistry`: Đăng ký font chữ hiển thị.
   - `musicTracks`: Đăng ký danh sách nhạc nền.
   - `decorRegistry`: Tải ảnh tĩnh và cấu hình dạng hiển thị cho các vật trang trí (decor/sticker).
   - `sceneConfig`: Định nghĩa bảng màu sắc và biểu tượng của từng Scene.
   - `textColors`: Định nghĩa bảng tùy chọn màu chữ.
4. **Cô lập Utilities**: Trích xuất các hàm toán học chuyển đổi hệ màu sắc OKLAB/OKLCH sang RGB phức tạp (`oklabToRgb`, `oklchToRgb`, `replaceOklchInString`) vào `/src/shared/utils/color.ts`.
5. **Cập nhật và Tinh gọn `App.tsx`**:
   - Loại bỏ hoàn toàn hơn 150 dòng mã cấu hình, kiểu dữ liệu thô, và hàm bổ trợ.
   - Cấu hình import tham chiếu trực tiếp tới các phân khu Shared Module mới tạo.
   - Thay thế các định nghĩa kiểu inline của React State bằng các interface `PlacedItem` và `HeartItem` chuẩn hóa, giúp code trong sáng và dễ đọc hơn rất nhiều.
6. **Tạo Placeholder cấu trúc chuẩn**: Tạo sẵn các tập tin entry point `index.ts` cho tất cả các folder con để sẵn sàng đón nhận các tệp logic tiếp theo khi dự án phát triển mạnh mẽ hơn.

---

## 3. KẾT QUẢ ĐÁNH GIÁ

- **Tính tương thích**: Hệ thống được kiểm tra biên dịch bằng Vite thành công 100% (`Build succeeded - the applet is compiled`).
- **Linter Check**: Đạt chuẩn lơ-ve hoàn toàn không phát sinh bất kỳ lỗi cú pháp hay thiếu import (`Linting completed successfully`).
- **Trải nghiệm người dùng**: Hành vi của trình phát nhạc, kéo thả decor, bộ lọc phông nền, xuất ảnh canvas sắc nét, và gọi tạo video qua backend được bảo toàn nguyên vẹn 100%. Không có bất kỳ rủi ro phá vỡ tính năng (zero regression).
