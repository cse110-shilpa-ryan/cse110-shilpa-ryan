// script.js
document.addEventListener('DOMContentLoaded', function() {
    const calendarElement = document.getElementById('calendar');
    const taskForm = document.getElementById('addTaskForm');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
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
            title: taskTitle,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        saveTasks(tasks);

        addTaskToCalendar(taskTitle, startDate, endDate);
        taskForm.reset();
    });

    function addTaskToCalendar(title, startDate, endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayElements = calendarElement.getElementsByClassName('day');

        for (let i = 0; i < dayElements.length; i++) {
            const dayElement = dayElements[i];
            const dayNumber = parseInt(dayElement.querySelector('.day-number')?.textContent, 10);

            if (!dayNumber) continue;

            const dayDate = new Date(year, month, dayNumber);
            if (dayDate >= startDate && dayDate <= endDate) {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.textContent = title;
                dayElement.appendChild(taskElement);
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
                addTaskToCalendar(task.title, startDate, endDate);
            }
        });
    }

    // Initial render
    renderCalendar(currentDate);
});
