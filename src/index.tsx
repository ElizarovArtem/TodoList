import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {store} from "./app/store";
import {BrowserRouter} from "react-router-dom";

export const rerenderEntireThree = () => {
    ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
        , document.getElementById('root'));
}
rerenderEntireThree()


if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./app/App', () => {
        rerenderEntireThree()
    } )
}

// https://git.heroku.com/infinite-woodland-84760.git

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
