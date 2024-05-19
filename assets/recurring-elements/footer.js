const footerHTML = `
<footer class="footer">
  <div class="footer-container">
    <p>11:eleven</p>
  </div>
</footer>
`;

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        console.error('Could not find insert-footer element');
    }
}

document.addEventListener('DOMContentLoaded', loadFooter);