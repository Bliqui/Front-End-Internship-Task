import loader from '../img/loader.gif';
import module from '../Style.module.css';

export const Loader = () => {

    return (
        <img className={module.loader} src={loader} alt="loader"/>
    )
};