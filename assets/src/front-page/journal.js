document.addEventListener('DOMContentLoaded', function() {
    /**
    * Fetches entry content from localStorage.
    * @returns all journal entries in localStorage
    */
    function getJournalEntries() {
        return JSON.parse(localStorage.getItem('journalEntries')) || [];
    }

    /**
    * Filters journal entries by the most recent number of days
    * @param {*} journals - list of journal entries
    * @param {number} days - number of days to filter by
    * @returns journal entries created within the last number of days.
    */
    function getRecentJournals(journals, days) {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - (days - 1));

        return journals.filter(journal => {
            let journalDate = new Date(journal.id);
            return journalDate >= lastWeek;
        }).sort((a, b) => b.id - a.id);
    }

    /**
    * Get an array of days. The days include whether or not you journaled, as well as the day of the week.
    * @param {*} journals - list of journal entries
    * @param {number} days - number of days to return
    * @returns array of 2 element arrays. Format of each element is [hasJournaled, indexDayOfWeek]
    */
    function getJournalDays(journals, days) {
        const today = new Date();
        let lastWeek = new Date();
        lastWeek.setDate(today.getDate() - (days - 1));

        let week = new Array();
        for (let i = 0; i < days; i++) {
            if (0 !== journals.filter(journal => {
                let journalDate = new Date(journal.id);
                return (journalDate.getDate() === lastWeek.getDate()
                    && journalDate.getMonth() === lastWeek.getMonth()
                    && journalDate.getFullYear() === lastWeek.getFullYear());
            }).length)
                week.push([true, lastWeek.getDay()]);
            else
                week.push([false, lastWeek.getDay()]);

            lastWeek.setDate(lastWeek.getDate() + 1);
        }
        return week;
    }
    
    /**
     * Renders the progress bar and progress message to the journal container.
     * @param {*} journals - list of journal entries
     */
    function renderWeeklyBar(journals) {
        const weeklyProgress = getJournalDays(journals, 7);
        let progressBar = document.getElementById('progress-bar');
        let daysJournaled = 0;

        for(let i = 0; i < weeklyProgress.length; i++) {
            let dayBar = document.createElement('div');
            dayBar.id = 'daily-bar';
            if(weeklyProgress[i][0]) {
                dayBar.className = "present";
                daysJournaled ++;
            }
            else
                dayBar.className = "absent";
            dayBar.textContent = dayAbbreviation(weeklyProgress[i][1]);
            progressBar.appendChild(dayBar);
        }

        let statusMessage = document.querySelector("#weekly-progress p");
        statusMessage.innerHTML = progressMessage(daysJournaled, );
    }
    /**
     * Returns a one-two character abbreviation of the day of the week
     * @param {*} index - an index representation of day of the week, starting with 0 = Sunday
     */
    function dayAbbreviation(index) {
        switch (index) {
            case 0: return "Su";
            case 1: return "M";
            case 2: return "Tu";
            case 3: return "W";
            case 4: return "Th";
            case 5: return "F";
            case 6: return "Sa";
            default: return null;
        }
    }
    /**
     * Returns a message to encourage users to journal more frequently. 
     * @param {number} days - number of days journaled
     * @param {number} maxDays - maximum number of days 
     * @returns a message with positivity based on how many days you've journaled.
     */
    function progressMessage(days, maxDays) {
        if(days === 7)
            return `Awesome!<br>You've journaled ${days} of the last 7 days!`;
        else if(days >= 4)
            return `Good Job!<br>You've journaled ${days} of the last 7 days.`;
        return `Make sure to journal!<br>You've journaled ${days} of the last 7 days.`;

    } 

    // Render recent journals
    function renderRecentJournals(journals) {
        const upcomingTasks = getRecentJournals(journals, 7);
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
    let journals = getJournalEntries();
    renderWeeklyBar(journals);
    renderRecentJournals(journals);
});




