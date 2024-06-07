import { jest } from '@jest/globals';
import { createEditModal, saveProjectImage, closeModal } from '../assets/src/projects/projectCRUD/uProject';
import { projects } from '../assets/src/projects/importProjects';
import { saveProjectsToLocalStorage, displayProjects } from '../assets/src/projects/projectCRUD/rProject';

jest.mock('../assets/src/projects/importProjects');
jest.mock('../assets/src/projects/projectCRUD/rProject');


describe('saveProjectImage', () => {
  test('should save the project image and update the project object', async () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    Object.defineProperty(inputElement, 'files', {
      value: [file],
    });
    const project = { image: '' };
    await saveProjectImage(inputElement, project);
    expect(project.image).toContain('data:image/png;base64');
  });

  test('should resolve if no file is selected', async () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    const project = { image: '' };
    await expect(saveProjectImage(inputElement, project)).resolves.toBeUndefined();
  });
});


