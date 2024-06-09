/**
 * Display the tasks that are due in the next 3 days
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Helper function to get tasks from local storage
     * @returns tasks
     */
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    /**
     * Helper function to filter tasks due in the next 3 days
     * @returns tasks due in the next 3 days
     */
    function getUpcomingTasks() {
        const tasks = getTasks();
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);
    
        // Normalize dates to local date strings without time component
        const todayISO = today.toISOString().split('T')[0];
        const nextThreeDaysISO = nextThreeDays.toISOString().split('T')[0];


        return tasks.filter(task => {
            const taskDueDate = new Date(task.endDate);
            const taskDueDateISO = taskDueDate.toISOString().split('T')[0];
            return taskDueDateISO >= todayISO && taskDueDateISO <= nextThreeDaysISO;
        });
    }

    function getProjectTasks() {
        const projects = JSON.parse(localStorage.getItem('projectsData')) || [];
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);
    
        // Normalize dates to local date strings without time component
        const todayISO = today.toISOString().split('T')[0];
        const nextThreeDaysISO = nextThreeDays.toISOString().split('T')[0];
    
        let tasks = [];
        for (let i = 0; i < projects.length; i++) {
            let projectTasks = projects[i]['tasks'];
            projectTasks.forEach(task => {
                tasks.push({
                    title: task.title,
                    due: task.due
                });
            });
        }
    
        return tasks.filter(task => {
            const taskDueDate = new Date(task.due);
            const taskDueDateISO = taskDueDate.toISOString().split('T')[0];
            return taskDueDateISO >= todayISO && taskDueDateISO <= nextThreeDaysISO;
        });
    }
    
    
    /**
     * Render upcoming tasks to the task container
     */

    function renderUpcomingTasks() {
        const upcomingTasks = getUpcomingTasks();
        const projectTasks = getProjectTasks();
        const taskContainer = document.getElementById('upcoming-tasks');
        taskContainer.innerHTML = '';

        const todayISO = new Date().toISOString().split('T')[0];

        let totalTasks = upcomingTasks.length + projectTasks.length;
        if (totalTasks === 0) {
            taskContainer.innerHTML = '<li>No upcoming tasks</li>';
        } else {
            upcomingTasks.forEach(task => {
                const taskItem = document.createElement('li');
                const taskDueDate = new Date(task.endDate).toISOString().split('T')[0];
                //taskItem.textContent = `${task.title} (Due: ${new Date(task.endDate).toDateString()})`;
                taskItem.textContent = `${task.title} (Due: ${taskDueDate})`;
                taskContainer.appendChild(taskItem);
            });

            projectTasks.forEach(task => {
                const taskItem = document.createElement('li');
                const taskDueDate = new Date(task.due).toISOString().split('T')[0];
                taskItem.textContent = `${task.title} (Due: ${taskDueDate})`;
                taskContainer.appendChild(taskItem);
            });
        }
    }

    // Initial rendering of upcoming tasks
    renderUpcomingTasks();
});




