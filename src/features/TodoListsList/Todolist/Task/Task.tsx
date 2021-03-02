import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "../../../../api/api-todolist";
import {AsyncTaskActions, TaskDomainType} from "../../tasks-reducer";
import {useActions} from "../../../../app/store";

export type TaskPropsType = {
    task: TaskDomainType
}
export const Task = React.memo(({task}: TaskPropsType) => {

    const {deleteTaskTC, updateTaskTC} = useActions(AsyncTaskActions)

    const removeTask = () => {
        deleteTaskTC({taskId: task.id, todoLIstId: task.todoListId})
    };
    const changeStatus = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        updateTaskTC({
            taskId: task.id,
            todoListId: task.todoListId,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
        })
    }, [task.id, task.todoListId])
    const changeTaskTitle = useCallback( (title: string) => {
        updateTaskTC({
            taskId: task.id,
            todoListId: task.todoListId,
            domainModel: {title}
        })
    },[task.id, task.todoListId])

    return (
        <li className={task.status === TaskStatuses.Completed ? "isDone" : ""} key={task.id} style={{position: "relative"}}>
            <Checkbox
                onChange={changeStatus}
                checked={task.status === TaskStatuses.Completed}
                color={"primary"}
                disabled={task.entityStatus === "loading"}
            />
            <EditableSpan title={task.title} changeTitle={changeTaskTitle} disabled={task.entityStatus === "loading"}/>
            <IconButton
                onClick={removeTask}
                style={{position: "absolute", right: "0", top: "2px"}}
                color={"primary"}
                disabled={task.entityStatus === "loading"}>
                <Delete fontSize={"small"}/>
            </IconButton>
        </li>
    )
})