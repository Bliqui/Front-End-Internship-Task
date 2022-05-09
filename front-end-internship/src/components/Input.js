import {forwardRef} from "react";

export const Input = forwardRef(({type, onChange, register, ...rest}, ref) => {

    return (
        <input type={type} onChange={onChange} ref={ref} {...rest}/>
    );
});