import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const contents = document.getElementById('text-content');
const parsedContent = document.getElementById('md-parser');

marked.use({
    breaks: true,
    gfm: true,
});

document.addEventListener('DOMContentLoaded', () => {
    const text = localStorage.getItem('content');
    if(text){
        parsedContent.innerHTML = marked.parse(text);
        contents.value = text;
    }
})

contents.addEventListener('input', () => {
    const text = contents.value.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,'');
    console.log(text);
    parsedContent.innerHTML = marked.parse(text);
    localStorage.setItem('content', text);
});