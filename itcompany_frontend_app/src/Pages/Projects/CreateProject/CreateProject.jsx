import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import keys from "../../../config/keys";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import { useTranslation } from 'react-i18next';
import FileUpload from "../../../Components/UI/FileUpload/FileUpload";

const CreateProject = () => {
    const { t } = useTranslation(); 
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [errors, setErrors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [errorInfo, setErrorInfo] = useState('none');
    const [coverFile, setCoverFile] = useState("");

    const fetchEmployees = async () => {
        const response = await axios.get(`${keys.ServerConnection}/Employee/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => console.log(err));
        const employeesWithFullName = await Promise.all(response.map(async (employee) => {
            return { ...employee, fullName: `${employee.lastName} ${employee.firstName}` };
        })).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        setEmployees(employeesWithFullName);
    }

    useEffect(() => {
        fetchEmployees();
    }, [token]);

    function validateForm(form) {
        console.log(form);
        const newErrors = [];
        if (!form.projectName || !form.projectName.value) {
            newErrors.push(t("projects.create.projectNameRequired"));
        } else if (form.projectName.value.length < 2 || form.projectName.value.length > 50) {
            newErrors.push(t("projects.create.projectNameLength"));
        }
        if (form.description && form.description.value && form.description.value.length > 500) {
            newErrors.push(t("projects.create.descriptionLength"));
        }
        if (!form.deadlineProjectDate || !form.deadlineProjectDate.value) {
            newErrors.push(t("projects.create.deadLineProjectDateRequired"));
        }
        const year = form.deadlineProjectDate.value.split("-")[0];
        if (parseInt(year, 10) > 9999) {
            newErrors.push(t("projects.create.deadlineProjectDateYearLimit"));
        }
        const deadlineDate = new Date(form.deadlineProjectDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadlineDate < today) {
            newErrors.push(t("projects.create.deadlineProjectDatePast"));
        }
        return newErrors;
    }
    
    



    const submitHandler = (event) => {
        event.preventDefault();
        const form = event.target;
        const newErrors = validateForm(form);
        setErrors(newErrors);
        console.log(newErrors);
        if (newErrors.length==0) {
        const fullNameExist = employees.some(item => item.fullName === form.teamLead.value);
        setErrorInfo(!fullNameExist ? 'block' : 'none');
        if (fullNameExist) {
            console.log('ff');
            const employee = employees.find(employee => employee.fullName === form.teamLead.value);
            const id = employee ? employee.id : null;

            axios.post(`${keys.ServerConnection}/Project`, {
                projectName: form.projectName.value,
                description: form.description.value,
                file: coverFile,
                isDone: false,
                deadLineProjectDate: form.deadlineProjectDate.value,
                employeeId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res);
                navigate('/projects');
            }).catch(err => {
                if (err.response.status === 401)
                    signOut();
                if (err.response.data.errors != null) {
                    const errorMessages = Object.values(err.response.data.errors)
                        .flatMap(errorArray => errorArray.map(errorMessage => errorMessage));
                    setErrors(errorMessages);
                }
                else {
                    setErrors([err.response.data]);
                }
            });
        }
    }
    }

    return (
        <div className="projectsContainer">
            <div className="container mt-5">
                <div className="form-container  mx-auto">
                    <h2 className="form-header text-center">{t("projects.create.header")}</h2>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>{t("projects.create.projectName")}</label>
                            <input type="text" className="form-control" name="projectName" placeholder={t("projects.create.projectNamePlaceholder")} />
                        </div>

                        <div className="form-group">
                            <label>{t("projects.create.photoFile")}</label>
                            <FileUpload folder="projects/project_files" setFile={setCoverFile} accept="image/png, image/gif, image/jpeg" className="form-control"/>
                        </div>

                        <div className="form-group">
                            <label>{t("projects.create.deadlineProjectDate")}</label>
                            <input type="date" className="form-control" name="deadlineProjectDate" placeholder={t("projects.create.deadlineProjectDatePlaceholder")} />
                        </div>

                        <div className="form-group">
                            <label>{t("projects.create.teamLead")}</label>
                            <SelectSearch placeholder={t("projects.create.teamLeadPlaceholder")} name="teamLead" options={employees.map(employee => employee.fullName)} id="teamleadtSearch" />
                            <h5 style={{ color: "red", marginLeft: "5px", display: errorInfo }}>{t("projects.create.noTeamLeadError")}</h5>
                        </div>

                        <div className="form-group">
                            <label>{t("projects.create.description")}</label>
                            <textarea type="text" className="form-control" name="description" placeholder={t("projects.create.descriptionPlaceholder")} aria-multiline={3} />
                        </div>

                        <hr />
                        {errors && errors.map((error, index) => (
                            <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                        ))}
                        <div>
                            <button type="submit" className="btn btn-success">{t("projects.create.createButton")}</button>
                            <button type="submit" className="btn btn-dark" onClick={() => { navigate(-1); }}>{t("projects.create.backButton")}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export { CreateProject };
