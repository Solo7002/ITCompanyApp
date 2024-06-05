import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Login=()=>{
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [username, setUserName] = useState(Cookies.get('username') || '');
    const [password, setPassword] = useState(Cookies.get('password') || '');
    const [errorDisplay, setErrorDisplay] = useState('none');

    const [showPassword, setShowPassword] = useState(false);

    const onClickHandler = async ()=>{
      const rememberMe = document.getElementById("rememberMe").checked;

      if(rememberMe){
        Cookies.set('username', username, { expires: 4 });
        Cookies.set('password', password, { expires: 4 });
      }

      try {
        await signIn({ login: username, password: password });
        navigate("/");
    } catch (e) {
        setPassword('');
        document.getElementById('username').style.border = '1px solid red';
        document.getElementById('password').style.border = '1px solid red';
        setErrorDisplay('block');
    }
    }
    const{t}=useTranslation();
    return(
      <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">{t('login.Log in')}</div>
                        <div className="card-body">
                            <div>
                                <div className="form-group">
                                    <label>{t('login.Username')}:</label>
                                    <input type="text" className="form-control" id="username" name="username" value={username} onChange={(event) => setUserName(event.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>{t('login.Password')}:</label>
                                    <div style={{position: "relative"}}>
                                        <input type={`${showPassword?"text":"password"}`} className="form-control" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                        <div style={{position: "absolute", top: "8px", right: "10px"}}>
                                            <i class={`fa-solid ${showPassword?"fa-eye":"fa-eye-slash"}`} style={{color: "#444", cursor: "pointer"}} onClick={() => setShowPassword(!showPassword)}></i>
                                        </div>
                                    </div>
                                </div>
                                <h5 style={{ display: errorDisplay }} className="login-h5">{t('login.wrong login or password!')}</h5>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label">{t('login.Remember me')}</label>
                                </div>
                                <button type="button" className="btn btn-primary" onClick={onClickHandler}>{t('login.Login')}</button>
                                <a href="/recoverPassword" className="float-right">{t('login.Forgot password?')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{Login};