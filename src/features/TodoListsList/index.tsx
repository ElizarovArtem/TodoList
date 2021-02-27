import {AsyncTaskActions} from "./tasks-reducer";
import {AsyncTodoListActions, slice} from "./todoList-reducer"
import {TodoListsList} from "./TodolistsList"

const todoListActions = {
    ...AsyncTodoListActions,
    ...slice.actions
}

export {
    AsyncTaskActions,
    todoListActions,
    TodoListsList
}