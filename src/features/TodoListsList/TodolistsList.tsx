import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {TodoListDomainType,} from "./todoList-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid} from "@material-ui/core";
import {AddItemForm} from "../../components";
import {TodoList} from "./";
import {Redirect} from "react-router-dom";
import {authSelectors} from "../Login";
import {todoListActions} from "./index";
import {useActions, useAppDispatch} from "../../utils/redux-utils";
import {RootStateType} from "../../utils/types";

type TodoListsListPropsType = {
    demo?: boolean
}
export const TodoListsList = ({demo = false}: TodoListsListPropsType) => {
    let todoLists = useSelector<RootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks = useSelector<RootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)
    const dispatch = useAppDispatch()

    const {setTodoListsTC} = useActions(todoListActions)
    console.log('cxxc111')
    const addTodolist = async (title: string) => {
        const result = await dispatch(todoListActions.createTodoListsTC(title))
        if (todoListActions.createTodoListsTC.rejected.match(result)) {
            if (result.payload?.errors?.length) {
                throw new Error(result.payload.errors[0])
            } else {
                throw new Error("Some error occurred")
            }
        }
    }
   /* const addTodolistSecondVariant = async (title: string, helper?: AddItemFormHelperObjectType) => {
        const result = await dispatch(todoListActions.createTodoListsTC(title))
        if (todoListActions.createTodoListsTC.rejected.match(result)) {
            if (result.payload?.errors?.length) {
                helper?.setError(result.payload.errors[0])
            } else {
                helper?.setError("Some error occurred")
            }
        } else {
            helper?.setTitle("")
        }
    }*/

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        if (!todoLists.length) {
            setTodoListsTC()
        }
    }, [])

    if (!isLoggedIn) {
        return <Redirect to={"/login"}/>
    }

    return (<>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={5} style={{flexWrap: "nowrap", overflowX: "scroll"}}>
            {
                todoLists.map(tl => {
                    let tasksForTodoList = tasks[tl.id];

                    return (
                        <Grid item key={tl.id} >
                            <div style={{width: "350px", position: "relative"}}>
                                <TodoList
                                    todolist={tl}
                                    tasks={tasksForTodoList}
                                    demo={demo}
                                />
                            </div>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>)
}