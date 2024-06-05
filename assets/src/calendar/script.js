document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const calendarElement = document.getElementById('calendar');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const taskModal = document.getElementById('task-modal');
    const closeButton = document.querySelector('.close-button');
    const taskList = document.getElementById('task-list');
    const projectList = document.getElementById('mainTaskList');
    const addTaskButton = document.getElementById('add-task-button');
    const addTaskFormModal = document.getElementById('addTaskFormModal');
    const submitButton = addTaskFormModal.querySelector('button');
    const modalDate = document.getElementById('modal-date');
    const monthYearDropdown = document.getElementById('monthYearDropdown');
    const monthDropdown = document.getElementById('monthDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const taskTitleModal = document.getElementById('taskTitleModal');
    const endDateModal = document.getElementById('endDateModal');
    let editTaskId = null; // To keep track of the task being edited

    // Initialize current date and selected day
    let currentDate = new Date();
    let selectedDay = null;

    // Retrieve tasks from local storage
    function getTasks(taskType) {
        return JSON.parse(localStorage.getItem(taskType)) || [];
    }

    // Save tasks to local storage
    function saveTasks(tasks, taskType) {
        localStorage.setItem(taskType, JSON.stringify(tasks));
    }

    // Render the calendar for a given date
    function renderCalendar(date) {
        calendarElement.innerHTML = '';
        currentMonthYear.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Create blank days until the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.className = 'day';
            calendarElement.appendChild(blankDay);
        }

        // Create days of the month
        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            calendarElement.appendChild(dayElement);
            dayElement.addEventListener('click', () => showTasksForDay(day));
        }

        renderTasks();
    }

    // Change the month in the calendar
    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar(currentDate);
    }

    // Event listeners for previous and next month buttons
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Add or edit a task
    addTaskFormModal.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = taskTitleModal.value;
        const endDate = new Date(endDateModal.value);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);

        const tasks = getTasks('tasks');

        if (editTaskId !== null) {
            // Edit existing task
            const taskIndex = tasks.findIndex(task => task.id === editTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].title = taskTitle;
                tasks[taskIndex].startDate = startDate.toISOString();
                tasks[taskIndex].endDate = endDate.toISOString();
            }
        } else {
            // Add new task
            tasks.push({
                id: Date.now(),  // Unique ID for each task
                title: taskTitle,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
        }
        
        saveTasks(tasks, 'tasks');

        renderCalendar(currentDate);  // Re-render calendar to include new tasks
        addTaskFormModal.reset();
        addTaskFormModal.style.display = 'none';
        showTasksForDay(selectedDay);
        editTaskId = null; // Reset the edit task ID
    });

    // Add a task to a specific day in the calendar
    function addTaskToCalendar(task, taskType, color, projName="") {
        const { title, startDate, endDate, due } = task;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayElements = calendarElement.getElementsByClassName('day');
        const dueDate = new Date(due);
        dueDate.setDate(dueDate.getDate() + 1);
        const dueStr = taskType == 'proj' ? "DUE: " + projName + " - ": "";
        
        for (let i = 0; i < dayElements.length; i++) {
            const dayElement = dayElements[i];
            const dayNumber = parseInt(dayElement.querySelector('.day-number')?.textContent, 10);

            if (!dayNumber) continue;

            const dayDate = new Date(year, month, dayNumber);

            if ((taskType == 'tasks' && dayDate >= new Date(startDate) && dayDate <= new Date(endDate)) || (taskType == 'proj' && dueDate.getDate() == dayDate.getDate())) {
                const tasksForDay = dayElement.querySelectorAll('.task');

                if (tasksForDay.length <= 1) {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'task';
                    taskElement.textContent = dueStr + title;
                    taskElement.style.backgroundColor = color;
                    dayElement.appendChild(taskElement);
                }
                
                // Limit visible tasks and add a "more-tasks" indicator
                if (tasksForDay.length > 1) {
                    if (!dayElement.querySelector('.more-tasks')) {
                        const moreTasksElement = document.createElement('div');
                        moreTasksElement.className = 'task more-tasks';
                        moreTasksElement.textContent = 'More...';
                        dayElement.appendChild(moreTasksElement);
                    }
                }
            }
        }
    }

    function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return 100 * hash;
    } 
    
    function intToRGB(i) {
        let r = (i >> 16) & 0xFF;
        let g = (i >> 8) & 0xFF;
        let b = i & 0xFF;

        function offset(r, g, b) {
            function check(c) {
                return c < 80 ? c + Math.ceil((80-c)*(1.2)) : c > 200 ? c - Math.ceil((c-220)*(1.2)) : c ;
            }
            
            
            r = check(r);
            g = check(g);
            b = check(b);
            if (r>=g && r>=b) {
                r += 30
            } else if (g>=r && g>=b) {
                g += 30
            } else if (b>=g && b>=r) {
                b += 30
            }
            if (r<=g && r<=b) {
                r -= 30
            } else if (g<=r && g<=b) {
                g -= 30
            } else if (b<=g && b<=r) {
                b -= 30
            }
            
            return [r, g, b]
        }
        [r, g, b] = offset(r, g, b);
        return `rgb(${r}, ${g}, ${b})`;
    }

    
    

    // Render tasks for the current month
    function renderTasks() {
        const tasks = getTasks('tasks');
        const projTasksData = getTasks('projectsData');
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const curDate = new Date(year, month);

        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);

            const newStart = new Date(startDate.getFullYear(), startDate.getMonth());
            const newEnd = new Date(endDate.getFullYear(), endDate.getMonth());
            if (newStart <= curDate && newEnd >= curDate) {
                addTaskToCalendar(task, 'tasks', '#ffeb3b');
            }
        });

        projTasksData.forEach(projData => {
            const title = projData.title;
            color = intToRGB(hashCode(title));
            console.log(color, title)
            projData.tasks.forEach(task => {
                const dueDate = new Date(task.due)
                dueDate.setDate(dueDate.getDate() + 1);
                if (dueDate.getFullYear() == curDate.getFullYear() && dueDate.getMonth() == curDate.getMonth()) {
                    addTaskToCalendar(task, 'proj', color, title)
                }
            })
        });
    }

    // Display tasks for a specific day
    function showTasksForDay(day) {
        selectedDay = day;
        taskList.innerHTML = '';
        projectList.innerHTML = '';
        const tasks = getTasks('tasks');
        const projTasksData = getTasks('projectsData');
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const curDate = new Date(year, month, day);
    
        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
    
            if (startDate <= curDate && endDate >= curDate) {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.title} (from ${startDate.toDateString()} to ${endDate.toDateString()})`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-task';
                deleteButton.addEventListener('click', () => deleteTask(task.id));
                taskItem.appendChild(deleteButton);

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-task';
                editButton.addEventListener('click', () => editTask(task));
                taskItem.appendChild(editButton);
    
                taskList.appendChild(taskItem);
            }
        });

        projTasksData.forEach(projData => {
            // Create a new list element for the project
            const projectItem = document.createElement('li');
            let confirm = false;
            // Create a heading for the project
            const projectTitle = document.createElement('strong');
            projectTitle.textContent = projData.title;
            projectItem.appendChild(projectTitle);
            
            // Create a nested list for the tasks
            const subList = document.createElement('ul');
            
            // Iterate over tasks within the project
            projData.tasks.forEach(task => {
                const dueDate = new Date(task.due);
                dueDate.setDate(dueDate.getDate() + 1);
                
                // Check if the task is due today
                if (dueDate.getDate() == curDate.getDate() && dueDate.getMonth() == curDate.getMonth() && dueDate.getFullYear() == curDate.getFullYear()) {
                    confirm = true;
                    // Create a list item for each task
                    const taskItem = document.createElement('li');
                    taskItem.textContent = task.title;
                    
                    // Append the task item to the task list
                    subList.appendChild(taskItem);
                }
            });
            if (confirm) {
                // Append the task list to the project item
                projectItem.appendChild(subList);

                // Append the project item to the main task list container
                projectList.appendChild(projectItem);
            }
        });
        
    
        modalDate.textContent = new Date(year, month, day).toDateString();
        taskModal.style.display = 'block';
    }

    // Toggle visibility of the add task form modal
    addTaskButton.addEventListener('click', () => {
        addTaskFormModal.style.display = addTaskFormModal.style.display === 'none' ? 'block' : 'none';
        editTaskId = null; // Reset the edit task ID when opening the form for a new task
        submitButton.innerHTML = 'Add Task';
    });

    // Function to edit a task
    function editTask(task) {
        editTaskId = task.id;
        taskTitleModal.value = task.title;
        endDateModal.value = new Date(task.endDate).toISOString().substring(0, 10);
        submitButton.innerHTML = 'Save Edit';
        addTaskFormModal.style.display = 'block';
    }

    // Delete a task from the task list and calendar
    function deleteTask(taskId) {
        let tasks = getTasks('tasks');
        tasks = tasks.filter(task => task.id !== taskId); // Only delete the specified task
        saveTasks(tasks, 'tasks');
        renderCalendar(currentDate);
        showTasksForDay(selectedDay);
    }

    // Close the task modal
    closeButton.addEventListener('click', () => {
        taskModal.style.display = 'none';
        addTaskFormModal.style.display = 'none';
    });

    // Handle outside clicks to close the modals
    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
            addTaskFormModal.style.display = 'none';
        } else if (!monthYearDropdown.contains(event.target) && !currentMonthYear.contains(event.target)) {
            monthYearDropdown.style.display = 'none';
        }
    });

    // Populate the month and year dropdowns with options
    function populateDropdowns() {
        monthDropdown.innerHTML = '';
        yearDropdown.innerHTML = '';
        const months = Array.from({length: 12}, (v, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            if (index === currentDate.getMonth()) {
                option.selected = true;
            }
            monthDropdown.appendChild(option);
        });

        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear + 10; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentDate.getFullYear()) {
                option.selected = true;
            }
            yearDropdown.appendChild(option);
        }
    }

    // Show the month and year dropdowns when the current month/year is clicked
    currentMonthYear.addEventListener('click', () => {
        populateDropdowns();
        monthYearDropdown.style.display = 'block';
    });

    // Change the month based on dropdown selection
    monthDropdown.addEventListener('change', () => {
        currentDate.setMonth(monthDropdown.value);
        renderCalendar(currentDate);
        monthYearDropdown.style.display = 'none';
    });

    // Change the year based on dropdown selection
    yearDropdown.addEventListener('change', () => {
        currentDate.setFullYear(yearDropdown.value);
        renderCalendar(currentDate);
        monthYearDropdown.style.display = 'none';
    });

    // Initial render of the calendar
    renderCalendar(currentDate);
});
