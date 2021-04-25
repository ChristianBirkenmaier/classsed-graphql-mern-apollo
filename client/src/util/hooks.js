import { useState } from "react";
export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        try {
            callback();
        } catch (err) {
            console.error(err);
        }
    };

    return {
        onChange,
        onSubmit,
        values,
    };
};
