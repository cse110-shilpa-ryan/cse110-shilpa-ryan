
document.addEventListener('DOMContentLoaded', function() {
    // Helper function to get journals from local storage
    function getJournalEntries() {
        return JSON.parse(localStorage.getItem('journalEntries')) || [];
    }

    // Helper function to filter journals within the last 5 days
    function getRecentJournals() {
        const journals = getJournalEntries();
        const today = new Date();
        const nextFiveDays = new Date();
        nextFiveDays.setDate(today.getDate() - 5);

        return journals.filter(journal => {
            let journalDate = new Date(journal.id);
            console.log(journalDate.toDateString());
            return journalDate >= nextFiveDays;
        }).sort((a,b) => b.id - a.id);
    }

    // Render recent journals
    function renderRecentJournals() {
        const upcomingTasks = getRecentJournals();
        const journalContainer = document.getElementById('home-journals');
        journalContainer.innerHTML = '';

        if (upcomingTasks.length === 0) {
            journalContainer.innerHTML = '<li>No recent journals</li>';
        } else {
            upcomingTasks.forEach(journal => {
                let journalItem = document.createElement('li');
                let journalDate = new Date(journal.id);
                journalItem.textContent = `${journal.title} (${journalDate.toDateString()})`;
                journalContainer.appendChild(journalItem);
            });
        }
    }

    renderRecentJournals();
});




