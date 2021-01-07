import {applyMiddleware, combineReducers, createStore} from "redux";
import {todoListReducer} from "../features/TodoListsList/todoList-reducer";
import {tasksReducer} from "../features/TodoListsList/tasks-reducer";
import thunkMiddleware from "redux-thunk"
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Login/authReducer";

const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export type RootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

// @ts-ignore
window.store = store