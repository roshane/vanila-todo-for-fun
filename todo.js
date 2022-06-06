const dateFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'long'
});

const cacheKey = 'TODO_ITEM_LIST';

let Todo = function (createdAt, description) {
    this.createdAt = createdAt;
    this.description = description;
};

let jsonToString = input => JSON.stringify(input);

let strToJson = input => JSON.parse(input);

let getAllFromCache = () => {
    const rawStr = localStorage.getItem(cacheKey);
    if (rawStr) {
        return strToJson(rawStr);
    }
    return [];
}

let putAllToCache = items => localStorage.setItem(cacheKey, jsonToString(items));

let renderTodoList = () => {
    const todoList = getAllFromCache();
    const ul = createUnorderedList(todoList);

    const todoListViewNode = document.getElementById('todoList');
    todoListViewNode.removeChild(todoListViewNode.lastChild);

    todoListViewNode.appendChild(ul);
}

let createUnorderedList = todoList => {
    let ul = document.createElement('ul');
    todoList.map(createListElement)
        .forEach(li => ul.appendChild(li));
    return ul;
}

let createListElement = todo => {
    let li = document.createElement('li');
    let text = document.createElement('span');
    text.innerText = todo.description;
    let separator = document.createElement('span');
    separator.innerText = ' - ';
    let date = document.createElement('span');
    date.innerHTML = dateFormat.format(parseZoneDateTime(todo.createdAt)) + '&nbsp;';

    let a = document.createElement('a');
    a.setAttribute('href', '#');
    a.setAttribute('data-id', todo.createdAt);
    a.addEventListener('click', e => handleDeleteTodoBtnClick(e));
    a.innerHTML = 'delete'

    li.appendChild(text);
    li.appendChild(separator);
    li.appendChild(date);
    li.appendChild(a);

    return li;
}

let parseZoneDateTime = millis => {
    if (millis) {
        const date = new Date();
        date.setTime(Number(millis));
        return date;
    }
}

let initialize = () => {
    let btnAddTodo = document.getElementById('btnAddTodo');
    btnAddTodo.addEventListener('click', ev => handleAddTodoBtnClick());
    setTimeout(renderTodoList, 0);
}


let handleAddTodoBtnClick = () => {
    let inputTodo = document.getElementById('todoInput');
    let description = inputTodo.value;
    if (description != null || description != '') {
        addTodoItem(new Todo(new Date().getTime(), description));
        setTimeout(renderTodoList, 0);
        setTimeout(() => inputTodo.value = '', 0);
    } else {
        console.error('todo item cannot be empty');
    }
}

let handleDeleteTodoBtnClick = e => {
    const dateId = e.target.getAttribute('data-id')
    console.info('deleting item', dateId);
    deleteTodoItem(dateId);
    setTimeout(renderTodoList, 0);
}

let deleteTodoItem = id => {
    const todoList = getAllFromCache();
    const modifiedTodoList = todoList.filter(i => Number(i.createdAt) != Number(id));
    putAllToCache(modifiedTodoList);
}

let addTodoItem = todo => {
    const todoList = getAllFromCache();
    todoList.push(todo);
    putAllToCache(todoList);
}
