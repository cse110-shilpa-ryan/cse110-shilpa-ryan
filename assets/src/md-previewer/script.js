import { marked } from './marked.esm.js';

const contents = document.getElementById('text-content');
const parsedContent = document.getElementById('md-parser');

/**
 * @param {boolean} breaks - Makes a newline everytime enter is pressed
 * @param {boolean} gfm - Mimics Github's markdown as close as possible
 */
marked.use({
    breaks: true,
    gfm: true,
});

// Loads text if it was saved in local storage
document.addEventListener('DOMContentLoaded', () => {
    const text = localStorage.getItem('content');
    if (text) {
        parsedContent.innerHTML = marked.parse(text);
        contents.value = text;
    }
    updateGutter();
})

/** Parses the text into HTML the regex is to remove
 * all occurences of characters that marked can't parse
 * such as zero width characters
*/
contents.addEventListener('input', () => {
    const text = contents.value.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '');
    parsedContent.innerHTML = marked.parse(text);
    localStorage.setItem('content', text);
});

// Dynamic Line Numbering
const input = document.querySelector('textarea');
const gutter = document.querySelector('.gutter');
let val = input.value;
let numOfLines = 1;

function updateGutter() {
	val = input.value;
	
	let lineBreaks = val.match(/\n/gi) || [];
	numOfLines = lineBreaks.length ? lineBreaks.length + 1 : 1;
	
	gutter.innerHTML = '';
	for(let i = 0; i < numOfLines; i++) {
		let div = document.createElement('div');
        div.classList.add('lineNum');
		div.innerHTML = i+1;
		gutter.appendChild(div);	
	}
}
// Event listener to update line number gutter
input.addEventListener('input', updateGutter);

// Event number to sync line number with textarea location
input.addEventListener('scroll', () => {
    const scrollPercent = input.scrollTop / (input.scrollHeight - input.clientHeight);
    const top = scrollPercent * (gutter.scrollHeight - gutter.clientHeight)
    gutter.scrollTo(0, top)
});