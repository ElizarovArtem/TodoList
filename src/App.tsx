import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./TodoList";

import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
} from "./state/todoList-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./state/store";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type FilterValuesType = 'all' | 'active' | 'completed';

function App() {

    let todoLists = useSelector<RootStateType, Array<TodoListType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const addTask = useCallback( (taskTitle: string, todoListID: string) => {
        dispatch(addTaskAC(taskTitle,todoListID))
    }, [dispatch]);

    const changeTaskStatus = useCallback( (taskId: string, isDone: boolean, todoListID: string) => {
        dispatch(changeTaskStatusAC(taskId,isDone,todoListID))
    }, [dispatch]);

    const changeTaskTitle = useCallback( (taskId: string, title: string, todoListID: string) => {
        dispatch(changeTaskTitleAC(taskId,title,todoListID))
    }, [dispatch]);

    const removeTasks = useCallback( (taskId: string, todoListID: string) => {
        dispatch(removeTaskAC(taskId,todoListID))
    }, [dispatch]);

    const changeFilter = useCallback( (value: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC(todoListID, value))
    }, [dispatch]);

    const removeTodoList = useCallback( (todoListID: string) => {
        dispatch(removeTodoListAC(todoListID))
    }, [dispatch])

    const addTodoList = useCallback( (title: string) => {
        let action = addTodoListAC(title)
        dispatch(action)
    }, [dispatch])

    const changeTodoListTitle = useCallback( (todoListID: string, title: string) => {
        dispatch(changeTodoListTitleAC(todoListID,title))
    }, [dispatch])

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

            <Container fixed={true}>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5}>
                    {
                        todoLists.map(tl => {
                            let tasksForTodoList = tasks[tl.id];


                            return (
                                <Grid item>
                                    <Paper elevation={3} style={{padding: "10px 20px 20px 20px"}} >
                                        <TodoList
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={tasksForTodoList}
                                            removeTask={removeTasks}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTaskTitle={changeTaskTitle}
                                            filter={tl.filter}
                                            removeTodoList={removeTodoList}
                                            changeTodoListTitle={changeTodoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}


export default App;
