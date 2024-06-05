/**
 * Adds a new button element to the navigation bar with the text "Add Project".
 * @function addButton
 */
export function addButton() {

    let navButtonsContainer = document.getElementsByClassName('nav-buttons')[0];
    if (navButtonsContainer) {
        // Create the new button element
        const addButton = document.createElement('div');

        addButton.classList.add('nav-button');
        addButton.id = 'add-project-button'; // A unique ID for the button
        addButton.textContent = 'Add Project';

        // Append the button to the navigation bar
        navButtonsContainer.prepend(addButton);
    } else {
        console.error('Could not find the navigation buttons container');
    }
}

