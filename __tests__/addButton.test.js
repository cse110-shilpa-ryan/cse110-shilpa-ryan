// addButton.test.js


import { addButton } from '../assets/src/projects/projectCRUD/addButton.js';

describe('addButton', () => {
  let navButtonsContainer;

  beforeEach(() => {
    document.body.innerHTML = '<div class="nav-buttons"></div>';
    navButtonsContainer = document.getElementsByClassName('nav-buttons')[0];
  });

  test('should add a new button to the navigation bar', () => {
    addButton();
    const addedButton = navButtonsContainer.querySelector('#add-project-button');
    expect(addedButton).not.toBeNull();
    expect(addedButton.textContent).toBe('Add Project');
  });
});
