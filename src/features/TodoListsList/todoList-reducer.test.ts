import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, TodoListDomainType,
    todoListReducer
} from './todoList-reducer'
import {v1} from 'uuid';

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

    const endState = todoListReducer(startState, removeTodoListAC({todoListID: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolistId3 = v1();

    let newTodolist =  {id: todolistId3, title: "Hey babe", filter: "all", order: 0, addedDate: ""};

    const endState = todoListReducer(startState, addTodoListAC({todolist: newTodolist}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("Hey babe");
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const action = changeTodoListTitleAC({id: todolistId2,title: newTodolistTitle})

    const endState = todoListReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action = changeTodoListFilterAC({id: todolistId2, filter: newFilter});

    const endState = todoListReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

