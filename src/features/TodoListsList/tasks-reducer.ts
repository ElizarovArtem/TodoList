import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodoListsType
} from "./todoList-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from "../../api/api-todolist";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {RootStateType} from "../../app/store";

export type RemoveTaskType = {
    type: "REMOVE-TASK",
    todoListID: string
    taskID: string
}
export type SetTasksACType = {
    type: "SET-TASKS"
    tasks: Array<TaskType>
    todoLIstId: string
}

let initialState: TasksStateType = {}

export type ActionType =
    | RemoveTaskType
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodoListsType
    | SetTasksACType


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todoLIstId]: action.tasks}
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "REMOVE-TASK":
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todoListID]: state[action.todoListID]
                    .map(t => t.id === action.taskID ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todoListID: string): RemoveTaskType => {
    return {type: "REMOVE-TASK", todoListID, taskID}
}
export const addTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", task} as const
}
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todoListID: string) => {
    return {type: "UPDATE-TASK", todoListID, model, taskID} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todoLIstId: string): SetTasksACType => {
    return {type: "SET-TASKS", tasks, todoLIstId}
}


// thunks

type SetTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string }, ActionType>
export const setTasksTC = (todoLIstId: string): SetTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.getTasks(todoLIstId)
            .then(res => {
                dispatch(setTasksAC(res.data.items, todoLIstId))
            })
    }
}

type AddTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string, title: string }, ActionType>
export const addTasksTC = (todoLIstId: string, title: string): AddTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.createTask(todoLIstId, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}

type DeleteTasksTCType = ThunkAction<void, RootStateType, { todoLIstId: string, taskId: string }, ActionType>
export const deleteTasksTC = (todoLIstId: string, taskId: string): DeleteTasksTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {
        todoListsAPI.deleteTask(todoLIstId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, todoLIstId))
            })
    }
}

type UpdateTaskTCType =
    ThunkAction<void,
        RootStateType,
        { todoLIstId: string, taskId: string, domainModel: UpdateDomainTaskModelType },
        ActionType>
export const updateTaskTC = (todoLIstId: string, taskId: string, domainModel: UpdateDomainTaskModelType): UpdateTaskTCType => {
    return (dispatch: ThunkDispatch<RootStateType, unknown, ActionType>,
            getState: () => RootStateType) => {

        const state = getState()
        const task = state.tasks[todoLIstId].find(tl => tl.id === taskId)

        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status,
                ...domainModel
            }

            todoListsAPI.updateTask(todoLIstId, taskId, apiModel)
                .then(res => {
                    dispatch(updateTaskAC(taskId, domainModel, todoLIstId))
                })

        }
    }
}

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}