import {combineReducers} from "redux";
import {todoListReducer} from "../features/TodoListsList/todoList-reducer";
import {tasksReducer} from "../features/TodoListsList/tasks-reducer";
import {applicationReducer} from "../features/Application/applicationReducer";
import {authReducer} from "../features/Login/authReducer";

export const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer,
    app: applicationReducer,
    auth: authReducer
})
