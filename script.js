document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDueDateInput = document.getElementById('taskDueDate');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

    // Function to save tasks to Local Storage
    const saveTasks = () => {
        localStorage.setItem('studyTasks', JSON.stringify(tasks));
    };

    // Function to render tasks
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear current list
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-id', index);
            if (task.completed) {
                listItem.classList.add('completed');
            }

            listItem.innerHTML = `
                <div class="task-details">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <span class="due-date">Due: ${task.dueDate || 'No date'}</span>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Unmark' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    };

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const dueDate = taskDueDateInput.value; // Format YYYY-MM-DD
        const description = taskDescriptionInput.value.trim();

        if (title) {
            const newTask = {
                title,
                dueDate,
                description,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            // Clear input fields
            taskTitleInput.value = '';
            taskDueDateInput.value = '';
            taskDescriptionInput.value = '';
        } else {
            alert('Task title cannot be empty!');
        }
    });

    // Handle Task Actions (Complete, Edit, Delete)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li');
        if (!listItem) return;

        const taskId = parseInt(listItem.getAttribute('data-id'));

        if (target.classList.contains('complete-btn')) {
            tasks[taskId].completed = !tasks[taskId].completed;
            saveTasks();
            renderTasks();
        } else if (target.classList.contains('edit-btn')) {
            // Simple edit functionality for now
            const newTitle = prompt('Edit Task Title:', tasks[taskId].title);
            const newDescription = prompt('Edit Task Description:', tasks[taskId].description);
            const newDueDate = prompt('Edit Due Date (YYYY-MM-DD):', tasks[taskId].dueDate);


            if (newTitle !== null && newTitle.trim() !== '') {
                tasks[taskId].title = newTitle.trim();
            }
            if (newDescription !== null) { // Allow empty description
                tasks[taskId].description = newDescription.trim();
            }
            if (newDueDate !== null) { // Allow empty due date
                 tasks[taskId].dueDate = newDueDate.trim();
            }
            saveTasks();
            renderTasks();
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(taskId, 1);
                saveTasks();
                renderTasks();
            }
        }
    });

    // Initial render when the page loads
    renderTasks();
});