import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/api-todolist";
import {FilterValuesType, TodoListDomainType} from "../todoList-reducer";
import {useDispatch} from "react-redux";
import {setTasksTC, TaskDomainType} from "../tasks-reducer";


type PropsType = {
    todolist: TodoListDomainType
    tasks: Array<TaskDomainType>
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (taskTitle: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (taskId: string, title:string, todoListId: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
    demo?: boolean
}

export const TodoList = React.memo( (props: PropsType) => {
    console.log("TODOLIST")

    const dispatch = useDispatch()
    useEffect(() => {
        if(props.demo) {
            return
        }
        dispatch(setTasksTC(props.todolist.id))
    }, [])

    const removeTodoList = useCallback( () => {
        props.removeTodoList(props.todolist.id)
    }, [props.removeTodoList, props.todolist.id])

    const addTask = useCallback( (title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask, props.todolist.id])

    const changeTodoListTitle = useCallback( (title: string) => {
        props.changeTodoListTitle(props.todolist.id, title)
    }, [ props.changeTodoListTitle, props.todolist.id])

    const setAllFilterType = useCallback(() => props.changeFilter('all', props.todolist.id), [props.changeFilter, props.todolist.id])
    const setActiveFilterType =useCallback(() => props.changeFilter('active', props.todolist.id), [props.changeFilter, props.todolist.id])
    const setCompletedFilterType =useCallback(() => props.changeFilter('completed', props.todolist.id), [props.changeFilter, props.todolist.id])

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
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                        removeTask={props.removeTask}
                        disabled={task.entityStatus === "loading"}
                    />)
                }
            </ul>
            <div>
                <Button
                    size={"small"}
                    variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                    color={"primary"}
                    //className={props.filter === "all" ? "active" : ""}
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

