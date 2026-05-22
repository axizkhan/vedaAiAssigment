export const stripHtmlAndXml = (text: string): { sanitized: string; tagsRemoved: number } => {
  let tagsRemoved = 0;
  
  // Strip potentially malicious tags entirely with their content (e.g. <script>...</script>)
  const dangerousTags = /<(script|style|iframe|object|embed)[^>]*>[\\s\\S]*?<\\/\\1>/gi;
  let sanitized = text.replace(dangerousTags, () => {
    tagsRemoved++;
    return '';
  });

  // Strip all other HTML/XML tags
  const allTags = /<[^>]+>/g;
  sanitized = sanitized.replace(allTags, () => {
    tagsRemoved++;
    return ' ';
  });

  return { sanitized, tagsRemoved };
};
