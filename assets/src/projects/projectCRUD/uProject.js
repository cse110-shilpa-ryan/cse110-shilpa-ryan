import { projects } from '../importProjects.js';
import { saveProjectsToLocalStorage, displayProjects } from './rProject.js';

/**
 * Creates and displays an edit modal for a project.
 * @param {Object|null} [project=null] - The project to edit, or null to create a new project.
 * @param {number|null} [projectIndex=null] - The index of the project to edit, or null for a new project.
 */
export function createEditModal(project = null, projectIndex = null) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const projectTitle = document.createElement('input');
    projectTitle.type = 'text';
    projectTitle.id = 'project-title';
    projectTitle.placeholder = 'Project Title';
    projectTitle.maxLength = 20; // Set max length to 20 characters
    projectTitle.value = project ? project.title : '';

    const projectDescription = document.createElement('textarea');
    projectDescription.id = 'project-description';
    projectDescription.placeholder = 'Project Description';
    projectDescription.id = 'project-description';
    projectDescription.value = project ? project.description : '';

    const projectImage = document.createElement('input');
    projectImage.id = 'project-image';
    projectImage.type = 'file';
    projectImage.accept = 'image/*';
    projectImage.id = 'project-image';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const saveButton = document.createElement('button');
    saveButton.id = 'save-project-button';
    saveButton.className = 'save-project-button';
    saveButton.textContent = 'Save';
    saveButton.id = 'save-project-button';
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
    cancelButton.id = 'cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.id = 'cancel-project-button';
    cancelButton.addEventListener('click', () => {
        closeModal(modalOverlay);
    });

    modalContent.appendChild(projectTitle);
    modalContent.appendChild(projectDescription);
    modalContent.appendChild(projectImage);

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(buttonContainer);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    document.querySelector('.project-container').classList.add('blur-background');
}

/**
 * Saves the selected project image and updates the project object.
 * @param {HTMLInputElement} inputElement - The input element containing the image file.
 * @param {Object} project - The project object to update with the image data.
 * @returns {Promise<void>} A promise that resolves when the image is saved.
 */
export function saveProjectImage(inputElement, project) {
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

/**
 * Closes the modal dialog.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    document.body.removeChild(modal);
    document.querySelector('.project-container').classList.remove('blur-background');
}
