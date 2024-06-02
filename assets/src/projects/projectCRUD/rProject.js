import { projects, LOCAL_STORAGE_KEY } from '../importProjects.js';
import { createProjectCard } from './cProject.js';


export function loadProjectsFromLocalStorage() {
    const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return projects ? JSON.parse(projects) : null;
}

export function saveProjectsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

export function displayProjects() {
    const journalContainer = document.querySelector('.project-container');
    journalContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const projectColumn = createProjectCard(project, index);
        journalContainer.appendChild(projectColumn);
    });
}