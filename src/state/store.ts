import {applyMiddleware, combineReducers, createStore} from "redux";
import {todoListReducer} from "./todoList-reducer";
import {tasksReducer} from "./tasks-reducer";
import thunkMiddleware from "redux-thunk"

const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer
})

export type RootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

// @ts-ignore
window.store = store