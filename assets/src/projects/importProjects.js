import { createEditModal } from './projectCRUD/uProject.js';
import { saveProjectsToLocalStorage, loadProjectsFromLocalStorage, displayProjects } from './projectCRUD/rProject.js';
import { addButton } from './projectCRUD/addButton.js';
export const LOCAL_STORAGE_KEY = 'projectsData';
export let projects = [];

/**
 * Fetches projects from a JSON file.
 * @returns {Promise<Array>} A promise that resolves to the projects array.
 */
async function fetchProjects() {
    const response = await fetch('projects.json');
    const projects = await response.json();
    return projects;
}

/**
 * Loads projects from local storage or fetches from JSON if not found.
 * Displays the projects in the project container.
 */
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
    addButton();

    setTimeout(500);

    document.getElementById('add-project-button').addEventListener('click', () => {
        createEditModal();
    });
});
