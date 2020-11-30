import {TaskType} from "./App";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";

type TaskPropsType = {
    task: TaskType
    todoListId: string
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {

    const removeTask = () => {
        props.removeTask(props.task.id, props.todoListId)
    };
    const changeStatus = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.task.id, e.currentTarget.checked, props.todoListId)
    }, [props.changeTaskStatus, props.task.id, props.todoListId])
    const changeTaskTitle = useCallback( (title: string) => {
        props.changeTaskTitle(props.task.id, title, props.todoListId)
    },[ props.changeTaskTitle, props.task.id, props.todoListId])

    return (
        <li className={props.task.isDone ? "isDone" : ""} key={props.task.id}>
            <Checkbox
                onChange={changeStatus}
                checked={props.task.isDone}
                color={"primary"}
            />
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={removeTask} color={"primary"}>
                <Delete/>
            </IconButton>
        </li>
    )
})