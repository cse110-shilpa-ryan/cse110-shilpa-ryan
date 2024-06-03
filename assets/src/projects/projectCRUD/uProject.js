import { projects } from '../importProjects.js';
import { saveProjectsToLocalStorage, displayProjects } from './rProject.js';


export function createEditModal(project = null, projectIndex = null) {
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

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

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

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(buttonContainer);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    document.querySelector('.project-container').classList.add('blur-background');
}

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

export function closeModal(modal) {
    document.body.removeChild(modal);
    document.querySelector('.project-container').classList.remove('blur-background');
}