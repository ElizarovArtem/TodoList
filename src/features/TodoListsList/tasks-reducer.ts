import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodoListsType
} from "./todoList-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "../../app/store";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorType,
    setAppStatusAC,
    SetAppStatusType
} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


let initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todoLIstId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "REMOVE-TASK":
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)}
        case "ADD-TASK":
            return {
                ...state, [action.task.todoListId]: [{...action.task, entityStatus: 'idle'},
                    ...state[action.task.todoListId]]
            }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todoListID]: state[action.todoListID]
                    .map(t => t.id === action.taskID ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case "SET-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.todoLIstId]: state[action.todoLIstId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.status} : t)
            }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todoListID: string) => {
    return {type: "REMOVE-TASK", todoListID, taskID} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", task} as const
}
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todoListID: string) => {
    return {type: "UPDATE-TASK", todoListID, model, taskID} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todoLIstId: string) => {
    return {type: "SET-TASKS", tasks, todoLIstId} as const
}
export const setTaskEntityStatusAC = (taskId: string, status: RequestStatusType, todoLIstId: string) => {
    return {type: "SET-TASK-ENTITY-STATUS", taskId, status, todoLIstId} as const
}
// thunks
type SetTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string }, ActionType>
export const setTasksTC = (todoLIstId: string): SetTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.getTasks(todoLIstId)
            .then(res => {
                dispatch(setTasksAC(res.data.items, todoLIstId))
                dispatch(setAppStatusAC("succeeded"))
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
type AddTaskTCType = ThunkAction<void, RootStateType, { todoLIstId: string, title: string }, ActionType>
export const addTaskTC = (todoLIstId: string, title: string): AddTaskTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.createTask(todoLIstId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
type DeleteTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string, taskId: string }, ActionType>
export const deleteTasksTC = (todoLIstId: string, taskId: string): DeleteTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setTaskEntityStatusAC(taskId, "loading", todoLIstId))
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.deleteTask(todoLIstId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todoLIstId))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(setTaskEntityStatusAC(taskId, "failed", todoLIstId))
                }
            })
            .catch(err => {
            handleServerNetworkError(err, dispatch)
            dispatch(setTaskEntityStatusAC(taskId, "failed", todoLIstId))
        })
    }
}
type UpdateTaskTCType =
    ThunkAction<void,
        RootStateType,
        { todoLIstId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
        ActionType>
export const updateTaskTC =
    (todoLIstId: string, taskId: string, domainModel: UpdateDomainTaskModelType): UpdateTaskTCType => {
        return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
                getState: () => RootStateType) => {

            const state = getState()
            const task = state.tasks[todoLIstId].find(tl => tl.id === taskId)

            if (task) {
                const apiModel: UpdateTaskModelType = {
                    title: task.title,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                    status: task.status,
                    ...domainModel
                }
                dispatch(setTaskEntityStatusAC(taskId, "loading", todoLIstId))
                dispatch(setAppStatusAC("loading"))
                todoListsAPI.updateTask(todoLIstId, taskId, apiModel)
                    .then(res => {
                        if (res.data.resultCode === 0) {
                            dispatch(updateTaskAC(taskId, domainModel, todoLIstId))
                            dispatch(setAppStatusAC("succeeded"))
                        } else {
                            handleServerAppError(res.data, dispatch)
                        }
                        dispatch(setTaskEntityStatusAC(taskId, "idle", todoLIstId))
                    })
                    .catch(err => {
                        handleServerNetworkError(err, dispatch)
                        dispatch(setTaskEntityStatusAC(taskId, "failed", todoLIstId))
                    })
            }
        }
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type ActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType
    | ReturnType<typeof setTasksAC>
    | SetAppStatusType
    | SetAppErrorType
    | ReturnType<typeof setTaskEntityStatusAC>
export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}