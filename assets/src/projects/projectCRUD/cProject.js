import { projects } from '../importProjects.js';
import { saveProjectsToLocalStorage } from './rProject.js';
import { createEditModal } from './uProject.js';


export function createTaskCard(task, projectIndex, taskIndex = null) {
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


export function createProjectCard(project, projectIndex) {
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

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-container';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'card-button';
    editButton.addEventListener('click', () => {
        createEditModal(project, projectIndex);
    });

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.className = 'card-button';
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
    projectCard.appendChild(projectDelete);

    buttonRow.appendChild(editButton);
    buttonRow.appendChild(addTaskButton);
    projectCard.appendChild(buttonRow);

    projectColumn.appendChild(projectCard);

    project.tasks.forEach((task, taskIndex) => {
        const taskCard = createTaskCard(task, projectIndex, taskIndex);
        projectColumn.appendChild(taskCard);
    });

    return projectColumn;
}