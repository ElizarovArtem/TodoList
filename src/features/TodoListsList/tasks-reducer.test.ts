import {
    addTaskAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType, updateTaskAC
} from "./tasks-reducer";
import {addTodoListAC, removeTodoListAC, setTodoListsAC} from "./todoList-reducer";
import {TaskStatuses, TodoListType} from "../../api/api-todolist";

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

    const action = removeTaskAC({taskID: "2",todoListId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(2)
    expect(endState["todolistId2"][1].id).toBe("3")
});

test('correct task should be added for correct array', () => {

    const task = {id: "5", title: "Feature", status: TaskStatuses.New,
        todoListId: 'todolistId2', addedDate: "", deadline: "",
        description: "", order: 0, priority: 0, startDate: ""}

    const action = addTaskAC({task});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][0].title).toBe("Feature");
});

test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskID: "2",todoListID: "todolistId2",model: {status: TaskStatuses.New}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(0);
    expect(endState["todolistId1"][1].status).toBe(2);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC({taskID: "2", todoListID: "todolistId2", model: {title: "Bubble"}});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("Bubble");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const todolist: TodoListType = {id: "todolistId5", addedDate: "", order: 0, title: "COMMON"}

    const action = addTodoListAC({todolist});

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

    const action = removeTodoListAC({todoListID: "todolistId2"});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

test('empty array should be added when todolist is set', () => {

    const action = setTodoListsAC({todoLists: startState["todolistId2"]});

    const endState = tasksReducer({}, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(3);
    expect(endState["2"]).toEqual([]);
});

