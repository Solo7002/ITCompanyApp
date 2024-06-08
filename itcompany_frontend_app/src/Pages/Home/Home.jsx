import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import { useTranslation } from "react-i18next";

import "./Home.css";
const Home = () => {
    const { token } = useAuth();
    const { signOut } = useAuth();
    const { t } = useTranslation();
    const [avarageScore, setAvarageScore] = useState();
    const [employeesDepartment, setEmployeesDepartments] = useState([]);
    const [employeesAll, setEmployeesAll] = useState([]);
    const [MyId, setMyId] = useState();
    const [birthdayEmployes, setBirthdayEmployees] = useState([]);
    const [amountTasks,setAmountTasks]=useState();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const decoded = jwtDecode(token);
        axios.get(`${keys.ServerConnection}/Employee/getAvarageFeedback/${decoded.nameid}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            setAvarageScore(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getEmployeeNameAndFeedback/${decoded.nameid}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            setEmployeesDepartments(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getAllEmployeesNameAndFeedBack`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            setEmployeesAll(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/GetBirthdayIsComingEmployees`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            setBirthdayEmployees(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getInfoTasks/${decoded.nameid}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            setAmountTasks(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        setMyId(decoded.nameid);

        axios.get(`${keys.ServerConnection}/Job`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
            setJobs(res.data);
        }).catch(err => {
            if (err.response && err.response.status === 401){
                signOut();
            }
        });
    }, [token]);

    return (
        <div className="homeContainer">
            <h1 className="text-center mb-5">{t("Home.Home")}</h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="review-container">
                            <h2 className="text-center mb-4">{t("Home.AverageText")}</h2>
                            <div className="rating-block d-flex justify-content-center align-items-center">
                                <i className="fas fa-star"></i>
                                <span id="average-score">{avarageScore}</span>
                            </div>
                        </div>
                        <div className="birthday-container mt-4">
                            <h3 className="text-center mb-3">{t('Home.BirthdayIsComing')}</h3>
                            <ul className="birthday-list">
                                {birthdayEmployes && birthdayEmployes.map((employee, index) => (
                                    <li className="birthday-item" key={index}>
                                        <span>{employee.name}</span>
                                        <span className="birthday-date">{employee.birthdate}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="tasks-container mb-4">
                            <h3 className="text-center">{t("Home.TaskOverview")}</h3>
                            {amountTasks && (
                                <div className="tasks-info">
                                    <div className="task-item">
                                        <h4 id="total-tasks">{amountTasks.allTask}</h4>
                                        <p>{t("Home.TotalTasks")}</p>
                                    </div>
                                    <div className="task-item">
                                        <h4 id="completed-tasks">{amountTasks.doneTask}</h4>
                                        <p>{t("Home.CompletedTasks")}</p>
                                    </div>
                                    <div className="task-item">
                                        <h4 id="pending-tasks">{amountTasks.unDoneTask}</h4>
                                        <p>{t("Home.CurrentTasks")}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nav-container mb-4">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="employees-tab" data-toggle="tab" href="#employees" role="tab" aria-controls="employees" aria-selected="true">{t("Home.Department")}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="employeeAll-tab" data-toggle="tab" href="#employeeAll" role="tab" aria-controls="employeeAll" aria-selected="false">{t("Home.All")}</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="employees" role="tabpanel" aria-labelledby="employees-tab">
                                    <div className="card mt-0">
                                        <div className="card-body">
                                            <h5 className="card-title">{t('Home.EmployeesByRating')}</h5>
                                            <div className="employee-list">
                                                {employeesDepartment && employeesDepartment.map((employee, index) => (
                                                    <div className={`employee-item ${employee.id === MyId ? 'meEmployee' : ''}`} key={index}>
                                                        <span>{index + 1}</span>
                                                        <div className="d-flex justify-content-between col-md-8">
                                                            <div className="employee-name" style={{fontWeight: "500"}}>{employee.name}</div>
                                                            <i className="col-md-5" style={{fontSize: "0.9em"}}>{jobs.filter(j => j.jobId == employee.jobId)[0]?jobs.filter(j => j.jobId == employee.jobId)[0].jobName:""}</i>
                                                        </div>
                                                        <div className="employee-rating">
                                                            <i className="fas fa-star"></i>
                                                            <span>{employee.averageFeedback}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="employeeAll" role="tabpanel" aria-labelledby="employeeAll-tab">
                                    <div className="card mt-0">
                                        <div className="card-body">
                                            <h5 className="card-title">{t('Home.EmployeesByRating')}</h5>
                                            <div className="employee-list">
                                                {employeesAll && employeesAll.map((employee, index) => (
                                                    <div className={`employee-item ${employee.id === MyId ? 'meEmployee' : ''}`} key={index}>
                                                        <span>{index + 1}</span>
                                                        <div className="d-flex justify-content-between col-md-8">
                                                            <div className="employee-name" style={{fontWeight: "500"}}>{employee.name}</div>
                                                            <i className="col-md-5" style={{fontSize: "0.9em"}}>{jobs.filter(j => j.jobId == employee.jobId)[0]?jobs.filter(j => j.jobId == employee.jobId)[0].jobName:""}</i>
                                                        </div>
                                                        <div className="employee-rating">
                                                            <i className="fas fa-star"></i>
                                                            <span>{employee.averageFeedback}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Home };