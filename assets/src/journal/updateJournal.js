/**
 * Fetches entry content from localStorage.
 * @returns all journal entries in localStorage
 */
function getEntries() {
    const entries = localStorage.getItem("journalEntries");
    return entries ? JSON.parse(entries) : [];
}

/**
 * Saves all journal entries to localStorage.
 * @param {*} entries - current journal entry content on page
 */
function saveEntries(entries) {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
}

/**
 * Creates a new journal entry on the page, and 
 * saves it to localStorage.
 * @param {*} content - intial text within entry
 * @returns newly created journal entry
 */
function createEntry(content) {
    const entries = getEntries();
    const currDate = new Date();
    const newEntry = {
        id: Date.now(),
        title: currDate.toLocaleString(),
        content: content
    };
    entries.push(newEntry);
    saveEntries(entries);
    return newEntry;
}

/**
 * Updates the title of an existing journal entry,
 * and saves it to localStorage.
 * @param {*} id - unique ID of entry
 * @param {*} newTitle - new title to overwrite existing
 */
function updateTitle(id, newTitle) {
    const entries = getEntries();
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        entry.title = newTitle;
        saveEntries(entries);
        loadEntries();
    }
}

/**
 * Updates text body of existing journal entry,
 * and saves it to localStorage.
 * @param {*} id - unique ID of entry
 * @param {*} newContent - new text to overwrite existing
 */
function updateContent(id, newContent) {
    const entries = getEntries();
    const entry = entries.find(entry => entry.id === id);
    console.log(entry);
    if (entry) {
        if (newContent == '') {
            newContent = 'Enter your text here...';
            document.getElementById(`# ${entry.id} p`)
        }
        entry.content = newContent;
        saveEntries(entries);
        loadEntries();
    }
}

/**
 * Deletes an existing journal entry from page and storage.
 * @param {*} id - unique ID of entry to delete
 * @returns deleted entry if successful; else, null
 */
function deleteEntry(id) {
    const entries = getEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
        const [deletedEntry] = entries.splice(index, 1);
        saveEntries(entries);
        loadEntries();
        return deletedEntry;
    }
    return null;
}

/**
 * Loads journal entries onto the page. No need to 
 * call getEntries() before this function, as it is called within.
 */
function loadEntries() {
    const entries = getEntries();
    const journalList = document.getElementById("journalEntries");
    journalList.innerHTML = "";
    entries.forEach(entry => {
        const entryElement = document.createElement("div");
        entryElement.classList.add("list-group-item");
        entryElement.innerHTML = `
            <div>
                <h3 class="mb-1" contenteditable="true" onblur="updateTitle(${entry.id}, this.textContent)">${entry.title}</h3>
                <p class="mb-1" contenteditable="true" onblur="updateContent(${entry.id}, this.textContent)">${entry.content}</p>
            </div>
            <div>
                <button class="delete" onclick="deleteEntry(${entry.id})">Delete</button> <br><br>
            </div>
        `;
        let p = entryElement.querySelector('p.mb-1');
        p.addEventListener('click', () => {
            if (p.innerHTML == 'Enter your text here...') {
                p.innerHTML = '';
            }
        });
        journalList.prepend(entryElement);
    });
}

/*
 * DOM event listener to handle "Add Entry" button interactions
 * and integrate nav bar.
 */
document.addEventListener('DOMContentLoaded', () => {
    let navLink = document.getElementById('journal-nav');
    navLink.classList.add('active');

    loadEntries();

    document.getElementById('addEntry').addEventListener('click', () => {
        const newEntry = createEntry('Enter your text here...');
        loadEntries();
    });
});