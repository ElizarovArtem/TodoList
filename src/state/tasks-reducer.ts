import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todoList-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/api-todolist";

export type RemoveTaskType = {
    type: "REMOVE-TASK",
    todoListID: string
    taskID: string
}
export type changeTaskStatusType = {
    type: "CHANGE-TASK-STATUS",
    todoListID: string
    taskID: string
    status: TaskStatuses
}

let initialState: TasksStateType = {}

export type ActionType =
    | RemoveTaskType
    | ReturnType<typeof addTaskAC>
    | changeTaskStatusType
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

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
            const newTask: TaskType = {
                id: action.taskID, title: action.title, status: TaskStatuses.New,
                todoListId: action.todoListID, addedDate: "", deadline: "", description: "",
                order: 0,priority: TaskPriorities.Middle, startDate: ""
            }
            const tasks = stateCopy[action.todoListID]
            stateCopy[action.todoListID] = [newTask, ...tasks]
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListID]
            const newTasks = tasks.map(t => {
                if (t.id === action.taskID) {
                    return {...t, status: action.status}
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
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todoListID: string): changeTaskStatusType => {
    return {type: "CHANGE-TASK-STATUS", todoListID, status, taskID}
}
