import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import keys from "../../../config/keys";
import { Link, useNavigate, useParams } from "react-router-dom";
import './DetailsEmployee.css';
const DetailsEmployee = () => {
    const { token } = useAuth();
    const [employee, setEmployee] = useState();
    const [projects, setProjects] = useState();
    const { id } = useParams();
    const navigate=useNavigate();

    const DateReduction = (date) => {
        return date.substring(0, date.indexOf('T'));
    }
    const fetchEmployee = async () => {
        const employeeRes = await axios.get(`${keys.ServerConnection}/Employee/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const jobName = employeeRes.data.jobId
            ? await axios.get(`${keys.ServerConnection}/Job/${employeeRes.data.jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.data.jobName)
            : 'No job';

        const departmentName = employeeRes.data.departmentId
            ? await axios.get(`${keys.ServerConnection}/Department/${employeeRes.data.departmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.data.departmentName)
            : 'No department';
        employeeRes.data.hireDate = DateReduction(employeeRes.data.hireDate);
        employeeRes.data.birthDate = DateReduction(employeeRes.data.birthDate);
        if (employeeRes.data.fireDate) {
            employeeRes.data.fireDate = DateReduction(employeeRes.data.fireDate);
        }


        const projectsRes = await axios.get(`${keys.ServerConnection}/Employee/lastProjects/${employeeRes.data.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const projects = projectsRes.data;

        setEmployee({
            ...employeeRes.data,
            jobName: jobName,
            departmentName: departmentName,
            projects: projects
        });

    }
    useEffect(() => {

        fetchEmployee();

    }, [token]);

    return (
        employee &&
        <div className="container employee-info-container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="row align-items-center mb-4">
                                <div className="col-md-3 text-center">
                                    <img id="image" className="img-fluid rounded-circle employee-photo" width="150px" height="150px" src="https://img.freepik.com/premium-vector/user-icon-man-business-suit_454641-453.jpg" alt="user" />

                                </div>
                                <div className="col-md-9">
                                    <h2>{employee.firstName} {employee.lastName}</h2>
                                    <p className="text-muted">{employee.jobName} | {employee.departmentName}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">


                                <div className="col-md-6">
                                    <p><strong>Birth Date:</strong> {employee.birthDate}</p>
                                    <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                                    <p><strong>Email:</strong> {employee.email}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Salary:</strong> ${employee.salary.toFixed(2)}</p>
                                    <p><strong>Hire Date:</strong> {employee.hireDate}</p>
                                    {employee.fireDate && <p><strong>Fire Date:</strong> {employee.fireDate}</p>}
                                </div>

                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Projects</h4>
                                    <ul className="list-unstyled">
                                        {employee.projects && employee.projects.map(project => (
                                            <li key={project.id}>
                                                <strong>{project.name}</strong> - {project.description}
                                                <Link to={`/project/details/${project.id}`}>
                                                    <button className="btn btn-info btn-sm">Info</button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            
                            </div>
                                        
                            <div>
                            <Link to={`/employee/update/${employee.id}`}>
                            <button className="btn btn-info btn-sm"> Update</button>
                            </Link>
                           
                            <button className="btn btn-dark btn-sm" onClick={()=>{navigate(-1)}}> Back</button></div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
export { DetailsEmployee }