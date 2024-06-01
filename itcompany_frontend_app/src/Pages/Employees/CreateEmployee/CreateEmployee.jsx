
import { useEffect, useState } from "react";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import "./CreateEmployee.css";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import keys from "../../../config/keys";
import {  useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateEmployee = () => {

    const{t}=useTranslation();

    const navigate=useNavigate();
    const {token}=useAuth();
    const [jobs,setJobs]=useState([]);
    const [departments,setDepartments]=useState([]);
    const [accessLevels,setAccessLevels]=useState([]);
    const [errorInfo, setErrorInfo] = useState({
        accessLevelDisplay: 'none',
        departmentDisplay: 'none',
        jobsDisplay: 'none'
    });
    const [errors,setErrors]=useState();
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
    const {signOut}=useAuth();
    const submitHandler=(event)=>{
        event.preventDefault();
        const form=event.target;
        const departmentExists = departments.includes(form.department.value);
        const accessLevelExists = accessLevels.includes(form.accessLevel.value);
        const jobExists = jobs.includes(form.job.value);

        setErrorInfo({
            departmentDisplay: !departmentExists ? 'block' : 'none',
            accessLevelDisplay: !accessLevelExists ? 'block' : 'none',
            jobsDisplay: !jobExists ? 'block' : 'none'
        });
        if (departmentExists && accessLevelExists && jobExists){
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
                PhotoFile:'',
                Salary:form.salary.value,
                DepartmentName:form.department.value,
                JobName:form.job.value,
                RoleName:form.accessLevel.value
            }
        ).then(res=>{
            console.log(res);
            navigate('/employees');
            
        }).catch(err=>{
           
                if(err.response.status===401)
                    signOut();
            
            if(err.response.data.errors!=null){
                const errorMessages = Object.values(err.response.data.errors)
                .flatMap(errorArray => errorArray.map(errorMessage => errorMessage));
            setErrors(errorMessages);
            }
            else{
                setErrors([err.response.data]);
            }
            
        console.log();
        })}
    }
    return (


        <div className="container mt-5">
            <div className="form-container  mx-auto">
                <h2 className="form-header text-center">{t("employees.create.Title")} </h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label >{t("employees.create.Login")}</label>
                        <input type="text" className="form-control"   name="login" placeholder={t("employees.create.InputLogin")} />
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Password")}</label>
                        <input type="password"  className="form-control"   name="password" placeholder={t("employees.create.InputPassword")} />
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.ConfirmPassword")}</label>
                        <input type="password"  className="form-control"   name="confirmPassword" placeholder={t("employees.create.InputConfirmPassword")} />
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Lastname")}</label>
                        <input type="text"  className="form-control"   name="lastname" placeholder={t("employees.create.InputLastname")}/>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Firstname")}</label>
                        <input type="text"  className="form-control"   name="firstname" placeholder={t("employees.create.InputFirstname")} />
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Birthdate")}</label>
                        <input type="date" className="form-control"   name="birthdate" placeholder={t("employees.create.InputBirthdate")} />
                    </div>

                    <div className="form-group">
                        <label >{t("employees.create.PhoneNumber")}</label>
                        <input type="text"  className="form-control"   name="phone" placeholder={t("employees.create.InputPhoneNumber")}/>
                    </div>
                    <div className="form-group">
                        <label >Email</label>
                        <input type="email"  className="form-control"   name="email" placeholder={t("employees.create.InputEmail")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.create.Salary")}</label>
                        <input type="number" min={1}  className="form-control"   name="salary" placeholder={t("employees.create.InputSalary")} />
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.Department")}</label>
                        <SelectSearch placeholder={t("employees.create.InputDepartment")} name='department' options={departments} id='departmentSearch' />
                        <h5 style={{color: "red", marginLeft: "5px", display: errorInfo.departmentDisplay}}>* {t("employees.create.NoDepartment")}</h5>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.AccessLevel")}</label>
                        <SelectSearch placeholder={t("employees.create.InputAccessLevel")} name='accessLevel' id='accessLevelSearch' options={accessLevels} />
                        <h5 style={{color: "red", marginLeft: "5px", display: errorInfo.accessLevelDisplay}}>* {t("employees.create.NoAccessLevel")}</h5>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.create.Job")}</label>
                        <SelectSearch placeholder={t("employees.create.InputJob")} name='job' id='jobSearch' options={jobs} />
                        <h5 style={{color: "red", marginLeft: "5px", display: errorInfo.jobsDisplay}}>* {t("employees.create.NoJob")}</h5>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.PhotoFile")}</label>
                        <input type="file"  className="form-control"   name="file" placeholder={t("employees.create.InputPhoto")}  accept="image/jpeg,image/png,image/gif" />
                    </div>
                    
                    
                        
                        {
                        errors != null && errors.map((error, index) => (
                           
                            <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                        ))}
                    
                    <div>
                    <button type="submit" className="btn btn-success">{t("employees.create.btnCreate")}</button>
                    <button type="submit" className="btn btn-dark" onClick={()=>{
                        navigate(-1);
                    }}>{t("employees.create.btnBack")}</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export { CreateEmployee };