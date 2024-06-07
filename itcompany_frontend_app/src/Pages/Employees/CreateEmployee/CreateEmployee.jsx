import { useEffect, useState } from "react";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import keys from "../../../config/keys";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FileUpload from "../../../Components/UI/FileUpload/FileUpload";
import InputMask from 'react-input-mask';

import "./CreateEmployee.css";

const CreateEmployee = () => {
    const {token, signOut}=useAuth();
    const{t}=useTranslation();

    const navigate=useNavigate();
    const [jobs,setJobs]=useState([]);
    const [departments,setDepartments]=useState([]);
    const [accessLevels,setAccessLevels]=useState([]);
    const [photoFile, setPhotoFile] = useState("");

    useEffect(()=>{
        try {
            axios.get(`${keys.ServerConnection}/AccessLevel`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                setAccessLevels(res.data.map(item=>item.accessLevelName));
            });//request get access levels

             axios.get(`${keys.ServerConnection}/Department`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                setDepartments(res.data.map(item=>item.departmentName));
            })//request get departments

            axios.get(`${keys.ServerConnection}/Job`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                setJobs(res.data.map(item=>item.jobName));
            })//request get jobs
        } catch (error) {
            console.log(error);
        }
    },[token]);
    
    const setInputAsInvalid = (el) => {
        (el.nextElementSibling? el.nextElementSibling : el.parentElement.nextElementSibling).style.display = "block";
        el.style.border = "1px solid red";
        el.focus();
    }

    const submitHandler=(event)=>{
        event.preventDefault();
        
        const form = event.target;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        Array.from(document.getElementById("create-employee-form").children).forEach(el => {
            if (!el.classList.contains("create-employee-page-buttons-div")){
                el.lastElementChild.style.display = "none";
                if (el.children[1].classList.contains("form-control")){
                    el.children[1].style.border = "";
                }
                else {
                    el.children[1].firstElementChild.style.border = "";
                }
            }
        });

        if (form.login.value.trim() == '' || form.login.value.length < 4){
            setInputAsInvalid(form.login);
        }
        else if (form.password.value.trim() == '' || form.password.value.length < 8){
            setInputAsInvalid(form.password);
        }
        else if (form.confirmPassword.value != form.password.value){
            setInputAsInvalid(form.confirmPassword);
        }
        else if (form.lastname.value.trim() == '' || form.lastname.value.length < 3 || form.lastname.value.length > 30){
            setInputAsInvalid(form.lastname);
        }
        else if (form.firstname.value.trim() == '' || form.firstname.value.length < 3 || form.firstname.value.length > 30){
            setInputAsInvalid(form.firstname);
        }
        else if (form.birthdate.value.trim() == '' || (new Date(form.birthdate.value)) > (new Date((new Date()).getFullYear() - 14, (new Date()).getMonth(), (new Date()).getDate()))){
            setInputAsInvalid(form.birthdate);
        }
        else if (form.phone.value.trim().length < 19){
            setInputAsInvalid(form.phone);
        }
        else if (!re.test(form.email.value)){
            setInputAsInvalid(form.email);
        }
        else if (form.salary.value.trim() == '' || parseFloat(form.salary.value)<1){
            setInputAsInvalid(form.salary);
        }
        else if (departments.filter(d => d == form.department.value).length == 0){
            setInputAsInvalid(form.department);
        }
        else if (jobs.filter(j => j == form.job.value).length == 0){
            setInputAsInvalid(form.job);
        }
        else if (accessLevels.filter(al => al == form.accessLevel.value).length == 0){
            setInputAsInvalid(form.accessLevel);
        }
        else if (photoFile.trim() == ''){
            setInputAsInvalid(document.getElementById("employeeCreatePhoto"));
        }
        else {
            axios.post(`${keys.ServerConnection}/Auth/register`,    
            {
                Login:form.login.value,
                Password:form.password.value,
                ConfirmPassword:form.confirmPassword.value,
                LastName:form.lastname.value,
                FirstName:form.firstname.value,
                BirthDate:form.birthdate.value,
                PhoneNumber:form.phone.value,
                Email:form.email.value,
                PhotoFile:photoFile,
                Salary:form.salary.value,
                DepartmentName:form.department.value,
                JobName:form.job.value,
                RoleName:form.accessLevel.value
            })
            .then(res=>{
                console.log(res);
                navigate('/employees');

            }).catch(err=>{
               if(err.response && err.response.status===401){
                signOut();
               }
            })
        }
    }

    return (
        <div className="container mt-5 create-employee-page-container">
            <div className="form-container  mx-auto">
                <h2 className="form-header text-center">{t("employees.create.Title")} </h2>
                <form onSubmit={submitHandler} id="create-employee-form">
                    <div className="form-group">
                        <label>{t("employees.create.Login")}</label>
                        <input type="text" className="form-control" name="login" placeholder={t("employees.create.InputLogin")} id="login-create-employee"/>
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Password")}</label>
                        <input type="password"  className="form-control"   name="password" placeholder={t("employees.create.InputPassword")} />
                        <small>{t("employees.errors.wrongPassword")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.ConfirmPassword")}</label>
                        <input type="password"  className="form-control"   name="confirmPassword" placeholder={t("employees.create.InputConfirmPassword")} />
                        <small>{t("employees.errors.wrongConfirmPassword")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Lastname")}</label>
                        <input type="text"  className="form-control"   name="lastname" placeholder={t("employees.create.InputLastname")}/>
                        <small>{t("employees.errors.wrongLastname")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Firstname")}</label>
                        <input type="text"  className="form-control"   name="firstname" placeholder={t("employees.create.InputFirstname")} />
                        <small>{t("employees.errors.wrongFirstname")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Birthdate")}</label>
                        <input type="date" className="form-control" name="birthdate" placeholder={t("employees.create.InputBirthdate")} max={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0]}/>
                        <small>{t("employees.errors.wrongBirthdate")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.create.PhoneNumber")}</label>
                        <InputMask mask="+38 (099) 999-99-99" maskChar=" " type="text" className="form-control" name="phone" placeholder={t("employees.create.InputPhoneNumber")}/>
                        <small>{t("employees.errors.wrongPhone")}</small>
                    </div>
                    <div className="form-group">
                        <label >Email</label>
                        <input type="email"  className="form-control"   name="email" placeholder={t("employees.create.InputEmail")} />
                        <small>{t("employees.errors.wrongEmail")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.create.Salary")}</label>
                        <input type="number" min={1}  className="form-control" name="salary" placeholder={t("employees.create.InputSalary")} />
                        <small>{t("employees.errors.wrongSalary")}</small>
                    </div>
                    <div className="form-group ">
                        <label >{t("employees.create.Department")}</label>
                        <SelectSearch placeholder={t("employees.create.InputDepartment")} name='department' options={departments} id='departmentSearch' />
                        <small>{t("employees.errors.wrongDepartment")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.create.Job")}</label>
                        <SelectSearch placeholder={t("employees.create.InputJob")} name='job' id='jobSearch' options={jobs} />
                        <small>{t("employees.errors.wrongJob")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.AccessLevel")}</label>
                        <SelectSearch placeholder={t("employees.create.InputAccessLevel")} name='accessLevel' id='accessLevelSearch' options={accessLevels}/>
                        <small>{t("employees.errors.wrongAccessLevel")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.PhotoFile")}</label>
                        <FileUpload folder="users/images" id="employeeCreatePhoto" setFile={setPhotoFile} accept="image/png, image/gif, image/jpeg" className="form-control" required={false}/>
                        <small>{t("employees.errors.wrongPhotofile")}</small>
                    </div>
                    <div className="form-group create-employee-page-buttons-div">
                        <button type="submit" className="btn btn-success">{t("employees.create.btnCreate")}</button>
                        <button type="submit" className="btn btn-dark" onClick={()=>{ navigate(-1); }}>{t("employees.create.btnBack")}</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export { CreateEmployee };