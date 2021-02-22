import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

export type EditableSpanPropsType = {
    title: string
    changeTitle: (value: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo( ({disabled = false, ...props}: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title)

    const onEditMode = () => {
        setEditMode(true);
    }
    const offEditMode = () => {
        setEditMode(false);
        if(title.trim()){
            props.changeTitle(title.trim());
        }
    }
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode && !disabled ?
        <TextField
            value={title}
            autoFocus={true}
            onBlur={offEditMode}
            onChange={onChangeTitle}
        />
        :
        <span onDoubleClick={() => !disabled && onEditMode()}>{props.title}</span>

} )