
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
            //console.log(journalDate.toDateString());
            return journalDate >= nextFiveDays;
        }).sort((a,b) => b.id - a.id);
    }

    function getJournalDays() {
        const journals = getJournalEntries();
        const today = new Date();
        let nextSevenDays = new Date();
        nextSevenDays.setDate(today.getDate() - 7);

        let week = new Array();
        for(let i = 0; i < 7; i++) {
            if ( 0 !== journals.filter(journal => {
                let journalDate = new Date(journal.id);
                return (journalDate.getDate() === nextSevenDays.getDate()
                        && journalDate.getMonth() === nextSevenDays.getMonth()
                        && journalDate.getFullYear() === nextSevenDays.getFullYear());
            }).length)
                week.push([true, nextSevenDays.getDay()]);
            else
                week.push([false, nextSevenDays.getDay()]);
            nextSevenDays.setDate(nextSevenDays.getDate() + 1);
        }
        console.log(week);
        return(week);
    }

    function renderWeeklyBar() {
        const weeklyProgress = getJournalDays();
        let progressContainer = document.getElementById('weekly-progress');
        let progressBar = document.getElementById('progress-bar');

        for(let i = 0; i < weeklyProgress.length; i++) {
            let dayBar = document.createElement('div');
            dayBar.id = 'daily-bar';
            if(weeklyProgress[i][0])
                dayBar.className = "present";
            else
                dayBar.className = "absent";
            dayBar.textContent = dayAbbreviation(weeklyProgress[i][1]);
            progressBar.appendChild(dayBar);
        }

        let statusMessage = document.querySelector("#weekly-progress  h3");
        statusMessage.innerHTML = 'haha';
    }
    function dayAbbreviation(index) {
        switch(index) {
            case 0: return "S";
            case 1: return "M";
            case 2: return "Tu";
            case 3: return "W";
            case 4: return "Th";
            case 5: return "F";
            case 6: return "S";
        }
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
    renderWeeklyBar();
    getJournalDays();
    renderRecentJournals();
});




