import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType
} from "./tasks-reducer";
import {addTodoListAC, removeTodoListAC} from "./todoList-reducer";
import {TaskStatuses} from "../api/api-todolist";

let startState: TasksStateType = {};

beforeEach(() => {
    startState = {
        "todolistId1": [
            {id: "1", title: "CSS", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""},
            {id: "2", title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""},
            {id: "3", title: "React", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""}
        ],
        "todolistId2": [
            {id: "1", title: "bread", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""},
            {id: "2", title: "milk", status: TaskStatuses.Completed,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""},
            {id: "3", title: "tea", status: TaskStatuses.New,
                todoListId: 'todoListID', addedDate: "", deadline: "",
                description: "", order: 0, priority: 0, startDate: ""}
        ]
    };
})


test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"].length).toBe(2)
    expect(endState["todolistId2"][1].id).toBe("3")
});

test('correct task should be added for correct array', () => {

    const action = addTaskAC("coca-cola", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][0].title).toBe("coca-cola");
});

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(0);
    expect(endState["todolistId1"][1].status).toBe(2);
});

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC("2", "Bubble", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("Bubble");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const action = addTodoListAC("new todolist");

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

    const action = removeTodoListAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

