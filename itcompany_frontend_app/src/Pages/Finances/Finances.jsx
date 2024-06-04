import { useTranslation } from "react-i18next";
import "./Finances.css";
import { MyStatistics } from "../../Components/UI/MyStatistics/MyStatistics";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import keys from "../../config/keys";

const Finances = () => {
    const { t } = useTranslation();
    const { signOut } = useAuth();
    const { token } = useAuth();
    const[countNewEmployeesInYear,setCountNewEmployeesInYear]=useState([]);
    const[countFireEmployeesInYear,setCountFireEmployeesInYear]=useState([]);
    const[countEmployees,setCountEmployees]=useState();
    const[salaryInYear,setsalaryInYear]=useState([]);
    const[taskInYear,setTaskInYear]=useState([]);
    const[projectInYear,setProjectInYear]=useState([]);
    const[averageSalary,setAverageSalary]=useState();
    const[averageSalaryInDepartment,setAverageSalaryInDepartment]=useState();
    const[averageSalaryInJob,setAverageSalaryInJob]=useState();
    useEffect(()=>{
        axios.get(`${keys.ServerConnection}/Employee/getCountEmployees`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setCountEmployees(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getNewEmployees`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setCountNewEmployeesInYear(res.data);
            
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getFireEmployeesInYear`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setCountFireEmployeesInYear(res.data);
            
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getMonthlyExpensesInYear`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setsalaryInYear(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Task/getCompliteTaskInYear`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setTaskInYear(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Project/getProjectInYear`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setProjectInYear(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Employee/getAvarageSalary`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setAverageSalary(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        axios.get(`${keys.ServerConnection}/Department/getAverageSalaryInDepartment`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setAverageSalaryInDepartment(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });

        axios.get(`${keys.ServerConnection}/Job/getAverageSalaryInJob`, { headers: { Authorization: `Bearer ${token}` } }).then(res=>{
            setAverageSalaryInJob(res.data);
            console.log(res.data);
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
    },[token]);
    const Month=[t("Month.January"),t("Month.February"),t("Month.March"),t("Month.April"),t("Month.May"),t("Month.June"),t("Month.July"),t("Month.August"),t("Month.September"),t("Month.October"),t("Month.November"),t("Month.December"),]


    return (
        <div className="financesContainer">
            <h1 className="text-center my-5">Finances</h1>
            <div className="contents">
                <div className="tasks-container">
                    <div className="tasks-header">
                        <h2>{t("Statistic.EmployeesStatistic")}</h2>
                    </div>
                    {
                        countEmployees&&
                    <div className="tasks-info">
                        <div className="task-item">
                            <h3 id="total-tasks">{countEmployees.allEmployee}</h3>
                            <p>{t("Statistic.TotalEmployee")}</p>
                        </div>
                        <div className="task-item">
                            <h3 id="pending-tasks">{countEmployees.notFireEmployee}</h3>
                            <p>{t("Statistic.NotFireEmployee")}</p>
                        </div>
                        <div className="task-item">
                            <h3 id="completed-tasks">{countEmployees.fireEmployee}</h3>
                            <p>{t("Statistic.FireEmployee")}</p>
                        </div>
                        
                    </div>
                    }
                </div>
                {
                    countNewEmployeesInYear&&
                <div className="statistic-container">
                    <MyStatistics data={countNewEmployeesInYear} backgroundColor='rgb(34, 139, 34)' label={t("Statistic.Employees")} borderColor='rgb(0, 160, 0)' text={t("Statistic.NewEmployeesPerYear")} labels={Month} />
                </div>
                }
                {
                    countFireEmployeesInYear&&
                <div className="statistic-container">
                    <MyStatistics data={countFireEmployeesInYear} backgroundColor='rgb(255, 0, 0)' label={t("Statistic.Employees")} borderColor='rgb(225, 0, 0)' text={t("Statistic.FiredEmployeesPerYear")} labels={Month} />
                </div>
                }
                {salaryInYear&&
                <div className="statistic-container">
                    <MyStatistics data={salaryInYear} backgroundColor='rgb(34, 139, 34)' label={t("Statistic.Money")} borderColor='rgb(0, 160, 0)' text={t("Statistic.SalariesPerYear")} labels={Month} />
                </div>
                }
                {taskInYear&&
                <div className="statistic-container">
                    <MyStatistics data={taskInYear}  label={t("Statistic.Tasks")}  text={t("Statistic.CompletedTasksForTheYear")} labels={Month} />
                </div>
                }
                {projectInYear&&
                <div className="statistic-container">
                    <MyStatistics data={projectInYear} backgroundColor='rgb(34, 139, 34)' label={t("Statistic.Projects")} borderColor='rgb(0, 160, 0)' text={t("Statistic.CompletedProjectsForTheYear")} labels={Month} />
                </div>
                }
                <div className="tasks-container">
                    <div className="tasks-header">
                        <h2>{t("Statistic.AverageSalary")}</h2>
                    </div>
                    <div className="tasks-info">
                        <div className="task-item">

                           {
                            averageSalary&&
                            <h3 id="total-tasks">{averageSalary}</h3>}
                            <p>{t("Statistic.AverageSalary")}</p>
                        </div>
                    </div>
                </div>
                {averageSalaryInDepartment&&
                <div className="statistic-container">
                    <MyStatistics data={averageSalaryInDepartment.map(d=>d.averageSalary)} backgroundColor='rgb(190, 7, 152)' label={t("Statistic.Money")} borderColor='rgb(247, 19, 199)' text={t("Statistic.AverageSalaryInDepartment")} labels={averageSalaryInDepartment.map(d=>d.nameDepartment)} />
                </div>
                }
                {averageSalaryInJob&&
                <div className="statistic-container">
                    <MyStatistics data={averageSalaryInJob.map(j=>j.averageSalary)} backgroundColor='rgb(11, 94, 227)' label={t("Statistic.Money")} borderColor='rgb(77, 142, 247)' text={t("Statistic.AverageSalaryInJob")} labels={averageSalaryInJob.map(j=>j.nameJob)} />
                </div>
                }
            </div>
        </div>
    )
};

export { Finances };