import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import module from './Style.module.css';
import pencilSvg from './img/drawing_pencil.svg';
import logo from './img/logo.svg';

const InternList = () => {

    const [interns, setInterns] = useState([]);

    useEffect(() => {
        const fetchInterns = async () => {
            const response = await fetch('http://localhost:3001/interns');
            const interns = await response.json();
            setInterns(interns);
        }
        fetchInterns();
    }, []);

    return (
        <div className={module.body}>
            <div className={module.wrapper}>
                <div className={module.secondWrapper}>
                    <h1 className={module.title}>Participants</h1>
                    <ul className={module.list}>
                        {interns.map(u =>
                            (<li className={module.list_li} key={u.id}>{u.name}
                                <NavLink to={`/interns/${u.id}`} className={module.edit_btn}>
                                    <img src={pencilSvg} alt="pencil"/>
                                </NavLink>
                            </li>)
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InternList;