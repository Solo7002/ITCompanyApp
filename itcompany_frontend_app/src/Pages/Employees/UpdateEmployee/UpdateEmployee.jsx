import axios from "axios";
import { useEffect, useState } from "react";
import keys from "../../../config/keys";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
import DateReduction from "../../../Function/DateReduction";
const { useParams, useNavigate } = require("react-router-dom");
const { useAuth } = require("../../../hooks/useAuth")



const UpdateEmployee=()=>{
    const navigate=useNavigate();
    const {token}=useAuth();
    const {id}=useParams();
    const [jobs,setJobs]=useState([]);
    const [departments,setDepartments]=useState([]);
 
    const [employee,setEmployee]=useState();
    const [errorInfo, setErrorInfo] = useState({
        accessLevelDisplay: 'none',
        departmentDisplay: 'none',
        jobsDisplay: 'none'
    });
    const [errors,setErrors]=useState();
    const fetchEmployee=async()=>{
        try {
            await axios.get(`${keys.ServerConnection}/Employee/${id}`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                
                setEmployee({...res.data,birthDate:DateReduction(res.data.birthDate)});
            });


        

            await   axios.get(`${keys.ServerConnection}/Department`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                setDepartments(res.data);
            })//request get departments

            await axios.get(`${keys.ServerConnection}/Job`,{headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                setJobs(res.data);
            })//request get jobs

        } catch (error) {
            console.log(error);
        }
    }
    const submitHandler=(event)=>{
        event.preventDefault();
        const form=event.target;
        const departmentExists = departments.some(dep => dep.departmentName === form.department.value);
        const jobExists = jobs.some(job => job.jobName === form.job.value);
        setErrorInfo({
            departmentDisplay: !departmentExists ? 'block' : 'none',
            jobsDisplay: !jobExists ? 'block' : 'none'
        });
        if (departmentExists  && jobExists){
            const departmentId = departments.find(dep => dep.departmentName === form.department.value).departmentId;
                const jobId = jobs.find(jb => jb.jobName === form.job.value).jobId;
            console.log(employee);
            axios.put(`${keys.ServerConnection}/Employee/${id}`,    
                {
                   
                    LastName: employee.lastName,
                    PhotoFile: employee.photoFile,
                    FirstName: employee.firstName,
                    BirthDate: employee.birthDate,
                    PhoneNumber: employee.phoneNumber,
                    Email: employee.email,
                    Salary: employee.salary,
                    DepartmentId: departmentId,
                    JobId: jobId,
                    
                },{headers: {
                    Authorization: `Bearer ${token}`
                }}
            ).then(res=>{
                console.log(res);
                navigate('/employees');
                
            }).catch(err=>{
                if(err.response.data.errors!=null){
                    const errorMessages = Object.values(err.response.data.errors)
                    .flatMap(errorArray => errorArray.map(errorMessage => errorMessage));
                setErrors(errorMessages);
                }
                else{
                    setErrors([err.response.data]);
                }
                
            
            })}
    }
    useEffect(()=>{
        fetchEmployee();
    },[token]);


    return(
        employee&&
        <div className="container mt-5">
        <div className="form-container  mx-auto">
            <h2 className="form-header text-center">Update employee </h2>
            <form onSubmit={submitHandler}>
            
                <div className="form-group">
                    <label >Lastname</label>
                    <input type="text"  className="form-control" value={employee.lastName} onChange={(event)=>setEmployee({...employee,lastName: event.target.value})}  name="lastname" placeholder="Input Lastname" />
                </div>
                <div className="form-group">
                    <label >Firstname</label>
                    <input type="text"  className="form-control" value={employee.firstName} onChange={(event)=>setEmployee({...employee,firstName: event.target.value})}   name="firstname" placeholder="Input Firstname" />
                </div>
                <div className="form-group">
                    <label >Birthdate</label>
                    <input type="date" className="form-control"  value={employee.birthDate} onChange={(event)=>setEmployee({...employee,birthDate: event.target.value})}  name="birthdate" placeholder="Input Birthdate" />
                </div>

                <div className="form-group">
                    <label >Phone number</label>
                    <input type="text"  className="form-control"  value={employee.phoneNumber} onChange={(event)=>setEmployee({...employee,phoneNumber: event.target.value})}   name="phone" placeholder="Input Phone" />
                </div>
                <div className="form-group">
                    <label >Email</label>
                    <input type="email"  className="form-control"  value={employee.email} onChange={(event)=>setEmployee({...employee,email: event.target.value})}   name="email" placeholder="Input Email" />
                </div>
                <div className="form-group">
                    <label>Salary</label>
                    <input type="number" min={1}  className="form-control"  value={employee.salary} onChange={(event)=>setEmployee({...employee,salary: event.target.value})}   name="salary" placeholder="Input Salary" />
                </div>
                <div className="form-group">
                    <label >Department</label>
                    <SelectSearch placeholder='Input Department' name='department'  options={departments.map(department=>department.departmentName)} id='departmentSearch' />
                    <h5 style={{color: "red", marginLeft: "5px", display: errorInfo.departmentDisplay}}>* No department with such name</h5>
                </div>
                <div className="form-group">
                    <label>Job</label>
                    <SelectSearch placeholder='Input Job' name='job' id='jobSearch' options={jobs.map(job=>job.jobName)} />
                    <h5 style={{color: "red", marginLeft: "5px", display: errorInfo.jobsDisplay}}>* No job with such name</h5>
                </div>
              
                    {
                    errors != null && errors.map((error, index) => (
                       
                        <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                    ))}
                
                <div>
                <button type="submit" className="btn btn-success">Update</button>
                <button type="submit" className="btn btn-dark" onClick={()=>{
                    navigate(-1);
                }}>Back</button>
                </div>
            </form>
        </div>
    </div>
    );
}

export {UpdateEmployee}