import module from "../Style.module.css";
import {InputTitle} from "./inputTitle";
import {Input} from "./Input";
import React, {useEffect, useRef, useState} from "react";
import {formatDate} from "../lib/formateDate";
import axios from "axios";
import {validateEmail} from "../lib/validateEmail";
import {flushSync} from "react-dom";
import {Loader} from "./Loader";
import {useParams, useNavigate} from "react-router-dom";
import {compareDates} from '../lib/compareDates'
import classNames from "classnames";
import {toast, ToastContainer} from "react-toastify";

export const EditInternForm = () => {

    const {id} = useParams();
    const navigate = useNavigate()

    const [intern, setIntern] = useState({});
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const inputFrom = useRef(null);
    const inputTo = useRef(null);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        console.log(id)
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
            })
            .catch(
                () => {
                    alert('Oops... something could have gone wrong.');
                    navigate('/');
                }
            )
            .finally(() => {
                setLoader(false)
            });
    }, [id]);

    function updateDb(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = Object.fromEntries(formData.entries());

        value.internshipStart = new Date(inputFrom.current.value).toISOString();
        value.internshipEnd = new Date(inputTo.current.value).toISOString();

        if (compareDates(inputFrom.current.value, inputTo.current.value)) {
            if (validateEmail(emailRef.current.value)) {
                return axios.put(`http://localhost:3001/interns/${id}`, value)
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
                    });
            };
        }
    };

    if (loader) {
        return <Loader/>
    }
    return (
        <form className={module.internForm} onSubmit={updateDb}>
            <ToastContainer />
            <div className={module.form_column}>
                <InputTitle title={"Full name *"}/>
                <Input className={module.textInput} value={intern.name} type={"text"} ref={nameRef} required
                       name={"name"}/>
                <InputTitle title={"Email address *"}/>
                <Input className={module.textInput} value={intern.email} type={"email"} ref={emailRef} required
                       name={"email"}/>
            </div>
            <div className={module.form_row}>
                <div id className={module.form_date_column}>
                    <InputTitle title={"Internship start *"}/>
                    <Input className={`${module.dateInput} ${module.mistake}`} type={"date"} id={"from"} ref={inputFrom} value={formatDate(intern.internshipStart)} required />
                </div>
                      <div className={module.form_date_column}>
                          <InputTitle title={"Internship end *"}/>
                          <Input className={module.dateInput} type={"date"} id={"to"} ref={inputTo} value={formatDate(intern.internshipEnd)} required/>
                      </div>
            </div>
            <button className={module.submitBtn} type="submit" value="Submit">Submit</button>
        </form>
    )
};