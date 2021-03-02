import {TasksStateType} from "./tasks-reducer";
import {TaskStatuses, TodoListType} from "../../api/api-todolist";
import {tasksReducer, tasksActions, todoListActions} from "./index";


let startState: TasksStateType = {};

beforeEach(() => {
    startState = {
        ["todolistId1"]: [
            {id: "1", title: "CSS", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
            {id: "2", title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
            {id: "3", title: "React", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"}
        ],
        ["todolistId2"]: [
            {id: "1", title: "bread", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
            {id: "2", title: "milk", status: TaskStatuses.Completed,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
            {id: "3", title: "tea", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"}
        ]
    };
})


test('correct task should be deleted from correct array', () => {

    const action = tasksActions.deleteTaskTC.fulfilled({taskID: "2",todoListId: "todolistId2"}, "", {taskId: "2",todoLIstId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(2)
    expect(endState["todolistId2"][1].id).toBe("3")
});

test('correct task should be added for correct array', () => {

    const task = {id: "5", title: "Feature", status: TaskStatuses.New,
        todoListId: 'todolistId2', addedDate: "", deadline: "",
        description: "", order: 0, priority: 0, startDate: ""}

    const action = tasksActions.addTaskTC.fulfilled({...task}, "", {title: task.title, todoLIstId: task.todoListId});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][0].title).toBe("Feature");
});

test('status of specified task should be changed', () => {

    let updateTaskParam = {taskID: "2",todoListID: "todolistId2",model: {status: TaskStatuses.New}};
    const action = tasksActions.updateTaskTC.fulfilled(updateTaskParam, "", {taskId: "2", todoListId: "todolistId2", domainModel: {status: TaskStatuses.New}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(0);
    expect(endState["todolistId1"][1].status).toBe(2);
});

test('title of specified task should be changed', () => {

    let updateTaskParam = {taskID: "2",todoListID: "todolistId2",model: {title: "Bubble"}};
    const action = tasksActions.updateTaskTC.fulfilled(updateTaskParam, "", {taskId: "2", todoListId: "todolistId2", domainModel: {title: "Bubble"}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("Bubble");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const todolist: TodoListType = {id: "todolistId5", addedDate: "", order: 0, title: "COMMON"}

    const action = todoListActions.createTodoListsTC.fulfilled(todolist, "requestId", todolist.title);

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = todoListActions.deleteTodoListsTC.fulfilled({todoListID: "todolistId2"}, "requestId", "todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

test('empty array should be added when todolist is set', () => {

    const todolist: TodoListType = {id: "todolistId5", addedDate: "", order: 0, title: "COMMON"}

    const action = todoListActions.createTodoListsTC.fulfilled(todolist, "requestId", "COMMON");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(3);
    expect(endState["todolistId5"]).toEqual([]);
});

test('tasks from server should be added to state', () => {

    const action = tasksActions.setTasksTC.fulfilled({tasks: startState["todolistId1"], todoLIstId: "todolistId1"}, "args", "todolistId1")

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId1"][0].title).toEqual("CSS");
});