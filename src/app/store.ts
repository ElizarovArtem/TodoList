import {compose} from "redux";
import thunkMiddleware from "redux-thunk"
import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./rootReducer";
import {rerenderEntireThree} from "../index";

const composeEnhancers =
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
    devTools: composeEnhancers
})

// @ts-ignore
window.store = store

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        store.replaceReducer(rootReducer)
    } )
}
