function parseContextPayload(text: string) {
  const result = {
    preset: 'Letter',
    author: 'Nam',
    target: 'Linh',
    timeline: '',
    memory: '',
    targetText: ''
  };

  if (!text) return result;

  // Extract [Preset: ...]
  const presetMatch = text.match(/\[Preset:\s*([^\]]+)\]/);
  if (presetMatch) result.preset = presetMatch[1].trim();

  // Extract [Author & Target: ... -> ...]
  const authorMatch = text.match(/\[Author & Target:\s*([^-]+)\s*->\s*([^\]]+)\]/);
  if (authorMatch) {
    result.author = authorMatch[1].trim();
    result.target = authorMatch[2].trim();
  }

  // Extract [Timeline: ...]
  const timelineMatch = text.match(/\[Timeline:\s*([^\]]+)\]/);
  if (timelineMatch) result.timeline = timelineMatch[1].trim();

  // Extract [Active Memory: ...]
  const memoryMatch = text.match(/\[Active Memory:\s*([^\]]+)\]/);
  if (memoryMatch) result.memory = memoryMatch[1].trim();

  // Extract [Target Text: ...]
  const targetTextMatch = text.match(/\[Target Text:\s*([\s\S]+?)\]$/) || text.match(/\[Target Text:\s*([\s\S]+?)\]/);
  if (targetTextMatch) {
    result.targetText = targetTextMatch[1].trim();
  } else {
    // If no format matches, clean up any bracket metadata
    let cleaned = text.replace(/\[Preset:\s*[^\]]+\]/g, '')
                      .replace(/\[Author & Target:\s*[^\]]+\]/g, '')
                      .replace(/\[Timeline:\s*[^\]]+\]/g, '')
                      .replace(/\[Active Memory:\s*[^\]]+\]/g, '')
                      .trim();
    result.targetText = cleaned || text.trim();
  }

  return result;
}

export function simulateWriting(action: string, text: string, tone: string): string {
  if (!text) return "";

  const ctx = parseContextPayload(text);
  const toneDesc = {
    romantic: 'ngọt ngào và đầy lãng mạn',
    cute: 'đáng yêu, dễ thương',
    formal: 'trang trọng và chân thành',
    funny: 'vui tươi, hóm hỉnh',
    emotional: 'đong đầy cảm xúc chân thành'
  }[tone as keyof typeof toneDesc] || 'lãng mạn';

  const author = ctx.author || 'Anh';
  const target = ctx.target || 'Em';
  const targetText = ctx.targetText || '';
  
  // Clean up targetText if it has bracket patterns or prompt metadata
  let cleanTargetText = targetText;
  cleanTargetText = cleanTargetText
    .replace(/\[[^\]]+\]/g, '')
    .replace(/^[*\-\u2022]?\s*(Cảm xúc chủ đạo|Phong cách thể hiện|Độ dài mong muốn|Ngôn ngữ|Mẫu thiết kế|Đối tượng|Dịp đặc biệt|Action|Target Text|Input Context):.*$/gm, '')
    .replace(/^[*\-\u2022]?\s*Chi tiết bổ sung từ người dùng:\s*/gm, '')
    .replace(/Hãy sáng tạo\s*dành cho\s*vào dịp\s*\.?/gi, '')
    .replace(/\(\d+\s*từ\)/gi, '')
    .trim();

  // Let's generate a beautiful response depending on the action
  let content = "";
  
  switch (action) {
    case 'improve':
      content = `Gửi ${target} thương mến,\n\nNhững dòng chữ này được viết bằng cả tấm lòng ${toneDesc}. ${cleanTargetText || 'Mỗi khoảnh khắc được đồng hành bên nhau đều đem lại những kỷ niệm đẹp đẽ.'} Hành trình này sẽ luôn là câu chuyện ý nghĩa mà chúng ta cùng nhau viết nên. Từng kỷ niệm sẽ mãi được nâng niu và gìn giữ.\n\nTrân trọng gửi ${target}, từ ${author}.`;
      break;
    case 'rewrite':
      content = `Thương gửi ${target},\n\nViết lại những lời này để gửi gắm trọn vẹn sự ${toneDesc} từ sự chân thành. ${cleanTargetText || 'Cảm ơn bạn đã luôn hiện diện, mang đến sự ấm áp và niềm vui ngập tràn.'} Chúc cho tình cảm gắn kết của chúng ta luôn bền chặt và tràn đầy ý nghĩa.\n\nThương mến, ${author}.`;
      break;
    case 'shorten':
      content = `Thương gửi ${target},\n\n${cleanTargetText || 'Cảm ơn bạn đã luôn đồng hành bên cạnh.'} Mọi khoảnh khắc gắn bó đều là vô giá.\n\nTrân trọng, ${author}.`;
      break;
    case 'expand':
      content = `Gửi ${target} thương mến,\n\n${cleanTargetText || 'Mỗi ngày trôi qua khi có người bạn đồng hành đều ngập tràn sự ấm áp.'} Mong được cùng bạn đi qua những chặng đường phía trước, chia sẻ từng niềm vui và kỷ niệm đáng nhớ.\n\nTừ ${author} với tất cả sự ${toneDesc}.`;
      break;
    case 'grammar':
      content = `${cleanTargetText || 'Chúc mừng kỷ niệm ngày đặc biệt của chúng ta!'}\n\nChúc cho hành trình phía trước luôn đong đầy tiếng cười và hạnh phúc vẹn tròn.`;
      break;
    case 'translate':
      if (text.toLowerCase().includes('vietnamese')) {
        content = `To dear ${target},\n\nI write these words from the bottom of my heart, filled with ${tone}. ${cleanTargetText || 'Every moment shared together is a beautiful gift.'} May our bond grow stronger with each passing day.\n\nBest wishes, ${author}.`;
      } else {
        content = `Gửi ${target} thương mến,\n\nViết những dòng này từ sự chân thành, đong đầy ${toneDesc}. ${cleanTargetText || 'Mỗi khoảnh khắc bên bạn là một món quà tuyệt đẹp.'} Mong rằng sự gắn kết của chúng ta sẽ ngày càng bền chặt theo năm tháng.\n\nVới tất cả sự trân trọng, ${author}.`;
      }
      break;
    default:
      content = `${cleanTargetText || 'Chúc chúng ta luôn hạnh phúc bền lâu.'}`;
  }

  // If there's timeline or memory context, let's gracefully weave it in!
  if (ctx.timeline && !content.includes(ctx.timeline)) {
    if (ctx.timeline.toLowerCase().includes('date') || ctx.timeline.toLowerCase().includes('hẹn hò')) {
      content = content.replace('\n\n', `\n\nNhắc về kỷ niệm ngày đầu gặp gỡ tại ${ctx.timeline.split(' at ')[1] || 'quán cà phê ấm áp'}, lòng anh lại dâng trào những cảm xúc xao xuyến như thuở ban đầu.\n\n`);
    } else {
      content = content.replace('\n\n', `\n\nKỷ niệm "${ctx.timeline}" sẽ mãi là cột mốc đáng nhớ nhất trong câu chuyện của chúng mình.\n\n`);
    }
  }

  return content;
}
