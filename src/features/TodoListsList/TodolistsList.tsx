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
import {addTasksTC, deleteTasksTC, TasksStateType, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/api-todolist";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";

export const TodoListsList: React.FC = () => {
    let todoLists = useSelector<RootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setTodoListsTC())
    }, [])

    const addTask = useCallback((taskTitle: string, todoListID: string) => {
        dispatch(addTasksTC(todoListID, taskTitle))
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
        dispatch(changeTodoListFilterAC(todoListID, value))
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
                                />
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>)
}