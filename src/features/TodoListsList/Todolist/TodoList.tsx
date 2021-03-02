import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper, PropTypes} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/api-todolist";
import {FilterValuesType, TodoListDomainType} from "../todoList-reducer";
import {AsyncTaskActions, TaskDomainType} from "../tasks-reducer";
import {todoListActions} from "../index";
import {AsyncThunkAction} from "@reduxjs/toolkit";
import {useActions} from "../../../utils/redux-utils";


type PropsType = {
    todolist: TodoListDomainType
    tasks: Array<TaskDomainType>
    demo?: boolean
}

export const TodoList = React.memo((props: PropsType) => {
    console.log("TODOLIST")

    const {setTasksTC, addTaskTC} = useActions(AsyncTaskActions)
    const {changeTodoListFilterAC, deleteTodoListsTC, updateTodoListsTC} = useActions(todoListActions)


    const addTask = useCallback(async (title: string) => {
            let result = await addTaskTC({title, todoLIstId: props.todolist.id}) as
                AsyncThunkAction<
                    TaskType,
                    { todoLIstId: string; title: string; },
                    {rejectValue: { errors: Array<string>, fields: Array<any> }}> & {type: any}//dispatch(AsyncTaskActions.addTaskTC({todoLIstId: props.todolist.id, title}))

            if (AsyncTaskActions.addTaskTC.rejected.match(result)) {
                if(result.payload?.errors?.length) {
                    throw new Error(result.payload.errors[0])
                } else {
                    throw new Error("Some error occurred")
                }
            }
    }, [props.todolist.id])


    useEffect(() => {
        if (props.demo) {
            return
        }
        setTasksTC(props.todolist.id)
    }, [])

    const removeTodoList = useCallback(() => {
        deleteTodoListsTC(props.todolist.id)
    }, [props.todolist.id])

    const changeTodoListTitle = useCallback((title: string) => {
        updateTodoListsTC({todolistId: props.todolist.id, title: title})
    }, [props.todolist.id])

    let tasks = props.tasks

    if (props.todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const onButtonFilterClickHandler = useCallback( (filter: FilterValuesType) => {
        changeTodoListFilterAC({id: props.todolist.id, filter: filter})
    }, [props.todolist.id])

    const renderFilterButton = (buttonFilter: FilterValuesType, color: PropTypes.Color) => {
        return (
            <Button
                size={"small"}
                variant={props.todolist.filter === buttonFilter ? "contained" : "outlined"}
                color={color}
                onClick={() => onButtonFilterClickHandler(buttonFilter)}>
                {buttonFilter.slice(0, 1).toUpperCase() + buttonFilter.slice(1)}
            </Button>
        )
    }

    return (
        <Paper elevation={3} style={{padding: "1px 20px 20px 20px"}}>
            <h3>
                <EditableSpan
                title={props.todolist.title}
                changeTitle={changeTodoListTitle}
                disabled={props.todolist.entityStatus === "loading"}
            />
                <IconButton
                    onClick={removeTodoList}
                    style={{position: "absolute", right: "5px", top: "4px"}}
                    disabled={props.todolist.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"}/>

            <ul style={{listStyleType: "none", padding: "0"}}>
                {
                    tasks.map(task => <Task key={task.id} task={task}/>)
                }
                {!tasks.length && <div style={{padding: "10px", color: "grey"}}>No tasks</div>}
            </ul>
            <div>
                {renderFilterButton("all", "primary")}
                {renderFilterButton("active", "primary")}
                {renderFilterButton("completed", "primary")}
            </div>
        </Paper>
    );
})

