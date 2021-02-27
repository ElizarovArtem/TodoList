import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/api-todolist";
import {TodoListDomainType} from "../todoList-reducer";
import {AsyncTaskActions, TaskDomainType} from "../tasks-reducer";
import {useActions} from "../../../app/store";
import {todoListActions} from "../index";


type PropsType = {
    todolist: TodoListDomainType
    tasks: Array<TaskDomainType>
    demo?: boolean
}

export const TodoList = React.memo( (props: PropsType) => {
    console.log("TODOLIST")

    const {setTasksTC, addTaskTC, deleteTaskTC, updateTaskTC} = useActions(AsyncTaskActions)
    const {changeTodoListFilterAC, deleteTodoListsTC, updateTodoListsTC} = useActions(todoListActions)

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        updateTaskTC({todoListId, taskId, domainModel: {status}})
    }, []);

    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        updateTaskTC({todoListId, taskId, domainModel: {title}})
    }, []);

    useEffect(() => {
        if(props.demo) {
            return
        }
       setTasksTC(props.todolist.id)
    }, [])

    const removeTodoList = useCallback( () => {
        deleteTodoListsTC(props.todolist.id)
    }, [props.todolist.id])

    const addTask = useCallback( (title: string) => {
        addTaskTC({title, todoLIstId: props.todolist.id})
    }, [props.todolist.id])

    const changeTodoListTitle = useCallback( (title: string) => {
        updateTodoListsTC({todolistId: props.todolist.id, title: title})
    }, [props.todolist.id])

    const setAllFilterType = useCallback(() => changeTodoListFilterAC({id: props.todolist.id, filter: 'all'}), [props.todolist.id])
    const setActiveFilterType =useCallback(() => changeTodoListFilterAC({id: props.todolist.id, filter: 'active'}), [props.todolist.id])
    const setCompletedFilterType =useCallback(() => changeTodoListFilterAC({id: props.todolist.id, filter: 'completed'}), [props.todolist.id])

    let tasks = props.tasks

    if (props.todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3><EditableSpan
                title={props.todolist.title}
                changeTitle={changeTodoListTitle}
                disabled={props.todolist.entityStatus === "loading"}
            />
            <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"}/>

            <ul style={{listStyleType: "none", padding: "0"}}>
                {
                    tasks.map(task => <Task
                        key={task.id}
                        task={task}
                        todoListId={props.todolist.id}
                        changeTaskTitle={changeTaskTitle}
                        changeTaskStatus={changeTaskStatus}
                        removeTask={deleteTaskTC}
                        disabled={task.entityStatus === "loading"}
                    />)
                }
            </ul>
            <div>
                <Button
                    size={"small"}
                    variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                    color={"primary"}
                    onClick={setAllFilterType}>All</Button>
                <Button
                    size={"small"}
                    variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                    color={"primary"}
                    onClick={setActiveFilterType}>Active</Button>
                <Button
                    size={"small"}
                    variant={props.todolist.filter === "completed" ? "contained" : "outlined" }
                    color={"primary"}
                    onClick={setCompletedFilterType}>Completed</Button>
            </div>
        </div>);
})

