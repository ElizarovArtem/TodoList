import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState: Array<TodoListDomainType> = []

export const setTodoListsTC = createAsyncThunk("todoList/setTodoLists", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.getTodoLists()
        thunkAPI.dispatch(setTodoListsAC({todoLists: res.data}))
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})
export const createTodoListsTC = createAsyncThunk("todoList/createTodoList", async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todoListsAPI.createTodoList(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(addTodoListAC({todolist: res.data.data.item}))
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})
export const deleteTodoListsTC = createAsyncThunk("todoList/deleteTodoList", async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setTodoListsEntityStatusAC({todolistID: todolistId, status: "loading"}))
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await todoListsAPI.deleteTodoList(todolistId)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(removeTodoListAC({todoListID: todolistId}))
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
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

const slice = createSlice({
    name: "todoList",
    initialState: initialState,
    reducers: {
        removeTodoListAC: (state, action: PayloadAction<{ todoListID: string }>) => {
            const index = state.findIndex(i => i.id === action.payload.todoListID)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodoListAC: (state, action: PayloadAction<{ todolist: TodoListType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodoListFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(i => i.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        setTodoListsAC: (state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
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
    }
})

export const todoListReducer = slice.reducer

export const {removeTodoListAC, addTodoListAC, changeTodoListFilterAC, setTodoListsAC, setTodoListsEntityStatusAC} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}