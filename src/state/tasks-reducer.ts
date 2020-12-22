import {v1} from "uuid";
import {
    AddTodolistActionType,
    changeTodoListTitleAC,
    RemoveTodolistActionType,
    SetTodoListsType
} from "./todoList-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI} from "../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "./store";

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
export type SetTasksACType = {
    type: "SET-TASKS"
    tasks: Array<TaskType>
    todoLIstId: string
}

let initialState: TasksStateType = {}

export type ActionType =
    | RemoveTaskType
    | ReturnType<typeof addTaskAC>
    | changeTaskStatusType
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType
    | SetTasksACType


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":{
            const stateCopy = {...state}
            stateCopy[action.todoLIstId] = action.tasks
            return stateCopy
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
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
                order: 0, priority: TaskPriorities.Middle, startDate: ""
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
            const stateCopy = {...state, [action.todolist.id]: []}
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
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
export const setTasksAC = (tasks: Array<TaskType>, todoLIstId: string): SetTasksACType => {
    return {type: "SET-TASKS", tasks, todoLIstId}
}



type SetTasksTCType = ThunkAction<void, RootStateType, {todoLIstId: string}, ActionType>
export const setTasksTC = (todoLIstId: string): SetTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.getTasks(todoLIstId)
            .then(res => {
                dispatch(setTasksAC(res.data.items, todoLIstId))
            })
    }
}

type AddTasksTCType = ThunkAction<void, RootStateType, {todoLIstId: string, title: string}, ActionType>
export const addTasksTC = (todoLIstId: string, title: string): AddTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.createTask(todoLIstId, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item.title, res.data.data.item.todoListId))
            })
    }
}

type DeleteTasksTCType = ThunkAction<void, RootStateType, {todoLIstId: string, taskId: string}, ActionType>
export const deleteTasksTC = (todoLIstId: string, taskId: string): DeleteTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.deleteTask(todoLIstId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, todoLIstId))
            })
    }
}

type UpdateTaskStatusTCType = ThunkAction<void, RootStateType, {todoLIstId: string, taskId: string, status: TaskStatuses}, ActionType>
export const updateTaskStatusTC = (todoLIstId: string, taskId: string, status: TaskStatuses): UpdateTaskStatusTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {

        const state = getState()
        const tasks = state.tasks
        const task = tasks[todoLIstId].find(tl => tl.id === taskId)

        if(task) {
            todoListsAPI.updateTask(todoLIstId, taskId, {
                title: task.title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: status
            })
                .then(res => {
                    dispatch(changeTaskStatusAC(taskId, status, todoLIstId))
                })
        }
    }
}

type UpdateTaskTitleTCType = ThunkAction<void, RootStateType, {todoLIstId: string, taskId: string, title:string}, ActionType>
export const updateTaskTitleTC = (todoLIstId: string, taskId: string, title:string): UpdateTaskTitleTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {

        const state = getState()
        const tasks = state.tasks
        const task = tasks[todoLIstId].find(tl => tl.id === taskId)

        if(task) {
            todoListsAPI.updateTask(todoLIstId, taskId, {
                title: title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status
            })
                .then(res => {
                    dispatch(changeTaskTitleAC(taskId, title, todoLIstId))
                })
        }
    }
}