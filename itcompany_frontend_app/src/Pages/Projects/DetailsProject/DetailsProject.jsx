import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './DetailsProject.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import keys from '../../../config/keys';
import DateReduction from '../../../Function/DateReduction';
const DetailsProject=()=>{
    const {token}=useAuth();
    const {signOut}=useAuth();
    const navigate=useNavigate();
    const [project,setProject]=useState();
    const {id}=useParams();
    const fetchProjects=async()=>{
        const project=await axios.get(`${keys.ServerConnection}/Project/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{return res.data}).catch(err=>{
            if(err.response.status===401)
                signOut();
            console.log(err)});
        const employees=await axios.get(`${keys.ServerConnection}/Project/getEmployeeInProject/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res=>{return res.data}).catch(err=>{
            if(err.response.status===401)
                signOut();
            console.log(err)});
        const employeesWithJobs = await Promise.all(employees.map(async (employee) => {
            try {
                if(employee.jobId)
                {const jobRes = await axios.get(`${keys.ServerConnection}/Job/${employee.jobId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });
    
                return { ...employee, jobName: jobRes.data.jobName };
            }
            else{
                return { ...employee, jobName: 'No job' };
            }
            } catch (error) {
               console.log(error);
               
            }}));
            const tasksRes=await axios.get(`${keys.ServerConnection}/Project/getTasksInProject/${project.projectId}`,{ headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{return res.data}).catch(err=>{
                if(err.response.status===401)
                    signOut();
                console.log(err)});
            const tasksStatus=tasksRes.map(task=>({
                ...task,status:task.isDone ? 'Completed' : 'Pending'
            }));
            console.log(project.employeeId);
            console.log(project.projectId);
            const employeeProjectHead=await axios.get(`${keys.ServerConnection}/Employee/${project.employeeId}`,{ headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{return res.data}).catch(err=>{
                if(err.response.status===401)
                    signOut();
                console.log(err)});
        
        project.startProjectDate=DateReduction(project.startProjectDate);
        project.deadLineProjectDate=DateReduction(project.deadLineProjectDate);
        const status=project.isDone?'Completed':'Pending';
        setProject({...project,employees:employeesWithJobs,employeeProjectHead:employeeProjectHead,status:status,tasks:tasksStatus});


    }
    const deleteHandler=()=>{
        axios.delete(`${keys.ServerConnection}/Project/${id}`,{ headers: {
            Authorization: `Bearer ${token}`
        }}).then(res=>{
            console.log(res);
            navigate('/projects');
        }).catch(err=>{
            
            if(err.response.status===401)
                signOut();
            console.log(err)
        });
    }
    useEffect(()=>{
        fetchProjects();
    },[token]);
    return(
        project&&
        <div className="container project-details-container my-5">
        <h1 className="text-center mb-4">{project.projectName}</h1>
        
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Project information</h5>
                <p className="card-text">{project.description}</p>
                <p><strong>Start Date:</strong> {project.startProjectDate}</p>
                <p><strong>Deadline:</strong> {project.deadLineProjectDate}</p>
                <p><strong>Status:</strong> <span className={`badge ${project.status==='Pending'?'badge-pending' : 'badge-done'}`}>{project.status}</span></p>
            </div>
        </div>

        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Project Head</h5>
                <p className="card-text">{project.employeeProjectHead.lastName} {project.employeeProjectHead.firstName}</p>
            </div>
        </div>

        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Tasks</h5>

                <ul className="list-group">
                    {
                        project.tasks&&project.tasks.map((task,index)=>{
                            <li id={index} className="list-group-item">
                                 <h6>{task.header}</h6>
                                 <p>{task.text}</p>
                         <p><strong>Status:</strong> <span className={`badge ${task.status==='Pending'?'badge-pending' : 'badge-done'}`}>{task.status}</span></p>
                    </li>
                        })
                    }
                </ul>
                
            </div>
        </div>

        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Employees</h5>
                <ul className="list-group">
                    {
                        project.employees.map((employee,index)=>{
                            <li id={index} className="list-group-item">
                           {employee.lastName} {employee.firstName}({employee.jobName})
                        </li>
                        })
                    }
                    
                </ul>
                
            </div>
            
        </div>
        <div>
        <Link to={`/projects/update/${project.projectId}`} ><button className='btn btn-success '>Update</button></Link>
        <Link ><button className='btn btn-danger ' onClick={deleteHandler}>Delete</button></Link>
        <Link ><button className='btn btn-dark ' onClick={()=>{
                        navigate(-1);
                    }}>Back</button></Link>
        </div>
    </div>
    );
}
export{DetailsProject}