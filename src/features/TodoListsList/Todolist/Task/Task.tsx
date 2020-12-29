import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/api-todolist";

type TaskPropsType = {
    task: TaskType
    todoListId: string
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    disabled?: boolean
}
export const Task = React.memo(({disabled, ...props}: TaskPropsType) => {

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
                disabled={disabled}
            />
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle} disabled={disabled}/>
            <IconButton onClick={removeTask} color={"primary"} disabled={disabled}>
                <Delete/>
            </IconButton>
        </li>
    )
})