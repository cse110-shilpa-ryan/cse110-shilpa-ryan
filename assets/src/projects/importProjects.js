
import { createEditModal } from './projectCRUD/uProject.js';
import { saveProjectsToLocalStorage, loadProjectsFromLocalStorage, displayProjects } from './projectCRUD/rProject.js';

export const LOCAL_STORAGE_KEY = 'projectsData';
export let projects = [];

async function fetchProjects() {
    const response = await fetch('projects.json');
    const projects = await response.json();
    return projects;
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
        createEditModal();
    });
});
