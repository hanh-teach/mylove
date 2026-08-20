export class QualityEvaluator {
  /**
   * Đánh giá chất lượng của nội dung do AI tạo ra.
   * Chấm điểm tối thiểu thật dựa trên độ dài và nội dung.
   */
  public static evaluate(output: string): number {
    if (!output || output.trim().length === 0) return 0;
    
    // Logic chấm điểm tối thiểu thật
    let score = 0.5;
    const text = output.trim();
    
    // Thưởng cho độ dài hợp lý
    if (text.length > 50) score += 0.1;
    if (text.length > 200) score += 0.1;
    if (text.length > 500) score += 0.1;
    
    // Phạt nếu chứa placeholder còn sót lại
    const placeholders = ['[...]', '{...}', 'TEMPLATE', 'INSERT_HERE', 'NHẬP_TẠI_ĐÂY'];
    if (placeholders.some(p => text.includes(p))) {
      score -= 0.3;
    }
    
    // Đảm bảo score trong khoảng 0.1 - 0.95 (PLACEHOLDER: chưa dùng cho quyết định thật)
    return Math.max(0.1, Math.min(0.95, score));
  }
}
