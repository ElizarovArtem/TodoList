import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormHelperObjectType = {setTitle: (title: string) => void, setError: (error: string) => void}
export type AddItemFormPropsType = {
    addItem: (title: string, helper?: AddItemFormHelperObjectType) => void
    disabled?: boolean
}
export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("");
    let [error, setError] = useState<null | string>(null);

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {

        setTitle(e.currentTarget.value)
    };

    const onAddItemKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.key === "Enter") {
            onAddItemClick();
        }
    };

    const onAddItemClick = async () => {
        if (title.trim() !== "") {
            try {
                await props.addItem(title.trim())
                setTitle("")
            } catch (error) {
                setError(error.message)
            }
        } else {
            setError("Title is required!");
        }
    }
    const onAddItemClickSecondVariant = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle !== "") {
            props.addItem(trimmedTitle, {setTitle, setError})
        } else {
            setError("Title is required!")
        }
    }

    return (
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
            <IconButton
                color={"primary"}
                onClick={onAddItemClick}
                style={{marginLeft: "10px"}}
                disabled={props.disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})