import axios from "axios";
import { useEffect, useState } from "react";
import keys from "../../../config/keys";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import DateReduction from "../../../Function/DateReduction";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import FileUpload from "../../../Components/UI/FileUpload/FileUpload";

const UpdateEmployee = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployee] = useState();
    const [errorInfo, setErrorInfo] = useState({
        departmentDisplay: 'none',
        jobsDisplay: 'none'
    });
    const [errors, setErrors] = useState();
    const { signOut } = useAuth();
    const [photoFile, setPhotoFile] = useState("");

    const fetchEmployee = async () => {
        try {
            await axios.get(`${keys.ServerConnection}/Employee/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res =>{
                    setEmployee({ ...res.data, birthDate: DateReduction(res.data.birthDate) });
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

    const submitHandler = (event) => {
        event.preventDefault();
        const form = event.target;
        const departmentExists = departments.some(dep => dep.departmentName === form.department.value);
        const jobExists = jobs.some(job => job.jobName === form.job.value);
        setErrorInfo({
            departmentDisplay: !departmentExists ? 'block' : 'none',
            jobsDisplay: !jobExists ? 'block' : 'none'
        });
        if (departmentExists && jobExists) {
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
            ).then(res => {
                navigate('/employees');
            }).catch(err => {
                if (err.response.status === 401) signOut();
                if (err.response.data.errors != null) {
                    const errorMessages = Object.values(err.response.data.errors)
                        .flatMap(errorArray => errorArray.map(errorMessage => errorMessage));
                    setErrors(errorMessages);
                } else {
                    setErrors([err.response.data]);
                }
            });
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [token]);

    return (
        employee &&
        <div className="container mt-5">
            <div className="form-container mx-auto">
                <h2 className="form-header text-center">{t("employees.update.Title")}</h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>{t("employees.update.Lastname")}</label>
                        <input type="text" className="form-control" value={employee.lastName} onChange={(event) => setEmployee({ ...employee, lastName: event.target.value })} name="lastname" placeholder={t("employees.update.InputLastname")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Firstname")}</label>
                        <input type="text" className="form-control" value={employee.firstName} onChange={(event) => setEmployee({ ...employee, firstName: event.target.value })} name="firstname" placeholder={t("employees.update.InputFirstname")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Birthdate")}</label>
                        <input type="date" className="form-control" value={employee.birthDate} onChange={(event) => setEmployee({ ...employee, birthDate: event.target.value })} name="birthdate" placeholder={t("employees.update.InputBirthdate")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.PhoneNumber")}</label>
                        <input type="text" className="form-control" value={employee.phoneNumber} onChange={(event) => setEmployee({ ...employee, phoneNumber: event.target.value })} name="phone" placeholder={t("employees.update.InputPhoneNumber")} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={employee.email} onChange={(event) => setEmployee({ ...employee, email: event.target.value })} name="email" placeholder={t("employees.update.InputEmail")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Salary")}</label>
                        <input type="number" min={1} className="form-control" value={employee.salary} onChange={(event) => setEmployee({ ...employee, salary: event.target.value })} name="salary" placeholder={t("employees.update.InputSalary")} />
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Department")}</label>
                        <SelectSearch placeholder={t("employees.update.InputDepartment")} name='department' options={departments.map(department => department.departmentName)} id='departmentSearch' />
                        <h5 style={{ color: "red", marginLeft: "5px", display: errorInfo.departmentDisplay }}>* {t("employees.update.NoDepartment")}</h5>
                    </div>
                    <div className="form-group">
                        <label>{t("employees.update.Job")}</label>
                        <SelectSearch placeholder={t("employees.update.InputJob")} name='job' id='jobSearch' options={jobs.map(job => job.jobName)} />
                        <h5 style={{ color: "red", marginLeft: "5px", display: errorInfo.jobsDisplay }}>* {t("employees.update.NoJob")}</h5>
                    </div>
                    <div className="form-group">
                        <label >{t("employees.create.PhotoFile")}</label>
                        <FileUpload folder="users/images" id="employeePhotoProfile" setFile={setPhotoFile} accept="image/png, image/gif, image/jpeg" className="form-control" required={false}/>
                    </div>
                    {
                        errors != null && errors.map((error, index) => (
                            <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                        ))
                    }
                    <div>
                        <button type="submit" className="btn btn-success">{t("employees.update.Update")}</button>
                        <button type="button" className="btn btn-dark" onClick={() => navigate(-1)}>{t("employees.update.Back")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { UpdateEmployee };
