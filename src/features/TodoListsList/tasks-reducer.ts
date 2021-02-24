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
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState: TasksStateType = {}

export const setTasksTC = createAsyncThunk('tasks/setTasks', (todoLIstId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    return todoListsAPI.getTasks(todoLIstId)
        .then(res => {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {tasks: res.data.items, todoLIstId: todoLIstId}
        })
})
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', (params: { todoLIstId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(setTaskEntityStatusAC({taskId: params.taskId, status: "loading", todoLIstId: params.todoLIstId}))
    return todoListsAPI.deleteTask(params.todoLIstId, params.taskId)
        .then(res => {
            // if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                return {taskID: params.taskId, todoListId: params.todoLIstId}
            // } else {
            //     handleServerAppError(res.data, dispatch)
            //     dispatch(setTaskEntityStatusAC({taskId, status: "failed", todoLIstId}))
            // }
        })
})
export const addTaskTC = createAsyncThunk('tasks/addTask', (param: { todoLIstId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    return todoListsAPI.createTask(param.todoLIstId, param.title)
        .then(res => {
            //if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                return res.data.data.item
            // } else {
            //     handleServerAppError(res.data, thunkAPI.dispatch)
            // }
        })
})

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        updateTaskAC: (state, action: PayloadAction<{ taskID: string, model: UpdateDomainTaskModelType, todoListID: string }>) => {
            const index = state[action.payload.todoListID].findIndex(i => i.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todoListID][index] = {...state[action.payload.todoListID][index], ...action.payload.model}
            }
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
        builder.addCase(setTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoLIstId] = action.payload.tasks.map((t) => ({...t, entityStatus: 'idle'}))
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todoListId].findIndex(i => i.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todoListId].splice(index, 1)
            }
        })
    }
})

export const tasksReducer = slice.reducer

export const {updateTaskAC, setTaskEntityStatusAC} = slice.actions
// thunks

/*type AddTaskTCType = ThunkAction<void, RootStateType, { todoLIstId: string, title: string }, ActionType>
export const addTaskTC_ = (todoLIstId: string, title: string): AddTaskTCType => {
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
}*/
/*type DeleteTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string, taskId: string }, ActionType>
export const deleteTasksTC_ = (todoLIstId: string, taskId: string): DeleteTasksTCType => {
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
}*/
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
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType
    | ReturnType<typeof setTaskEntityStatusAC>

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}