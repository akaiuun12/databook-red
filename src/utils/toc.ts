export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const extractToc = (markdown: string): TocItem[] => {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];
  
  // Remove frontmatter if present
  let startIndex = 0;
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        startIndex = i + 1;
        break;
      }
    }
  }
  
  let inCodeBlock = false;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const trimmedLine = line.trim();
    
    // Check if we're entering or exiting a code block
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    // Skip lines inside code blocks
    if (inCodeBlock) {
      continue;
    }
    
    // Match headings: #, ##, ###, etc. (must have space after #)
    // Use trimmed line to handle indentation
    const h1Match = trimmedLine.match(/^#\s+(.+)$/);
    const h2Match = trimmedLine.match(/^##\s+(.+)$/);
    const h3Match = trimmedLine.match(/^###\s+(.+)$/);
    const h4Match = trimmedLine.match(/^####\s+(.+)$/);
    const h5Match = trimmedLine.match(/^#####\s+(.+)$/);
    const h6Match = trimmedLine.match(/^######\s+(.+)$/);
    
    if (h1Match) {
      const text = h1Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 1,
        });
      }
    } else if (h2Match) {
      const text = h2Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 2,
        });
      }
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 3,
        });
      }
    } else if (h4Match) {
      const text = h4Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 4,
        });
      }
    } else if (h5Match) {
      const text = h5Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 5,
        });
      }
    } else if (h6Match) {
      const text = h6Match[1].trim();
      const cleanText = text.replace(/[#*`]/g, '').trim();
      if (cleanText) {
        toc.push({
          id: slugify(cleanText),
          text: cleanText,
          level: 6,
        });
      }
    }
  }
  
  return toc;
};

