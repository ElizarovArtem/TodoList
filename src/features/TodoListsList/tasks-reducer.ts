import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../api/api-todolist";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {RootStateType} from "../../app/store";
import {AsyncTodoListActions} from "./todoList-reducer"

console.log('TASK-REDUCER')
let initialState: TasksStateType = {}

export const setTasksTC = createAsyncThunk('tasks/setTasks', async (todoLIstId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        let res = await todoListsAPI.getTasks(todoLIstId)
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks: res.data.items, todoLIstId: todoLIstId}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(err.message)
    }
})
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (params: { todoLIstId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(setTaskEntityStatusAC({taskId: params.taskId, status: "loading", todoLIstId: params.todoLIstId}))
    try {
        let res = await todoListsAPI.deleteTask(params.todoLIstId, params.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {taskID: params.taskId, todoListId: params.todoLIstId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setTaskEntityStatusAC({
                taskId: params.taskId,
                status: "failed",
                todoLIstId: params.todoLIstId
            }))
            return thunkAPI.rejectWithValue(res.data.messages[0])
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(err.message)
    }
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todoLIstId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        let res = await todoListsAPI.createTask(param.todoLIstId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(res.data.messages[0])
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(err.message)
    }
})
export const updateTaskTC = createAsyncThunk<{ taskID: string, model: UpdateDomainTaskModelType, todoListID: string },
    { todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
    { state: RootStateType }>('tasks/updateTask', async (param, thunkAPI) => {
    const state = thunkAPI.getState()

    const task = state.tasks[param.todoListId].find((tl) => tl.id === param.taskId)

    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            ...param.domainModel
        }
        thunkAPI.dispatch(setTaskEntityStatusAC({
            taskId: param.taskId,
            status: "loading",
            todoLIstId: param.todoListId
        }))
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))

        try {
            let res = await todoListsAPI.updateTask(param.todoListId, param.taskId, apiModel)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                thunkAPI.dispatch(setTaskEntityStatusAC({
                    taskId: param.taskId,
                    status: "idle",
                    todoLIstId: param.todoListId
                }))
                return {taskID: param.taskId, model: param.domainModel, todoListID: param.todoListId}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                thunkAPI.dispatch(setTaskEntityStatusAC({
                    taskId: param.taskId,
                    status: "idle",
                    todoLIstId: param.todoListId
                }))
                return thunkAPI.rejectWithValue(res.data.messages[0])
            }
        } catch (err) {
            handleServerNetworkError(err, thunkAPI.dispatch)
            thunkAPI.dispatch(setTaskEntityStatusAC({
                taskId: param.taskId,
                status: "idle",
                todoLIstId: param.todoListId
            }))
            return thunkAPI.rejectWithValue(err.message)
        }
    } else {
        return thunkAPI.rejectWithValue("rejected")
    }
})

export const AsyncTaskActions = {
    setTasksTC,
    deleteTaskTC,
    addTaskTC,
    updateTaskTC
}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        setTaskEntityStatusAC: (state, action: PayloadAction<{ taskId: string, status: RequestStatusType, todoLIstId: string }>) => {
            const index = state[action.payload.todoLIstId].findIndex(i => i.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todoLIstId][index].entityStatus = action.payload.status
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AsyncTodoListActions.setTodoListsTC.fulfilled, (state, action) => {
            action.payload.forEach((tl) => {
                state[tl.id] = []
            })
        })
        builder.addCase(AsyncTodoListActions.createTodoListsTC.fulfilled, (state, action) => {
            state[action.payload.id] = []
        })
        builder.addCase(AsyncTodoListActions.deleteTodoListsTC.fulfilled, (state, action) => {
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
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todoListID].findIndex(i => i.id === action.payload.taskID)
            if (index > -1) {
                state[action.payload.todoListID][index] = {...state[action.payload.todoListID][index], ...action.payload.model}
            }
        })
    }
})

export const tasksReducer = slice.reducer

export const {setTaskEntityStatusAC} = slice.actions

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}