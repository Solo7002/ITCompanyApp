import { useEffect, useState } from "react";
import "./Home.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import { useTranslation } from "react-i18next";
const Home = () => {
    const { token } = useAuth();
    const { signOut } = useAuth();
    const { t } = useTranslation();
    const [avarageScore, setAvarageScore] = useState();
    const [employeesDepartment, setEmployeesDepartments] = useState([]);
    const [employeesAll, setEmployeesAll] = useState([]);
    const [MyId, setMyId] = useState();
    const [birthdayEmployes, setBirthdayEmployees] = useState([]);
    const[amountTasks,setAmountTasks]=useState();
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

    }, [token])
    console.log(token);
    const handlerInfo = () => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded);


            } catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <div classNameName="homeContainer">
            <h1>{t("Home.Home")}</h1>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="review-container text-center">
                            <h1>{t("Home.AverageText")}</h1>
                            <div className="rating-block">
                                <i className="fas fa-star"></i>
                                <span id="average-score">{avarageScore}</span>
                            </div>
                        </div>
                        <br />
                        <div className="birthday-container ">
                            <h2>{t('Home.BirthdayIsComing')}</h2>
                            <ul className="birthday-list">
                                {
                                    birthdayEmployes &&
                                    birthdayEmployes.map((employee, index) => {
                                        return (
                                            <li className="birthday-item" key={index}>
                                                <span>{employee.name}</span>
                                                <span className="birthday-date">{employee.birthdate}</span>
                                            </li>)
                                    })
                                }


                            </ul>
                        </div>
                    </div>

                    <div >
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
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{t('Home.EmployeesByRating')}</h5>
                                        <div className="employee-list">
                                            {
                                                employeesDepartment &&
                                                employeesDepartment.map((employee, index) => {
                                                    return (
                                                        <div className={`employee-item ${employee.id == MyId ? 'meEmployee' : ''}`}>
                                                            <span>{index + 1}</span>
                                                            <div className="employee-name">{employee.name}</div>
                                                            <div className="employee-rating">
                                                                <i className="fas fa-star"></i>
                                                                <span>{employee.averageFeedback}</span>
                                                            </div>
                                                        </div>)
                                                })

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="employeeAll" role="tabpanel" aria-labelledby="feedbacks-tab">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{t('Home.EmployeesByRating')}</h5>
                                        <div className="employee-list">

                                            {
                                                employeesAll &&
                                                employeesAll.map((employee, index) => {
                                                    return (
                                                        <div className={`employee-item ${employee.id == MyId ? 'meEmployee' : ''}`}>
                                                            <span>{index + 1}</span>
                                                            <div className="employee-name">{employee.name}</div>
                                                            <div className="employee-rating">
                                                                <i className="fas fa-star"></i>
                                                                <span>{employee.averageFeedback}</span>
                                                            </div>
                                                        </div>)
                                                })

                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        
                    </div>
                    <div className="tasks-container">
                            <div className="tasks-header">
                                <h2>{t("Home.TaskOverview")}</h2>
                            </div>
                            {amountTasks&&
                            <div className="tasks-info">
                                <div className="task-item">
                                    <h3 id="total-tasks">{amountTasks.allTask}</h3>
                                    <p>{t("Home.TotalTasks")}</p>
                                </div>
                                <div className="task-item">
                                    <h3 id="completed-tasks">{amountTasks.doneTask}</h3>
                                    <p>{t("Home.CompletedTasks")}</p>
                                </div>
                                <div className="task-item">
                                    <h3 id="pending-tasks">{amountTasks.unDoneTask}</h3>
                                    <p>{t("Home.CurrentTasks")}</p>
                                </div>
                            </div>}

                        </div>
                    
                </div>
                
            </div>

        </div>
    )
};

export { Home };