// --- Кнопки HTML-страницы ---

const addButton = document.getElementById("addButton");
const todoInput = document.getElementById("todoInput");

// --- Классы, задающие структуру и логику работы списка задач ---

class ToDo {

    constructor(description, completed = false) {

        this.description = description; // Описание задачи

        this.completed = completed; // Получает значение выполнено из localStorage, по-умолчанию не выполнено

    }

    // --- Переключение задачи выполнено/не выполнено ---

    markComplete() {

        if (!this.completed) {
            this.completed = true;
            console.log(`"${this.description}" marked as complete!`);
        } else {
            this.completed = false;
            console.log(`"${this.description}" marked as yet incomplete!`);
        }
    }

// ! Добавить методы (редактирование задачи) позже.

}

class ToDoList {

    constructor() {

        // Из localStorage получит простые объекты JSON задач, либо создаст пустой массив
        const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];

        // Преобразует простые объекты обратно в классы TоDо
        this.todos = storedTodos.map(todo => new ToDo(todo.description, todo.completed));

    }

    addTodo(description) {

        const newTodo = new ToDo(description); // Создает новый объект задачи

        this.todos.push(newTodo); // Добавляет в массив задач

        this.setTodosToLocalStorage(); // Записывает обновленный список задач в localStorage

        this.renderTodoList(); // Обновляет интерфейс задач

    }

    listTodos() {

        return this.todos; // Возвращает список задач (для дальнейшей обработки или отрисовки)

    }

    markTodoComplete(index) {

        if (index >= 0 && index < this.todos.length) { // Корявенько, подумать

            this.todos[index].markComplete();

            this.setTodosToLocalStorage(); // Записывает обновленный список задач в localStorage

            this.renderTodoList(); // Отрисовывает список после завершения задачи

        }

    }

    renderTodoList() {

        const todoListElement = document.getElementById('todoList');

        todoListElement.innerHTML = ''; // Очищает список задач перед отрисовкой

        this.todos.forEach((todo, index) => {

            const listItem = document.createElement('li');

            listItem.textContent = todo.description;

            if (todo.completed) {

                listItem.classList.add('completed'); // Добавляет CSS класс для стилей выполненной задачи

            }

            // --- Создает кнопку "Complete" для каждой задачи, отслеживает клик по ней ---

            const completeButton = document.createElement('button');

            completeButton.textContent = 'Complete';

            completeButton.onclick = () => this.markTodoComplete(index);

            listItem.appendChild(completeButton);

            todoListElement.appendChild(listItem);

        });

    }

    setTodosToLocalStorage() {

        localStorage.setItem('todos', JSON.stringify(this.todos));

    }

}

const myTodoList = new ToDoList(); // Создает изначальный список задач

// --- Отслеживание кликов по кнопке добавления новой задачи ---

addButton.addEventListener("click", () => {
    const todoText = todoInput.value.trim(); // Получаем текст описания новой задачи из окна ввода

    if (todoText) { // Сработает только если поле ввода не пустое

        myTodoList.addTodo(todoText); // Добавляет новую задачу

        todoInput.value = ""; // Очищает окно ввода
    }
});

myTodoList.renderTodoList(); // Отрисовывает список задач при первичной загрузки страницы
