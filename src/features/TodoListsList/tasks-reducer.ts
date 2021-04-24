import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../api/api-todolist";
import {RequestStatusType} from "../Application/applicationReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppErrorSecond, handleServerNetworkErrorSecond} from "../../utils/error-utils";
import {AsyncTodoListActions} from "./todoList-reducer"
import {AsyncActionsRejectedValueType, RootStateType} from "../../utils/types";
import {appActions} from "../Application"

const {setAppStatusAC} = appActions;

let initialState: TasksStateType = {}

export const setTasksTC = createAsyncThunk<
    {tasks: Array<TaskType>, todoLIstId: string},
    string,
    AsyncActionsRejectedValueType
    >('tasks/setTasks', async (todoLIstId, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        let res = await todoListsAPI.getTasks(todoLIstId)
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks: res.data.items, todoLIstId: todoLIstId}
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const deleteTaskTC = createAsyncThunk<
    {taskID: string, todoListId: string}, { todoLIstId: string, taskId: string }, AsyncActionsRejectedValueType
    >('tasks/deleteTask', async (params: { todoLIstId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(setTaskEntityStatusAC({taskId: params.taskId, status: "loading", todoLIstId: params.todoLIstId}))
    try {
        let res = await todoListsAPI.deleteTask(params.todoLIstId, params.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {taskID: params.taskId, todoListId: params.todoLIstId}
        } else {
            thunkAPI.dispatch(setTaskEntityStatusAC({
                taskId: params.taskId,
                status: "failed",
                todoLIstId: params.todoLIstId
            }))
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        const task = thunkAPI.getState().tasks[params.todoLIstId].find(t => t.id === params.taskId)
        task && thunkAPI.dispatch(setTaskEntityStatusAC({
            taskId: task.id,
            status: "idle",
            todoLIstId: task.todoListId
        }))
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const addTaskTC = createAsyncThunk<
    TaskType,
    { todoLIstId: string, title: string },
    AsyncActionsRejectedValueType
    >('tasks/addTask', async (param: { todoLIstId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        let res = await todoListsAPI.createTask(param.todoLIstId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const updateTaskTC = createAsyncThunk<{ taskID: string, model: UpdateDomainTaskModelType, todoListID: string },
    { todoListId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
    { state: RootStateType}>('tasks/updateTask', async (param, thunkAPI) => {
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
            thunkAPI.dispatch(setTaskEntityStatusAC({
                taskId: param.taskId,
                status: "idle",
                todoLIstId: param.todoListId
            }))
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                return {taskID: param.taskId, model: param.domainModel, todoListID: param.todoListId}
            } else {
                return handleServerAppErrorSecond(res.data, thunkAPI)
            }
        } catch (err) {
            thunkAPI.dispatch(setTaskEntityStatusAC({
                taskId: param.taskId,
                status: "idle",
                todoLIstId: param.todoListId
            }))
            return handleServerNetworkErrorSecond(err, thunkAPI)
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
console.log('TASKSREDsadasdasd1')
export const slice = createSlice({
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