import {
    addTodoListAC,
    AddTodolistActionType,
    removeTodoListAC,
    RemoveTodolistActionType,
    setTodoListsAC,
    SetTodoListsType
} from "./todoList-reducer";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todoListsAPI,
    TodoListType,
    UpdateTaskModelType
} from "../../api/api-todolist";
import {ThunkAction} from "redux-thunk";
import {RootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState: TasksStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskID: string, todoListId: string }>) => {
            const index = state[action.payload.todoListId].findIndex(i => i.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todoListId].splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
        },
        updateTaskAC: (state, action: PayloadAction<{ taskID: string, model: UpdateDomainTaskModelType, todoListID: string }>) => {
            const index = state[action.payload.todoListID].findIndex(i => i.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todoListID][index] = {...state[action.payload.todoListID][index], ...action.payload.model}
            }
        },
        setTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskType>, todoLIstId: string }>) => {
            state[action.payload.todoLIstId] = action.payload.tasks.map((t) => ({...t, entityStatus: 'idle'}))
        },
        setTaskEntityStatusAC: (state, action: PayloadAction<{ taskId: string, status: RequestStatusType, todoLIstId: string }>) => {
            const index = state[action.payload.todoLIstId].findIndex(i => i.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todoLIstId][index].entityStatus = action.payload.status
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach((tl) => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.todoListID]
        })
    }
})

export const tasksReducer = slice.reducer

export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC, setTaskEntityStatusAC} = slice.actions
// thunks
type SetTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string }, ActionType>
export const setTasksTC = (todoLIstId: string): SetTasksTCType => {
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.getTasks(todoLIstId)
            .then(res => {
                dispatch(setTasksAC({tasks: res.data.items, todoLIstId: todoLIstId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
type AddTaskTCType = ThunkAction<void, RootStateType, { todoLIstId: string, title: string }, ActionType>
export const addTaskTC = (todoLIstId: string, title: string): AddTaskTCType => {
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.createTask(todoLIstId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC({task: res.data.data.item}))
                    dispatch(setAppStatusAC({status: "succeeded"}))
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
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setTaskEntityStatusAC({taskId, status: "loading", todoLIstId}))
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.deleteTask(todoLIstId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC({taskID: taskId, todoListId: todoLIstId}))
                    dispatch(setAppStatusAC({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                    dispatch(setTaskEntityStatusAC({taskId, status: "failed", todoLIstId}))
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
                dispatch(setTaskEntityStatusAC({taskId, status: "failed", todoLIstId}))
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
        return (dispatch: Dispatch, getState: () => RootStateType) => {

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
                dispatch(setTaskEntityStatusAC({taskId, status: "loading", todoLIstId}))
                dispatch(setAppStatusAC({status: "loading"}))
                todoListsAPI.updateTask(todoLIstId, taskId, apiModel)
                    .then(res => {
                        if (res.data.resultCode === 0) {
                            dispatch(updateTaskAC({taskID: taskId, model: domainModel, todoListID: todoLIstId}))
                            dispatch(setAppStatusAC({status: "succeeded"}))
                        } else {
                            handleServerAppError(res.data, dispatch)
                        }
                        dispatch(setTaskEntityStatusAC({taskId, status: "idle", todoLIstId}))
                    })
                    .catch(err => {
                        handleServerNetworkError(err, dispatch)
                        dispatch(setTaskEntityStatusAC({taskId, status: "failed", todoLIstId}))
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
    | ReturnType<typeof setTaskEntityStatusAC>

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}