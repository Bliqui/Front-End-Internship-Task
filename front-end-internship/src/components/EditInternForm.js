import module from '../styles/EditIntern.module.css';
import {InputTitle} from './inputTitle';
import {Input} from './Input';
import React, {useEffect, useState} from 'react';
import {formatDate} from '../lib/formateDate';
import axios from 'axios';
import {validateEmail} from '../lib/validateEmail';
import {flushSync} from 'react-dom';
import {Loader} from './Loader';
import {useParams, useNavigate} from "react-router-dom";
import {compareDates} from '../lib/compareDates';
import {useForm} from 'react-hook-form';
import classNames from "classnames";
import mistake from '../img/mistake.svg'

export const EditInternForm = () => {

    const {id} = useParams();
    const navigate = useNavigate();

    const [intern, setIntern] = useState({});
    const [loader, setLoader] = useState(true);

    const {
        register,
        onChange,
        formState: {
            errors,
            isValid
        },
        handleSubmit, getValues
    } = useForm({
        mode: "all",
    });

    const inputDateClass = classNames(module.dateInput, {[module.dateInputMistakeOutline]: compareDates(getValues().internshipEnd, getValues().internshipStart)});
    const inputDateMistake = classNames(module.dateInputMistake, {[module.dateInputMistakeAlert]: compareDates(getValues().internshipEnd, getValues().internshipStart)});
    const inputIconActive = classNames(module.dateMistakeIcon, {[module.dateMistakeIconActive]: compareDates(getValues().internshipEnd, getValues().internshipStart)})

    useEffect(() => {
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
        const value = e;

        value.internshipStart = new Date(value.internshipStart).toISOString();
        value.internshipEnd = new Date(value.internshipEnd).toISOString();

        if (compareDates(value.internshipStart, value.internshipEnd)) {
            if (validateEmail(value.email)) {
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
                        });
                        alert('Success')
                    });
            }
        }
    };

    if (loader) {
        return <Loader/>
    }
    return (
        <form className={module.internForm} onSubmit={handleSubmit(updateDb)}>
            <div className={module.form_column}>
                <InputTitle title={"Full name *"}/>
                <Input className={`${errors?.name && module.dateInputMistakeOutline} ${module.textInput}`} type={"text"}
                       {...register('name', {
                           required: true,
                           value: intern.name,
                           onChange: onChange
                       })}/>
                <img className={`${errors?.name && module.textMistakeIconActive} ${module.textMistakeIcon}`} src={mistake} alt="mistake"/>
                <div className={module.textInputMistake}>
                    {errors?.name && <p>This field is required</p>}
                </div>
            </div>
            <div className={module.form_column}>
                <InputTitle title={"Email address *"}/>
                <Input className={`${errors?.email && module.dateInputMistakeOutline} ${module.textInput}`} type={"email"}
                       {...register('email', {
                           required: true,
                           value: intern.email,
                           onChange: onChange
                       })}/>
                <img className={`${errors?.email && module.textMistakeIconActive} ${module.textMistakeIcon}`} src={mistake} alt="mistake"/>
                <div className={module.textInputMistake}>
                    {errors?.email && <p>This field is required</p>}
                </div>
            </div>
            <div className={module.form_row}>
                <div className={module.form_date_column}>
                    <InputTitle title={"Internship start *"}/>
                    <div className={module.dateInputWrapper}>
                        <div className={module.dateInputLine}></div>
                        <Input className={module.dateInput} type={"date"}
                               {...register('internshipStart', {
                                   required: true,
                                   value: formatDate(intern.internshipStart),
                                   onChange: onChange
                               })}
                        />
                    </div>
                    <div className={module.dateInputMistake}>
                        {errors?.internshipStart && <p>This date is not correct</p>}
                    </div>
                </div>
                <div className={module.form_date_column}>
                    <InputTitle title={"Internship end *"}/>
                    <div className={module.dateInputWrapper}>
                        <div className={module.dateInputLine}></div>
                        <Input className={inputDateClass} type={"date"}
                               {...register('internshipEnd', {
                                   required: true,
                                   value: formatDate(intern.internshipEnd),
                                   onChange: onChange
                               })}
                        />
                        <img className={inputIconActive} src={mistake} alt="mistake"/>
                    </div>
                    <div className={inputDateMistake}>
                        <p>This date is not correct</p>
                    </div>
                </div>
            </div>
            <button className={module.submitBtn} disabled={!isValid} type="submit" value="Submit">Submit</button>
        </form>
    )
};