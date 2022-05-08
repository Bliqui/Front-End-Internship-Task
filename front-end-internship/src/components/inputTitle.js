import module from '../Style.module.css'

export const InputTitle = ({title}) => {
    return(
        <label className={module.inputTitle}>{title}</label>
    )
}