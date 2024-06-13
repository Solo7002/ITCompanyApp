import { useTranslation } from "react-i18next"


const Error404=()=>{
    const {t}=useTranslation();
    return(
    <div className="container">
        <div className="error">
            <h1>404</h1>
            <p>{t('Errors404.Page Not Found')}</p>
        </div>
        <div className="message">
            <p>{t('Errors404.Oops! The page you are looking for does not exist. It might have been moved or deleted.')}</p>
            <a className="btn btn-info" href="/">{t('Errors404.Go back to Home')}</a>
        </div>
    </div>
    )
}
export{Error404}