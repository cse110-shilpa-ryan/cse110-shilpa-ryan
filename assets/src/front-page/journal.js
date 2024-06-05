
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

    /*function getJournalDays() {
        const journals = getJournalEntires();
        const today = new Date();
        const nextSevenDays = new Date();
        nextSevenDays.setDate(today.getDate() - 7);

        let week = new Array();
        for(let i = 0; i < 7; i++) {
            if ( 0 !== journals.filter(journal => {
                let journalDate = new Date(journal.id);
                return journalDate === nextSevenDays;
            }).length)
                week.push(true);
            else
                week.push(false);
        }
    }*/

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




