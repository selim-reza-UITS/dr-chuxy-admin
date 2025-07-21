import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Custom renderer to set target and rel on links
const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

export function formatText(content) {
  marked.setOptions({
    renderer, // use custom renderer
    gfm: true,
    breaks: true,
    smartLists: true,
  });

  const rawHtml = marked(content);
  return DOMPurify.sanitize(rawHtml);
}
