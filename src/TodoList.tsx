import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "./api/api-todolist";
import {FilterValuesType} from "./state/todoList-reducer";
import {useDispatch} from "react-redux";
import {setTasksTC} from "./state/tasks-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (taskTitle: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (taskId: string, title:string, todoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
}

export const TodoList = React.memo( (props: PropsType) => {
    console.log("TODOLIST")

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setTasksTC(props.id))
    }, [])

    const removeTodoList = useCallback( () => {
        props.removeTodoList(props.id)
    }, [props.removeTodoList, props.id])

    const addTask = useCallback( (title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const changeTodoListTitle = useCallback( (title: string) => {
        props.changeTodoListTitle(props.id, title)
    }, [ props.changeTodoListTitle, props.id])

    const setAllFilterType = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id])
    const setActiveFilterType =useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id])
    const setCompletedFilterType =useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id])

    let tasks = props.tasks

    if (props.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
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
                        key={task.id}
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
                    onClick={setActiveFilterType}>Active</Button>
                <Button
                    size={"small"}
                    variant={props.filter === "completed" ? "contained" : "outlined" }
                    color={"primary"}
                    onClick={setCompletedFilterType}>Completed</Button>
            </div>
        </div>);
})

