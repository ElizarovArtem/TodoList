import React, {useCallback} from 'react';

import {FilterValuesType, TaskType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (taskTitle: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskId: string, title:string, todoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
}

export const TodoList = React.memo( (props: PropsType) => {

    const removeTodoList = useCallback( () => {
        props.removeTodoList(props.id)
    }, [props.removeTodoList, props.id])

    const addTask = useCallback( (title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const changeTodoListTitle = useCallback( (title: string) => {
        props.changeTodoListTitle(props.id, title)
    }, [ props.changeTodoListTitle, props.id])

    const setAllFilterType = () => {props.changeFilter('all', props.id)}
    const setActiveFilterType = () => {props.changeFilter('active', props.id)}
    const setCompletedFilterType = () => {props.changeFilter('completed', props.id)}

    let tasks = props.tasks

    if (props.filter === 'active') {
        tasks = tasks.filter(t => t.isDone === false)
    }
    if (props.filter === 'completed') {
        tasks = tasks.filter(t => t.isDone === true)
    }

    return (
        <div>
            <h3><EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
            <IconButton onClick={removeTodoList}>
                <Delete/>
            </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>

            <ul style={{listStyleType: "none", padding: "0"}}>
                {
                    tasks.map(task => <Task
                        task={task}
                        todoListId={props.id}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                        removeTask={props.removeTask}
                    />)
                }
            </ul>
            <div>
                <Button
                    size={"small"}
                    variant={props.filter === "all" ? "contained" : "outlined"}
                    color={"primary"}
                    //className={props.filter === "all" ? "active" : ""}
                    onClick={setAllFilterType}>All</Button>
                <Button
                    size={"small"}
                    variant={props.filter === "active" ? "contained" : "outlined"}
                    color={"primary"}
                    //className={props.filter === "active" ? "active" : ""}
                    onClick={setActiveFilterType}>Active</Button>
                <Button
                    size={"small"}
                    variant={props.filter === "completed" ? "contained" : "outlined" }
                    color={"primary"}
                    // className={props.filter === "completed" ? "active" : ""}
                    onClick={setCompletedFilterType}>Completed</Button>
            </div>
        </div>);
})

