import { projects } from '../importProjects.js';
import { saveProjectsToLocalStorage } from './rProject.js';
import { createEditModal } from './uProject.js';

/**
 * Creates a task card element.
 * @param {Object} task - The task object.
 * @param {number} projectIndex - The index of the project the task belongs to.
 * @param {number|null} [taskIndex=null] - The index of the task within the project, or null if not applicable.
 * @returns {HTMLElement} The task card element.
 */
export function createTaskCard(task, projectIndex, taskIndex = null) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    // Task name input field
    const taskName = document.createElement('input');
    taskName.type = 'text';
    taskName.id = 'task-name';
    taskName.value = task.title;
    taskName.addEventListener('change', () => {
        task.title = taskName.value;
        saveProjectsToLocalStorage();
    });

    // Task due date input field
    const taskDue = document.createElement('input');
    taskDue.type = 'date';
    taskDue.id = 'task-due';
    taskDue.value = task.due;
    taskDue.addEventListener('change', () => {
        task.due = taskDue.value;
        saveProjectsToLocalStorage();
    });

    // Task delete button
    const taskDelete = document.createElement('div');
    taskDelete.className = 'task-delete';
    taskDelete.id = 'task-delete';
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

/**
 * Creates a project card element.
 * @param {Object} project - The project object.
 * @param {number} projectIndex - The index of the project.
 * @returns {HTMLElement} The project card element.
 */
export function createProjectCard(project, projectIndex) {
    const projectColumn = document.createElement('div');
    projectColumn.className = 'project-column';

    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    // Project image
    const projectImage = document.createElement('div');
    projectImage.className = 'project-image';
    projectImage.id = 'image-input';
    projectImage.style.backgroundImage = `url(${project.image})`;

    const projectDetails = document.createElement('div');
    projectDetails.className = 'project-details';

    // Project title
    const projectTitle = document.createElement('input');
    projectTitle.type = 'text';
    projectTitle.value = project.title;
    projectTitle.disabled = true; // Disable editing directly

    // Project description
    const projectDescription = document.createElement('p');
    projectDescription.textContent = project.description;

    // Project delete button
    const projectDelete = document.createElement('div');
    projectDelete.className = 'project-delete';
    projectDelete.id = 'project-delete';
    projectDelete.innerHTML = '<i class="fa fa-trash"></i>';
    projectDelete.addEventListener('click', () => {
        projects.splice(projectIndex, 1);
        projectColumn.remove();
        saveProjectsToLocalStorage();
    });

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-container';

    // Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.id = 'edit-project-button';
    editButton.className = 'card-button';
    editButton.addEventListener('click', () => {
        createEditModal(project, projectIndex);
    });

    // Add task button
    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.id = 'add-task-button';
    addTaskButton.className = 'card-button';
    addTaskButton.addEventListener('click', () => {
        const today = new Date();
        const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Set to the next day using local time
        const nextDayFormatted = nextDay.toISOString().split('T')[0];
        const task = { title: 'New Task', due: nextDayFormatted };
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

    buttonRow.appendChild(addTaskButton);
    buttonRow.appendChild(editButton);
    projectCard.appendChild(buttonRow);

    projectColumn.appendChild(projectCard);

    project.tasks.forEach((task, taskIndex) => {
        const taskCard = createTaskCard(task, projectIndex, taskIndex);
        projectColumn.appendChild(taskCard);
    });

    return projectColumn;
}
