import { HeaderFooterData } from './render.types';

export const getHeaderTemplate = (data: HeaderFooterData): string => {
  return \`<div style="font-size:9px;width:100%;text-align:center;font-family:sans-serif;">\${data.title}</div>\`;
};

export const getFooterTemplate = (): string => {
  return \`<div style="font-size:9px;width:100%;text-align:right;padding-right:25mm;font-family:sans-serif;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>\`;
};
