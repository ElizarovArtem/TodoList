import {combineReducers, createStore} from "redux";
import {todoListReducer} from "./todoList-reducer";
import {tasksReducer} from "./tasks-reducer";

const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer
})

export type RootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer)

// @ts-ignore
window.store = store