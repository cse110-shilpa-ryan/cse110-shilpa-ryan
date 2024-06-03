import { projects, LOCAL_STORAGE_KEY } from '../importProjects.js';
import { createProjectCard } from './cProject.js';

/**
 * Loads projects from local storage.
 * @returns {Array|null} The loaded projects array, or null if none are found.
 */
export function loadProjectsFromLocalStorage() {
    const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return projects ? JSON.parse(projects) : null;
}

/**
 * Saves the current projects to local storage.
 */
export function saveProjectsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Displays all projects in the project container.
 */
export function displayProjects() {
    const journalContainer = document.querySelector('.project-container');
    journalContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const projectColumn = createProjectCard(project, index);
        journalContainer.appendChild(projectColumn);
    });
}
