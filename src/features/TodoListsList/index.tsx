import {AsyncTaskActions, slice as tasksSlice} from "./tasks-reducer";
import {AsyncTodoListActions, slice as todolistSlice} from "./todoList-reducer"
import {TodoListsList} from "./TodolistsList"
import {TodoList} from "./Todolist/TodoList";

const todoListActions = {
    ...AsyncTodoListActions,
    ...todolistSlice.actions
}
const tasksActions = {
    ...AsyncTaskActions,
    ...tasksSlice.actions
}

const todolistReducer = todolistSlice.reducer
const tasksReducer = tasksSlice.reducer

export {
    tasksActions,
    todoListActions,
    TodoListsList,
    tasksReducer,
    todolistReducer,
    TodoList
}