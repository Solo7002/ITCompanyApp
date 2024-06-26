import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import { useTranslation } from "react-i18next"; 
import { MyStatistics } from "../../Components/UI/MyStatistics/MyStatistics";
import FileUpload from "../../Components/UI/FileUpload/FileUpload.js";
import InputMask from 'react-input-mask';
import Notification from "../../Components/Other/Notification/Notification.js";

import "./Profile.css";

const Profile = () => {
    const { t } = useTranslation(); 
    const { token } = useAuth();
    const { signOut } = useAuth();
    const [employee, setEmployee] = useState({});
    const [user, setUser] = useState({});
    const [department, setDepartment] = useState({});
    const [job, setJob] = useState({});
    const [countTask,setCountTasks]=useState([]);
    const [userImagePath, setUserImagePath] = useState("");
    const [accessLevel, setAccessLevel] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                axios.get(`${keys.ServerConnection}/User/${decoded.nameid}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        res.data.password = '';
                        setUser(res.data);

                        axios.get(`${keys.ServerConnection}/AccessLevel/${res.data.accessLevelId}`, { headers: { Authorization: `Bearer ${token}` }})
                        .then(res => {
                            setAccessLevel(res.data.accessLevelName);
                        });

                    }).catch(err => {
                        if (err.response.status === 401)
                            signOut();
                    });

                axios.get(`${keys.ServerConnection}/Employee/${decoded.nameid}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        res.data.birthDate = res.data.birthDate.substring(0, res.data.birthDate.indexOf('T'));
                        res.data.hireDate = res.data.hireDate.substring(0, res.data.hireDate.indexOf('T'));
                        setEmployee(res.data);

                        axios.get(`${keys.ServerConnection}/Department/${res.data.departmentId}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(res1 => {
                                setDepartment(res1.data);
                            }).catch(err => {
                                if (err.response.status === 401)
                                    signOut();
                            });


                        axios.get(`${keys.ServerConnection}/Job/${res.data.jobId}`, { headers: { Authorization: `Bearer ${token}` } })
                            .then(res1 => {
                                setJob(res1.data);
                            }).catch(err => {
                                if (err.response.status === 401)
                                    signOut();
                            });

                    }).catch(err => {
                        if (err.response.status === 401)
                            signOut();
                    });
                    axios.get(`${keys.ServerConnection}/Employee/getCountTasks/${decoded.nameid}`,{ headers: { Authorization: `Bearer ${token}` } }).then(res=>{
                        setCountTasks(res.data);
                    }).catch(err => {
                        if (err.response.status === 401)
                            signOut();
                    });


            } catch (error) {
                console.log(error);
            }
        }
    }, [token]);


    useEffect(() => {
        setEmployee({
            ...employee,
            photoFile: userImagePath
        });
        document.getElementById("imageUserProfilePhoto").setAttribute("src", `${keys.ServerConnection}/Files/download${userImagePath}`);
    }, [userImagePath])

    const Month=[t("Month.January"),t("Month.February"),t("Month.March"),t("Month.April"),t("Month.May"),t("Month.June"),t("Month.July"),t("Month.August"),t("Month.September"),t("Month.October"),t("Month.November"),t("Month.December"),]
    const inputUserChangeHandler = (event) => {
        event.target.setCustomValidity("");
        const { name, value } = event.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const inputEmployeeChangeHandler = (event) => {
        event.target.setCustomValidity("");
        const { name, value } = event.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };

    const chooseFileHandler = () => {
        document.getElementById("employeePhotoProfile").click();
    }

    const btnClickHandler = async () => {
        const decoded = jwtDecode(token);
        let emailInput = document.getElementById("email-change-profile");
        let phoneInput = document.getElementById("phone-change-profile");
        let loginInput = document.getElementById("login-change-profile");
        let passwordInput = document.getElementById("password-change-profile");
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!re.test(employee.email)){
            emailInput.setCustomValidity(t("profile.errors.wrongEmail"));
            emailInput.reportValidity();
        }
        else if (phoneInput.value.trim().length < 19){
            phoneInput.setCustomValidity(t("profile.errors.wrongPhone"));
            phoneInput.reportValidity();
        }
        else if (user.login.length < 4 || user.login.length > 29){
            loginInput.setCustomValidity(t("profile.errors.wrongLogin"));
            loginInput.reportValidity();
        }
        else if (user.password.trim().length != 0 && user.password.length < 4){
            passwordInput.setCustomValidity(t("profile.errors.wrongPassword"));
            passwordInput.reportValidity();
        }
        else {
            axios.put(`${keys.ServerConnection}/Employee/${decoded.nameid}`, employee,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setShowNotification(true);
            })
            .catch((err) => {
                if (err.response.status === 401)
                    signOut();
                console.log("Error in put: ", err);
            });

            axios.put(`${keys.ServerConnection}/User/${decoded.nameid}`, user,
            { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setShowNotification(true);
            })
            .catch((err) => {
                if (err.response.status === 401)
                    signOut();
                console.log("Error in put: ", err);
            });
        }
    }

    return (
        <div className="profile-page-container">
            <Notification
                show={showNotification}
                setShow={setShowNotification}
                text="Profile updated successfully"
                color="success"
                icon="fa-regular fa-circle-check"
            ></Notification>
            <div className="container rounded bg-white mt-5 mb-5 main-cont">
                <div className="row">
                    <div className="col-lg-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <div id="image-container" className="mt-5">
                                <FileUpload folder="users/images" id="employeePhotoProfile" setFile={setUserImagePath} accept="image/png, image/gif, image/jpeg" display="none"/>
                                <label>
                                    <img id="imageUserProfilePhoto" className="img" width={150} height={150} style={{borderRadius: "50%"}} src={`${keys.ServerConnection}/Files/download${employee.photoFile}`} alt="user"/>
                                    <div id="overlay" onClick={chooseFileHandler}>
                                        <span id="plus">+</span>
                                    </div>
                                </label>
                            </div>
                            <span className="font-weight-bold">{employee.lastName + " " + employee.firstName}</span>
                            <span className="text-black-50">{employee.email}</span>
                        </div>
                    </div>
                    <div className="col-lg-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">{t("profile.settings")}</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.name")}</label>
                                    <input className="form-control" value={employee.firstName} readOnly={true} />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.surname")}</label>
                                    <input className="form-control" value={employee.lastName} readOnly={true} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">{t("profile.birthdate")}</label>
                                    <input className="form-control" value={employee.birthDate} readOnly={true} />
                                </div>
                                <div className="col-md-12 mt-1">
                                    <label className="labels">{t("profile.email")}</label>
                                    <input type="email" className="form-control" name="email" maxLength="24" value={employee.email} onChange={inputEmployeeChangeHandler} id="email-change-profile"/>
                                </div>
                                <div className="col-md-12 mt-1">
                                    <label className="labels">{t("profile.phone")}</label>
                                    <InputMask mask="+38 (099) 999-99-99" maskChar=" " type="tel" className="form-control" value={employee.phoneNumber} name="phoneNumber" onChange={inputEmployeeChangeHandler}   id="phone-change-profile"/>
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">{t("profile.userInformation")}</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.login")}</label>
                                    <input type="text" className="form-control" name="login" value={user.login} onChange={inputUserChangeHandler} id="login-change-profile"/>
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.password")}</label>
                                    <input type="password" className="form-control" placeholder={t("profile.enterPassword")} name="password" value={user.password} onChange={inputUserChangeHandler} id="password-change-profile"/>
                                </div>
                                <div className="col-md-12 mt-3">
                                    <label className="labels">{t("profile.accessLevel")}</label>
                                    <input type="text" className="form-control" readOnly={true} value={accessLevel}/>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <button className="btn btn-success" type="button" onClick={btnClickHandler}>{t("profile.saveChanges")}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">{t("profile.workInfo")}</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">{t("profile.department")}</label>
                                    <input type="text" className="form-control" value={department.departmentName} readOnly={true} />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">{t("profile.job")}</label>
                                    <input className="form-control" value={job.jobName} readOnly={true} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.hireDate")}</label>
                                    <input className="form-control" value={employee.hireDate} readOnly={true} />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">{t("profile.salary")}</label>
                                    <input className="form-control" value={employee.salary + " $"} readOnly={true} />
                                </div>
                            </div>
                            <hr />
                            <div className="row mt-3" id="statistick">
                               <MyStatistics labels={Month} label={t('profile.Tasks')} text={t('profile.Completedtasks')} data={countTask} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export { Profile };

