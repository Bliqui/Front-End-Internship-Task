import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router';
import {NavLink} from 'react-router-dom';
import axios from "axios";
import {Input} from "./components/Input";
import {flushSync} from 'react-dom';

const EditIntern = () => {
    const {id} = useParams();
    const [intern, setIntern] = useState({});
    const inputFrom = useRef(null);
    const inputTo = useRef(null);

    const nameRef = useRef(null);
    const emailRef = useRef(null);

    useEffect(() => {
        //TODO: get intern from REST api http://localhost:3001/interns/:id
        axios.get(`http://localhost:3001/interns/${id}`)
            .then((promise) => {
                const {name, email, internshipStart, internshipEnd} = promise.data;
                setIntern({
                    name,
                    email,
                    internshipStart,
                    internshipEnd
                });
            });
    }, [id]);

    function formatDate(date) {
        const newDate = new Date(Date(date)).toLocaleDateString().split('/').map((d) => {
            return d < 10 ? '05' : d
        })
        return newDate.reverse().join('-')
    };

    function compareDates() {
        return inputFrom.current.value < inputTo.current.value
    };

    function validateEmail() {
        return String(emailRef.current.value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function updateDb(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = Object.fromEntries(formData.entries());

        value.internshipStart = new Date(inputFrom.current.value).toISOString();
        value.internshipEnd = new Date(inputTo.current.value).toISOString();

        if (compareDates()) {
            if (validateEmail()) {
                return axios.patch(`http://localhost:3001/interns/${id}`, value)
                    .then((response) => {
                        const {name, email, internshipStart, internshipEnd} = response.data
                        flushSync(() => {
                            setIntern({
                                name,
                                email,
                                internshipStart,
                                internshipEnd
                            });
                        })
                    })
                    .finally(() => {
                        nameRef.current.value = '';
                        emailRef.current.value = '';
                    });
            };
        };
    };

    return (
        <div>
            <NavLink to="/">Back to list </NavLink>
            <form onSubmit={updateDb}>
                <label>{intern.name}</label>
                <Input type={"text"} ref={nameRef} required name={"name"}/>
                <label>{intern.email}</label>
                <Input type={"email"} ref={emailRef} required name={"email"}/>
                <Input type={"date"} id={"from"} ref={inputFrom} value={formatDate(intern.internshipStart)} required/>
                <Input type={"date"} id={"to"} ref={inputTo} value={formatDate(intern.internshipEnd)} required/>
                <button type="submit" value="Submit">Submit</button>
            </form>
        </div>
    );
};

export default EditIntern;