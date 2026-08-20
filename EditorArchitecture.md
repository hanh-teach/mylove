# KIẾN TRÚC THIẾT KẾ EDITOR ENGINE (BẢN VẼ KIẾN TRÚC TOÀN DIỆN)
**Tác giả:** Chief Software Architect (25 năm kinh nghiệm trong thiết kế công cụ đồ họa: Canva, Figma, Photoshop)  
**Tài liệu:** Bản thiết kế hệ thống Core Editor Engine thế hệ mới cho ứng dụng Thiết kế Thiệp chúc mừng đa phương tiện.

---

## 1. GIỚI THIỆU & TẦM NHÌN KIẾN TRÚC

Một trình chỉnh sửa đồ họa chuyên nghiệp (Graphics Editor) không chỉ đơn thuần là việc kéo thả các phần tử HTML trên màn hình thông qua các thư viện như Framer Motion hay CSS Absolute. Bản chất của một Editor Engine thực thụ nằm ở **khả năng quản lý không gian (Spatial Management)**, **độc lập thiết bị (Device-independent rendering)**, **tính toán ma trận biến hình (Affine Matrix Transformation)** và **quản lý vòng đời trạng thái hiệu quả (Deterministic State Lifecycle)**.

Kiến trúc đề xuất dưới đây hướng tới việc biến hệ thống Editor hiện tại thành một **Engine tách biệt hoàn toàn (Decoupled Engine)** có tính module hóa cao, dễ dàng mở rộng sang các công nghệ hiển thị khác (HTML5 Canvas, WebGL, SVG) mà không phá vỡ logic giao diện người dùng (UI) hiện tại.

---

## 2. PHÂN TÍCH LUỒNG DỮ LIỆU HIỆN TẠI (CURRENT DATA FLOW)

Hiện tại, toàn bộ dữ liệu editor được quản lý phân tán hoặc gộp chung trong component React lớn (`App.tsx`).

### Sơ đồ Luồng Dữ liệu Hiện tại:
```
[User Action: Click/Drag] 
       │
       ▼
[React State: placedItems (App.tsx)] ──(Kích hoạt Re-render toàn bộ DOM)──► [DOM Updates]
       │
       ▼
[AI Video Generation Pipeline] ──► [Server-side Media Production]
```

### Cách thức hoạt động:
1. **Khởi tạo & Thêm Decor:** Khi người dùng click chọn một biểu tượng trang trí trong bảng màu (`Palette`), phần tử mới được thêm vào mảng `placedItems` với một tọa độ ngẫu nhiên tính dựa trên kích thước cửa sổ trình duyệt hiện hành (`window.innerWidth / 2`, `window.innerHeight / 2`).
2. **Kéo thả (Dragging):** Sử dụng thuộc tính `drag` của `<motion.div>`. Sau khi kết thúc sự kiện kéo, `onDragEnd` thu thập độ lệch dịch chuyển (`info.offset`) và cộng dồn trực tiếp vào tọa độ gốc `(x, y)` của phần tử trong React state thông qua hàm `setPlacedItems`.
3. **Thay đổi tỷ lệ (Scaling) & Xoay (Rotating):** Các nút điều khiển nổi tiếp nhận sự kiện click chuột và áp dụng phép cộng trực tiếp vào thuộc tính số thực `scale` và `rotation` của đối tượng mục tiêu.
4. **Xử lý hoạt ảnh (Animation):** Thuộc tính động của Framer Motion chuyển hóa dạng chuỗi động như `"float"`, `"pulse"`, `"spin"` trực tiếp thành các cấu hình chuyển động của CSS.

---

## 3. CÁC ĐIỂM YẾU VÀ NỢ KỸ THUẬT CỦA EDITOR HIỆN TẠI (TECHNICAL DEBT)

Qua phân tích mã nguồn hiện tại của dự án, chúng tôi nhận thấy các vấn đề kiến trúc nghiêm trọng sau:

1. **Hiệu năng suy giảm do Khớp nối Chặt chẽ (Tight Coupling & Re-render Bottleneck):**
   * *Triệu chứng:* Toàn bộ các trạng thái UI phụ (nhạc nền, thanh menu mở rộng, màu văn bản, danh sách menu trang trí) đều nằm chung trong React State của `App.tsx`. 
   * *Hậu quả:* Mỗi pixel di chuyển của chuột trong quá trình kéo thả đều có khả năng kích hoạt render lại toàn bộ DOM của ứng dụng, gây ra hiện tượng giật lag (frame drop) khi số lượng decor tăng lên quá 15 phần tử.

2. **Lỗi Tọa độ không ổn định (Viewport-dependent Coordinates):**
   * *Triệu chứng:* Tọa độ ban đầu và phép toán chuyển dịch phần tử phụ thuộc trực tiếp vào kích thước vùng chứa CSS tuyệt đối hoặc độ phân giải của trình duyệt thiết bị khách.
   * *Hậu quả:* Một thiệp được tạo trên màn hình điện thoại (mobile) khi hiển thị trên màn hình máy tính (desktop) sẽ bị vỡ hoàn toàn bố cục, các phần tử decor bị lệch ra khỏi tâm thiết kế vì không có khái niệm **Không gian thiết kế ảo (World Space)**.

3. **Thiếu vắng Hệ thống quản lý Lớp (Implicit Layer Stack):**
   * *Triệu chứng:* Z-index và thứ tự chồng lớp được xác định ngầm định bằng vị trí index của mảng `placedItems`.
   * *Hậu quả:* Người dùng không thể di chuyển một đối tượng ra phía sau (Send Backward) hoặc đưa lên phía trước (Bring Forward). Không thể khóa (Lock) một layer để tránh click nhầm hoặc ẩn tạm thời (Hide) một đối tượng.

4. **Trực quan hóa điều chỉnh phần tử thô sơ (Primitive Transformation UI):**
   * *Triệu chứng:* Việc xoay và phóng to thu nhỏ phụ thuộc vào việc click nút cộng/trừ cơ học.
   * *Hậu quả:* Trải nghiệm người dùng xa lạ so với các tiêu chuẩn thiết kế hiện đại (không có khung điều khiển bao quanh đối tượng - Bounding Box, không thể tương tác kéo trực tiếp các góc phần tử).

---

## 4. KIẾN TRÚC ĐỀ XUẤT CHO EDITOR ENGINE THẾ HỆ MỚI

Hệ thống được tái cấu trúc thành một **Editor Engine** độc lập, bọc kín toàn bộ logic nghiệp vụ đồ họa trong các Manager chuyên biệt và giao tiếp với React thông qua một **React Adapter / Bridge Interface**.

```
                           ┌────────────────────────────────────────────────────────┐
                           │                      EDITOR ENGINE                     │
                           ├────────────────────────────────────────────────────────┤
                           │                                                        │
 ┌───────────────┐         │   ┌─────────────────────┐    ┌─────────────────────┐   │
 │ React UI View │◄────────┼──►│       Canvas        │◄──►│    Layer Manager    │   │
 └───────────────┘         │   └─────────────────────┘    └─────────────────────┘   │
                           │                                                        │
                           │   ┌─────────────────────┐    ┌─────────────────────┐   │
                           │   │   History Manager   │◄──►│  Selection Manager  │   │
                           │   └─────────────────────┘    └─────────────────────┘   │
                           │                                                        │
                           │   ┌─────────────────────┐    ┌─────────────────────┐   │
                           │   │  Transform Manager  │◄──►│    Grid Manager     │   │
                           │   └─────────────────────┘    └─────────────────────┘   │
                           │                                                        │
                           │   ┌─────────────────────┐    ┌─────────────────────┐   │
                           │   │    Zoom Manager     │◄──►│   Export Manager    │   │
                           │   └─────────────────────┘    └─────────────────────┘   │
                           │                                                        │
                           │                ┌─────────────────────┐                 │
                           │                │  Auto Save Manager  │                 │
                           │                └─────────────────────┘                 │
                           └────────────────────────────────────────────────────────┘
```

---

## 5. THIẾT KẾ CÁC THÀNH PHẦN CỐT LÕI (CORE MODULES)

### 5.1. Canvas (Bộ quản lý vùng làm việc)
Canvas đóng vai trò là "Vùng tọa độ chuẩn toàn cầu" (Global Coordinate Anchor). Nhiệm vụ cốt lõi của Canvas là duy trì sự nhất quán giữa những gì người dùng thấy và dữ liệu thực tế lưu trữ.
* **Tách biệt Không gian Tọa độ (Coordinate Space Separation):**
  * **World Space (Không gian thiết kế):** Một hệ tọa độ cố định ảo (ví dụ: `1920x1080` pixel) độc lập hoàn toàn với thiết bị đầu ra. Tất cả thông số phần tử đồ họa (vị trí $X, Y$, kích thước $W, H$) đều được lưu trữ theo tọa độ World Space này.
  * **Screen Space (Không gian màn hình):** Hệ tọa độ vật lý của trình duyệt của người dùng.
* **Biến đổi Ma trận Affine (Affine Transform Matrix):**
  Để chuyển đổi giữa World Space và Screen Space, Canvas sử dụng một Ma trận Biến đổi $3\times3$ đồng nhất:
  $$\begin{bmatrix} X_{screen} \\ Y_{screen} \\ 1 \end{bmatrix} = M_{viewport} \times \begin{bmatrix} X_{world} \\ Y_{world} \\ 1 \end{bmatrix}$$
  Trong đó $M_{viewport}$ là tích hợp của ma trận Dịch chuyển (Translation), Ma trận Thu phóng (Scale), và Ma trận Xoay (Rotation).
* **Zoom-Invariant Manipulation (Xử lý không đổi theo Zoom):** Các đường viền thiết kế, nút neo kéo thả (handles) sẽ tự động tính toán lại ma trận nghịch đảo để luôn hiển thị ở kích thước cố định (ví dụ: `8px`) trên màn hình người dùng, bất kể canvas đang ở tỷ lệ zoom $10\%$ hay $500\%$.

### 5.2. Layer Manager (Quản lý các lớp đồ họa)
Hệ thống quản lý một Cây cấu trúc lớp đồ họa (Scenegraph), lưu trữ phân cấp các node trên Canvas.
* **Cây Đối Tượng (Scene Node Tree):** Mỗi phần tử trên Canvas được định nghĩa là một Node kế thừa từ một interface chuẩn:
  ```typescript
  interface SceneNode {
    id: string;
    name: string;
    type: string;
    locked: boolean;
    visible: boolean;
    opacity: number;
    transform: AffineMatrix;
    parentId: string | null;
    children?: SceneNode[];
  }
  ```
* **Thứ tự vẽ (Z-Order):** Thay vì sử dụng chỉ số mảng phẳng, Layer Manager điều hướng vẽ bằng phương pháp duyệt cây (Pre-order Tree Traversal) nhằm bảo vệ tính toàn vẹn cấu trúc lớp vẽ từ sau ra trước (Painter's Algorithm).
* **Khóa và Ẩn Lớp (Layer Locking & Visibility):**
  * `locked: true` sẽ vô hiệu hóa hoàn toàn khả năng nhận diện điểm va chạm (Hit Testing) của Node đó, giúp bảo vệ lớp nền không bị lệch khi người dùng chọn nhiều phần tử nhỏ phía trên.
  * `visible: false` loại bỏ phần tử khỏi luồng vẽ và tắt các tương tác của nó.

### 5.3. History Manager (Bộ quản lý lịch sử)
Cung cấp khả năng Undo/Redo tức thì với bộ nhớ tối ưu hóa cao.
* **Command Pattern (Thiết kế mẫu lệnh):** Mỗi hành động tương tác (Move, Scale, Add, Delete, Change Color) phải được gói gọn trong một lớp thực thi `Command`:
  ```typescript
  interface Command {
    execute(): void;
    undo(): void;
  }
  ```
* **Cơ chế lưu trữ trạng thái Delta (Delta-State / Memoization):**
  * Thay vì chụp lại toàn bộ dữ liệu canvas khổng lồ sau mỗi thay đổi (gây tốn bộ nhớ RAM), History Manager chỉ lưu trữ mảng thay đổi cục bộ (diff / patch).
  * Giới hạn kích thước ngăn xếp lịch sử (History Stack Limit) tự động giải phóng các mảng lệnh cũ nhất khi ngăn xếp vượt ngưỡng (ví dụ: tối đa 100 bước lưu).

### 5.4. Selection Manager (Quản lý lựa chọn)
Selection Manager xử lý các phép tính toán hình học liên quan đến việc chọn phần tử.
* **Bao đóng Đối tượng (Axis-Aligned Bounding Box - AABB):**
  Mỗi phần tử được bao quanh bởi một hình hộp chữ nhật giới hạn hẹp nhất. Selection Manager tính toán khung này để vẽ đường viền xanh định vị đối tượng được chọn.
* **Lựa chọn Đa điểm (Multi-selection & Marquee Selection):**
  * Khi người dùng nhấn và giữ chuột kéo trên màn hình tạo thành một vùng chọn trống (Marquee Box). Engine sẽ áp dụng thuật toán kiểm tra sự giao nhau của các hộp giới hạn (AABB Intersection Test) để xác định danh sách các node nằm trong vùng chọn.
* **Nhóm Đối tượng Tạm thời (Transient Grouping):**
  Khi nhiều đối tượng cùng được chọn, Selection Manager tạo ra một `VirtualGroupNode` tạm thời bọc ngoài chúng, giúp xử lý kéo thả đồng bộ và dịch chuyển cả nhóm như một khối thống nhất.

### 5.5. Transform Manager (Bộ biến đổi tương tác)
Transform Manager chịu trách nhiệm tính toán vị trí, góc xoay và kích cỡ của một hoặc nhiều phần tử đang được chọn trong quá trình tương tác trực tiếp bằng chuột.
* **Khung neo tương tác (Transformation Handles):**
  * Vẽ 8 nút góc xung quanh hình hộp bao của đối tượng được chọn kèm nút neo xoay ở đỉnh phía trên.
* **Hệ số tỷ lệ khóa góc (Aspect Ratio Lock):**
  * Hỗ trợ tự động khóa tỷ lệ chiều dọc/ngang nguyên thủy của phần tử khi người dùng nhấn giữ phím `Shift` lúc kéo nút neo góc.
* **Quay quanh điểm trọng tâm (Pivot-Point Rotation):**
  Tính toán góc quay tương đối của chuột với tâm hình học của đối tượng:
  $$\theta = \text{atan2}(y_{mouse} - y_{center}, x_{mouse} - x_{center})$$
  và cập nhật ma trận quay của phần tử.

### 5.6. Grid Manager (Hệ thống căn chỉnh & Lưới)
Hỗ trợ căn chỉnh phần tử mỹ thuật với độ chính xác tuyệt đối.
* **Lưới cơ sở (Base Grid):**
  * Lưới tọa độ vô hình giúp làm tròn các giá trị dịch chuyển của chuột đến bội số gần nhất của kích thước lưới (ví dụ: dịch chuyển nhảy cách quãng `8px`).
* **Đường gióng Thông minh (Smart Guides / Magnetic Snapping):**
  * Khi kéo thả một phần tử, Grid Manager quét các phần tử xung quanh trong bán kính quét xác định (ví dụ: `10px`).
  * Tự động tính toán các đường thẳng gióng hàng (Căn lề Trái, Tâm, Phải, Trên, Dưới) giữa đối tượng đang kéo và các đối tượng lân cận, đồng thời sinh các nét vẽ màu đỏ chấm để chỉ dẫn cho người dùng.

### 5.7. Zoom Manager (Thu phóng & Di chuyển Viewport)
Quản lý trạng thái hiển thị của camera ảo trên Canvas.
* **Điều khiển Trực quan (Pan & Zoom):**
  * Zoom Canvas thông qua sự kiện cuộn chuột (`WheelEvent` kết hợp phím `Ctrl`) hoặc cử chỉ chụm ngón tay trên Touchpad.
  * Trượt Canvas (Panning) khi nhấn phím khoảng trắng (`Spacebar`) và kéo chuột.
* **Zoom hội tụ tại Con trỏ (Zoom at Pointer):**
  * Khi phóng to, điểm nằm dưới con trỏ chuột của người dùng phải giữ nguyên vị trí Screen Space, yêu cầu Zoom Manager dịch chuyển đồng thời ma trận viewport dịch chuyển $M_{viewport}$ bù trừ góc thu phóng.

### 5.8. Export Manager (Kết xuất & Xuất bản)
Xuất bản nội dung từ cấu trúc dữ liệu đồ họa ra các định dạng đích chất lượng cao.
* **Bản vẽ tuần tự hóa (JSON Schema Serialization):**
  * Xuất toàn bộ Scene Node Tree thành một tập tin JSON nhỏ gọn, sạch sẽ, lưu trữ đúng định dạng tọa độ World Space để tái dựng lại chính xác 100% trên mọi thiết bị.
* **Bộ biên dịch vectơ (SVG Compiler):**
  * Duyệt cây phân cấp Node và biên dịch chúng thành mã nguồn SVG nguyên bản, hỗ trợ xuất bản in ấn sắc nét vô hạn độ phân giải.
* **Bộ raster hóa (Canvas Rasterization Pipeline):**
  * Vẽ cấu trúc Node Tree lên một thẻ `<canvas>` ẩn ở độ phân giải gốc cao (ví dụ: 2x hoặc 3x mật độ pixel) để xuất file PNG/JPEG chất lượng cao không bị nhòe nét.

### 5.9. Auto Save Manager (Tự động Lưu trữ Tránh Xung đột)
* **Debounced Persistence (Lưu trữ hoãn trì chống thắt nút cổ chai):**
  * Tránh việc gọi API lưu trữ liên tục mỗi khi kéo chuột di chuyển một pixel. Auto Save Manager tích hợp thuật toán hoãn (debounce) hoãn lưu trong khoảng 1-2 giây sau khi người dùng dừng thao tác.
* **Lưu trữ Cục bộ Kết hợp Đám mây (Hybrid Storage):**
  * Lưu trữ tạm thời trạng thái JSON thiết kế vào `LocalStorage` hoặc `IndexedDB` của trình duyệt khách.
  * Đồng bộ định kỳ lên cơ sở dữ liệu đám mây (ví dụ: Firestore) dưới dạng một tác vụ nền không chặn UI (non-blocking background sync).

---

## 6. THIẾT KẾ PHÂN TÁCH STATE MANAGEMENT & RENDERING PIPELINE

Để giải quyết triệt để lỗi thắt nút cổ chai của React Render, chúng tôi thiết kế lại mô hình quản lý trạng thái và luồng vẽ của Editor:

### Vòng đời Pipeline vẽ và luồng dữ liệu (The Rendering Pipeline):

```
[MOUSE / TOUCH EVENTS]
       │
       ▼ (Event Capture)
[INPUT PROCESSING] (Bắt sự kiện và chuyển sang tọa độ World Space)
       │
       ▼ (Dispatch Action)
[ATOMIC ENGINE STORE] (Cập nhật trực tiếp dữ liệu thô dạng tham chiếu thuần)
       │
       ├─────────────────────────┐
       ▼ (Trigger Render)        ▼ (Publish Event)
[RENDER LOOP] (60FPS Frame)    [REACT BRIDGE ADAPTER]
  - Clear Viewport               - Chỉ đồng bộ các thuộc tính
  - Apply Camera Transform         cơ bản lên React State để hiển thị
  - Draw Layers (Z-order)          thông tin thanh công cụ (ví dụ: scale%, góc xoay)
  - Draw Smart Guides            - KHÔNG re-render lại cấu trúc cây canvas DOM.
  - Draw Active Selection Handles
```

### Kiến trúc State Độc lập (Atomic Pub/Sub Store):
1. **Engine Core Store:** Sử dụng mô hình lưu trữ thô tối giản (như Zustand hoặc cấu trúc OOP Vanilla JS) nằm ngoài cây component React.
2. **React Bridge:** Component React chỉ lắng nghe các sự kiện thay đổi vĩ mô (ví dụ: `selection-changed`, `history-mutated`).
3. **Luồng vẽ Độc lập:** Quá trình dịch chuyển kéo thả, xoay và vẽ lưới dẫn hướng hoàn toàn chạy bên trong lớp vẽ canvas tối ưu hóa của HTML5 Canvas hoặc các thẻ SVG độc lập có cấu hình `will-change: transform`, giảm tối thiểu lượng tính toán của React Virtual DOM xuống mức tiệm cận bằng 0.

---

## 7. LỘ TRÌNH TRIỂN KHAI PHẦN CỨNG MÀ KHÔNG ẢNH HƯỞNG ĐẾN UI HIỆN TẠI

Để tích hợp kiến trúc mới này mà **không phá vỡ logic hay giao diện hiện có** của người dùng, chúng tôi đề xuất quy trình thực thi cuốn chiếu như sau:

1. **Giai đoạn 1: Triển khai Module Hóa Tọa độ ảo (Virtual World Coordinates):**
   * Giữ nguyên cấu trúc render DOM hiện tại của `<motion.div>`.
   * Tạo thư mục `/src/shared/utils/coordinates.ts` để lưu trữ các phép tính chuyển hóa từ tọa độ tương đối sang tọa độ World Space ảo `1000x1000`. Căn chỉnh để các thiết bị hiển thị đồng bộ tỷ lệ.

2. **Giai đoạn 2: Tách biệt Trạng thái & Xây dựng Cây Node Lớp (Scenegraph):**
   * Di chuyển mảng `placedItems` từ React State trong `App.tsx` vào một file riêng `/src/modules/editor/store.ts`.
   * Xây dựng giao thức lớp `LayerManager` bao gồm các hàm chức năng: `bringToFront()`, `sendToBack()`, `lockLayer()`, `toggleVisibility()`.

3. **Giai đoạn 3: Triển khai Command Pattern cho History (Lịch sử):**
   * Viết cấu trúc lớp `HistoryManager` có khả năng đón nhận mảng trạng thái cây Node cũ và mới. Tích hợp chức năng hoàn tác `Undo` và làm lại `Redo` với các phím tắt `Ctrl + Z` / `Ctrl + Y`.

4. **Giai đoạn 4: Đánh bóng Trải nghiệm Tương tác (Transform & Grid Managers):**
   * Thay thế các nút chỉnh sửa thô sơ nổi trên màn hình hiện tại bằng một khung Bounding Box tương tác bao quanh đối tượng được chọn.
   * Tích hợp tính năng tự động hút dính phần tử (Snapping/Magnetic) khi tâm hoặc cạnh của đối tượng di chuyển đến gần các đối tượng khác.

---
*Bản thiết kế này cung cấp một nền tảng vững chắc, sẵn sàng đưa trình biên tập thiệp của dự án lên tiêu chuẩn công nghệ của một ứng dụng đồ họa chuyên nghiệp quy mô lớn.*
