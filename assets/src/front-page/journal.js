
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
        nextFiveDays.setDate(today.getDate() + 5);

        return journals.filter(task => {
            //const journalDate = Date.parse(journals.id);
            console.log(journals.id);
            return true;
            //return endDate >= today && endDate <= nextThreeDays;
        });
    }

    // Render upcoming tasks to the task container
    function renderUpcomingTasks() {
        const upcomingTasks = getRecentJournals();
        const taskContainer = document.getElementById('upcoming-tasks');
        taskContainer.innerHTML = '';

        if (upcomingTasks.length === 0) {
            taskContainer.innerHTML = '<li>No upcoming tasks</li>';
        } else {
            upcomingTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.title} (Due: ${new Date(task.endDate).toDateString()})`;
                taskContainer.appendChild(taskItem);
            });
        }
    }

    // Initial rendering of upcoming tasks
    renderUpcomingTasks();
});




