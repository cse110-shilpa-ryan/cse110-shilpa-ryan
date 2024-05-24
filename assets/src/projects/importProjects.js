const LOCAL_STORAGE_KEY = 'projectsData';
let projects = [];

async function fetchProjects() {
    const response = await fetch('projects.json');
    const projects = await response.json();
    return projects;
}

function loadProjectsFromLocalStorage() {
    const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return projects ? JSON.parse(projects) : null;
}

function saveProjectsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

function createTaskCard(task, projectIndex, taskIndex = null) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    const taskName = document.createElement('input');
    taskName.type = 'text';
    taskName.value = task.task;
    taskName.addEventListener('change', () => {
        task.task = taskName.value;
        saveProjectsToLocalStorage();
    });

    const taskDue = document.createElement('input');
    taskDue.type = 'date';
    taskDue.value = task.due;
    taskDue.addEventListener('change', () => {
        task.due = taskDue.value;
        saveProjectsToLocalStorage();
    });

    const taskDelete = document.createElement('div');
    taskDelete.className = 'task-delete';
    taskDelete.innerHTML = '<i class="fa fa-trash"></i>';

    taskDelete.addEventListener('click', () => {
        if (taskIndex !== null) {
            projects[projectIndex].tasks.splice(taskIndex, 1);
        }
        taskCard.remove();
        saveProjectsToLocalStorage();
    });

    taskCard.appendChild(taskName);
    taskCard.appendChild(taskDue);
    taskCard.appendChild(taskDelete);
    return taskCard;
}

function createProjectCard(project, projectIndex) {
    const projectColumn = document.createElement('div');
    projectColumn.className = 'project-column';

    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    const projectImage = document.createElement('div');
    projectImage.className = 'project-image';
    projectImage.style.backgroundImage = `url(${project.image})`;

    const projectDetails = document.createElement('div');
    projectDetails.className = 'project-details';

    const projectTitle = document.createElement('input');
    projectTitle.type = 'text';
    projectTitle.value = project.title;
    projectTitle.addEventListener('change', () => {
        project.title = projectTitle.value;
        saveProjectsToLocalStorage();
    });

    const projectDescription = document.createElement('p');
    projectDescription.textContent = project.description;

    const projectDelete = document.createElement('div');
    projectDelete.className = 'project-delete';
    projectDelete.innerHTML = '<i class="fa fa-trash"></i>';

    projectDelete.addEventListener('click', () => {
        projects.splice(projectIndex, 1);
        projectColumn.remove();
        saveProjectsToLocalStorage();
    });

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', () => {
        const task = { task: 'New Task', due: '2024-12-31' };
        projects[projectIndex].tasks.push(task);
        const taskCard = createTaskCard(task, projectIndex, projects[projectIndex].tasks.length - 1);
        projectColumn.appendChild(taskCard);
        saveProjectsToLocalStorage();
    });

    projectDetails.appendChild(projectTitle);
    projectDetails.appendChild(projectDescription);
    projectCard.appendChild(projectImage);
    projectCard.appendChild(projectDetails);
    projectCard.appendChild(projectDelete);
    projectCard.appendChild(addTaskButton);
    projectColumn.appendChild(projectCard);

    project.tasks.forEach((task, taskIndex) => {
        const taskCard = createTaskCard(task, projectIndex, taskIndex);
        projectColumn.appendChild(taskCard);
    });

    return projectColumn;
}

function displayProjects() {
    const journalContainer = document.querySelector('.project-container');
    journalContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const projectColumn = createProjectCard(project, index);
        journalContainer.appendChild(projectColumn);
    });
}

async function loadProjects() {
    projects = loadProjectsFromLocalStorage();
    if (!projects) {
        projects = await fetchProjects();
        saveProjectsToLocalStorage();
    }
    displayProjects();
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    document.getElementById('add-project-button').addEventListener('click', () => {
        const project = {
            title: 'New Project',
            description: 'Description of new project',
            image: '../../images/default.png',
            tasks: []
        };
        projects.push(project);
        displayProjects();
        saveProjectsToLocalStorage();
    });
});
