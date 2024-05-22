// script.js
document.addEventListener('DOMContentLoaded', function() {
    const calendarElement = document.getElementById('calendar');
    const taskForm = document.getElementById('addTaskForm');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const taskModal = document.getElementById('task-modal');
    const closeButton = document.querySelector('.close-button');
    const taskList = document.getElementById('task-list');
    
    let currentDate = new Date();

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

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskTitle = document.getElementById('taskTitle').value;
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);

        const tasks = getTasks();
        tasks.push({
            id: Date.now(),  // Unique ID for each task
            title: taskTitle,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        saveTasks(tasks);

        renderCalendar(currentDate);  // Re-render calendar to include new tasks
        taskForm.reset();
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
        taskList.innerHTML = '';
        const tasks = getTasks();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
    
        tasks.forEach(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const taskStartDay = startDate.getDate();
            const taskEndDay = endDate.getDate();
    
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
    
        taskModal.style.display = 'block';
    }
    

    function deleteTask(taskId) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId); // Only delete the specified task
        saveTasks(tasks);
        renderCalendar(currentDate);
        taskModal.style.display = 'none';
    }

    closeButton.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });

    // Initial render
    renderCalendar(currentDate);
});
