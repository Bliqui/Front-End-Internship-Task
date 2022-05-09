import React from 'react';
import {NavLink} from 'react-router-dom';
import module from './styles/EditIntern.module.css';
import backToListSvg from './img/back_to_list.svg';
import {EditInternForm} from './components/EditInternForm'

const EditIntern = () => {

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
                    <EditInternForm/>
                </div>
            </div>
        </div>
    );
};

export default EditIntern;