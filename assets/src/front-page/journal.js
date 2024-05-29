
document.addEventListener('DOMContentLoaded', function() {
    // Helper function to get tasks from local storage
    function getJournalEntries() {
        return JSON.parse(localStorage.getItem('journalEntries')) || [];
    }

    // Helper function to filter tasks due in the next 3 days
    function getRecentJournals() {
        const journals = getJournalEntries();
        const today = new Date();
        const nextFiveDays = new Date();
        nextFiveDays.setDate(today.getDate() - 5);

        return journals.filter(journal => {
            let journalDate = new Date(journal.id);
            return journalDate >= nextFiveDays;
            //return endDate >= today && endDate <= nextThreeDays;
        });
    }

    // Render upcoming tasks to the task container
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

    // Initial rendering of upcoming tasks
    renderRecentJournals();
});




