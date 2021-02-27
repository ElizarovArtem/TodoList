import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootStateType, useActions} from "../../app/store";
import {TodoListDomainType,} from "./todoList-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";
import {authSelectors} from "../Login";
import {todoListActions} from "./index";

type TodoListsListPropsType = {
    demo?: boolean
}
export const TodoListsList = ({demo = false}: TodoListsListPropsType) => {
    let todoLists = useSelector<RootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

    const {setTodoListsTC,createTodoListsTC} = useActions(todoListActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        setTodoListsTC()
    }, [])

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return (<>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={createTodoListsTC}/>
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