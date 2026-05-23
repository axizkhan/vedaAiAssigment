import sanitizeHtml from 'sanitize-html';

export const sanitizeTemplateData = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class']
    }
  });
};
