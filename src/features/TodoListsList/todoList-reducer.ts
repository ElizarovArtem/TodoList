import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "../../app/store";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorType,
    setAppStatusAC,
    SetAppStatusType
} from "../../app/appReducer";


let initialState: Array<TodoListDomainType> = []

export const todoListReducer = (state: Array<TodoListDomainType> = initialState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.todolistID ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

export const removeTodoListAC = (todoListID: string) => {
    return {type: "REMOVE-TODOLIST", id: todoListID} as const
}
export const addTodoListAC = (todolist: TodoListType) => {
    return {type: "ADD-TODOLIST", todolist} as const
}
export const changeTodoListTitleAC = (id: string, title: string) => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title} as const
}
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter} as const
}
export const setTodoListsAC = (todoLists: Array<TodoListType>) => {
    return {type: "SET-TODOLISTS", todoLists} as const
}
export const setTodoListsEntityStatusAC = (todolistID: string, status: RequestStatusType) => {
    return {type: "SET-TODOLIST-ENTITY-STATUS", status, todolistID} as const
}


// thunks

type SetTodoListsTCType = ThunkAction<void, RootStateType, unknown, ActionType>
export const setTodoListsTC = (): SetTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.getTodoLists()
            .then(res => {
                dispatch(setTodoListsAC(res.data))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

type CreateTodoListsTCType = ThunkAction<void, RootStateType, { title: string }, ActionType>
export const createTodoListsTC = (title: string): CreateTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.createTodoList(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodoListAC(res.data.data.item))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    dispatch(setAppErrorAC(res.data.messages.length ? res.data.messages[0] : "Some server error"))
                    dispatch(setAppStatusAC("failed"))
                }
            })
            .catch(err => {
                dispatch(setAppErrorAC("Some error, maybe it depends of network"))
                dispatch(setAppStatusAC("failed"))
            })
    }
}

type DeleteTodoListsTCType = ThunkAction<void, RootStateType, { todolistId: string }, ActionType>
export const deleteTodoListsTC = (todolistId: string): DeleteTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setTodoListsEntityStatusAC(todolistId, "loading"))
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.deleteTodoList(todolistId)
            .then(res => {
                dispatch(removeTodoListAC(todolistId))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}

type UpdateTodoListsTCType = ThunkAction<void, RootStateType, { todolistId: string, title: string }, ActionType>
export const updateTodoListsTC = (todolistId: string, title: string): UpdateTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        dispatch(setAppStatusAC("loading"))
        todoListsAPI.updateTodoList(todolistId, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todolistId, title))
                dispatch(setAppStatusAC("succeeded"))
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
    | SetAppStatusType
    | SetAppErrorType
    | SetTodoListEntityStatusType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}