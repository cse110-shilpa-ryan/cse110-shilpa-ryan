import { jest } from '@jest/globals';
import { loadProjectsFromLocalStorage, saveProjectsToLocalStorage, displayProjects } from '../assets/src/projects/projectCRUD/rProject';
import { projects, LOCAL_STORAGE_KEY } from '../assets/src/projects/importProjects';
import { createProjectCard } from '../assets/src/projects/projectCRUD/cProject';

jest.mock('../assets/src/projects/projectCRUD/cProject');
jest.mock('../assets/src/projects/importProjects');

describe('loadProjectsFromLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return null if no projects are in local storage', () => {
    const result = loadProjectsFromLocalStorage();
    expect(result).toBeNull();
  });

  test('should return projects if they are in local storage', () => {
    const storedProjects = [{ title: 'Stored Project' }];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedProjects));
    const result = loadProjectsFromLocalStorage();
    expect(result).toEqual(storedProjects);
  });
});

describe('saveProjectsToLocalStorage', () => {
  test('should save projects to local storage', () => {
    projects.push({ title: 'New Project' });
    saveProjectsToLocalStorage();
    const storedProjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    expect(storedProjects).toEqual(projects);
  });
});
