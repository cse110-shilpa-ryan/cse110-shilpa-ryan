

function loadNavbar() {
    const navPlaceholder = document.getElementById('insert-nav');
    if (navPlaceholder) {
        const navHTML = `
        <nav>
            <div class="nav-container">
                <div class="nav-title">
                    <h2>Title</h2>
                </div>
                    <div class="nav-buttons">
                        <a href="../front-page/index.html" class="nav-button">Front Page</a>
                        <a href="../events-tasks/index.html" class="nav-button">Events & Tasks</a>
                        <a href="../journal/index.html" class="nav-button">Journal</a>
                </div>
            </div>
        </nav>
        `;
        navPlaceholder.innerHTML = navHTML;
    } else {
        console.error('Could not find insert-nav element');
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);