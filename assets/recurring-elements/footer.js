function loadFooter() {
  const footerPlaceholder = document.getElementById('footer');
  const footerHTML = `
  <footer class="footer">
    <div class="footer-container">
      <p>11:eleven</p>
    </div>
  </footer> 
`;
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  } else {
    console.error('Could not find footer element');
  }
}

document.addEventListener('DOMContentLoaded', loadFooter);