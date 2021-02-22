import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../app/store";
import {
    changeTodoListFilterAC,
    createTodoListsTC,
    deleteTodoListsTC,
    FilterValuesType,
    setTodoListsTC,
    TodoListDomainType,
    updateTodoListsTC
} from "./todoList-reducer";
import {addTaskTC, deleteTasksTC, TasksStateType, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/api-todolist";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";

type TodoListsListPropsType = {
    demo?: boolean
}
export const TodoListsList = ({demo = false}: TodoListsListPropsType) => {
    let todoLists = useSelector<RootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(setTodoListsTC())
    }, [])

    const addTask = useCallback((taskTitle: string, todoListID: string) => {
        dispatch(addTaskTC(todoListID, taskTitle))
    }, []);

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskId, {status}))
    }, []);

    const changeTaskTitle = useCallback((taskId: string, title: string, todoListID: string) => {
        dispatch(updateTaskTC(todoListID, taskId, {title}))
    }, []);

    const removeTasks = useCallback((taskId: string, todoListID: string) => {
        dispatch(deleteTasksTC(todoListID, taskId))
    }, []);

    const changeFilter = useCallback((value: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC({id: todoListID, filter: value}))
    }, []);

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodoListsTC(todoListID))
    }, [])

    const addTodoList = useCallback((title: string) => {
        let action = createTodoListsTC(title)
        dispatch(action)
    }, [])

    const changeTodoListTitle = useCallback((todoListID: string, title: string) => {
        dispatch(updateTodoListsTC(todoListID, title))
    }, [])

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return (<>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={5}>
            {
                todoLists.map(tl => {
                    let tasksForTodoList = tasks[tl.id];

                    return (
                        <Grid item key={tl.id}>
                            <Paper elevation={3} style={{padding: "10px 20px 20px 20px"}}>
                                <TodoList
                                    todolist={tl}
                                    tasks={tasksForTodoList}
                                    removeTask={removeTasks}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    removeTodoList={removeTodoList}
                                    changeTodoListTitle={changeTodoListTitle}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>)
}