import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import keys from "../../../config/keys";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";
const CreateProject=()=>{
    const {signOut}=useAuth();
    const navigate=useNavigate();
    const {token}=useAuth();
    const [errors,setErrors]=useState();
    const [employees,setEmployees]=useState([]);
    const [errorInfo,setErrorInfo]=useState('none');
    const fetchEmployees=async()=>{
      const response= await axios.get(`${keys.ServerConnection}/Employee/`,{
            headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{return res.data}).catch(err=>console.log(err));
        const employeesWithFullName=await Promise.all(response.map(async(employee)=>{
            return {...employee,fullName:`${employee.lastName} ${employee.firstName}`};
        })).catch(err=>{
            if(err.response.status===401)
                signOut();
        });
;
        setEmployees(employeesWithFullName);
    }
    useEffect(()=>{
        fetchEmployees();
        },[token]);
     const submitHandler=(event)=>{
        event.preventDefault();
        const form=event.target;
        const fullNameExist=employees.some(item=>item.fullName===form.teamLead.value);
        setErrorInfo( !fullNameExist ? 'block' : 'none');
        if(fullNameExist){
            const employee=employees.find(employee=>employee.fullName===form.teamLead.value);
            const id=employee?employee.id:null;
        
            axios.post(`${keys.ServerConnection}/Project`,{
                projectName:form.projectName.value,
                description:form.description.value,
                file:'',//set!!!
                isDone:false,
                deadLineProjectDate:form.deadlineProjectDate.value,
                employeeId:id
            },{ headers: {
                Authorization: `Bearer ${token}`
            }}).then(res=>{
                console.log(res);
                navigate('/projects');
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
                if(err.response.data.errors!=null){
                    const errorMessages = Object.values(err.response.data.errors)
                    .flatMap(errorArray => errorArray.map(errorMessage => errorMessage));
                setErrors(errorMessages);
                }
                else{
                    setErrors([err.response.data]);
                }
            });
        }
     }   
    return(
        <div className="projectsContainer">

            <div className="container mt-5">
                
            <div className="form-container  mx-auto">
                <h2 className="form-header text-center">Create project </h2>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label >Project Name</label>
                        <input type="text"  className="form-control" required name="projectName" placeholder="Input Project Name" />
                    </div>
                    
                    <div className="form-group">
                        <label >Photo File</label>
                        <input type="file"  className="form-control" required name="file" placeholder="Input Photo" accept="image/jpeg,image/png,image/gif" />
                    </div>
                    <div className="form-group">
                        <label >DeadLine Project Date</label>
                        <input type="date"  className="form-control" required name="deadlineProjectDate" placeholder="Input Deadeline" />
                    </div>
                    <div className="form-group">
                        <label >Team Lead</label>
                        <SelectSearch placeholder='Input Team Lead' name='teamLead' options={employees.map(employee=>employee.fullName)} id='teamleadtSearch' />
                        <h5 style={{color: "red", marginLeft: "5px", display: errorInfo}}>* No team lead with such name</h5>
                    </div>

                    <div className="form-group">
                        <label >Description</label>
                        <input type="text"  className="form-control" required name="description" placeholder="Input Description" multiple  />
                    </div>
                    <hr />
                        {
                        errors != null && errors.map((error, index) => (
                           
                            <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                        ))}
                    <div>
            <button type="submit" className="btn btn-success">Create</button>
                    <button type="submit" className="btn btn-dark" onClick={()=>{
                        navigate(-1);
                    }}>Back</button></div>
                    
                   
                </form>
            </div>
        </div>
        </div>
    )
}
export {CreateProject}