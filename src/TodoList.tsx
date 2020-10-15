import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

import {FilterValuesType, TaskType} from "./App";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (taskTitle: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
}

export function TodoList(props: PropsType) {

    const[title, setTitle] = useState<string>("");
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
    };

    const removeTodoList = () => {props.removeTodoList(props.id)}

    const setAllFilterType = () => {props.changeFilter('all', props.id)}
    const setActiveFilterType = () => {props.changeFilter('active', props.id)}
    const setCompletedFilterType = () => {props.changeFilter('completed', props.id)}

    return (
        <div>
            <h3>{props.title}<button onClick={removeTodoList}>X</button></h3>
            <div>
                <input value={title}
                       onChange={onChangeTitle}
                       onKeyPress={onAddTaskKeyPress}
                       className={error ? "error" : ""}
                />
                <button onClick={addTask}>+</button>
                {error && <div className={"error-message"}>{error}</div>}
            </div>
            <ul>
                {
                    props.tasks.map(task => {

                        const removeTask = () => {
                            props.removeTask(task.id, props.id)
                        };
                        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeTaskStatus(task.id, e.currentTarget.checked, props.id)
                        }

                        return (
                            <li key={task.id} >
                                <input
                                    type="checkbox"
                                    checked={task.isDone}
                                    onChange={changeStatus}
                                />
                                <span className={task.isDone ? "isDone" : ""}>{task.title}</span>
                                <button onClick={removeTask}>X</button>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "active" : ""}
                    onClick={setAllFilterType}>All</button>
                <button
                    className={props.filter === "active" ? "active" : ""}
                    onClick={setActiveFilterType}>Active</button>
                <button
                    className={props.filter === "completed" ? "active" : ""}
                    onClick={setCompletedFilterType}>Completed</button>
            </div>
        </div>);
}