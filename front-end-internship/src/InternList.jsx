import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import module from './styles/InternList.module.css';
import pencilSvg from './img/drawing_pencil.svg';

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
                            (<NavLink to={`/interns/${u.id}`} key={u.id} className={module.edit_btn}>
                                <li className={module.list_li}>
                                    {u.name}
                                    <img src={pencilSvg} alt="pencil"/>
                                </li>
                            </NavLink>)
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InternList;