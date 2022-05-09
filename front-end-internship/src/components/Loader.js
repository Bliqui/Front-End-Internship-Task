import loader from '../img/loader.gif';
import module from '../styles/EditIntern.module.css';

export const Loader = () => {

    return (
        <img className={module.loader} src={loader} alt="loader"/>
    )
};