import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState: Array<TodoListDomainType> = []

export const setTodoListsTC = createAsyncThunk("todoList/setTodoLists", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return res.data
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue("")
    }
})
export const createTodoListsTC = createAsyncThunk("todoList/createTodoList", async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.createTodoList(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue("")
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue("")
    }
})
export const deleteTodoListsTC = createAsyncThunk("todoList/deleteTodoList", async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setTodoListsEntityStatusAC({todolistID: todolistId, status: "loading"}))
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todoListsAPI.deleteTodoList(todolistId)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todoListID: todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue("")
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue("")
    }
})
export const updateTodoListsTC = createAsyncThunk("todoList/updateTodoList", async (param: {todolistId: string, title: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        try {
            await todoListsAPI.updateTodoList(param.todolistId, param.title)
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todoListId: param.todolistId, title: param.title}
        } catch (err) {
            handleServerNetworkError(err, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(err.message)
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