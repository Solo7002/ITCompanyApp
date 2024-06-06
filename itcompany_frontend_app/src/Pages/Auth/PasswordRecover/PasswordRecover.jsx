import {useState } from "react";
import axios from "axios";
import keys from "../../../config/keys";

import "./PasswordRecover.css";
import { useTranslation } from "react-i18next";

const PasswordRecover=()=>{

    const {t}=useTranslation();

    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [isPasswordRecovered, setIsPasswordRecovered] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const sendCodeToEmailHandler = () => {
        let emailInput = document.getElementById("email-recover-password");
        
        if (email.trim() === ''){
            emailInput.setCustomValidity(t("PasswordRecover.Email is required"));
            emailInput.reportValidity();
        }
        else {
            axios.post(`${keys.ServerConnection}/Auth/sendConfirmationEmail`, {email})
            .then(() => {
                setIsEmailValid(true);
            })
            .catch(() => {
                emailInput.setCustomValidity(t("PasswordRecover.No employees with such email!"));
                emailInput.reportValidity();
            });
        }
    }

    const checkConfirmationCodeHandler = () => {
        let codeInput = document.getElementById("temp-confirm-code");
        
        if (confirmationCode.trim() === '' || confirmationCode.trim().length < 6){
            codeInput.setCustomValidity(t("PasswordRecover.Confirmation code must have 6 numbers"));
            codeInput.reportValidity();
        }
        else {
            axios.post(`${keys.ServerConnection}/Auth/ConfirmEmailByCode`, {email, confirmationCode})
            .then(() => {
                setIsCodeValid(true);
            })
            .catch(() => {
                codeInput.setCustomValidity(t("PasswordRecover.Wrong confirmation code!"));
                codeInput.reportValidity();
            });
        }
    }

    const setPasswordOnNewHandler = () => {
        let newPasswordInput = document.getElementById("new-password-recover");
        let newPasswordConfirmInput = document.getElementById("new-password-confirm-recover");
        
        if (newPassword.trim() === '' || newPassword.trim().length < 8){
            newPasswordInput.setCustomValidity(t("PasswordRecover.Password can't have less than 8 symbols"));
            newPasswordInput.reportValidity();
        }
        else if (confirmNewPassword !== newPassword){
            newPasswordConfirmInput.setCustomValidity(t("PasswordRecover.Password and it's confirmation is not the same!"));
            newPasswordConfirmInput.reportValidity();
        }
        else {
            axios.post(`${keys.ServerConnection}/Auth/setPassword`, {email, newPassword})
            .then(() => {
                setIsPasswordRecovered(true);
                
                let header = document.getElementById("recover-password-header");
                header.style.backgroundColor = "green";
                header.style.color = "white";
                header.innerHTML = t("PasswordRecover.Password recovered");
            })
            .catch(() => {
                newPasswordInput.setCustomValidity(t("PasswordRecover.Password is invalid"));
                newPasswordInput.reportValidity();
            });
        }
    }

    return(
        <div className="PasswordRecoveryContainer">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header" id="recover-password-header">{t("PasswordRecover.Recover password")}</div>
                            <div className="card-body">
                                {
                                    !isEmailValid && !isCodeValid && !isPasswordRecovered
                                    &&
                                    <div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" placeholder={t("PasswordRecover.Enter your email address")}  value={email} onChange={(event) => setEmail(event.target.value)} id="email-recover-password"/>
                                        </div>
                                        <button type="button" className="btn btn-primary" onClick={sendCodeToEmailHandler}>{t("PasswordRecover.Send code")}</button>
                                        <a href="/login" className="btn btn-secondary">{t("PasswordRecover.Back to login page")}</a>
                                    </div>
                                }
                                {
                                    isEmailValid && !isCodeValid
                                    &&
                                    <div>
                                        <h6>{t("PasswordRecover.We have sent confirmation code to your email, please enter that code here")}</h6>
                                        <br />
                                        <div className="form-group">
                                            <label>{t("PasswordRecover.Confirmation code")}</label>
                                            <input type="text" className="form-control" placeholder={t("PasswordRecover.Enter confirmation code")} value={confirmationCode} onChange={(event) => setConfirmationCode(event.target.value)} maxLength={6} id="temp-confirm-code"/>
                                        </div>
                                        <button type="button" className="btn btn-primary" onClick={checkConfirmationCodeHandler}>{t("PasswordRecover.Check code")}</button>
                                        <a href="/login" className="btn btn-secondary">{t("PasswordRecover.Back to login page")}</a>
                                    </div>
                                }
                                {
                                    isCodeValid && !isPasswordRecovered
                                    &&
                                    <div>
                                        <div className="form-group">
                                            <label>{t("PasswordRecover.New password")}</label>
                                            <div style={{position: "relative"}}>
                                                <input type={`${showPassword?"text":"password"}`} className="form-control" placeholder={t("PasswordRecover.Enter your new password")} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} id="new-password-recover"/>
                                                <div style={{position: "absolute", top: "8px", right: "10px"}}>
                                                    <i class={`fa-solid ${showPassword?"fa-eye":"fa-eye-slash"}`} style={{color: "#444", cursor: "pointer"}} onClick={() => setShowPassword(!showPassword)}></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>{t("PasswordRecover.Confirm")}</label>
                                            <div style={{position: "relative"}}>
                                                <input type={`${showConfirmPassword?"text":"password"}`} className="form-control" placeholder={t("PasswordRecover.Confirm your new password")} value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} id="new-password-confirm-recover"/>
                                                <div style={{position: "absolute", top: "8px", right: "10px"}}>
                                                    <i class={`fa-solid ${showConfirmPassword?"fa-eye":"fa-eye-slash"}`} style={{color: "#444", cursor: "pointer"}} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary" onClick={setPasswordOnNewHandler}>{t("PasswordRecover.Send code")}</button>
                                        <a href="/login" className="btn btn-secondary">{t("PasswordRecover.Back to login page")}</a>
                                    </div>
                                }
                                {
                                    isPasswordRecovered
                                    &&
                                    <div>
                                        <div className="d-flex justify-content-center mt-3" style={{width: "100%"}}>
                                            <i className="fa-regular fa-circle-check" style={{fontSize: "102pt", color: "#888"}}></i>
                                        </div>
                                        <h5 className="text-center mt-3" style={{color: "#666"}}>{t("PasswordRecover.Your password has been recovered successfully")}</h5>
                                        <div className="d-flex justify-content-center" style={{width: "100%"}}><a href="/login" className="btn btn-success mt-4" style={{width: "100%", fontSize: "16pt"}}>{t("PasswordRecover.Back to login page")}</a></div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export {PasswordRecover};