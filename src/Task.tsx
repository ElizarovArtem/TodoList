import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./api/api-todolist";

type TaskPropsType = {
    task: TaskType
    todoListId: string
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {

    const removeTask = () => {
        props.removeTask(props.task.id, props.todoListId)
    };
    const changeStatus = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.task.id, status, props.todoListId)
    }, [props.changeTaskStatus, props.task.id, props.todoListId])
    const changeTaskTitle = useCallback( (title: string) => {
        props.changeTaskTitle(props.task.id, title, props.todoListId)
    },[ props.changeTaskTitle, props.task.id, props.todoListId])

    return (
        <li className={props.task.status === TaskStatuses.Completed ? "isDone" : ""} key={props.task.id}>
            <Checkbox
                onChange={changeStatus}
                checked={props.task.status === TaskStatuses.Completed}
                color={"primary"}
            />
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={removeTask} color={"primary"}>
                <Delete/>
            </IconButton>
        </li>
    )
})