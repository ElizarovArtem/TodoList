import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {action} from "@storybook/addon-actions";
import {EditableSpan, EditableSpanPropsType} from "./EditableSpan";


export default {
    title: 'Components/EditableSpan',
    component: EditableSpan,
    argTypes: {
        onChange: {
            description: 'Changed value editable span'
        },
        value: {
            description: "Start value to editable span"
        }
    },
} as Meta;

const Template: Story<EditableSpanPropsType> = (args) => <EditableSpan {...args} />;


export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
    title: "Test Title",
    changeTitle: action('New Title was sent')
};