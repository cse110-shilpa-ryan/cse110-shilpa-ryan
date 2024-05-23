
function editIFrame() {
    var frame = document.querySelector("iframe");
    header = frame.contentDocument.querySelector("header");
    header.remove();
    footer = frame.contentDocument.querySelector("footer");
    footer.remove();
}


document.addEventListener('DOMContentLoaded', editIFrame);