/** Used JavaScript code from warmup */
document.addEventListener('DOMContentLoaded', function () {
    fetch('src/tasks.json')
        .then(response => response.json())
        .then(tasks => {
            /**
             * Represents the list element with the id 'taskList'.
             * populates the task list with the tasks from the json file.
             * @type {HTMLElement}
             */
            const listElement = document.getElementById('taskList');
            listElement.innerHTML = tasks.map(task => {
                return `
                <div class="box ${task.priority} ${task.completed ? 'completed' : ''}" onclick="toggleSize(this)">
                    <li>
                        <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})">
                        <label for="task-${task.id}"><h2>${task.title}</h2></label>
                          <div class="task-info">
                            <h3>Task Priority: ${task.priority.toUpperCase()} | Deadline: ${task.due}</h3>
                            <p><b>Description:</b> ${task.description}</p>
                        </div>
                    </li>
                </div>`;
            }).join('');
        })
        .catch(error => console.error('Error loading the tasks:', error));
});

/**
 * Marks a task as complete, changes it color, and moves it to the bottom of page.
 * @param {*} taskId id number assigned to task via json file
 */
function toggleTaskCompletion(taskId) {
    const checkbox = document.getElementById(`task-${taskId}`);
    let listItem = checkbox.closest('.box');
    let list = listItem.parentElement;

    if (checkbox.checked) {
        listItem.classList.add('completed');
        list.appendChild(listItem);
    } else {
        listItem.classList.remove('completed');
        list.insertBefore(listItem, list.childNodes[taskId]);
    }
}

/**
 * Expands/collapses a task description upon click.
 * @param {*} box Box being expanded/collapsed
 */
function toggleSize(box) {
    box.classList.toggle('expanded');
}
