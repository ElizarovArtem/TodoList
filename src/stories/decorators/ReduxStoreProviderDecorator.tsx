import {Provider} from "react-redux";
import React from "react";
import {HashRouter} from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import {todoListReducer} from "../../features/TodoListsList/todoList-reducer";
import {tasksReducer} from "../../features/TodoListsList/tasks-reducer";
import {applicationReducer} from "../../features/Application/applicationReducer";
import {authReducer} from "../../features/Login/authReducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../../api/api-todolist";
import thunkMiddleware from "redux-thunk";
import {RootStateType} from "../../utils/types";

const rootReducer = combineReducers({
    todoLists: todoListReducer,
    tasks: tasksReducer,
    app: applicationReducer,
    auth: authReducer
})

const initialGlobalState: RootStateType = {
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all", entityStatus: 'idle', addedDate: '', order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", entityStatus: 'loading', addedDate: '', order: 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            {id: v1(), title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}
        ]
    },
    app: {
        error: null,
        status: 'idle',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

const storybookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export const ReduxStoreProviderDecorator = (StoryFn: React.FC) => {
    return (
        <HashRouter>
            <Provider store={storybookStore}>
                <StoryFn/>
            </Provider>
        </HashRouter>
    )
}