async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        const journalContainer = document.querySelector('.project-container');

        projects.forEach(project => {
            const projectColumn = document.createElement('div');
            projectColumn.className = 'project-column';

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const projectImage = document.createElement('div');
            projectImage.className = 'project-image';
            projectImage.style.backgroundImage = `url(${project.image})`;

            const projectDetails = document.createElement('div');
            projectDetails.className = 'project-details';

            const projectTitle = document.createElement('h3');
            projectTitle.textContent = project.title;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = project.description;

            const projectDelete = document.createElement('div');
            projectDelete.className = 'project-delete';
            projectDelete.innerHTML = '<i class="fa fa-trash"></i>';

            projectDelete.addEventListener('click', () => {
                projectColumn.remove();
                // UPDATE DATA SOURCE HERE
            });

            projectDetails.appendChild(projectTitle);
            projectDetails.appendChild(projectDescription);
            projectCard.appendChild(projectImage);
            projectCard.appendChild(projectDetails);
            projectCard.appendChild(projectDelete); 
            projectColumn.appendChild(projectCard);

            project.tasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.className = 'task-card';

                const taskName = document.createElement('p');
                taskName.textContent = task.task;

                const taskDue = document.createElement('p');
                taskDue.textContent = `Due: ${task.due}`;

                const taskDelete = document.createElement('div');
                taskDelete.className = 'task-delete';
                taskDelete.innerHTML = '<i class="fa fa-trash"></i>';

                taskDelete.addEventListener('click', () => {
                    taskCard.remove();
                    // UPDATE DATA SOURCE HERE
                });

                taskCard.appendChild(taskName);
                taskCard.appendChild(taskDue);
                taskCard.appendChild(taskDelete);
                projectColumn.appendChild(taskCard);
            });

            journalContainer.appendChild(projectColumn);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);
