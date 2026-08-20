/**
 * Utility to clean AI generated content and remove prompt metadata, bracketed options,
 * bullet settings, and raw prompt instructions so only clean letter text is displayed.
 */
export function cleanAIGeneratedText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Strip bracketed metadata tags like [Bức thư & Bài viết tri ân], [Cho Bạn bè / Đồng nghiệp], [Kỷ niệm ngày đặc biệt], [Preset: ...], etc.
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');

  // 2. Strip bullet parameter lines (e.g., "- Cảm xúc chủ đạo: ...", "- Phong cách thể hiện: ...", "- Độ dài mong muốn: ...", "- Ngôn ngữ: ...")
  cleaned = cleaned.replace(/^[*\-\u2022]?\s*(Cảm xúc chủ đạo|Phong cách thể hiện|Độ dài mong muốn|Ngôn ngữ|Mẫu thiết kế|Đối tượng|Dịp đặc biệt|Action|Target Text|Input Context):.*$/gm, '');

  // 3. Strip standalone metadata lines without bullets
  cleaned = cleaned.replace(/^(Cảm xúc chủ đạo|Phong cách thể hiện|Độ dài mong muốn|Ngôn ngữ):.*$/gm, '');

  // 4. Clean user notes prefix if present (keep the actual content after the colon)
  cleaned = cleaned.replace(/^[*\-\u2022]?\s*Chi tiết bổ sung từ người dùng:\s*/gm, '');

  // 5. Remove prompt boilerplate phrases like "Hãy sáng tạo dành cho vào dịp." or "Hãy sáng tạo dành cho vào dịp"
  cleaned = cleaned.replace(/Hãy sáng tạo\s*dành cho\s*vào dịp\s*\.?/gi, '');

  // 6. Remove system prefixes like "Dưới đây là bài viết:", "Tác phẩm sáng tạo:", "Gợi ý từ AI Coach:"
  cleaned = cleaned.replace(/^(Dưới đây là|Tác phẩm sáng tạo|Kết quả AI|Gợi ý từ AI Coach|Đề xuất từ AI Coach):?\s*/gi, '');

  // 7. Strip word count specifications like "(250 từ)" or "(vừa phải)"
  cleaned = cleaned.replace(/\(\d+\s*từ\)/gi, '');

  // 8. Trim and normalize line breaks
  const lines = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter((line, index, arr) => {
      if (line === '') {
        // Keep single blank line between paragraphs, remove consecutive empty lines
        return index > 0 && arr[index - 1] !== '';
      }
      return true;
    });

  return lines.join('\n').trim();
}
