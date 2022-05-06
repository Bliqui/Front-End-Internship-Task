import {forwardRef, useRef, useImperativeHandle, useState} from "react";

export const Input = forwardRef(({type, value, ...rest}, ref) => {
    const [state, setState] = useState(value || "");

    function onChange(e) {
        setState(e.target.value)
    };

    return (
        <input type={type} value={state} onChange={onChange} ref={ref} {...rest}/>
    );
});