import { jest } from '@jest/globals';
import { createTaskCard, createProjectCard } from '../assets/src/projects/projectCRUD/cProject';
import { projects } from '../assets/src/projects/importProjects';
import { saveProjectsToLocalStorage } from '../assets/src/projects/projectCRUD/rProject';
import { createEditModal } from '../assets/src/projects/projectCRUD/uProject';

jest.mock('../assets/src/projects/projectCRUD/rProject');
jest.mock('../assets/src/projects/importProjects');
jest.mock('../assets/src/projects/projectCRUD/uProject');

describe('createTaskCard', () => {
  let task, projectIndex, taskIndex, taskCard;

  beforeEach(() => {
    task = { title: 'Test Task', due: '2024-06-10' };
    projectIndex = 0;
    taskIndex = 0;
    taskCard = createTaskCard(task, projectIndex, taskIndex);
  });

  test('should create a task card with the correct elements', () => {
    expect(taskCard.className).toBe('task-card');
    expect(taskCard.querySelector('#task-name').value).toBe(task.title);
    expect(taskCard.querySelector('#task-due').value).toBe(task.due);
  });
});

describe('createProjectCard', () => {
  let project, projectIndex, projectColumn;

  beforeEach(() => {
    project = {
      title: 'Test Project',
      description: 'Project Description',
      image: 'test-image.png',
      tasks: [{ title: 'Task 1', due: '2024-06-10' }]
    };
    projectIndex = 0;
    projectColumn = createProjectCard(project, projectIndex);
  });

  test('should create a project card with the correct elements', () => {
    expect(projectColumn.querySelector('.project-card')).not.toBeNull();
    expect(projectColumn.querySelector('.project-image').style.backgroundImage).toBe('url(test-image.png)');
    expect(projectColumn.querySelector('.project-details input[type="text"]').value).toBe(project.title);
  });
});
