import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const content = document.getElementById('text-content');
const parsedContent = document.getElementById('md-parser');

content.addEventListener('input', () => {
    parsedContent.innerHTML = marked.parse(content.value);
});