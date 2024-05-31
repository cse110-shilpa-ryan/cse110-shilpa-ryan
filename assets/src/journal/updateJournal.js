function getEntries() {
    const entries = localStorage.getItem("journalEntries");
    return entries ? JSON.parse(entries) : [];
}

function saveEntries(entries) {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
}

function createEntry(title, content) {
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

function updateTitle(id, newTitle) {
    const entries = getEntries();
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        entry.title = newTitle;
        saveEntries(entries);
    }
}

function updateContent(id, newContent) {
    const entries = getEntries();
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        entry.content = newContent;
        saveEntries(entries);
    }
}

function deleteEntry(id) {
    const entries = getEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
        const [deletedEntry] = entries.splice(index, 1);
        saveEntries(entries);
        return deletedEntry;
    }
    return null;
}

function removeEntry(id) {
    deleteEntry(id);
    loadEntries();
}
                                                      
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
                <button class="delete" onclick="removeEntry(${entry.id})">Delete</button> <br><br>
            </div>
        `;
        let p = entryElement.querySelector('p.mb-1');
        p.addEventListener('click', () => {
            if(p.innerHTML === 'Enter your text here...'){
                p.innerHTML = '';
                p.style = 'color: black';
                console.log('clicked');
            }
        });
        journalList.prepend(entryElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let navLink = document.getElementById('journal-nav');
    navLink.classList.add('active');

    loadEntries();

    document.getElementById('addEntry').addEventListener('click', () => {
        const newEntry = createEntry('New Entry Title', 'Enter your text here...');
        loadEntries();
    });
});