document.addEventListener('DOMContentLoaded', function() {
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

    let currentDate = new Date();
    let selectedDay = null;

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

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

        // Render tasks for the current month
        renderTasks();
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar(currentDate);
    }

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    addTaskFormModal.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = document.getElementById('taskTitleModal').value;
        const endDate = new Date(document.getElementById('endDateModal').value);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);

        const tasks = getTasks();
        tasks.push({
            id: Date.now(),  // Unique ID for each task
            title: taskTitle,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        saveTasks(tasks);

        renderCalendar(currentDate);  // Re-render calendar to include new tasks
        addTaskFormModal.reset();
        addTaskFormModal.style.display = 'none';
        showTasksForDay(selectedDay);
    });

    function addTaskToCalendar(task) {
        const { title, startDate, endDate } = task;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayElements = calendarElement.getElementsByClassName('day');

        for (let i = 0; i < dayElements.length; i++) {
            const dayElement = dayElements[i];
            const dayNumber = parseInt(dayElement.querySelector('.day-number')?.textContent, 10);

            if (!dayNumber) continue;

            const dayDate = new Date(year, month, dayNumber);
            if (dayDate >= new Date(startDate) && dayDate <= new Date(endDate)) {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.textContent = title;
                dayElement.appendChild(taskElement);

                // Limit visible tasks and add a "more-tasks" indicator
                const tasksForDay = dayElement.querySelectorAll('.task');
                if (tasksForDay.length > 2) {
                    for (let j = 2; j < tasksForDay.length; j++) {
                        tasksForDay[j].style.display = 'none';
                    }
                    if (!dayElement.querySelector('.more-tasks')) {
                        const moreTasksElement = document.createElement('div');
                        moreTasksElement.className = 'task more-tasks';
                        moreTasksElement.textContent = 'More...';
                        dayElement.appendChild(moreTasksElement);
                        moreTasksElement.addEventListener('click', (event) => {
                            event.stopPropagation();  // Prevent triggering the day click event
                            showTasksForDay(dayNumber);
                        });
                    }
                }
            }
        }
    }

    function renderTasks() {
        const tasks = getTasks();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);

            if (startDate.getFullYear() === year && startDate.getMonth() === month ||
                endDate.getFullYear() === year && endDate.getMonth() === month) {
                addTaskToCalendar(task);
            }
        });
    }

    function showTasksForDay(day) {
        selectedDay = day;
        taskList.innerHTML = '';
        const tasks = getTasks();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
    
        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
    
            if (startDate <= new Date(year, month, day) && endDate >= new Date(year, month, day)) {
                const taskItem = document.createElement('li');
                taskItem.textContent = `${task.title} (from ${startDate.toDateString()} to ${endDate.toDateString()})`;
                
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-task';
                deleteButton.addEventListener('click', () => deleteTask(task.id));
                taskItem.appendChild(deleteButton);
    
                taskList.appendChild(taskItem);
            }
        });
    
        modalDate.textContent = new Date(year, month, day).toDateString();
        taskModal.style.display = 'block';
    }

    addTaskButton.addEventListener('click', () => {
        addTaskFormModal.style.display = addTaskFormModal.style.display === 'none' ? 'block' : 'none';
    });

    function deleteTask(taskId) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId); // Only delete the specified task
        saveTasks(tasks);
        renderCalendar(currentDate);
        showTasksForDay(selectedDay);
    }

    closeButton.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        } else if (!monthYearDropdown.contains(event.target) && !currentMonthYear.contains(event.target)) {
            monthYearDropdown.style.display = 'none';
        }
    });

    // Month/Year Dropdown functionality
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

    currentMonthYear.addEventListener('click', () => {
        populateDropdowns();
        monthYearDropdown.style.display = 'block';
    });

    monthDropdown.addEventListener('change', () => {
        currentDate.setMonth(monthDropdown.value);
        renderCalendar(currentDate);
        monthYearDropdown.style.display = 'none';
    });

    yearDropdown.addEventListener('change', () => {
        currentDate.setFullYear(yearDropdown.value);
        renderCalendar(currentDate);
        monthYearDropdown.style.display = 'none';
    });

    // Initial render
    renderCalendar(currentDate);
});
