import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import keys from "../../../config/keys";
import DateReduction from "../../../Function/DateReduction";
import SelectSearch from "../../../Components/UI/SelectSearch/SelectSearch";

import './UpdateProject.css'
const UpdateProject = () => {
    const { id } = useParams();

    const [project, setProject] = useState();
    const [errors, setErrors] = useState();
    const [employees, setEmployees] = useState([]);
    const [errorInfo, setErrorInfo] = useState('none');

    const { token, signOut } = useAuth();

    const navigate = useNavigate();


    const fetchProject = async () => {
        axios.get(`${keys.ServerConnection}/Project/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
            const deadLine = DateReduction(res.data.deadLineProjectDate);
            setProject({ ...res.data, deadLineProjectDate: deadLine });
        }).catch(err => {
            if (err.response.status === 401)
                signOut();
            console.log(err);
        })
        const response = await axios.get(`${keys.ServerConnection}/Employee/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => { return res.data }).catch(err => console.log(err));
        const employeesWithFullName = await Promise.all(response.map(async (employee) => {
            return { ...employee, fullName: `${employee.lastName} ${employee.firstName}` };
        })).catch(err => {
            if (err.response.status === 401)
                signOut();
        });
        setEmployees(employeesWithFullName);
    }
    useEffect(() => {
        fetchProject();
    }, [token])

    const submitHandler = (event) => {
        event.preventDefault();
        const form = event.target;
        const fullNameExist = employees.some(item => item.fullName === form.teamLead.value);
        setErrorInfo(!fullNameExist ? 'block' : 'none');
        if (fullNameExist) {
            const employee = employees.find(employee => employee.fullName === form.teamLead.value);
            const idEmpployee = employee ? employee.id : null;
            console.log(form.file.value.length > 1 ? form.file.value : project.file);
            console.log(project.isDone);
            axios.put(`${keys.ServerConnection}/Project/${id}`, {

                projectName: project.projectName,
                description: project.description,
                file: form.file.value.length>0?form.file.value:project.file,
                isDone: project.isDone,
                startProjectDate: project.startProjectDate,
                deadLineProjectDate: project.deadLineProjectDate,
                employeeId: idEmpployee
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                navigate(`/projects/details/${id}`);
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
            })
        }
    }

    return (
        <div className="updateProjectContainer">
            {
                project != null ?
                    <div className="container mt-5">

                        <div className="form-container  mx-auto">
                            <h2 className="form-header text-center">Update project </h2>
                            <form onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label >Project Name</label>
                                    <input type="text" className="form-control" name="projectName" value={project.projectName} onChange={(event) => setProject({ ...project, projectName: event.target.value })} placeholder="Input Project Name" />
                                </div>

                                <div className="form-group">
                                    <label >Photo File</label>
                                    <input type="file" className="form-control" name="file" placeholder="Input Photo" accept="image/jpeg,image/png,image/gif" />
                                </div>
                                <div className="form-group">
                                    <label >DeadLine Project Date</label>
                                    <input type="date" className="form-control" name="deadlineProjectDate" value={project.deadLineProjectDate} onChange={(event) => setProject({ ...project, deadLineProjectDate: event.target.value })} placeholder="Input Deadeline" />
                                </div>
                                <div className="form-group">
                                    <label >Project Done</label>
                                    <input
                                        type="checkbox"
                                        style={{ margin: '5px' }}
                                        checked={project.isDone}
                                        onChange={(event) => {
                                            setProject({ ...project, isDone: event.target.checked });
                                        }}
                                        name="projectDone"
                                    />
                                </div>
                                <div className="form-group">
                                    <label >Team Lead</label>
                                    <SelectSearch placeholder='Input Team Lead' name='teamLead' options={employees.map(employee => employee.fullName)} id='teamleadtSearch' />
                                    <h5 style={{ color: "red", marginLeft: "5px", display: errorInfo }}>* No team lead with such name</h5>
                                </div>

                                <div className="form-group">
                                    <label >Description</label>
                                    <textarea type="text" className="form-control" name="description" value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} placeholder="Input Description" aria-multiline={3} />
                                </div>
                                <hr />
                                {
                                    errors != null && errors.map((error, index) => (

                                        <li key={index}><h6 style={{ color: "red", marginLeft: "5px" }}>{error}</h6></li>
                                    ))}
                                <div>
                                    <button type="submit" className="btn btn-success">Update</button>
                                    <button type="submit" className="btn btn-dark" onClick={() => {
                                        navigate(-1);
                                    }}>Back</button></div>


                            </form>
                        </div>
                    </div>
                    :
                    <div>Loading...</div>
            }
        </div>
    )
}

export { UpdateProject }