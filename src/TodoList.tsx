import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

import {FilterValuesType, TaskType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (taskTitle: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskId: string, title:string, todoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
}

export function TodoList(props: PropsType) {

    /*const[title, setTitle] = useState<string>("");
    let [error,setError] = useState<null | string>(null);

    const addTask = () => {
        if(title.trim() !== ""){
            props.addTask(title.trim(), props.id)
            setTitle("")
        }else{
            setError("Title is required!");
        }
    };

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const onAddTaskKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if(e.key === "Enter"){
            addTask();
        }
    };*/

    const removeTodoList = () => {props.removeTodoList(props.id)}

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(props.id, title)
    }

    const setAllFilterType = () => {props.changeFilter('all', props.id)}
    const setActiveFilterType = () => {props.changeFilter('active', props.id)}
    const setCompletedFilterType = () => {props.changeFilter('completed', props.id)}

    return (
        <div>
            <h3><EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
            <IconButton onClick={removeTodoList}>
                <Delete/>
            </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            {/*<div>
                <input value={title}
                       onChange={onChangeTitle}
                       onKeyPress={onAddTaskKeyPress}
                       className={error ? "error" : ""}
                />
                <button onClick={addTask}>+</button>
                {error && <div className={"error-message"}>{error}</div>}
            </div>*/}
            <ul style={{listStyleType: "none", padding: "0"}}>
                {
                    props.tasks.map(task => {

                        const removeTask = () => {
                            props.removeTask(task.id, props.id)
                        };
                        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeTaskStatus(task.id, e.currentTarget.checked, props.id)
                        }
                        const changeTaskTitle = (title: string) => {
                            props.changeTaskTitle(task.id, title, props.id)
                        }

                        return (
                            <li className={task.isDone ? "isDone" : ""} key={task.id} >
                                {/*<input
                                    type="checkbox"
                                    checked={task.isDone}
                                    onChange={changeStatus}
                                />*/}
                                <Checkbox
                                    onChange={changeStatus}
                                    checked={task.isDone}
                                    color={"primary"}
                                />
                                {/*<span className={task.isDone ? "isDone" : ""}>{task.title}</span>*/}
                                <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                                {/*<button onClick={removeTask}>X</button>*/}
                                <IconButton onClick={removeTask} color={"primary"}>
                                    <Delete/>
                                </IconButton>
                            </li>
                        )
                    })
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
}