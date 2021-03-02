import {TasksStateType} from "./tasks-reducer";
import {TodoListDomainType} from "./todoList-reducer";
import {tasksReducer, todoListActions, todolistReducer} from "./index";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];

    const action = todoListActions.createTodoListsTC.
    fulfilled({id: "todolistId1", title: "What to learn", order: 0, addedDate: ""}, "requestId", "What to learn");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todolistReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.id);
    expect(idFromTodoLists).toBe(action.payload.id);
    expect(idFromTodoLists).toEqual(idFromTasks);
});
