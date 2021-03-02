import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from "redux";
import {todoListReducer} from "../features/TodoListsList/todoList-reducer";
import {tasksReducer} from "../features/TodoListsList/tasks-reducer";
import thunkMiddleware from "redux-thunk"
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";
import {FieldsErrorsResponseType} from "../api/api-todolist";

const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootStateType = ReturnType<typeof store.getState>
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}

export type AsyncActionsRejectedValueType = {rejectValue: {errors: Array<string>, fields?: Array<FieldsErrorsResponseType>}}

// @ts-ignore
window.store = store