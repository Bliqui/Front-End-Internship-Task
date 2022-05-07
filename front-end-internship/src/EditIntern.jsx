import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import {Input} from './components/Input';
import {flushSync} from 'react-dom';
import module from './Style.module.css';
import backToListSvg from './img/back_to_list.svg';
import calendarSvg from './img/calendar.svg';
import mistakeSvg from './img/mistake.svg';

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
            }
            ;
        }
        ;
    };

    return (
        <div className={module.body}>
            <div className={module.wrapper_invisible}>
                <NavLink className={module.backToList} to="/">
                    <img src={backToListSvg} alt="backToList"/>
                    Back to list
                </NavLink>
            </div>
            <div className={module.wrapper_edit}>
                <div className={module.secondWrapper}>
                <h1 className={module.title}>Edit</h1>
                    <form className={module.internForm} onSubmit={updateDb}>
                        <div className={module.form_column}>
                            <label className={module.inputTitle}>Full name *</label>
                            <Input className={module.textInput} value={intern.name} type={"text"} ref={nameRef} required name={"name"}/>
                            <label className={module.inputTitle}>Email address *</label>
                            <Input className={module.textInput} value={intern.email} type={"email"} ref={emailRef} required name={"email"}/>
                        </div>
                        <div className={module.form_row}>
                            <Input className={module.dateInput} type={"date"} id={"from"} ref={inputFrom} value={formatDate(intern.internshipStart)}
                                   required/>
                            <Input className={module.dateInput} type={"date"} id={"to"} ref={inputTo} value={formatDate(intern.internshipEnd)} required/>
                        </div>
                            <button className={module.submitBtn} type="submit" value="Submit">Submit</button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default EditIntern;