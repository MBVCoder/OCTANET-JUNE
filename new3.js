document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const taskDateInput = document.getElementById('task-date');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    loadTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        if (taskText !== '') {
            addTask(taskText, taskDate);
            taskInput.value = '';
            taskDateInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            const taskDate = taskDateInput.value;
            if (taskText !== '') {
                addTask(taskText, taskDate);
                taskInput.value = '';
                taskDateInput.value = '';
            }
        }
    });

    clearAllBtn.addEventListener('click', () => {
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTasks(btn.getAttribute('data-filter'));
        });
    });

    function addTask(taskText, taskDate, completed = false) {
        const li = document.createElement('li');
        if (completed) {
            li.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.addEventListener('click', () => {
            taskSpan.parentElement.classList.toggle('completed');
            saveTasks();
        });

        const taskDateSpan = document.createElement('span');
        taskDateSpan.textContent = taskDate ? `Due: ${taskDate}` : '';
        taskDateSpan.classList.add('task-date');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit your task:', taskSpan.textContent);
            if (newTaskText !== null) {
                taskSpan.textContent = newTaskText;
                saveTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(taskSpan);
        li.appendChild(taskDateSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                date: li.querySelector('.task-date').textContent.replace('Due: ', ''),
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => addTask(task.text, task.date, task.completed));
        }
    }

    function filterTasks(filter) {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = '';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? '' : 'none';
                    break;
                case 'incomplete':
                    task.style.display = task.classList.contains('completed') ? 'none' : '';
                    break;
            }
        });
    }

    new Sortable(taskList, {
        animation: 150,
        onEnd: () => saveTasks(),
    });
});
