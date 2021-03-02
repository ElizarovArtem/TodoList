import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {RequestStatusType} from "../Application/applicationReducer";
import {handleServerAppErrorSecond, handleServerNetworkErrorSecond} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AsyncActionsRejectedValueType} from "../../utils/types";
import {appActions} from "../Application"

const {setAppStatusAC} = appActions;

let initialState: Array<TodoListDomainType> = []

export const setTodoListsTC = createAsyncThunk<TodoListType[], void, AsyncActionsRejectedValueType>("todoList/setTodoLists", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return res.data
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const createTodoListsTC = createAsyncThunk<
    TodoListType, string, AsyncActionsRejectedValueType
    >("todoList/createTodoList", async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.createTodoList(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        // handleServerNetworkError(err, thunkAPI.dispatch)
        // return thunkAPI.rejectWithValue({errors: err.message, fields: undefined})
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const deleteTodoListsTC = createAsyncThunk<
    {todoListID: string}, string, AsyncActionsRejectedValueType
    >("todoList/deleteTodoList", async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(setTodoListsEntityStatusAC({todolistID: todolistId, status: "loading"}))
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todoListsAPI.deleteTodoList(todolistId)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todoListID: todolistId}
        } else {
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
    }
})
export const updateTodoListsTC = createAsyncThunk("todoList/updateTodoList", async (param: {todolistId: string, title: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await todoListsAPI.updateTodoList(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
                return {todoListId: param.todolistId, title: param.title}
            } else {
                return handleServerAppErrorSecond(res.data, thunkAPI)
            }
        } catch (err) {
            return handleServerNetworkErrorSecond(err, thunkAPI)
        }
})

export const AsyncTodoListActions = {
    setTodoListsTC,
    createTodoListsTC,
    deleteTodoListsTC,
    updateTodoListsTC
}

export const slice = createSlice({
    name: "todoList",
    initialState: initialState,
    reducers: {
        changeTodoListFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(i => i.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        setTodoListsEntityStatusAC: (state, action: PayloadAction<{ todolistID: string, status: RequestStatusType }>) => {
            const index = state.findIndex(i => i.id === action.payload.todolistID)
            if (index > -1) {
                state[index].entityStatus = action.payload.status
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(updateTodoListsTC.fulfilled, (state, action) => {
            const index = state.findIndex(i => i.id === action.payload.todoListId)
            if (index > -1) {
                state[index].title = action.payload.title
            }
        })
        builder.addCase(createTodoListsTC.fulfilled, (state, action) => {
            state.unshift({...action.payload, filter: "all", entityStatus: "idle"})
        })
        builder.addCase(setTodoListsTC.fulfilled, (state, action) => {
            return action.payload.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        })
        builder.addCase(deleteTodoListsTC.fulfilled, (state, action) => {
            const index = state.findIndex(i => i.id === action.payload.todoListID)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
    }
})

export const todoListReducer = slice.reducer

export const {changeTodoListFilterAC, setTodoListsEntityStatusAC} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}