import module from '../styles/EditIntern.module.css'

export const InputTitle = ({title}) => {
    return(
        <label className={module.inputTitle}>{title}</label>
    )
}