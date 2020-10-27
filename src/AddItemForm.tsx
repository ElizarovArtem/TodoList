import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm( props: AddItemFormPropsType) {
    const[title, setTitle] = useState<string>("");
    let [error,setError] = useState<null | string>(null);

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const onAddItemKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
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
    };



    return(
        <div>
            {/*<input value={title}
                   onChange={onChangeTitle}
                   onKeyPress={onAddItemKeyPress}
                   className={error ? "error" : ""}
            />*/}
            <TextField
                onChange={onChangeTitle}
                onKeyPress={onAddItemKeyPress}
                value={title}
                variant={"outlined"}
                error={!!error}
                label={"Title"}
                helperText={error}
            />
            {/*<button onClick={onAddItemClick}>+</button>*/}
            <IconButton color={"primary"} onClick={onAddItemClick}>
                <AddBox/>
            </IconButton>
            {/*{error && <div className={"error-message"}>{error}</div>}*/}
        </div>
    )
}