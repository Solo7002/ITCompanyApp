import axios from "axios";
import { useEffect, useState } from "react";
import keys from "../../../config/keys";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import DateReduction from "../../../Function/DateReduction";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import FileUpload from "../../../Components/UI/FileUpload/FileUpload";
import InputMask from 'react-input-mask';

import "./UpdateEmployee.css";

const UpdateEmployee = () => {
    const { t } = useTranslation();
    const { token, signOut } = useAuth();
    const { id } = useParams();
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployee] = useState();
    const [photoFile, setPhotoFile] = useState("");
    const navigate = useNavigate();

    const fetchEmployee = async () => {
        try {
            await axios.get(`${keys.ServerConnection}/Employee/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res =>{
                setEmployee({ ...res.data, birthDate: DateReduction(res.data.birthDate) });

                axios.get(`${keys.ServerConnection}/Department/${res.data.departmentId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res2 => {
                    document.getElementById("update-employee-form").department.value = res2.data.departmentName;
                });

                axios.get(`${keys.ServerConnection}/Job/${res.data.jobId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res2 => {
                    document.getElementById("update-employee-form").job.value = res2.data.jobName;
                });

                setPhotoFile(res.data.photoFile);
            })
            .catch(err => {
                if (err.response.status === 401) signOut();
            });

            await axios.get(`${keys.ServerConnection}/Department`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setDepartments(res.data))
                .catch(err => {
                    if (err.response.status === 401) signOut();
                });

            await axios.get(`${keys.ServerConnection}/Job`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setJobs(res.data))
                .catch(err => {
                    if (err.response.status === 401) signOut();
                });

        } catch (error) {
            console.log(error);
        }
    };
    
    const setInputAsInvalid = (el) => {
        (el.nextElementSibling? el.nextElementSibling : el.parentElement.nextElementSibling).style.display = "block";
        el.style.border = "1px solid red";
        el.focus();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        
        const form = event.target;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        Array.from(document.getElementById("update-employee-form").children).forEach(el => {
            if (!el.classList.contains("update-employee-page-buttons-div")){
                el.lastElementChild.style.display = "none";
                if (el.children[1].classList.contains("form-control")){
                    el.children[1].style.border = "";
                }
                else {
                    el.children[1].firstElementChild.style.border = "";
                }
            }
        });

        if (form.lastname.value.trim() == '' || form.lastname.value.length < 3 || form.lastname.value.length > 30){
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
        else if (departments.filter(d => d.departmentName == form.department.value).length == 0){
            setInputAsInvalid(form.department);
        }
        else if (jobs.filter(j => j.jobName == form.job.value).length == 0){
            setInputAsInvalid(form.job);
        }
        else if (photoFile.trim() == ''){
            setInputAsInvalid(document.getElementById("employeeCreatePhoto"));
        }
        else {
            const departmentId = departments.find(dep => dep.departmentName === form.department.value).departmentId;
            const jobId = jobs.find(jb => jb.jobName === form.job.value).jobId;
            axios.put(`${keys.ServerConnection}/Employee/${id}`,
                {
                    LastName: employee.lastName,
                    PhotoFile: photoFile,
                    FirstName: employee.firstName,
                    BirthDate: employee.birthDate,
                    PhoneNumber: employee.phoneNumber,
                    Email: employee.email,
                    Salary: employee.salary,
                    DepartmentId: departmentId,
                    JobId: jobId,
                }, { headers: { Authorization: `Bearer ${token}` } }
            ).then(() => {
                navigate('/employees');
            }).catch(err => {
                if (err.response && err.response.status === 401){
                    signOut();
                }
            });
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [token]);

    return (
        employee &&
        <div className="container mt-5 update-employee-page-container">
            <div className="form-container mx-auto">
                <h2 className="form-header text-center">{t("employees.update.Title")}</h2>
                <form onSubmit={submitHandler} id="update-employee-form">
                    <div className="form-group">
                        <label>{t("employees.update.Lastname")}</label>
                        <input type="text" className="form-control" value={employee.lastName} onChange={(event) => setEmployee({ ...employee, lastName: event.target.value })} name="lastname" placeholder={t("employees.update.InputLastname")} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Firstname")}</label>
                        <input type="text" className="form-control" value={employee.firstName} onChange={(event) => setEmployee({ ...employee, firstName: event.target.value })} name="firstname" placeholder={t("employees.update.InputFirstname")} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Birthdate")}</label>
                        <input type="date" className="form-control" name="birthdate" placeholder={t("employees.create.InputBirthdate")} max={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0]} value={employee.birthDate} onChange={(event) => setEmployee({ ...employee, birthDate: event.target.value })}/>
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.PhoneNumber")}</label>
                        <InputMask mask="+38 (099) 999-99-99" maskChar=" " type="text" className="form-control" name="phone" placeholder={t("employees.create.InputPhoneNumber")} value={employee.phoneNumber} onChange={(event) => setEmployee({ ...employee, phoneNumber: event.target.value })} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={employee.email} onChange={(event) => setEmployee({ ...employee, email: event.target.value })} name="email" placeholder={t("employees.update.InputEmail")} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Salary")}</label>
                        <input type="number" min={1} className="form-control" value={employee.salary} onChange={(event) => setEmployee({ ...employee, salary: event.target.value })} name="salary" placeholder={t("employees.update.InputSalary")} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Department")}</label>
                        <SelectSearch placeholder={t("employees.update.InputDepartment")} name='department' options={departments.map(department => department.departmentName)} id='departmentSearch' />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Job")}</label>
                        <SelectSearch placeholder={t("employees.update.InputJob")} name='job' id='jobSearch' options={jobs.map(job => job.jobName)} />
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.PhotoFile")}</label>
                        <FileUpload folder="users/images" id="employeePhotoProfile" setFile={setPhotoFile} accept="image/png, image/gif, image/jpeg" className="form-control" required={false}/>
                        <small>{t("employees.errors.wrongLogin")}</small>
                    </div>
                    <div className="update-employee-page-buttons-div">
                        <button type="submit" className="btn btn-success">{t("employees.update.Update")}</button>
                        <button type="button" className="btn btn-dark" onClick={() => navigate(-1)}>{t("employees.update.Back")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { UpdateEmployee };
