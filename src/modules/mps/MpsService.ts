import { MpsVolume, ProductTelemetryData } from './types';

class MpsService {
  private mpsVolumes: MpsVolume[] = [
    {
      id: 'vol_1',
      volumeNumber: 1,
      title: 'Vision & Product Strategy',
      subtitle: 'Tầm nhìn, triết lý sản phẩm & định hướng chiến lược dài hạn',
      summary: 'Định nghĩa sứ mệnh của LoveNote như một không gian sáng tạo kỷ niệm cá nhân, đề cao sự riêng tư, tính nghệ thuật và sự đồng hành của trí tuệ nhân tạo.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '1.1 Triết lý Core Vision',
          details: [
            'Sản phẩm không chỉ lưu giữ dữ liệu, mà nâng tầm cảm xúc tình yêu và kỷ niệm gia đình.',
            'Nguyên tắc Trust-First & Local-First: Dữ liệu người dùng thuộc sở hữu độc quyền của người dùng.',
            'Chuyển đổi từ dự án thử nghiệm (Sprint Model) sang Sản phẩm Thương mại Bền vững (Product Lifecycle Management).'
          ]
        },
        {
          heading: '1.2 Mục tiêu Chiến lược',
          details: [
            'Trở thành ứng dụng hàng đầu thế giới về viết thư tình và nhật ký kỷ niệm đa nền tảng.',
            'Mở rộng hệ sinh thái ứng dụng hỗ trợ Windows, Android, Tablet và Cloud SaaS.'
          ]
        }
      ]
    },
    {
      id: 'vol_2',
      volumeNumber: 2,
      title: 'UX/UI & Design System',
      subtitle: 'Hệ thống thiết kế, chuẩn mực giao diện & quy tắc tương tác',
      summary: 'Quy chuẩn toàn bộ bảng màu Warm Romantic, typography Playfair & Plus Jakarta Sans, khoảng cách spacing rhythmic và quy tắc chuyển cảnh motion.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '2.1 Design Tokens & Typography Scale',
          details: [
            'Bảng màu chủ đạo: Warm Rose (#F43F5E), Warm Off-White, Soft Slate & Twilight Dark.',
            'Font hiển thị: Playfair Display cho tiêu đề cảm xúc; Plus Jakarta Sans cho giao diện làm việc.',
            'Rhythmic Padding Math: Container padding luôn ≥ element gap.'
          ]
        },
        {
          heading: '2.2 Micro-interactions & Motion',
          details: [
            'Sử dụng Framer Motion với hiệu ứng Spring mượt mà cho modal và route transition.',
            'Phản hồi haptic và âm thanh thị giác khi tương tác tạo cảm giác chân thật như cầm giấy thiệp.'
          ]
        }
      ]
    },
    {
      id: 'vol_3',
      volumeNumber: 3,
      title: 'Core Architecture & Data Engine',
      subtitle: 'Kiến trúc phần mềm, mô hình dữ liệu Local-First & Storage',
      summary: 'Đặc tả chi tiết kiến trúc React + Vite + TypeScript, IndexedDB / Room Database local storage và cơ chế mã hóa AES-256.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '3.1 Kiến trúc Local-First & Memory Engine',
          details: [
            'Lưu trữ trực tiếp trên thiết bị (Offline-First) với độ trễ phản hồi < 10ms.',
            'Hệ thống quản lý State với React Context & Custom Hooks phân tách module sạch rành rọt.'
          ]
        },
        {
          heading: '3.2 Schema & Data Models',
          details: [
            'LoveNote Document Spec: Hỗ trợ Rich-text, Vector Graphics, Audio Memory và Time-capsule Metadata.'
          ]
        }
      ]
    },
    {
      id: 'vol_4',
      volumeNumber: 4,
      title: 'AI Platform & Co-pilot Specification',
      subtitle: 'Trợ lý trí tuệ nhân tạo Gemini 2.5/3.0 & Prompt Engineering',
      summary: 'Quy chuẩn tích hợp AI Co-pilot hỗ trợ sáng tác thơ, văn phong tình cảm, tự động tạo thiệp và phân tích dòng thời gian kỷ niệm.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '4.1 AI Engine Proxy',
          details: [
            'Gọi API Gemini thông qua Server Proxy để bảo mật tuyệt đối API Keys.',
            'Sử dụng Streaming Responses và fallback local khi mất kết nối mạng.'
          ]
        },
        {
          heading: '4.2 Prompt Engineering Guidelines',
          details: [
            'Cấu trúc Prompt tôn trọng cảm xúc người dùng, tránh ngôn từ sáo rỗng hoặc AI Slop.'
          ]
        }
      ]
    },
    {
      id: 'vol_5',
      volumeNumber: 5,
      title: 'Cloud & Infrastructure Sync',
      subtitle: 'Hạ tầng đám mây, mã hóa End-to-End & Đồng bộ hóa',
      summary: 'Quy chuẩn kiến trúc Cloud Sync mã hóa E2EE, sao lưu tự động và phục hồi sau sự cố (Disaster Recovery).',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '5.1 Zero-Knowledge Cloud Sync',
          details: [
            'Máy chủ Cloud chỉ đóng vai trò lưu trữ gói mã hóa, không thể đọc nội dung thư tình người dùng.'
          ]
        }
      ]
    },
    {
      id: 'vol_6',
      volumeNumber: 6,
      title: 'Developer & API Specification',
      subtitle: 'Open API, Plugin SDK & Hệ sinh thái Marketplace',
      summary: 'Đặc tả OpenAPI v3, Webhook Events, Sandbox Runner cách ly plugin và tài nguyên cho nhà phát triển.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '6.1 Plugin SDK Interface',
          details: [
            'Cung cấp API an toàn cho phép bên thứ ba tạo thêm Mẫu Thiệp, Hiệu ứng âm thanh và Widget kỷ niệm.'
          ]
        }
      ]
    },
    {
      id: 'vol_7',
      volumeNumber: 7,
      title: 'Testing & Quality Assurance',
      subtitle: 'Tiêu chuẩn kiểm thử, tự động hóa & tiêu chí Go/No-Go',
      summary: 'Khung kiểm thử Unit, Integration, E2E và tiêu chí phủ code (Code Coverage > 90%).',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '7.1 Matrix Kiểm thử Đa Nền tảng',
          details: [
            'Windows High-DPI, Android Tablet / Foldable và Chrome/Edge Web Browsers.'
          ]
        }
      ]
    },
    {
      id: 'vol_8',
      volumeNumber: 8,
      title: 'Operations & Release Management',
      subtitle: 'Sổ tay vận hành, giám sát Telemetry & Khung cập nhật',
      summary: 'Quy trìnhStaged Rollout, xử lý sự cố khẩn cấp và khung điều hành Product Council.',
      status: 'approved_canonical',
      lastUpdated: '2026-07-23',
      sections: [
        {
          heading: '8.1 Product Council (QPC) Model',
          details: [
            'Chuyển đổi từ Sprint định kỳ sang Đánh giá Quý (QPC) và Bản vá Hàng tháng (Monthly Patch).'
          ]
        }
      ]
    }
  ];

  private telemetryData: ProductTelemetryData[] = [
    { moduleName: 'Global Search', usagePercentage: 95, activeUsersCount: 14200, satisfactionScore: 4.9, trend: 'up', recommendation: 'Duy trì hiệu năng siêu tốc < 20ms.' },
    { moduleName: 'Studio Editor & Cards', usagePercentage: 92, activeUsersCount: 13800, satisfactionScore: 4.8, trend: 'up', recommendation: 'Bổ sung thêm bộ sticker vector tình yêu.' },
    { moduleName: 'AI Co-pilot Assistant', usagePercentage: 87, activeUsersCount: 13050, satisfactionScore: 4.7, trend: 'up', recommendation: 'Mở rộng ngữ cảnh gợi ý câu thơ lãng mạn.' },
    { moduleName: 'Memory Vault & Journal', usagePercentage: 80, activeUsersCount: 12000, satisfactionScore: 4.6, trend: 'stable', recommendation: 'Tăng cường tính năng khóa vân tay/PIN.' },
    { moduleName: 'Plugin Ecosystem', usagePercentage: 31, activeUsersCount: 4650, satisfactionScore: 4.2, trend: 'up', recommendation: 'Đơn giản hóa tài liệu SDK cho Devs.' },
    { moduleName: 'Interactive Timeline', usagePercentage: 12, activeUsersCount: 1800, satisfactionScore: 3.8, trend: 'down', recommendation: 'Cần đơn giản hóa giao diện dòng thời gian trong bản 1.1.' }
  ];

  public getMpsVolumes(): MpsVolume[] {
    return this.mpsVolumes;
  }

  public getTelemetryData(): ProductTelemetryData[] {
    return this.telemetryData;
  }
}

export const mpsService = new MpsService();
