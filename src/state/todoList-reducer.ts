import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST"
    id: string
}
export type AddTodolistActionType = {
    type: "ADD-TODOLIST"
    title: string
    todoListID :string
}
export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE"
    title: string
    id: string
}
export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER"
    filter: FilterValuesType
    id: string
}

export const todoListID1 = v1();
export const todoListID2 = v1();

let initialState: Array<TodoListType> = []

export type ActionType = ChangeTodolistFilterActionType |
    ChangeTodolistTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType

export const todoListReducer = (state: Array<TodoListType> = initialState, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{
                id:action.todoListID,
                title: action.title,
                filter: "all"
            }, ...state ]
        case 'CHANGE-TODOLIST-TITLE':{
            const todoList = state.find(tl => tl.id === action.id)
            if(todoList){
                todoList.title = action.title
                return [...state]
            }
            return state
        }
        case 'CHANGE-TODOLIST-FILTER':
            const todoList = state.find(tl => tl.id === action.id)
            if(todoList){
                todoList.filter = action.filter
                return [...state]
            }
            return state
        default:
            return state
    }
}

export const removeTodoListAC = (todoListID: string): RemoveTodolistActionType => {
    return {type: "REMOVE-TODOLIST", id: todoListID}
}
export const addTodoListAC = (newTodolistTitle: string): AddTodolistActionType => {
    return {type: "ADD-TODOLIST", title: newTodolistTitle, todoListID: v1()}
}
export const changeTodoListTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title}
}
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter}
}