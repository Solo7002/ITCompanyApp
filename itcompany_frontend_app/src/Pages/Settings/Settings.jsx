import { useEffect, useState, useTransition } from "react";
import "./Settings.css";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    }
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);
    return (
        <div className="settings-container">
            <h1 className="text-center my-4">{t("settings.Settings")}</h1>
            <div className="container mt-4 cont">
                <div className="form-group">
                    <label htmlFor="languageSelect">{t("settings.selectLanguage")}</label>
                    <select
                        className="form-control custom-select"
                        id="languageSelect"
                        onChange={changeLanguage}
                        value={currentLanguage}
                    >
                        <option value="en">English</option>
                        <option value="ua">Українська</option>
                        <option value="es">Español</option>
                        <option value="ja">日本語</option>
                        <option value="de">Deutschland</option>
                    </select>
                </div>
            </div>
        </div>
    )
};

export { Settings };