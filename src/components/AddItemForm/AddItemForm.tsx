import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {Button, IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo( ( props: AddItemFormPropsType) => {
    const[title, setTitle] = useState<string>("");
    let [error,setError] = useState<null | string>(null);

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {

        setTitle(e.currentTarget.value)
    };

    const onAddItemKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null){
            setError(null);
        }
        if(e.key === "Enter"){
            onAddItemClick();
        }
    };

    const onAddItemClick = () => {
        if(title.trim() !== ""){
            props.addItem(title.trim())
            setTitle("")
        }else{
            setError("Title is required!");
        }
    }

    return(
        <div>
            <TextField
                onChange={onChangeTitle}
                onKeyPress={onAddItemKeyPress}
                value={title}
                variant={"outlined"}
                error={!!error}
                label={"Title"}
                helperText={error}
                disabled={props.disabled}
            />
            <IconButton color={"primary"} onClick={onAddItemClick} disabled={props.disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
} )