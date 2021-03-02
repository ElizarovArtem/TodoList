import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {action} from "@storybook/addon-actions";
import {Task, TaskPropsType} from "./Task";
import {TaskStatuses} from "../../../../api/api-todolist";
import {ReduxStoreProviderDecorator} from "../../../../stories/decorators/ReduxStoreProviderDecorator";


export default {
    title: 'Components/Task',
    component: Task,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    removeTask: action("Task was removed"),
    changeTaskTitle: action("Task title was changed"),
    changeTaskStatus: action("Task status was changed")
}

export const ActiveTask = Template.bind({});
ActiveTask.args = {
    task: {id: "1", title: "tea", status: TaskStatuses.Completed,
        todoListId: 'todoListID1', addedDate: "", deadline: "",
        description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
};

export const NotActiveTask = Template.bind({});
NotActiveTask.args = {
    task: {id: "1", title: "tea", status: TaskStatuses.New,
        todoListId: 'todoListID1', addedDate: "", deadline: "",
        description: "", order: 0, priority: 0, startDate: "", entityStatus: "idle"},
};

