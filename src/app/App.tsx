import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodoListsList} from "../features/TodoListsList/TodolistsList";
import {useSelector} from "react-redux";
import {RootStateType} from "./store";
import {RequestStatusType} from "./appReducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";


const App = React.memo(() => {
    const status = useSelector<RootStateType, RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress color="secondary" style={{display: "absolute"}}/>}
            <Container fixed={true}>
                <TodoListsList />
            </Container>
            <ErrorSnackbar/>
        </div>
    );
})

export default App;


