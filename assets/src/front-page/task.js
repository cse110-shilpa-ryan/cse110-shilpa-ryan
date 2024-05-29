
document.addEventListener('DOMContentLoaded', function() {
    // Helper function to get tasks from local storage
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Helper function to filter tasks due in the next 3 days
    function getUpcomingTasks() {
        const tasks = getTasks();
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);

        return tasks.filter(task => {
            const endDate = new Date(task.endDate);
            return endDate >= today && endDate <= nextThreeDays;
        });
    }

    // Render upcoming tasks to the task container
    function renderUpcomingTasks() {
        const upcomingTasks = getUpcomingTasks();
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




