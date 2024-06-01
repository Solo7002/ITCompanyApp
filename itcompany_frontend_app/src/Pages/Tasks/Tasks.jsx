import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import DateReduction from "../../Function/DateReduction.js"
import SelectSearch from "../../Components/UI/SelectSearch/SelectSearch";
import FileUpload from "../../Components/UI/FileUpload/FileUpload.js";
import ModalWindow from "../../Components/Other/ModalWindow/ModalWindow.js";
import Notification from "../../Components/Other/Notification/Notification.js";

import "./Tasks.css";

const Tasks=()=>{
  const {token, signOut} = useAuth();
  const [reload, setReload] = useState(false);

  const [projects, setProjects] = useState([]);

  const [obligatoryTasks, setObligatoryTasks] = useState([]);
  const [expiredTasks, setExpiredTasks] = useState([]);
  const [optionalTasks, setOptionalTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({headerBackColor: "white"});

  const [obligatoryTasksForEmp, setObligatoryTasksForEmp] = useState([]);
  const [expiredTasksForEmp, setExpiredTasksForEmp] = useState([]);
  const [optionalTasksForEmp, setOptionalTasksForEmp] = useState([]);
  const [doneTasksForEmp, setDoneTasksForEmp] = useState([]);
  const [selectedTaskForEmp, setSelectedTaskForEmp] = useState({headerBackColor: "white"});

  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showTaskCreateModal, setShowTaskCreateModal] = useState(false);
  
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [currentDepEmployees, setCurrentDepEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState({});

  const [coverFilePath, setCoverFilePath] = useState("");
  const [taskFilePath, setTaskFilePath] = useState("");

  
  const [notification, setNotification] = useState({
    show: false,
    text: "",
    setShow: (arg) => {setNotification({
        ...notification,
        show: arg
    })},
    color: "success",
    icon: "fa-regular fa-circle-check",
    corner: "4"
  });

  useEffect(()=> {
    if(token){
      console.log(token);
      const decoded = jwtDecode(token);
            
      axios.get(`${keys.ServerConnection}/Task/employeeFor/${decoded.nameid}`, {headers: {
        Authorization:`Bearer ${token}`
      }})
      .then(res => {
        res.data.forEach(el => {
          el.deadLineDate = DateReduction(el.deadLineDate);
          el.uploadDate = DateReduction(el.uploadDate);
          el.doneDate = el.isDone? DateReduction(el.doneDate) : el.doneDate;});

        setObligatoryTasks(res.data.filter(t => (new Date(t.deadLineDate) > new Date()) && !t.isDone && t.employeeFor_Id));
        setExpiredTasks(res.data.filter(t => (new Date(t.deadLineDate) < new Date()) && !t.isDone && t.employeeFor_Id));
        setOptionalTasks(res.data.filter(t => !t.isDone && !t.employeeFor_Id && !t.employeeFor_Id == decoded.nameid));
        setDoneTasks(res.data.filter(t => t.isDone));
      })
      .then(() => {
        setIsTasksLoading(false);
      })
      .catch(err=>{
        if(err.response.status===401)
          signOut();
      });

      axios.get(`${keys.ServerConnection}/Department/checkIfHead/${decoded.nameid}`, {headers: {
        Authorization:`Bearer ${token}`
      }})
      .then(res => {
        setCurrentEmployee(res.data);
        axios.get(`${keys.ServerConnection}/Employee/byDepartmentId/${res.data.departmentId}`, {headers: {
          Authorization:`Bearer ${token}`
        }})
        .then(res2 => {
          setCurrentDepEmployees(res2.data.filter(e => e.id != decoded.nameid))
        })
        .catch(err=>{
          if(err.response.status===401){
            signOut();
          }
        });
      })
      .catch(err=>{
        if(err.response.status===401){
          signOut();
        }
      });

      axios.get(`${keys.ServerConnection}/Project`, {headers: {
        Authorization:`Bearer ${token}`
      }})
      .then(res => {
        setProjects(res.data);
        console.log("projects: ", res.data);
      });
    }
  }, [token, reload]);

  const forceReload = () => {
    setReload(!reload);
  }

  const openDetailsModalWindow = (task_type, task_index) => {
    let temp_data = {};
    switch (task_type){
      case "obligatory": 
        temp_data = obligatoryTasks[task_index];
        temp_data.headerBackColor = "#d1ecf1";
        temp_data.btnText = "Upload done task"
        break;
      case "overdue": 
        temp_data = expiredTasks[task_index];
        temp_data.headerBackColor = "#d4555f";
        temp_data.btnText = "Upload done task"
        break;
      case "optional": 
        temp_data = optionalTasks[task_index];
        temp_data.headerBackColor = "#fedf77";
        temp_data.btnText = "Claim"
        temp_data.confirmBtnColor = "warning"
        break;
      case "done": 
        temp_data = doneTasks[task_index];
        temp_data.headerBackColor = "#85f19e";
        temp_data.btnText = "Ok"
        break;
    }
    temp_data.task_type = task_type;

    setSelectedTask(temp_data);

    setShowTaskDetailsModal(true);
  }

  const chooseUserHandler = (event, index) => {
    const decoded = jwtDecode(token);

    Array.from(document.getElementById("tasks-employees-by-department").children).forEach((el)=>{
      el.style.backgroundColor = "white";
      el.style.fontWeight = "normal";
      el.style.color = "black";
    })
    event.target.style.backgroundColor = "#ccc";
    event.target.style.fontWeight = "500";
    event.target.style.color = "black";
    
    axios.get(`${keys.ServerConnection}/Task/employeeFor/${currentDepEmployees[index].id}/employeeFrom/${decoded.nameid}`, {headers: {
      Authorization:`Bearer ${token}`
    }})
    .then((res) => {
      console.log("res: ", res.data);
      res.data.forEach(el => {
        el.deadLineDate = DateReduction(el.deadLineDate);
        el.uploadDate = DateReduction(el.uploadDate);
        el.doneDate = el.isDone? DateReduction(el.doneDate) : el.doneDate;}
      );

      setObligatoryTasksForEmp(res.data.filter(t => (new Date(t.deadLineDate) > new Date()) && !t.isDone && t.employeeFor_Id));
      setExpiredTasksForEmp(res.data.filter(t => (new Date(t.deadLineDate) < new Date()) && !t.isDone && t.employeeFor_Id));
      setOptionalTasksForEmp(res.data.filter(t => !t.isDone && !t.employeeFor_Id));
      setDoneTasksForEmp(res.data.filter(t => t.isDone));
      setSelectedEmp(currentDepEmployees[index]);
    })
    .catch(err=>{
      if(err.response && err.response.status===401){
        signOut();
      }
      else{
        console.log(err);
      }
    });
  }

  const createTaskHandler = () => {
    const decoded = jwtDecode(token);

    /* ------------------------ To do ---------------------------
    /////////////////////////////////////////////////////////////
                          Add validation 
    /////////////////////////////////////////////////////////////
    -----------------------------------------------------------*/

    console.log("data for create: ", {
      deadLineDate: document.getElementById("create-task-deadline").value,
      header: document.getElementById("create-task-header").value,
      text: document.getElementById("create-task-text").value,
      file: taskFilePath,
      doneFile: "doneFile",
      cover: coverFilePath,
      isDone: false,
      projectId: projects.filter(p => p.projectName == document.getElementById("create-task-project").value)[0].projectId,
      employeeFor_Id: currentDepEmployees.filter(e => e.lastName + " " + e.firstName == document.getElementById("create-task-employeeFor").value)[0].id,
      employeeFrom_Id: parseInt(decoded.nameid)
    });
    axios.post(`${keys.ServerConnection}/Task`, 
    {
      deadLineDate: document.getElementById("create-task-deadline").value,
      header: document.getElementById("create-task-header").value,
      text: document.getElementById("create-task-text").value,
      file: taskFilePath,
      doneFile: "doneFile",
      cover: coverFilePath,
      isDone: false,
      projectId: projects.filter(p => p.projectName == document.getElementById("create-task-project").value)[0].projectId,
      employeeFor_Id: currentDepEmployees.filter(e => e.lastName + " " + e.firstName == document.getElementById("create-task-employeeFor").value)[0].id,
      employeeFrom_Id: parseInt(decoded.nameid)
    },
    {headers: {Authorization:`Bearer ${token}`}})
    .then(() => {
      setShowTaskCreateModal(false);

      setNotification({
        ...notification,
        show: true,
        text: `Task added to ${document.getElementById("create-task-employeeFor").value}`,
        color: "success",
        icon: "fa-regular fa-circle-check"
      });

      forceReload();
    })
  }

  return(
    <div className="task-page-container">
      <ModalWindow
        title="Task details"
        show={showTaskDetailsModal} 
        handleClose={() => setShowTaskDetailsModal(false)} 
        handleConfirm={() => setShowTaskDetailsModal(false)}
        confirmText={selectedTask.btnText}
        confirmBtnColor={selectedTask.confirmBtnColor}
        cancelText="Cancel"
        headerBackgroundColor={selectedTask.headerBackColor}>
      <div id="modal-task-details">
        <div class="col-md-12">
          <h2 className="text-center" style={{marginBottom: "15px"}}>{selectedTask.header}</h2>
          <div className="task-cover" style={{marginBottom: "15px"}}>
            <img src={`${selectedTask.cover}`} className="task-cover" alt="Task Cover"/>
          </div>
          <p>{selectedTask.text}</p>
        </div>
        <div class="col-md-9" style={{marginBottom: "10px"}}>
          <div class="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h5>Task file:</h5>
            <a href="task-file.pdf" class="btn btn-success" download>Download File <i class="fa-solid fa-file-arrow-down"></i></a>
          </div>
          {
            selectedTask.task_type == "done" && 
            <div class="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h5>Done task file:</h5>
              <a href="done-task-file.pdf" class="btn btn-success" download>Download File <i class="fa-solid fa-file-arrow-down"></i></a>
            </div>
          }
        </div>
        <div class="col-md-12" style={{textAlign: "right", marginTop: "40px", color: "#555"}}>
          <h6>Uploaded: <b style={{color: "black"}}>{selectedTask.uploadDate}</b></h6>
          <h6>Deadline: <b style={{color: "red"}}>{selectedTask.deadLineDate}</b></h6>
        </div>
      </div>
      </ModalWindow>

      <ModalWindow
        title="Task creating"
        show={showTaskCreateModal} 
        handleClose={() => setShowTaskCreateModal(false)} 
        handleConfirm={createTaskHandler}
        confirmText="Create"
        cancelText="Cancel"
        headerBackgroundColor={selectedTask.headerBackColor}>
      <div id="modal-task-details">
        <form>
          <div className="row">
            <div className="col-md-3" style={{display: "flex", alignItems: "center", marginBottom: "0"}}>
              <label>Header</label>
            </div>
            <div className="col-md-9">
              <input type="text" className="form-control" required={true} id="create-task-header"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 mt-1">
              <label>Cover</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_covers" id="create-task-cover" setFile={setCoverFilePath}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 mb-2" style={{display: "flex", alignItems: "center", marginBottom: "0"}}>
              <label>Description</label>
            </div>
            <div className="col-md-12">
              <textarea type="text" rows={3} className="form-control" required={true}  id="create-task-text"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 mb-2">
              <label>Project</label>
            </div>
            <div className="col-md-6 mb-2">
              <label style={{marginLeft: "18px"}}>Employee for</label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <SelectSearch options={projects.map(p => p.projectName)} id="create-task-project"/>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <SelectSearch options={currentDepEmployees.map(employee => employee.lastName + " " + employee.firstName)} id="create-task-employeeFor"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 mt-1">
              <label>Task file</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_files" id="create-task-file" setFile={setTaskFilePath}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 d-flex align-items-center mt-2">
              <label>Deadline</label>
            </div>
            <div className="col-md-9">
              <input type="date" className="form-control" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} id="create-task-deadline"/>
            </div>
          </div>
        </form>
      </div>
      </ModalWindow>

      <Notification
        show={notification.show}
        setShow={notification.setShow}
        text={notification.text}
        color={notification.color}
        icon={notification.icon}
        corner={notification.corner}
      ></Notification>

      <div className="container mt-5">
        <h1 className="text-center mb-4">Tasks</h1>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="all-tasks-tab" data-toggle="pill" href="#all-tasks" role="tab" aria-controls="all-tasks" aria-selected="true">All tasks</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="obligatory-tab" data-toggle="pill" href="#obligatory" role="tab" aria-controls="obligatory" aria-selected="false">Obligatory</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="optional-tab" data-toggle="pill" href="#optional" role="tab" aria-controls="optional" aria-selected="false">Optional</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="done-tab" data-toggle="pill" href="#done" role="tab" aria-controls="done" aria-selected="false">Done</a>
            </li>
            {
              currentEmployee &&
              <li className="nav-item">
                <a className="nav-link" id="manage-tasks-tab" data-toggle="pill" href="#manage-tasks" role="tab" aria-controls="manage-tasks" aria-selected="false">Manage tasks</a>
              </li>
            }
        </ul>
        <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="all-tasks" role="tabpanel" aria-labelledby="all-tasks-tab">
                <div className="row">
                    <div className="col-12 my-3">
                      <h3>Obligatory</h3>
                    </div>
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (obligatoryTasks.length == 0? <h4 className="noTasks">No obligatory tasks yet</h4> 
                      :
                        obligatoryTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("obligatory", index)}>
                          <div className="task-container task-obligatory">
                              <div className="task-cover">
                                  <img src={task.cover} alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    {
                      !isTasksLoading && expiredTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>Overdue</h3>
                      </div>
                    }
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (expiredTasks.length == 0? <div></div>
                      :
                      expiredTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("overdue", index)}>
                          <div className="task-container task-overdue" style={{position: "relative"}}>
                              <div className="task-cover">
                                  <img src={task.cover} alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                              </div>
                              <div style={{position: "absolute", bottom: "3px", right: "13px"}}>
                                <h6>Expired</h6>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    {
                      !isTasksLoading && optionalTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>Optional</h3>
                      </div>
                    }
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (optionalTasks.length == 0? <div></div>
                      :
                      optionalTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("optional", index)}>
                          <div className="task-container task-optional">
                              <div className="task-cover">
                                <img src={task.cover} alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    <div className="col-12 my-3">
                        <h3>Done</h3>
                    </div>
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (doneTasks.length == 0? <h4 className="noTasks">No done tasks yet</h4>
                      :
                      doneTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("done", index)}>
                          <div className="task-container task-done">
                              <div className="task-cover">
                                <img src={task.cover} alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                                <p className="task-done-date">Done Date: {task.doneDate}</p>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                </div>
            </div>
            <div className="tab-pane fade" id="obligatory" role="tabpanel" aria-labelledby="obligatory-tab">
                <div className="row">
                  <div className="col-12 my-3">
                    <h3>Obligatory</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (obligatoryTasks.length == 0? <h4 className="noTasks">No obligatory tasks yet</h4> 
                    :
                      obligatoryTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("obligatory", index)}>
                        <div className="task-container task-obligatory">
                            <div className="task-cover">
                                <img src={task.cover} alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                            </div>
                        </div>
                      </div>
                      ))
                    )
                  }
                  {
                      !isTasksLoading && expiredTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>Overdue</h3>
                      </div>
                    }
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (expiredTasks.length == 0? <div></div>
                      :
                      expiredTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("overdue", index)}>
                          <div className="task-container task-overdue" style={{position: "relative"}}>
                              <div className="task-cover">
                                  <img src={task.cover} alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                              </div>
                              <div style={{position: "absolute", bottom: "3px", right: "13px"}}>
                                <h6>Expired</h6>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                </div>
            </div>
            <div className="tab-pane fade" id="optional" role="tabpanel" aria-labelledby="optional-tab">
                <div className="row">
                  <div className="col-12 my-3">
                    <h3>Optional</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (optionalTasks.length == 0? <h4 className="noTasks">No optional tasks yet</h4>
                    :
                    optionalTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("optional", index)}>
                        <div className="task-container task-optional">
                            <div className="task-cover">
                              <img src={task.cover} alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                            </div>
                        </div>
                      </div>
                      ))
                    )
                  }
                </div>
            </div>
            <div className="tab-pane fade" id="done" role="tabpanel" aria-labelledby="done-tab">
                <div className="row">
                  <div className="col-12 my-3">
                    <h3>Done</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (doneTasks.length == 0? <h4 className="noTasks">No done tasks yet</h4>
                    :
                    doneTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("done", index)}>
                        <div className="task-container task-done">
                            <div className="task-cover">
                              <img src={task.cover} alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">Deadline: {task.deadLineDate}</p>
                              <p className="task-done-date">Done Date: {task.doneDate}</p>
                            </div>
                        </div>
                      </div>
                      ))
                    )
                  }
                </div>
            </div>
            {
              currentEmployee && 
              <div className="tab-pane fade" id="manage-tasks" role="tabpanel" aria-labelledby="manage-tasks-tab">
              <div class="row" style={{marginTop: "30px"}}>
                {
                  currentDepEmployees.length > 0 && 
                  <div class="col-md-4">
                    <h4>Choose employee</h4>
                    <br />
                    <input type="text" class="form-control mb-3" placeholder="Search users by name" />
                    <div class="user-list list-group" id="tasks-employees-by-department">
                      {
                        currentDepEmployees.map((emp, index) => (
                          <div class="list-group-item list-group-item-action" key={index} onClick={(event) => chooseUserHandler(event, index)} style={{cursor: "pointer"}}>{emp.lastName + " " + emp.firstName}</div>
                        ))
                      }
                    </div>
                  </div>
                }
                { 
                !selectedEmp.id ? <h4 style={{margin: "60px 20px"}}>Choose employee to manage his tasks</h4> 
                :
                !obligatoryTasksForEmp && !expiredTasksForEmp && !optionalTasks && !doneTasksForEmp ? <h3 style={{margin: "60px 20px"}}>That employee has no tasks, <span style={{color: "#007BFF", cursor: "pointer", fontWeight: "450"}}><i>create new one</i></span></h3>
                :
                <div class="col-md-8">
                  <h4 style={{marginBottom: "15px"}}>Obligatory</h4>
                  <div class="row">
                  {
                    obligatoryTasksForEmp.length == 0? <h4 className="noTasks">No obligatory tasks for {selectedEmp.lastName + " " + selectedEmp.firstName}, <span style={{color: "#007BFF", cursor: "pointer", fontWeight: "450"}}><i>create new one</i></span></h4> : obligatoryTasksForEmp.map((task, index) => (
                      <div class="col-md-4" key={index}>
                        <div class="task-container task-obligatory">
                          <div class="task-cover">
                            <img src={`https://localhost:7250/api/Files/download${task.cover}`} alt="cover" class="img-fluid" />
                          </div>
                          <div class="task-content">
                            <h5 class="task-title">{task.header}</h5>
                            <p class="task-deadline">Deadline: {task.deadLineDate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  <div class="col-md-4">
                    <div class="task-container task-obligatory-add" onClick={() => setShowTaskCreateModal(true)}>
                      <p>+</p>
                    </div>
                  </div>
                  </div>
                  { expiredTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>Overdue</h4> }
                  {
                    expiredTasksForEmp.length > 0 && 
                    <div class="row">
                    {
                      expiredTasksForEmp.map((task, index) => (
                        <div class="col-md-4" key={index}>
                          <div class="task-container task-overdue">
                            <div class="task-cover">
                              <img src={task.cover} alt="cover" class="img-fluid" />
                            </div>
                            <div class="task-content">
                              <h5 class="task-title">{task.header}</h5>
                              <p class="task-deadline">Deadline: {task.deadLineDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  }

                  { optionalTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>Optional</h4> }
                  {
                    optionalTasksForEmp.length > 0 && 
                    <div class="row">
                    {
                      optionalTasksForEmp.map((task, index) => (
                        <div class="col-md-4" key={index}>
                          <div class="task-container task-optional">
                            <div class="task-cover">
                              <img src={task.cover} alt="cover" class="img-fluid" />
                            </div>
                            <div class="task-content">
                              <h5 class="task-title">{task.header}</h5>
                              <p class="task-deadline">Deadline: {task.deadLineDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  }

                  { doneTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>Done</h4> }
                  {
                    doneTasksForEmp.length > 0 && 
                    <div class="row">
                    {
                      doneTasksForEmp.map((task, index) => (
                        <div class="col-md-4" key={index}>
                          <div class="task-container task-done">
                            <div class="task-cover">
                              <img src={task.cover} alt="cover" class="img-fluid" />
                            </div>
                            <div class="task-content">
                              <h5 class="task-title">{task.header}</h5>
                              <p class="task-deadline">Deadline: {task.deadLineDate}</p>
                              <p>Done: {task.doneDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  }
                </div>
                }
                {/**/}
              </div>
            </div>
            }
        </div>
    </div>
    </div>  
  )
};

export{Tasks};