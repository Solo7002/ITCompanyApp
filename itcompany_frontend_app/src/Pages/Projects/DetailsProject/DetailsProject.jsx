import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './DetailsProject.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import keys from '../../../config/keys';
import DateReduction from '../../../Function/DateReduction';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { resolve } from 'chart.js/helpers';

const DetailsProject = () => {
    const { t } = useTranslation(); 
    const { token } = useAuth();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState();
    const { id } = useParams();
    const [showTasks, setShowTasks] = useState(false);
    const [showEmployees, setShowEmployees] = useState(false);
    const user=jwtDecode(token);
    const fetchProjects = async () => {
        const projectRes =  await axios.get(`${keys.ServerConnection}/Project/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err)
        });

        const employeesRes = await  axios.get(`${keys.ServerConnection}/Project/getEmployeeInProject/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res =>{
           return res.data}).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err)
        });

        const employeesWithJobs =  Promise.all(employeesRes.map(async (employee) => {
            try {
                if (employee.jobId) {
                    const jobRes = await axios.get(`${keys.ServerConnection}/Job/${employee.jobId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).catch(err => {
                        if (err.response.status === 401)
                            signOut();
                    });
                    return { ...employee, jobName: jobRes.data.jobName };
                }
                else {
                    return { ...employee, jobName: 'No job' };
                }
            } catch (error) {
                console.log(error);
            }
        }));

        const tasksRes = await axios.get(`${keys.ServerConnection}/Project/getTasksInProject/${projectRes.projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            return res.data
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err)
        });

         const tasksStatus =  tasksRes.map(task => ({
            ...task, status: task.isDone ? t("projects.details.completed") : t("projects.details.pending")
        }));

        const employeeProjectHead = await axios.get(`${keys.ServerConnection}/Employee/${projectRes.employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err)
        });
        projectRes.startProjectDate = DateReduction(projectRes.startProjectDate);
        projectRes.deadLineProjectDate = DateReduction(projectRes.deadLineProjectDate);
        const status = projectRes.isDone ? t("projects.details.completed") : t("projects.details.pending");

        setProject({
            ...projectRes,
            employees: await employeesWithJobs,
            employeeProjectHead: employeeProjectHead,
            status: status,
            tasks: tasksStatus
        });
    }
    
    const deleteHandler = () => {
        axios.delete(`${keys.ServerConnection}/Project/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            navigate('/projects');
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err)
        });
    }

    useEffect(() => {
        fetchProjects();
    }, [token]);

    return (
        project &&
        <div className="container project-details-container my-5">
            <h1 className="text-center mb-4">{project.projectName}</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t("projects.details.projectInformation")}</h5>
                    <p className="card-text">{project.description}</p>
                    <p><strong>{t("projects.details.startDate")}:</strong> {project.startProjectDate}</p>
                    <p><strong>{t("projects.details.deadline")}:</strong> {project.deadLineProjectDate}</p>
                    <p><strong>{t("projects.details.status")}:</strong> <span className={`badge ${project.status === t("projects.details.pending") ? 'badge-pending' : 'badge-done'}`}>{project.status}</span></p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t("projects.details.projectHead")}</h5>
                    <p className="card-text">{project.employeeProjectHead.lastName} {project.employeeProjectHead.firstName}</p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        {t("projects.details.tasks")}
                        <span className='btn' onClick={() => setShowTasks(!showTasks)}>{showTasks ?  <i class="fa-solid fa-chevron-up"></i>

 :  <i class="fa-solid fa-chevron-down"></i>}</span>
                    </h5>

                    <ul className={`list-group ${showTasks ? 'show' : ''}`}>
                        {project.tasks && project.tasks.map((task, index) => (
                            <li key={index} className="list-group-item">
                                <h6>{task.header}</h6>
                                <p>{task.text}</p>
                                <p><strong>{t("projects.details.status")}: </strong><span className={`badge ${task.status === t("projects.details.pending") ? 'badge-pending' : 'badge-done'}`}>{task.status}</span></p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t("projects.details.employees")}
                    <span className='btn' onClick={() => setShowEmployees(!showEmployees)}>{showEmployees ?  <i class="fa-solid fa-chevron-up"></i>

:  <i class="fa-solid fa-chevron-down"></i>}</span>
                    </h5>
                    <ul className={`list-group ${showEmployees ? 'show' : ''}`} >
                        {
                            project.employees&&
                            project.employees.map((employee, index) => (
                                <li key={index} className="list-group-item">
                                    {employee.lastName} {employee.firstName} ({employee.jobName})
                                </li>
                            ))
                        }
                    </ul>

                </div>

            </div>
            <div>
                {
                    user.actort=='Admin'||user.actort=='Manager'?
                   ( <span>
               <Link to={`/projects/update/${project.projectId}`}><button className='btn btn-success '>{t("projects.details.updateButton")}</button></Link>
                <button className='btn btn-danger ' onClick={deleteHandler}>{t("projects.details.deleteButton")}</button>
                </span>):null
                }
                <button className='btn btn-dark ' onClick={() => { navigate('/projects'); }}>{t("projects.details.backButton")}</button>
            </div>
        </div>
    );
}

export { DetailsProject };
