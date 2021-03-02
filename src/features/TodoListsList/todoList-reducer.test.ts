import {FilterValuesType, TodoListDomainType} from './todoList-reducer'
import {v1} from 'uuid';
import {todolistReducer, todoListActions} from "./index";

let startState: Array<TodoListDomainType>
let todolistId1 = v1();
let todolistId2 = v1();

beforeEach(() => {
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "", entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistReducer(startState, todoListActions.deleteTodoListsTC.fulfilled({todoListID: todolistId1}, "requestId", todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolistId3 = v1();

    let newTodolist =  {id: todolistId3, title: "Hey babe", filter: "all", order: 0, addedDate: ""};

    const endState = todolistReducer(startState, todoListActions.createTodoListsTC.fulfilled(newTodolist, "requestId", "Hey babe"))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("Hey babe");
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const action = todoListActions.updateTodoListsTC.fulfilled({todoListId: todolistId2,title: newTodolistTitle}, 'request', {todolistId: todolistId2,title: newTodolistTitle})

    const endState = todolistReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action = todoListActions.changeTodoListFilterAC({id: todolistId2, filter: newFilter});

    const endState = todolistReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

