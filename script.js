// --- Элементы HTML-страницы ---

const addButton = document.getElementById("addButton");
const filterIncompleteButton = document.getElementById("filterIncompleteButton");
const filterCompletedButton = document.getElementById("filterCompletedButton");
const filterResetButton = document.getElementById("filterResetButton");
const todoInput = document.getElementById("todoInput");
let filter = 'all';

// --- Класс, задающий структуру задачи и логику работы с ней ---

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

    // --- Создание новой задачи ---

    addTodo(description) {

        const newTodo = new ToDo(description); // Создает новый объект задачи
        this.todos.push(newTodo); // Добавляет в массив задач
        this.setTodosToLocalStorage(); // Записывает обновленный список задач в localStorage
        this.whichRenderTodoList(); // Обновляет интерфейс задач

    }

    listTodos() {

        return [...this.todos]; // Возвращает копию списка задач в виде массива (для внешней обработки и отрисовки)

    }

    // --- Логика работы с полем "Выполнено" задачи ---

    markTodoComplete(todo) {

        const index = this.findTodoIndex(todo);

        if (index >= 0 && index < this.todos.length) {

            this.todos[index].markComplete();
            this.setTodosToLocalStorage(); // Записывает обновленный список задач в localStorage
            this.whichRenderTodoList(); // Отрисовывает список после завершения задачи

        } else {
            console.error(`Todo not found: ${todo.description}`);
        }

    }

    // --- Удаление задачи ---

    deleteTodo(todo) {

        const index = this.findTodoIndex(todo);

        if (index >= 0 && index < this.todos.length) {

            this.todos.splice(index, 1); // Удаляет элемент из массива по его индексу

            this.setTodosToLocalStorage(); // Записывает обновленный список задач в localStorage
            this.whichRenderTodoList(); // Отрисовывает список после удаления задачи

            console.log(`"${todo.description}" has been deleted!`);
        } else {
            console.error(`Todo not found: ${todo.description}`);
        }

    }

    findTodoIndex(todo) {

        return this.todos.findIndex(t => t === todo); // Находит и передает исходный индекс (для внешней обработки и отрисовки)

    }

    // --- Настройка отрисовки в зависимости от примененных фильтров

    whichRenderTodoList() {

        if (filter === 'all') { // Без фильтров

            myFilterToDoList.filterAll();

        } else if (filter === 'completed') { // Только выполненные

            myFilterToDoList.filterCompleted();

        } else if (filter === 'incomplete') { // Только невыполненные

            myFilterToDoList.filterIncomplete();

        }
    }

    // --- Скрипты отрисовки списка задач ---

    renderTodoList(filteredTodos = this.todos) {

        const todoListElement = document.getElementById('todoList');
        todoListElement.innerHTML = ''; // Очищает список задач перед отрисовкой

        filteredTodos.forEach((todo) => {

            const listItem = document.createElement('li');
            listItem.textContent = todo.description;

            // --- Создает див для кнопок, чтобы сгруппировать их вместе ---
            const buttonsDiv = document.createElement('div');
            listItem.appendChild(buttonsDiv);

            // --- Создает кнопку "Complete" для каждой задачи, отслеживает клик по ней ---
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.onclick = () => this.markTodoComplete(todo);
            buttonsDiv.appendChild(completeButton);

            // --- Создает кнопку "Delete" для каждой задачи, отслеживает клик по ней ---
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => this.deleteTodo(todo);
            buttonsDiv.appendChild(deleteButton);

            if (todo.completed) {
                listItem.classList.add('completed'); // Добавляет CSS класс для стилей выполненной задачи
                completeButton.textContent = 'Incomplete';
            }

            todoListElement.appendChild(listItem);
        });

    }

    setTodosToLocalStorage() {

        localStorage.setItem('todos', JSON.stringify(this.todos));

    }

}

// --- Фильтры ---

class FilterToDoList {

    constructor(myTodoList) {

        this.todoList = myTodoList;

    }

    filterAll() { // Без фильтров

        this.todoList.renderTodoList(); // Примет отрисовку по-умолчанию, то есть без фильров

    }

    filterIncomplete() { // Отфильтровывает по отметке Выполнено (остаются все невыполненные)

        this.todoList.renderTodoList(this.todoList.listTodos().filter(todo => !todo.completed));

    }

    filterCompleted() { // Отфильтровывает по отметке Выполнено (остаются все выполненные)

        this.todoList.renderTodoList(this.todoList.listTodos().filter(todo => todo.completed));

    }
}

// --- Создание изначальных объектов списка задач и фильтров ---

const myTodoList = new ToDoList();
const myFilterToDoList = new FilterToDoList(myTodoList);

// --- Отслеживание кликов по кнопке добавления новой задачи ---

addButton.addEventListener("click", () => {
    const todoText = todoInput.value.trim(); // Получаем текст описания новой задачи из окна ввода

    if (todoText) { // Сработает только если поле ввода не пустое
        myTodoList.addTodo(todoText); // Добавляет новую задачу
        todoInput.value = ""; // Очищает окно ввода
    }
});

filterIncompleteButton.addEventListener("click", () => {
    filter = 'incomplete';
    myFilterToDoList.filterIncomplete(); // Обновляет фильтрованный список задач
})

filterCompletedButton.addEventListener("click", () => {
    filter = 'completed';
    myFilterToDoList.filterCompleted();
})

filterResetButton.addEventListener("click", () => {
    filter = 'all';
    myFilterToDoList.filterAll();
})

// myTodoList.renderTodoList(); // Отрисовывает список задач при первичной загрузки страницы
myTodoList.whichRenderTodoList();
