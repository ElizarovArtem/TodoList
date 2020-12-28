import {todoListsAPI, TodoListType} from "../../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "../../app/store";


let initialState: Array<TodoListDomainType> = []

export const todoListReducer = (state: Array<TodoListDomainType> = initialState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todoLists.map(tl =>  ({...tl, filter: "all"}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{ ...action.todolist, filter: "all" }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
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


// thunks

type SetTodoListsTCType = ThunkAction<void, RootStateType, unknown, ActionType>
export const setTodoListsTC = (): SetTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.getTodoLists()
            .then(res => {
                dispatch(setTodoListsAC(res.data))
            })
    }
}

type CreateTodoListsTCType = ThunkAction<void, RootStateType, {title: string}, ActionType>
export const createTodoListsTC = (title: string): CreateTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.createTodoList(title)
            .then(res => {
                dispatch(addTodoListAC(res.data.data.item))
            })
    }
}

type DeleteTodoListsTCType = ThunkAction<void, RootStateType, {todolistId: string}, ActionType>
export const deleteTodoListsTC = (todolistId: string): DeleteTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.deleteTodoList(todolistId)
            .then(res => {
                dispatch(removeTodoListAC(todolistId))
            })
    }
}

type UpdateTodoListsTCType = ThunkAction<void, RootStateType, {todolistId: string, title: string}, ActionType>
export const updateTodoListsTC = (todolistId: string, title: string): UpdateTodoListsTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.updateTodoList(todolistId, title)
            .then(res => {
                dispatch(changeTodoListTitleAC(todolistId, title))
            })
    }
}

// types

export type RemoveTodolistActionType = ReturnType<typeof removeTodoListAC>
export type AddTodolistActionType = ReturnType<typeof addTodoListAC>
export type SetTodoListsType = ReturnType<typeof setTodoListsAC>

export type ActionType =
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}