import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import DateReduction from "../../Function/DateReduction.js"
import SelectSearch from "../../Components/UI/SelectSearch/SelectSearch";
import ModalWindow from "../../Components/Other/ModalWindow/ModalWindow.js";
import Notification from "../../Components/Other/Notification/Notification.js";

import "./Tasks.css";

const Tasks=()=>{
  const {token, signOut} = useAuth();
  const [reload, setReload] = useState(false);

  const [obligatoryTasks, setObligatoryTasks] = useState([]);
  const [expiredTasks, setExpiredTasks] = useState([]);
  const [optionalTasks, setOptionalTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({headerBackColor: "white"});

  const [isTasksLoading, setIsTasksLoading] = useState(true);

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);

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
        setOptionalTasks(res.data.filter(t => !t.isDone && !t.employeeFor_Id));
        setDoneTasks(res.data.filter(t => t.isDone));

        console.log(res.data);
      })
      .then(() => {
        setIsTasksLoading(false);
      })
      .catch(err=>{
        if(err.response.status===401)
          signOut();
      });
    }
  }, [token, reload]);

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
          <div class="file-upload" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h5>Task file:</h5>
            <a href="task-file.pdf" class="btn btn-success" download>Download File <i class="fa-solid fa-file-arrow-down"></i></a>
          </div>
          {
            selectedTask.task_type == "done" && 
            <div class="file-upload" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
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
        </div>
    </div>
    </div>  
  )
};

export{Tasks};