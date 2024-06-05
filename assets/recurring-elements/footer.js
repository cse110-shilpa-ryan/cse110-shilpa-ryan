function loadFooter() {
  const footerPlaceholder = document.querySelector('footer');
  const footerHTML = `
    <div class="footer-container">
      <p>11:eleven</p>
    </div>
`;
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  } else {
    console.error('Could not find footer element');
  }
}

document.addEventListener('DOMContentLoaded', loadFooter);