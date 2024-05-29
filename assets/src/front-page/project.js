
document.addEventListener('DOMContentLoaded', function() {
    // Helper function to get projects from local storage
    function getProjects() {
        return JSON.parse(localStorage.getItem('projectsData')) || [];
    }

    // Helper function to filter tasks due in the next week
    function getUpcomingProjects() {
        const projects = getProjects();
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return projects.filter(project => {
            return project.tasks.some(task => {
                const taskDueDate = new Date(task.due);
                return taskDueDate >= today && taskDueDate <= nextWeek;
            });
        });
    }

    // Render upcoming projects with tasks due in the next week
    function renderUpcomingProjects() {
        const upcomingProjects = getUpcomingProjects();
        const projectContainer = document.getElementById('recent-projects');
        projectContainer.innerHTML = '';

        if (upcomingProjects.length === 0) {
            projectContainer.innerHTML = '<li>No upcoming projects</li>';
        } else {
            upcomingProjects.forEach(project => {
                const projectItem = document.createElement('li');
                projectItem.innerHTML = `
                    <div class="project-card">
                        <div class="project-image" style="background-image: url(${project.image});"></div>
                        <div class="project-details">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <p><em>Tasks due soon:</em></p>
                            <ul>
                                ${project.tasks.filter(task => {
                                    const taskDueDate = new Date(task.due);
                                    return taskDueDate >= new Date() && taskDueDate <= nextWeek;
                                }).map(task => `<li>${task.task} - ${task.due}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                projectContainer.appendChild(projectItem);
            });
        }
    }

    // Initial rendering of upcoming projects
    renderUpcomingProjects();
});
