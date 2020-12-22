import {v1} from "uuid";
import {todoListsAPI, TodoListType} from "../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "./store";

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST"
    id: string
}
export type AddTodolistActionType = {
    type: "ADD-TODOLIST"
    todolist: TodoListType
}
export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE"
    title: string
    id: string
}
export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER"
    filter: FilterValuesType
    id: string
}
export type SetTodoListsType = {
    type: "SET-TODOLISTS"
    todoLists: Array<TodoListType>
}

export const todoListID1 = v1();
export const todoListID2 = v1();

let initialState: Array<TodoListDomainType> = []

export type ActionType = ChangeTodolistFilterActionType |
    ChangeTodolistTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType
    | SetTodoListsType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

export const todoListReducer = (state: Array<TodoListDomainType> = initialState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            return action.todoLists.map(tl => {
                return {...tl, filter: "all"}
            })
        }
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{
                ...action.todolist,
                filter: "all"
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE': {
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.title = action.title
                return [...state]
            }
            return state
        }
        case 'CHANGE-TODOLIST-FILTER':
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.filter = action.filter
                return [...state]
            }
            return state
        default:
            return state
    }
}

export const removeTodoListAC = (todoListID: string): RemoveTodolistActionType => {
    return {type: "REMOVE-TODOLIST", id: todoListID}
}
export const addTodoListAC = (todolist: TodoListType): AddTodolistActionType => {
    return {type: "ADD-TODOLIST", todolist}
}
export const changeTodoListTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title}
}
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter}
}
export const setTodoListsAC = (todoLists: Array<TodoListType>): SetTodoListsType => {
    return {type: "SET-TODOLISTS", todoLists}
}


//thunks
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

