// --- Кнопки HTML-страницы ---

const addButton = document.getElementById("addButton");
const todoInput = document.getElementById("todoInput");

// --- Классы, задающие структуру и логику работы списка задач ---

class ToDo {

    constructor(description) {

        this.description = description; // Описание задачи

        this.completed = false; // По-умолчанию не выполнено

    }

    markComplete() {

        this.completed = true;

        console.log(`"${this.description}" marked as complete!`);

    }

// ! Добавить методы (редактирование задачи) позже.

}

class ToDoList {

    constructor() {

        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        // Получает список из localStorage, или создает пустой, если его нет

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
