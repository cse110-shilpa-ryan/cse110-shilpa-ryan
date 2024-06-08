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

        return tasks.filter(task => {
            const endDate = new Date(task.endDate);
            return endDate >= today && endDate <= nextThreeDays;
        });
    }

    function getProjectTasks() {
        const projects = JSON.parse(localStorage.getItem('projectsData')) || [];
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);

        let tasks = new Array();
        for(let i = 0; i < projects.length; i++) {
            let pro = projects[i]['tasks'];
            pro.forEach(task => {
                tasks.push(task);
            });
        }

        return tasks.filter(task => {
            console.log("yaya");
            const endDate = new Date(Date.parse(task.due));
            return endDate >= today && endDate <= nextThreeDays;
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

        
        let totalTasks = upcomingTasks.length + projectTasks.length;
        if (totalTasks === 0) {
            taskContainer.innerHTML = '<li>No upcoming tasks</li>';
        } else {
            upcomingTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.title} (Due: ${new Date(task.endDate).toDateString()})`;
                taskContainer.appendChild(taskItem);
            });
            projectTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.task} (Due: ${new Date(task.due).toDateString()})`;
                taskContainer.appendChild(taskItem);
            });
        }
    }

    // Initial rendering of upcoming tasks
    renderUpcomingTasks();
});




