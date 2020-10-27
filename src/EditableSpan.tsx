import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    changeTitle: (value: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
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

    return editMode ?
        /*<input onChange={onChangeTitle} value={title} autoFocus={true} onBlur={offEditMode}/>*/
        <TextField
            value={title}
            autoFocus={true}
            onBlur={offEditMode}
            onChange={onChangeTitle}
        />
        :
        <span onDoubleClick={onEditMode}>{props.title}</span>

}