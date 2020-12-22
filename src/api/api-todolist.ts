import axios from 'axios'

const axiosInstance = axios.create({
    headers: {
        "API_KEY": "226ab278-2dfb-4ab9-ae80-f2d3924748f4"
    },
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.1/"
})


export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}
export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export enum TaskStatuses{
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

//Responses types
type ResponseType<D = {}> = {
    data: D
    resultCode: number
    messages: string[]
}
type GetTasksResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: string
}
const todoListsAPI = {
    getTodoLists() {
        return axiosInstance.get<Array<TodoListType>>(`todo-lists`);
    },
    createTodoList(title: string) {
        return axiosInstance.post<ResponseType<{item: TodoListType}>>(`todo-lists`, {title: title})
    },
    deleteTodoList(todoId: string) {
        return axiosInstance.delete<ResponseType>(`todo-lists/${todoId}`)
    },
    updateTodoList(todoId: string, title: string) {
        return axiosInstance.put<ResponseType>(`todo-lists/${todoId}`, {title})
    },
    getTasks(todoId: string) {
        return axiosInstance.get<GetTasksResponseType>(`todo-lists/${todoId}/tasks`)
    },
    createTask(todoId: string, title: string) {
        return axiosInstance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todoId}/tasks`, {title})
    },
    deleteTask(todoId: string, taskId: string) {
        return axiosInstance.delete<ResponseType>(`todo-lists/${todoId}/tasks/${taskId}`)
    },
    updateTask(todoId: string, taskId: string, model:UpdateTaskModelType) {
        return axiosInstance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todoId}/tasks/${taskId}`, model)
    }
}