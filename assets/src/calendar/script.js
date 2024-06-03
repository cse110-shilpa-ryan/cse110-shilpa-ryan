document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const calendarElement = document.getElementById('calendar');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const taskModal = document.getElementById('task-modal');
    const closeButton = document.querySelector('.close-button');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task-button');
    const addTaskFormModal = document.getElementById('addTaskFormModal');
    const modalDate = document.getElementById('modal-date');
    const monthYearDropdown = document.getElementById('monthYearDropdown');
    const monthDropdown = document.getElementById('monthDropdown');
    const yearDropdown = document.getElementById('yearDropdown');

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

    // Add a task to the calendar
    addTaskFormModal.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = document.getElementById('taskTitleModal').value;
        const endDate = new Date(document.getElementById('endDateModal').value);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);

        const tasks = getTasks('tasks');
        tasks.push({
            id: Date.now(),  // Unique ID for each task
            title: taskTitle,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        saveTasks(tasks, 'tasks');

        renderCalendar(currentDate);  // Re-render calendar to include new tasks
        addTaskFormModal.reset();
        addTaskFormModal.style.display = 'none';
        showTasksForDay(selectedDay);
    });

    // Add a task to a specific day in the calendar
    function addTaskToCalendar(task, taskType, color) {
        const { title, startDate, endDate, due } = task;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayElements = calendarElement.getElementsByClassName('day');
        const dueDate = new Date(due);
        dueDate.setDate(dueDate.getDate() + 1);
        const dueStr = taskType == 'proj' ? "DUE: " : "";
        
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
    
    function intToRGB(i){
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
    
        return "#" + "00000".substring(0, 6 - c.length) + c;
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
            color = intToRGB(hashCode(projData.title));
            console.log(color)
            projData.tasks.forEach(task => {
                const dueDate = new Date(task.due)
                dueDate.setDate(dueDate.getDate() + 1);
                if (dueDate.getFullYear() == curDate.getFullYear() && dueDate.getMonth() == curDate.getMonth()) {
                    addTaskToCalendar(task, 'proj', color)
                }
            })
        });
    }

    // Display tasks for a specific day
    function showTasksForDay(day) {
        selectedDay = day;
        taskList.innerHTML = '';
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
    
                taskList.appendChild(taskItem);
            }
        });

        projTasksData.forEach(projData => {
            const projTitle = projData.title;
            projData.tasks.forEach(task => {
                const dueDate = new Date(task.due);
                dueDate.setDate(dueDate.getDate() + 1);
                
                if (dueDate.getDate() == curDate.getDate() && dueDate.getMonth() == curDate.getMonth() && dueDate.getFullYear() == curDate.getFullYear()) {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = `${task.title} (for ${projTitle})`;
        
                    taskList.appendChild(taskItem);
                }
            })
        });
    
        modalDate.textContent = new Date(year, month, day).toDateString();
        taskModal.style.display = 'block';
    }

    // Toggle visibility of the add task form modal
    addTaskButton.addEventListener('click', () => {
        addTaskFormModal.style.display = addTaskFormModal.style.display === 'none' ? 'block' : 'none';
    });

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
