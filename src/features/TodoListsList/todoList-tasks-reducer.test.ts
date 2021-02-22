import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {addTodoListAC, TodoListDomainType, todoListReducer} from "./todoList-reducer";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];

    const action = addTodoListAC({todolist: {id: "todolistId1", title: "What to learn", order: 0, addedDate: ""}});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodoLists).toBe(action.payload.todolist.id);
    expect(idFromTodoLists).toEqual(idFromTasks);
});
