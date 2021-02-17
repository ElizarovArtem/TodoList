import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {ThunkAction} from "redux-thunk";
import {RootStateType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


let initialState: Array<TodoListDomainType> = []

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
        changeTodoListTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(i => i.id === action.payload.id)
            if (index > -1) {
                state[index].title = action.payload.title
            }
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
    }
})

export const todoListReducer = slice.reducer

export const {removeTodoListAC, addTodoListAC, changeTodoListTitleAC, changeTodoListFilterAC, setTodoListsAC, setTodoListsEntityStatusAC} = slice.actions

// thunks

type SetTodoListsTCType = ThunkAction<void, RootStateType, unknown, ActionType>
export const setTodoListsTC = (): SetTodoListsTCType => {
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.getTodoLists()
            .then(res => {
                dispatch(setTodoListsAC({todoLists: res.data}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }
}

type CreateTodoListsTCType = ThunkAction<void, RootStateType, { title: string }, ActionType>
export const createTodoListsTC = (title: string): CreateTodoListsTCType => {
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.createTodoList(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodoListAC({todolist: res.data.data.item}))
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

type DeleteTodoListsTCType = ThunkAction<void, RootStateType, { todolistId: string }, ActionType>
export const deleteTodoListsTC = (todolistId: string): DeleteTodoListsTCType => {
    return (dispatch: Dispatch, getState: () => RootStateType) => {
        dispatch(setTodoListsEntityStatusAC({todolistID:todolistId, status: "loading"}))
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.deleteTodoList(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodoListAC({todoListID: todolistId}))
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

type UpdateTodoListsTCType = ThunkAction<void, RootStateType, { todolistId: string, title: string }, ActionType>
export const updateTodoListsTC = (todolistId: string, title: string): UpdateTodoListsTCType => {
    return (dispatch: Dispatch,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todoListsAPI.updateTodoList(todolistId, title)
            .then(res => {
                dispatch(changeTodoListTitleAC({id: todolistId, title: title} ))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
    }
}

// types

export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export type AddTodolistActionType = ReturnType<typeof addTodoListAC>
export type SetTodoListsType = ReturnType<typeof setTodoListsAC>
export type SetTodoListEntityStatusType = ReturnType<typeof setTodoListsEntityStatusAC>

export type ActionType =
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType
    | SetTodoListEntityStatusType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}