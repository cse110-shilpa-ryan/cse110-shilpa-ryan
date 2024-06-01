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
    projectTitle.disabled = true; // Disable editing directly

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

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        createEditModal(project, projectIndex);
    });

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', () => {
        const today = new Date();
        const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Set to the next day using local time
        const nextDayFormatted = nextDay.toISOString().split('T')[0];
        const task = { task: 'New Task', due: nextDayFormatted };
        projects[projectIndex].tasks.push(task);
        const taskCard = createTaskCard(task, projectIndex, projects[projectIndex].tasks.length - 1);
        projectColumn.appendChild(taskCard);
        saveProjectsToLocalStorage();
    });
    
    

    projectDetails.appendChild(projectTitle);
    projectDetails.appendChild(projectDescription);
    projectCard.appendChild(projectImage);
    projectCard.appendChild(projectDetails);
    projectCard.appendChild(editButton);
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

function createEditModal(project = null, projectIndex = null) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const projectTitle = document.createElement('input');
    projectTitle.type = 'text';
    projectTitle.placeholder = 'Project Title';
    projectTitle.value = project ? project.title : '';

    const projectDescription = document.createElement('textarea');
    projectDescription.placeholder = 'Project Description';
    projectDescription.value = project ? project.description : '';

    const projectImage = document.createElement('input');
    projectImage.type = 'file';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        if (!project) {
            // Adding a new project
            project = {
                title: projectTitle.value,
                description: projectDescription.value,
                image: '',
                tasks: []
            };
            projects.push(project);
            saveProjectImage(projectImage, project).then(() => {
                saveProjectsToLocalStorage();
                displayProjects();
                closeModal(modalOverlay);
            });
        } else {
            // Editing an existing project
            project.title = projectTitle.value;
            project.description = projectDescription.value;
            if (projectImage.files[0]) {
                saveProjectImage(projectImage, project).then(() => {
                    saveProjectsToLocalStorage();
                    displayProjects();
                    closeModal(modalOverlay);
                });
            } else {
                saveProjectsToLocalStorage();
                displayProjects();
                closeModal(modalOverlay);
            }
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        closeModal(modalOverlay);
    });

    modalContent.appendChild(projectTitle);
    modalContent.appendChild(projectDescription);
    modalContent.appendChild(projectImage);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(cancelButton);
    modalOverlay.appendChild(modalContent);

    document.body.appendChild(modalOverlay);
    document.querySelector('.project-container').classList.add('blur-background');
}

function saveProjectImage(inputElement, project) {
    return new Promise((resolve) => {
        if (inputElement.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                project.image = reader.result;
                resolve();
            };
            reader.readAsDataURL(inputElement.files[0]);
        } else {
            resolve();
        }
    });
}

function closeModal(modal) {
    document.body.removeChild(modal);
    document.querySelector('.project-container').classList.remove('blur-background');
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    document.getElementById('add-project-button').addEventListener('click', () => {
        createEditModal();
    });
});
