import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import SelectSearch from "../../Components/UI/SelectSearch/SelectSearch";
import ModalWindow from "../../Components/Other/ModalWindow/ModalWindow.js";
import Notification from "../../Components/Other/Notification/Notification.js";

import "./DepsJobs.css";

const DepsJobs=()=>{
    const {token} = useAuth();
    const [reload, setReload] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [nowPageName, setNowPageName] = useState("Departments");
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState({});
    const [employeesInSelDep, setEmployeesInSelDep] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState({});
    const [employeesInSelJob, setEmployeesInSelJob] = useState([]);

    const [departmentsLoading, setDepartmentsLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(true);

    const [showAddDepModal, setShowAddDepModal] = useState(false);
    const [showEditDepModal, setShowEditDepModal] = useState(false);
    const [showDelDepModal, setShowDelDepModal] = useState(false);

    const [showAddJobModal, setShowAddJobModal] = useState(false);
    const [showEditJobModal, setShowEditJobModal] = useState(false);
    const [showDelJobModal, setShowDelJobModal] = useState(false);

    const [tempDepName, setTempDepName] = useState("");
    const [tempJobName, setTempJobName] = useState("");

    const [notification, setNotification] = useState({
        show: false,
        text: "",
        setShow: (arg) => {setNotification({
            ...notification,
            show: arg
        })},
        color: "success",
        icon: "fa-regular fa-circle-check",
        corner: "1"
    });
    const{ signOut}=useAuth();
    useEffect(()=> {
        if(token){
            const decoded = jwtDecode(token);
            
            axios.get(`${keys.ServerConnection}/Department`, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setDepartments(res.data);
                setFilteredDepartments(res.data);
            })
            .then(() => {
                setDepartmentsLoading(false);
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

            axios.get(`${keys.ServerConnection}/Job`, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setJobs(res.data);
                setFilteredJobs(res.data);
            })
            .then(() => {
                setJobsLoading(false);
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });


            axios.get(`${keys.ServerConnection}/Employee`, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setEmployees(res.data);
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

        }
    }, [token, reload]);

    const forceReload = () => {
        setReload(!reload);
    };

    const seachDepartmentChangeHandler = (event) => {
        Array.from(document.getElementsByClassName("depjobs-table-container")[0].firstElementChild.lastElementChild.children).forEach((el) => {
            el.firstElementChild.classList.remove("depjob-active");
        });
        if (!event.target.value.trim()){
            setFilteredDepartments(departments);
        }
        else {
            setFilteredDepartments(departments.filter(dep => dep.departmentName.toLowerCase().startsWith(event.target.value.toLowerCase())));
        }
    }

    const seachJobChangeHandler = (event) => {
        Array.from(document.getElementsByClassName("depjobs-table-container")[1].firstElementChild.lastElementChild.children).forEach((el) => {
            el.firstElementChild.classList.remove("depjob-active");
        });
        if (!event.target.value.trim()){
            setFilteredJobs(jobs);
        }
        else {
            setFilteredJobs(jobs.filter(job => job.jobName.toLowerCase().startsWith(event.target.value.toLowerCase())));
        }
    }

    const departmentChooseHandler = (event, depId) => {
        Array.from(event.target.parentElement.parentElement.children).forEach((el) => {
            el.firstElementChild.classList.remove("depjob-active");
        });
        event.target.classList.add("depjob-active");

        axios.get(`${keys.ServerConnection}/Department/getInfo/${depId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setSelectedDepartment(res.data);
            setTempDepName(res.data.departmentName);
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });


        axios.get(`${keys.ServerConnection}/Employee/byDepartmentId/${depId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setEmployeesInSelDep(res.data);
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });

    }

    const jobChooseHandler = (event, jobId) => {
        Array.from(event.target.parentElement.parentElement.children).forEach((el) => {
            el.firstElementChild.classList.remove("depjob-active");
        });
        event.target.classList.add("depjob-active");

        axios.get(`${keys.ServerConnection}/Job/getInfo/${jobId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setSelectedJob(res.data);
            setTempJobName(res.data.jobName);
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });


        axios.get(`${keys.ServerConnection}/Employee/byJobId/${jobId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setEmployeesInSelJob(res.data);
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });

    }

    const isDepartmentValid = (depNameInput, depHeadInput, emps, isEdit) => {
        let currentEmp = emps[0];

        if (depNameInput.value.trim() === ''){
            depNameInput.setCustomValidity('This field is required');
            depNameInput.reportValidity();
        }
        else if (depNameInput.value.length < 2){
            depNameInput.setCustomValidity('Min lenght is 2 symbols');
            depNameInput.reportValidity();
        }
        else if ((!isEdit && departments.filter(dep => dep.departmentName == depNameInput.value).length != 0)||(isEdit && departments.filter(dep => dep.departmentName == depNameInput.value).length != 0 && selectedDepartment.departmentName != depNameInput.value)){
            depNameInput.setCustomValidity('Department with such name already exists!');
            depNameInput.reportValidity();
        }
        else if (depHeadInput.value.trim() === ''){
            depHeadInput.setCustomValidity('This field is required.');
            depHeadInput.reportValidity();
        } 
        else if (emps.length == 0){
            depHeadInput.setCustomValidity('No employees with such name');
            depHeadInput.reportValidity();
        }
        else if ((!isEdit && departments.filter(d => d.departmentHeadId == currentEmp.id).length > 0)||(isEdit && departments.filter(d => d.departmentHeadId == currentEmp.id).length > 0 && selectedDepartment.departmentHeadName != depHeadInput.value)){
            depHeadInput.setCustomValidity('That employee is already head of another department');
            depHeadInput.reportValidity();
        }
        else {
            return true;
        }
        return false;
    }

    const isJobValid = (jobNameInput, isEdit) => {
        if (jobNameInput.value.trim() === ''){
            jobNameInput.setCustomValidity('This field is required');
            jobNameInput.reportValidity();
        }
        else if (jobNameInput.value.length < 2){
            jobNameInput.setCustomValidity('Min lenght is 2 symbols');
            jobNameInput.reportValidity();
        }
        else if (jobs.filter(job => job.jobName == jobNameInput.value).length != 0){
            if (isEdit && selectedJob.jobName == jobNameInput.value){
                jobNameInput.setCustomValidity(`New job name can't be like old`);
            } 
            else{
                jobNameInput.setCustomValidity('Job with such name already exists!');
            }
            jobNameInput.reportValidity();
        }
        else {
            return true;
        }
        return false;
    }

    const addDepartmentHandler = () => {
        let depNameInput = document.getElementById("add-dep-name-input");
        let depHeadInput = document.getElementById("add-dep-dhead-input");
        let emps = employees.filter(emp => emp.lastName + " " + emp.firstName == depHeadInput.value);

        if (isDepartmentValid(depNameInput, depHeadInput, emps, false)){
            axios.post(`${keys.ServerConnection}/Department`, { 
                departmentName: depNameInput.value,
                departmentHeadId: emps[0].id
             }, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setShowAddDepModal(false);
                
                setNotification({
                    ...notification,
                    show: true,
                    text: `Department ${depNameInput.value} added`,
                    color: "success",
                    icon: "fa-regular fa-circle-check"
                });

                depNameInput.value = "";
                depHeadInput.value = "";
    
                forceReload();
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

        }
    }

    const updateDepartmentHandler = () => {
        let depNameInput = document.getElementById("edit-dep-name-input");
        let depHeadInput = document.getElementById("edit-dep-dhead-input");
        let emps = employees.filter(emp => emp.lastName + " " + emp.firstName == depHeadInput.value);

        if (isDepartmentValid(depNameInput, depHeadInput, emps, true)){
            axios.put(`${keys.ServerConnection}/Department/${selectedDepartment.departmentId}`, { 
                departmentName: depNameInput.value,
                departmentHeadId: emps[0].id
             }, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setShowEditDepModal(false);
                
                setNotification({
                    ...notification,
                    show: true,
                    text: `Department ${depNameInput.value} updated`,
                    color: "success",
                    icon: "fa-regular fa-circle-check"
                });
                depNameInput.value = "";
                depHeadInput.value = "";
   
                forceReload();
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

        }
    }

    const deleteDepartmentHandler = () => {
        axios.delete(`${keys.ServerConnection}/Department/${selectedDepartment.departmentId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setShowDelDepModal(false);
            
            setNotification({
                ...notification,
                show: true,
                text: `Department deleted`,
                color: "success",
                icon: "fa-regular fa-circle-check"
            });

            forceReload();
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });

    }

    const addJobHandler = () => {
        let jobNameInput = document.getElementById("add-job-name-input");

        if (isJobValid(jobNameInput, false)){
            axios.post(`${keys.ServerConnection}/Job`, { 
                jobName: jobNameInput.value,
             }, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setShowAddJobModal(false);
                
                setNotification({
                    ...notification,
                    show: true,
                    text: `Job ${jobNameInput.value} added`,
                    color: "success",
                    icon: "fa-regular fa-circle-check"
                });

                jobNameInput.value = "";
    
                forceReload();
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

        }
    }

    const updateJobHandler = () => {
        let jobNameInput = document.getElementById("edit-job-name-input");

        if (isJobValid(jobNameInput, true)){
            axios.put(`${keys.ServerConnection}/Job/${selectedJob.jobId}`, { 
                jobName: jobNameInput.value
             }, {headers: {
                Authorization:`Bearer ${token}`
            }})
            .then(res => {
                setShowEditJobModal(false);
                
                setNotification({
                    ...notification,
                    show: true,
                    text: `Job ${jobNameInput.value} updated`,
                    color: "success",
                    icon: "fa-regular fa-circle-check"
                });
                jobNameInput.value = "";
   
                forceReload();
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });

        }
    }

    const deleteJobHandler = () => {
        axios.delete(`${keys.ServerConnection}/Job/${selectedJob.jobId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            setShowDelJobModal(false);
            
            setNotification({
                ...notification,
                show: true,
                text: `Job deleted`,
                color: "success",
                icon: "fa-regular fa-circle-check"
            });

            forceReload();
        }).catch(err=>{
            if(err.response.status===401)
                signOut();
        });

    }

    return(
        <div className="DepsJobscontainer">
            <ModalWindow
                title="Adding department"
                show={showAddDepModal} 
                handleClose={() => setShowAddDepModal(false)} 
                handleConfirm={addDepartmentHandler}
                confirmText="Add new department" 
                cancelText="Cancel">
            <div className="modal-form">
                <div className="row">
                    <label className="col-md-5">Department name</label>
                    <input className="form-control col-md-6" type="text" style={{marginLeft: "15px"}}id="add-dep-name-input" minLength={2} maxLength={50}/>
                </div>
                <br />
                <div className="row">
                    <label className="col-md-5">Department head</label>
                    <SelectSearch options={employees.map(employee => employee.lastName + " " + employee.firstName)} classListDiv="col-md-6" id="add-dep-dhead-input"></SelectSearch>
                </div>
            </div>
            </ModalWindow>
            <ModalWindow
                title="Editing department"
                show={showEditDepModal} 
                handleClose={() => setShowEditDepModal(false)} 
                handleConfirm={updateDepartmentHandler}
                confirmText="Update department" 
                cancelText="Cancel">
            <div className="modal-form">
                <div className="row">
                    <label className="col-md-5">Department name</label>
                    <input className="form-control col-md-6" type="text" style={{marginLeft: "15px"}}id="edit-dep-name-input" minLength={2} maxLength={50} value={tempDepName} onChange={(event) => setTempDepName(event.target.value)}/>
                </div>
                <br />
                <div className="row">
                    <label className="col-md-5">Department head</label>
                    <SelectSearch options={employees.map(employee => employee.lastName + " " + employee.firstName)} classListDiv="col-md-6" id="edit-dep-dhead-input" value={selectedDepartment.departmentHeadName}></SelectSearch>
                </div>
            </div>
            </ModalWindow>
            <ModalWindow
                title="Confirm department deletion"
                show={showDelDepModal} 
                handleClose={() => setShowDelDepModal(false)} 
                handleConfirm={deleteDepartmentHandler}
                confirmText="Delete" 
                cancelText="Cancel">
            <p>Are you sure that you want to delete that department?</p>
            </ModalWindow>

            <ModalWindow
                title="Adding job"
                show={showAddJobModal} 
                handleClose={() => setShowAddJobModal(false)} 
                handleConfirm={addJobHandler}
                confirmText="Add new job" 
                cancelText="Cancel">
                <div className="modal-form">
                    <div className="row">
                        <label className="col-md-5">Job name</label>
                        <input className="form-control col-md-6" type="text" style={{marginLeft: "15px"}}   id="add-job-name-input" minLength={2} maxLength={50}/>
                    </div>
                </div>
            </ModalWindow>
            <ModalWindow
                title="Editing job"
                show={showEditJobModal} 
                handleClose={() => setShowEditJobModal(false)} 
                handleConfirm={updateJobHandler}
                confirmText="Update job" 
                cancelText="Cancel">
            <div className="modal-form">
                <div className="row">
                    <label className="col-md-5">Job name</label>
                    <input className="form-control col-md-6" type="text" style={{marginLeft: "15px"}}id="edit-job-name-input" minLength={2} maxLength={50} value={tempJobName} onChange={(event) => setTempJobName(event.target.value)}/>
                </div>
            </div>
            </ModalWindow>
            <ModalWindow
                title="Confirm job deletion"
                show={showDelJobModal} 
                handleClose={() => setShowDelJobModal(false)} 
                handleConfirm={deleteJobHandler}
                confirmText="Delete" 
                cancelText="Cancel">
            <p>Are you sure that you want to delete that job?</p>
            </ModalWindow>

            <Notification
                show={notification.show}
                setShow={notification.setShow}
                text={notification.text}
                color={notification.color}
                icon={notification.icon}
                corner={notification.corner}
            ></Notification>
            <div className="container mt-4">
                <h1 className="text-center mb-4">{nowPageName}</h1>
                <ul className="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                    <li className="nav-item" onClick={() => setNowPageName("Departments")}>
                        <a className="nav-link active" id="departments-tab" data-toggle="tab" href="#departments" role="tab" aria-controls="departments" aria-selected="true">Departments</a>
                    </li>
                    <li className="nav-item" onClick={() => setNowPageName("Jobs")}>
                        <a className="nav-link" id="jobs-tab" data-toggle="tab" href="#jobs" role="tab" aria-controls="jobs" aria-selected="false">Jobs</a>
                    </li>
                </ul>
                <div className="tab-content mt-4" id="myTabContent">
                    <div className="tab-pane fade show active" id="departments" role="tabpanel" aria-labelledby="departments-tab">
                        <div className="row">
                        {
                            departmentsLoading ?
                            <h2>Loading ....</h2>
                            :
                            (departments.length == 0 ?
                            <h2>No departments yet</h2>
                            :
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Seach department by name</label>
                                        <input type="text" className="form-control" id="search-department"  placeholder="Search Departments" onChange={seachDepartmentChangeHandler}/>
                                    </div>
                                    <div className="depjobs-table-container">
                                      <table className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Choose department</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            filteredDepartments.map((department, index) => (
                                                <tr key={index}>
                                                    <td onClick={(event) => departmentChooseHandler(event,  department.departmentId)}>{department.departmentName}</td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }
                            <div className="col-md-6">
                                <form>
                                    <div className="form-group">
                                        <label>Department Name</label>
                                        <input type="text" className="form-control" id="department-name" readOnly={true} value={selectedDepartment.departmentName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Department Head</label>
                                        <input type="text" className="form-control" id="department-head" readOnly={true} value={selectedDepartment.departmentHeadName}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Amount of employees</label>
                                        <input type="number" className="form-control" id="department-staff-count" readOnly={true} value={selectedDepartment.amountOfWorkers}/>
                                    </div>
                                    {
                                        selectedDepartment.amountOfWorkers > 0 &&
                                        (!employeesInSelDep? <h4>loading ....</h4>
                                        :
                                        <div className="form-group">
                                            <label>Employees in this department</label>
                                            <div className="table-responsive limited-height">
                                              <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                      <th>Name</th>
                                                      <th>Salary</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    employeesInSelDep.map((emp, index)=>(
                                                    <tr key={index}>
                                                        <td>{emp.lastName + " " + emp.firstName}</td>
                                                        <td>{emp.salary} $</td>
                                                    </tr>
                                                    ))
                                                }
                                                </tbody>
                                              </table> 
                                            </div>
                                        </div>
                                        )
                                    }
                                    <div className="form-group depjobs-buttons">
                                        <button type="button" className="btn btn-success" onClick={() => setShowAddDepModal(true)}>Add Department</button>
                                        {
                                            selectedDepartment.departmentName && 
                                            <button type="button" className="btn btn-warning" onClick={() => setShowEditDepModal(true)}>Edit Department</button>
                                        }
                                        {
                                            selectedDepartment.departmentName &&
                                            <button type="button" className="btn btn-danger" onClick={() => {
                                                if (selectedDepartment.amountOfWorkers > 0){
                                                    setNotification({
                                                        ...notification,
                                                        show: true,
                                                        text: `You can't delete department with workers in it!`,
                                                        color: "danger",
                                                        icon: "fa-solid fa-ban",
                                                    });
                                                }
                                                else {
                                                    setShowDelDepModal(true);
                                                }
                                            }}>Delete Department</button>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="jobs" role="tabpanel" aria-labelledby="jobs-tab">
                        <div className="row">
                        {
                            jobsLoading?
                            <h2>Loading ....</h2>
                            :
                            (jobs.length == 0 ?
                            <h2>No jobs yet</h2>
                            :
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Seach job by name</label>
                                    <input type="text" className="form-control" id="search-job" placeholder="Search Jobs" onChange={seachJobChangeHandler}/>
                                </div>
                                <div className="depjobs-table-container">
                                  <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filteredJobs.map((job, index) => (
                                            <tr key={index}>
                                                <td onClick={(event) => jobChooseHandler(event, job.jobId)}>{job.jobName}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                  </table>
                                </div>
                            </div>)
                        }
                        <div className="col-md-6">
                            <form>
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input type="text" className="form-control" id="job-title" readOnly={true} value={selectedJob.jobName}/>
                                </div>
                                <div className="form-group">
                                    <label>Staff Count</label>
                                    <input type="number" className="form-control" id="job-staff-count"readOnly={true} value={selectedJob.amountOfEmployees}/>
                                </div>
                                {
                                    selectedJob.amountOfEmployees > 0 &&
                                    (!employeesInSelJob? <h4>loading ....</h4>
                                    :
                                    <div className="form-group">
                                        <label>Employees on this job</label>
                                        <div className="table-responsive limited-height" style={{maxHeight:"281px", height: "281px"}}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Salary</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    employeesInSelJob.map((emp, index)=>(
                                                        <tr key={index}>
                                                            <td>{emp.lastName + " " + emp.firstName}</td>
                                                            <td>{emp.salary} $</td>
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    )
                                }
                                <div className="form-group depjobs-buttons">
                                    <button type="button" className="btn btn-success" onClick={() => setShowAddJobModal(true)}>Add Job</button>
                                    {
                                        selectedJob.jobName && 
                                        <button type="button" className="btn btn-warning" onClick={() => setShowEditJobModal(true)}>Edit Job</button>
                                    }
                                    {
                                        selectedJob.jobName && 
                                        <button type="button" className="btn btn-danger" onClick={() => {
                                            if (selectedJob.amountOfEmployees > 0){
                                                setNotification({
                                                    ...notification,
                                                    show: true,
                                                    text: `You can't delete job with workers in it!`,
                                                    color: "danger",
                                                    icon: "fa-solid fa-ban",
                                                });
                                            }
                                            else {
                                                setShowDelJobModal(true);
                                            }
                                        }}>Delete Job</button>
                                    }
                                </div>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{DepsJobs};