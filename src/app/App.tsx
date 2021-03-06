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
import {TodoListsList} from "../features/TodoListsList";
import {useDispatch, useSelector} from "react-redux";
import {appActions} from "../features/Application";
import {ErrorSnackbar} from "../components";
import {Redirect, Route, Switch} from 'react-router-dom';
import {Login} from "../features/Login";
import {authActions} from "../features/Login/";
import {selectIsInitialized, selectStatus} from "../features/Application/selectors";
import {authSelectors} from "../features/Login";
import {appCommonActions} from "../features/CommonActions/App";

type AppPropsType = {
    demo?: boolean
}
const App = React.memo(({demo = false}:AppPropsType) => {

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)
    const isInitialized = useSelector(selectIsInitialized)
    const dispatch = useDispatch()

    useEffect(() => {
        if(!isInitialized) {
            dispatch(appActions.initializedTC())
        }
    }, [])

    const logoutHandler = useCallback(() => {
        if(!demo) {
            dispatch(authActions.logoutTC())
        } else {
            dispatch(appCommonActions.setIsLoggedInAC({value: false}))
        }
    }, [])

    if(!isInitialized) {
        return <div style={{textAlign:'center', position:'fixed', top:'50%', width:'100%'}}>
            <CircularProgress style={{width:'100px', height: "100px"}}/>
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
                    <Route exact path={'/'} render={() => <TodoListsList demo={demo}/>}/>
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


