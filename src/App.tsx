import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    changeTodoListFilterAC,createTodoListsTC, deleteTodoListsTC, FilterValuesType,
    setTodoListsTC, TodoListDomainType, updateTodoListsTC,
} from "./state/todoList-reducer";
import {
    addTasksTC, deleteTasksTC,
    TasksStateType, updateTaskStatusTC, updateTaskTitleTC
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./state/store";
import {TaskStatuses} from "./api/api-todolist";



const  App = React.memo ( () => {

    let todoLists = useSelector<RootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setTodoListsTC())
    }, [])

    const addTask = useCallback( (taskTitle: string, todoListID: string) => {
        dispatch(addTasksTC(todoListID,taskTitle))
    }, []);

    const changeTaskStatus = useCallback( (taskId: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTaskStatusTC(todoListID,taskId,status))
    }, []);

    const changeTaskTitle = useCallback( (taskId: string, title: string, todoListID: string) => {
        dispatch(updateTaskTitleTC(todoListID,taskId,title))
    }, []);

    const removeTasks = useCallback( (taskId: string, todoListID: string) => {
        dispatch(deleteTasksTC(todoListID,taskId))
    }, []);

    const changeFilter = useCallback( (value: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC(todoListID, value))
    }, []);

    const removeTodoList = useCallback( (todoListID: string) => {
        dispatch(deleteTodoListsTC(todoListID))
    }, [])

    const addTodoList = useCallback( (title: string) => {
        let action = createTodoListsTC(title)
        dispatch(action)
    }, [])

    const changeTodoListTitle = useCallback( (todoListID: string, title: string) => {
        dispatch(updateTodoListsTC(todoListID,title))
    }, [])

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
                                <Grid item key={tl.id}>
                                    <Paper elevation={3} style={{padding: "10px 20px 20px 20px"}} >
                                        <TodoList
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
})


export default App;
