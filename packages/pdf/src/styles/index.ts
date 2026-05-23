import fs from 'fs';
import path from 'path';

// Helper to load and inject all modular CSS files into the Puppeteer renderer
export const loadPrintStyles = (): string => {
  const stylesDir = __dirname;
  
  // Basic aggregation for rendering (in production, you might pre-compile these or use a bundler)
  const files = [
    'variables.css',
    'layout.css',
    'typography.css',
    'page-breaks.css',
    'tables.css',
    'code-blocks.css',
    'utilities.css',
    'print.css'
  ];

  let aggregatedCss = '';
  
  for (const file of files) {
    try {
      const filePath = path.join(stylesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Remove @import statements from print.css to avoid double loading or network calls
      if (file === 'print.css') {
        aggregatedCss += content.replace(/@import url\(['"]?.*?['"]?\);/g, '');
      } else {
        aggregatedCss += content + '\n';
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(\`[PDF Styles] Failed to load \${file}: \${err}\`);
      }
    }
  }

  return aggregatedCss;
};
