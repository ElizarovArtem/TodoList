import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodoListsList} from "../features/TodoListsList/TodolistsList";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./store";
import {initializedTC, RequestStatusType} from "./appReducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Route, Redirect, Switch} from 'react-router-dom';
import {Login} from "../features/Login/Login";
import {logoutTC} from "../features/Login/authReducer";


const App = React.memo(() => {
    const status = useSelector<RootStateType, RequestStatusType>(state => state.app.status)
    const isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)
    const isInitialized = useSelector<RootStateType, boolean>(state => state.app.isInitialized)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializedTC())
    }, [])

    const logoutHandler = useCallback(() => dispatch(logoutTC()), [])

    if(!isInitialized) {
        return <div style={{textAlign:'center', position:'fixed', top:'50%', width:'100%'}}>
            <CircularProgress style={{width:'200px', height: "200px"}}/>
        </div>
    }

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
                    {isLoggedIn && <Button onClick={logoutHandler} color="inherit">Log Out</Button>}
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress color="secondary" style={{display: "absolute"}}/>}
            <Container fixed={true}>
                <Switch>
                    <Route exact path={'/'} render={() => <TodoListsList/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <h1 style={{textAlign: "center"}}>404:Page not found</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
})

export default App;


