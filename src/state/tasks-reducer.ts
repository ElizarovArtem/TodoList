import {FilterValuesType, TasksStateType, TaskType, TodoListType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, todoListID1, todoListID2} from "./todoList-reducer";

export type RemoveTaskType = {
    type: "REMOVE-TASK",
    todoListID: string
    taskID: string
}
export type changeTaskStatusType = {
    type: "CHANGE-TASK-STATUS",
    todoListID: string
    taskID: string
    isDone: boolean
}

let initialState: TasksStateType = {}

export type ActionType =
    | RemoveTaskType
    | ReturnType<typeof addTaskAC>
    | changeTaskStatusType
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state}
            const tasks = state[action.todoListID]
            const newTasks = tasks.filter(t => t.id !== action.taskID)
            stateCopy[action.todoListID] = newTasks
            return stateCopy
        }
        case "ADD-TASK": {
            const stateCopy = {...state}
            const newTask: TaskType = {id: action.taskID, title: action.title, isDone: false}
            const tasks = stateCopy[action.todoListID]
            stateCopy[action.todoListID] = [newTask, ...tasks]
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListID]
            const newTasks = tasks.map(t => {
                if (t.id === action.taskID) {
                    return {...t, isDone: action.isDone}
                }
                return t
            })
            stateCopy[action.todoListID] = newTasks
            return stateCopy
        }
        case "CHANGE-TASK-TITLE": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListID]
            const newTasks = tasks.map(t => {
                if (t.id === action.taskID) {
                    return {...t, title: action.title}
                }
                return t
            })
            stateCopy[action.todoListID] = newTasks
            return stateCopy
        }
        case "ADD-TODOLIST": {
            const stateCopy = {...state, [action.todoListID]: []}
            return stateCopy
        }
        case "REMOVE-TODOLIST":{
            const stateCopy = { ...state }
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todoListID: string): RemoveTaskType => {
    return {type: "REMOVE-TASK", todoListID, taskID}
}
export const addTaskAC = (title: string, todoListID: string) => {
    return {type: "ADD-TASK", todoListID, title, taskID: v1()} as const
}
export const changeTaskTitleAC = (taskID: string, title: string, todoListID: string) => {
    return {type: "CHANGE-TASK-TITLE", todoListID, title, taskID} as const
}
export const changeTaskStatusAC = (taskID: string, isDone: boolean, todoListID: string): changeTaskStatusType => {
    return {type: "CHANGE-TASK-STATUS", todoListID, isDone, taskID}
}
