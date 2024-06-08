

function loadNavbar() {
    const navPlaceholder = document.getElementById('insert-nav');
    if (navPlaceholder) {
        const navHTML = `
        <nav>
            <div class="nav-container">
                <div class="nav-title">
                <a href="../front-page/index.html"><img src="../../images/icon.png" alt="home icon" class="home-icon"></a>
                </div>
                    <div class="nav-buttons">
                        <a href="../front-page/index.html" class="nav-button" id="home-nav">Home</a>
                        <a href="../calendar/index.html" class="nav-button" id="calendar-nav">Calendar</a>
                        <a href="../projects/index.html" class="nav-button" id="projects-nav">Projects</a>
                        <a href="../journal/index.html" class="nav-button" id="journal-nav">Journal</a>
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