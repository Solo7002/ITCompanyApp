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
import { useTranslation } from "react-i18next";

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
  const [showTaskUploadDoneModal, setShowTaskUploadDoneModal] = useState(false);
  const [showTaskDetailsInMangeModal, setShowTaskDetailsInMangeModal] = useState(false);
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const [showTaskDeleteModal, setShowTaskDeleteModal] = useState(false);
  
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [currentDepEmployees, setCurrentDepEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState({});
  const [empsSeachInput, setEmpsSeachInput] = useState("");
  const [tempChoosenIndex, setTempChoosenIndex] = useState(0);
  const [tempProjectName, setTempProjectName] = useState("");
  const [tempEmployeeName, setTempEmployeeName] = useState("");

  const [coverFilePath, setCoverFilePath] = useState("");
  const [taskFilePath, setTaskFilePath] = useState("");
  const [doneTaskFilePath, setDoneTaskFilePath] = useState("");

  const {t}=useTranslation();
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
          el.doneDate = el.isDone? DateReduction(el.doneDate) : el.doneDate;
        });

        setObligatoryTasks(res.data.filter(t => (new Date(t.deadLineDate) > new Date()) && !t.isDone && t.employeeFor_Id));
        setExpiredTasks(res.data.filter(t => (new Date(t.deadLineDate) < new Date()) && !t.isDone && t.employeeFor_Id));

        axios.get(`${keys.ServerConnection}/Employee/${decoded.nameid}`, {headers: {Authorization:`Bearer ${token}`}})
        .then(res2 => {
          axios.get(`${keys.ServerConnection}/Department/${res2.data.departmentId}`, {headers: {Authorization:`Bearer ${token}`}})
          .then(res3 => {
            setOptionalTasks(res.data.filter(t => !t.isDone && !t.employeeFor_Id && t.employeeFor_Id != decoded.nameid && t.employeeFrom_Id == res3.data.departmentHeadId));
          });
        });
        
        setDoneTasks(res.data.filter(t => t.isDone));
      })
      .then(() => {
        setIsTasksLoading(false);
      })
      .catch(err=>{
        if(err.response && err.response.status===401)
          signOut();
      });

      axios.get(`${keys.ServerConnection}/Department/checkIfHead/${decoded.nameid}`, {headers: {
        Authorization:`Bearer ${token}`
      }})
      .then(res => {
        setCurrentEmployee(res.data);
        
        if (res.data){
          let depId;
          axios.get(`${keys.ServerConnection}/Department`, {headers: {
            Authorization:`Bearer ${token}`
          }})
          .then(res2 => {
            axios.get(`${keys.ServerConnection}/Employee/byDepartmentId/${res2.data.filter(d => d.departmentHeadId == res.data.id)[0].departmentId}`, {headers: {
              Authorization:`Bearer ${token}`
            }})
            .then(res3 => {
              setCurrentDepEmployees(res3.data.filter(e => e.id != decoded.nameid))
            })
            .catch(err=>{
              if(err.response.status===401){
                signOut();
              }
            });
          })
          .catch(err=>{
            if(err.response && err.response.status===401){
              signOut();
            }
          });
        }
      })
      .catch(err=>{
        if(err.response && err.response.status===401){
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
    console.log("force reload!");
    setReload(!reload);
  }

  const openDetailsModalWindow = (task_type, task_index) => {
    let temp_data = {};
    switch (task_type){
      case "obligatory": 
        temp_data = obligatoryTasks[task_index];
        temp_data.headerBackColor = "#d1ecf1";
        temp_data.btnText = t("Tasks.UploadDoneTask");
        break;
      case "overdue": 
        temp_data = expiredTasks[task_index];
        temp_data.headerBackColor = "#d4555f";
        temp_data.btnText = t("Tasks.UploadDoneTask");
        break;
      case "optional": 
        temp_data = optionalTasks[task_index];
        temp_data.headerBackColor = "#fedf77";
        temp_data.btnText =  t("Tasks.Claim");
        temp_data.confirmBtnColor = "warning"
        break;
      case "done": 
        temp_data = doneTasks[task_index];
        temp_data.headerBackColor = "#85f19e";
        temp_data.btnText = t("Tasks.Ok");
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
      setTempChoosenIndex(index);

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

  const isTaskValid = (taskHeaderInput, taskDescriptionInput, taskCoverInput, taskProjectInput, taskEmployeeInput, taskFileInput, taskDeadLineInput, isEdit) => {
    if (taskHeaderInput.value.trim() === ''){
      taskHeaderInput.setCustomValidity(t("Tasks.HeaderIsRequired"));
      taskHeaderInput.reportValidity();
    }
    else if (taskDescriptionInput.value.trim() === ''){
      taskDescriptionInput.setCustomValidity(t("Tasks.DescriptionIsRequired"));
      taskDescriptionInput.reportValidity();
    }
    else if (!isEdit && taskCoverInput.value.trim() === ''){
      taskCoverInput.setCustomValidity(t("Tasks.CoverIsRequired"));
      taskCoverInput.reportValidity();
    }
    else if (isEdit && taskCoverInput.value.trim() === '' && !coverFilePath){
      taskCoverInput.setCustomValidity(t("Tasks.CoverIsRequired"));
      taskCoverInput.reportValidity();
    }
    else if (taskProjectInput.value.trim() === ''){
      taskProjectInput.setCustomValidity(t("Tasks.ProjectIsRequired"));
      taskProjectInput.reportValidity();
    }
    else if (projects.filter(p => p.projectName.toLowerCase() == taskProjectInput.value.toLowerCase()).length == 0){
      taskProjectInput.setCustomValidity(t("Tasks.NoProjectsWithSuchName"));
      taskProjectInput.reportValidity();
    }
    else if (taskEmployeeInput.value.trim() != '' && currentDepEmployees.filter(e => e.lastName.toLowerCase() + " " + e.firstName.toLowerCase() == taskEmployeeInput.value.toLowerCase()).length == 0){
      taskProjectInput.setCustomValidity(t("Tasks.NoEmployeesWithSuchName"));
      taskProjectInput.reportValidity();
    }
    else if (!isEdit && taskFileInput.value.trim() === ''){
      taskFileInput.setCustomValidity(t("Tasks.FileIsRequired"));
      taskFileInput.reportValidity();
    }
    else if (isEdit && taskFileInput.value.trim() === '' && !taskFilePath){
      taskFileInput.setCustomValidity(t("Tasks.FileIsRequired"));
      taskFileInput.reportValidity();
    }
    else if (taskDeadLineInput.value.trim() === ''){
      taskDeadLineInput.setCustomValidity(t("Tasks.DeadlineIsRequired"));
      taskDeadLineInput.reportValidity();
    }
    else {
      return true;
    }
    return false;
  }

  const createTaskHandler = () => {
    const decoded = jwtDecode(token);

    const taskModel = {
      header: document.getElementById("create-task-header"),
      text: document.getElementById("create-task-text"),
      cover: document.getElementById("create-task-cover"),
      project: document.getElementById("create-task-project"),
      employeeFor: document.getElementById("create-task-employeeFor"),
      file: document.getElementById("create-task-file"),
      deadline: document.getElementById("create-task-deadline")
    }

    if (isTaskValid(taskModel.header, taskModel.text, taskModel.cover, taskModel.project, taskModel.employeeFor, taskModel.file, taskModel.deadline, false)){
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
        employeeFor_Id: document.getElementById("create-task-employeeFor").value? currentDepEmployees.filter(e => e.lastName + " " + e.firstName == document.getElementById("create-task-employeeFor").value)[0].id : null,
        employeeFrom_Id: parseInt(decoded.nameid)
      },
      {headers: {Authorization:`Bearer ${token}`}})
      .then(() => {
        setShowTaskCreateModal(false);

        setNotification({
          ...notification,
          show: true,
          text: `${t("Tasks.Task added to")} ${document.getElementById("create-task-employeeFor").value}`,
          color: "success",
          icon: "fa-regular fa-circle-check"
        });

        document.getElementById("create-task-header").value = document.getElementById("create-task-text").value = document.getElementById("create-task-cover").value = document.getElementById("create-task-project").value = document.getElementById("create-task-employeeFor").value = document.getElementById("create-task-file").value = document.getElementById("create-task-deadline").value = "";
  
        forceReload();
        document.getElementById("tasks-employees-by-department").children[tempChoosenIndex].click();
      });
    }
  }

  const confirmFromDetailsHandler = () => {
    if (selectedTask.isDone){
      setShowTaskDetailsModal(false);
    }
    else if (selectedTask.employeeFor_Id){
      uploadConfirmInDetailsHandler();
    }
    else{
      claimInDetailsHandler();
    }
  }

  const claimInDetailsHandler = () => {
    const decoded = jwtDecode(token);
    console.log(`${keys.ServerConnection}/Task/claim/${selectedTask.taskId}/${decoded.nameid}`);

    axios.put(`${keys.ServerConnection}/Task/claim/${selectedTask.taskId}/${decoded.nameid}`, {}, {headers: {
      Authorization:`Bearer ${token}`
    }}).then(() => {
      setShowTaskDetailsModal(false);

      setNotification({
        ...notification,
        show: true,
        text: `${t("Tasks.Task claimed successfully")}`,
        color: "success",
        icon: "fa-regular fa-circle-check"
      });

      forceReload();
    });
  }

  const uploadConfirmInDetailsHandler = () => {
    setShowTaskDetailsModal(false);
    setShowTaskUploadDoneModal(true);
  }

  const uploadDoneTaskHandler = () => {
    let uploadDoneFileInput = document.getElementById("upload-done-task-file");
    if (uploadDoneFileInput.value.trim() === ''){
      uploadDoneFileInput.setCustomValidity(t("Tasks.Header is required"));
      uploadDoneFileInput.reportValidity();
    }
    else
    {
      uploadDoneFileInput.setCustomValidity("");
      uploadDoneFileInput.reportValidity();

      console.log(doneTaskFilePath);

      axios.put(`${keys.ServerConnection}/Task/setDone/${selectedTask.taskId}`,{
        doneFilePath: doneTaskFilePath
      }, {headers: { Authorization:`Bearer ${token}`,}})
      .then(() => {
        setNotification({
          ...notification,
          show: true,
          text: `${t("Tasks.Done task uploaded successfully")}`,
          color: "success",
          icon: "fa-regular fa-circle-check"
        });

        forceReload();
      });
    }
  }

  const openDetailsInManageModalWindow = (task_type, task_index) => {
    let temp_data = {};
    switch (task_type){
      case "obligatory": 
        temp_data = obligatoryTasksForEmp[task_index];
        temp_data.headerBackColor = "#d1ecf1";
        break;
      case "overdue": 
        temp_data = expiredTasksForEmp[task_index];
        temp_data.headerBackColor = "#d4555f";
        break;
      case "optional": 
        temp_data = optionalTasksForEmp[task_index];
        temp_data.headerBackColor = "#fedf77";
        break;
      case "done": 
        temp_data = doneTasksForEmp[task_index];
        temp_data.headerBackColor = "#85f19e";
        break;
    }
    temp_data.task_type = task_type;

    setSelectedTaskForEmp(temp_data);
    setShowTaskDetailsInMangeModal(true);
  }

  const updateClickInManageHandler = () => {
    setShowTaskUpdateModal(true);
    setShowTaskDetailsInMangeModal(false);

    document.getElementById("update-task-header").value = selectedTaskForEmp.header;
    setCoverFilePath(selectedTaskForEmp.cover);
    document.getElementById("update-task-text").value = selectedTaskForEmp.text;
    setTempProjectName(projects.filter(p => p.projectId == selectedTaskForEmp.projectId)[0].projectName);
    setTempEmployeeName(selectedEmp.lastName + " " + selectedEmp.firstName);
    setTaskFilePath(selectedTaskForEmp.file);
    document.getElementById("update-task-deadline").value = selectedTaskForEmp.deadLineDate;
  }

  const updateTaskHandler = () => {
    const decoded = jwtDecode(token);

    const taskModel = {
      header: document.getElementById("update-task-header"),
      text: document.getElementById("update-task-text"),
      cover: document.getElementById("update-task-cover"),
      project: document.getElementById("update-task-project"),
      employeeFor: document.getElementById("update-task-employeeFor"),
      file: document.getElementById("update-task-file"),
      deadline: document.getElementById("update-task-deadline")
    }

    if (isTaskValid(taskModel.header, taskModel.text, taskModel.cover, taskModel.project, taskModel.employeeFor, taskModel.file, taskModel.deadline, true)){
      axios.put(`${keys.ServerConnection}/Task/${selectedTaskForEmp.taskId}`, 
      {
        deadLineDate: taskModel.deadline.value,
        header: taskModel.header.value,
        text: taskModel.text.value,
        file: taskFilePath,
        doneFile: "",
        cover: coverFilePath,
        isDone: false,
        projectId: projects.filter(p => p.projectName == taskModel.project.value)[0].projectId,
        employeeFor_Id: taskModel.employeeFor.value? currentDepEmployees.filter(e => e.lastName.toLowerCase() + " " + e.firstName.toLowerCase() == taskModel.employeeFor.value.toLowerCase())[0].id : null,
        employeeFrom_Id: parseInt(decoded.nameid)
      },
      {headers: {Authorization:`Bearer ${token}`}})
      .then(() => {
        setShowTaskUpdateModal(false);

        setNotification({
          ...notification,
          show: true,
          text: `${t("Tasks.Task updated successfully")}`,
          color: "success",
          icon: "fa-regular fa-circle-check"
        });

        taskModel.header.value = taskModel.text.value = taskModel.cover.value = taskModel.project.value = taskModel.employeeFor.value = taskModel.file.value = taskModel.deadline.value = "";
        setTempEmployeeName("");
        setTempProjectName("");
        setCoverFilePath("");
        setTaskFilePath("");

        forceReload();
        document.getElementById("tasks-employees-by-department").children[tempChoosenIndex].click();
      });
    }
  }

  const confirmDeletionHandler = () => {
    setShowTaskDeleteModal(true);
    setShowTaskDetailsInMangeModal(false);
  }

  const onDeleteTaskHandler = () => {
    axios.delete(`${keys.ServerConnection}/Task/${selectedTaskForEmp.taskId}`, {headers: {
      Authorization:`Bearer ${token}`
    }})
    .then(() => {
      setShowTaskDeleteModal(false);

      setNotification({
        ...notification,
        show: true,
        text: `${t("Tasks.Task deleted successfully")}`,
        color: "success",
        icon: "fa-regular fa-circle-check"
      });
      
      forceReload();
      document.getElementById("tasks-employees-by-department").children[tempChoosenIndex].click();
    });
  }

  return(
    <div className="task-page-container">
      <ModalWindow
        title={t("Tasks.Task details")}
        show={showTaskDetailsModal} 
        handleClose={() => setShowTaskDetailsModal(false)} 
        handleConfirm={confirmFromDetailsHandler}
        confirmText={selectedTask.btnText}
        confirmBtnColor={selectedTask.confirmBtnColor}
        cancelText={t("Tasks.Cancel")}
        headerBackgroundColor={selectedTask.headerBackColor}>
      <div id="modal-task-details">
        <div className="col-md-12">
          <h2 className="text-center" style={{marginBottom: "15px"}}>{selectedTask.header}</h2>
          <div className="task-cover" style={{marginBottom: "15px"}}>
            <img src={`${keys.ServerConnection}/Files/download${selectedTask.cover}`} className="task-cover" alt="Task Cover"/>
          </div>
          <p style={{wordWrap: "break-word", whiteSpace: "normal"}}>{selectedTask.text}</p>
        </div>
        <div className="col-md-9" style={{marginBottom: "10px"}}>
          <div className="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h5>Task file:</h5>
            <a href={`${keys.ServerConnection}/Files/download${selectedTask.file}`} className="btn btn-success" download>{t("Tasks.Download File")} <i className="fa-solid fa-file-arrow-down"></i></a>
          </div>
          {
            selectedTask.task_type == "done" && 
            <div className="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h5>{t("Tasks.Done task file")}:</h5>
              <a href={`${keys.ServerConnection}/Files/download${selectedTask.doneFile}`} className="btn btn-success" download>{t("Tasks.Download File")} <i className="fa-solid fa-file-arrow-down"></i></a>
            </div>
          }
        </div>
        <div className="col-md-12" style={{textAlign: "right", marginTop: "40px", color: "#555"}}>
          <h6>{t("Tasks.Uploaded")}: <b style={{color: "black"}}>{selectedTask.uploadDate}</b></h6>
          <h6>{t("Tasks.Deadline")}: <b style={{color: "red"}}>{selectedTask.deadLineDate}</b></h6>
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
              <label>{t("Tasks.Header")}</label>
            </div>
            <div className="col-md-9">
              <input type="text" className="form-control" required={true} id="create-task-header" maxLength={50}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 mt-1">
              <label>{t("Tasks.Cover")}</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_covers" id="create-task-cover" setFile={setCoverFilePath} accept="image/png, image/gif, image/jpeg"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 mb-2" style={{display: "flex", alignItems: "center", marginBottom: "0"}}>
              <label>{t("Tasks.Description")}</label>
            </div>
            <div className="col-md-12">
              <textarea type="text" rows={3} className="form-control" required={true}  id="create-task-text" maxLength={250}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 mb-2">
              <label>{t("Tasks.Project")}</label>
            </div>
            <div className="col-md-6 mb-2">
              <label style={{marginLeft: "18px"}}>{t("Tasks.Employee for")}</label>
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
              <label>{t("Tasks.Task file")}</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_files" id="create-task-file" setFile={setTaskFilePath}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 d-flex align-items-center mt-2">
              <label>{t("Tasks.Deadline")}</label>
            </div>
            <div className="col-md-9">
              <input type="date" className="form-control" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} id="create-task-deadline"/>
            </div>
          </div>
        </form>
      </div>
      </ModalWindow>

      <ModalWindow
        title={t("Tasks.Done task upload")}
        show={showTaskUploadDoneModal} 
        handleClose={() => setShowTaskUploadDoneModal(false)} 
        handleConfirm={uploadDoneTaskHandler}
        confirmText={t("Tasks.Upload")}
        cancelText={t("Tasks.Cancel")}>
      <div id="modal-task-details">
          <div className="row">
            <div className="col-md-4 mt-1">
              <label>{t("Tasks.Done task file")}</label>
            </div>
            <div className="col-md-8">
              <FileUpload folder="tasks/task_files" id="upload-done-task-file" setFile={setDoneTaskFilePath}/>
            </div>
          </div>
      </div>
      </ModalWindow>

      <ModalWindow
        title={t("Tasks.Task details")}
        show={showTaskDetailsInMangeModal} 
        handleClose={() => setShowTaskDetailsInMangeModal(false)} 
        handleConfirm={() => selectedTaskForEmp.isDone? setShowTaskDetailsInMangeModal(false) : updateClickInManageHandler()}
        confirmText={selectedTaskForEmp.isDone? t("Tasks.Ok") : t("Tasks.Update")}
        cancelText={t("Tasks.Cancel")}
        headerBackgroundColor={selectedTaskForEmp.isDone? "primary" : selectedTaskForEmp.headerBackColor}
        >
      <div id="modal-task-details-2">
        <div className="col-md-12">
          <h2 className="text-center mb-3">{selectedTaskForEmp.header}</h2>
          <div className="task-cover mb-3">
            <img src={`${keys.ServerConnection}/Files/download${selectedTaskForEmp.cover}`} className="task-cover" alt="Task Cover"/>
          </div>
          <p style={{wordWrap: "break-word", whiteSpace: "normal"}}>{selectedTaskForEmp.text}</p>
        </div>
        <div className="col-md-9 mb-2">
          <div className="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h5>{t("Tasks.Task file")}:</h5>
            <a href={`${keys.ServerConnection}/Files/download${selectedTaskForEmp.file}`} className="btn btn-success" download>{t("Tasks.Download File")} <i className="fa-solid fa-file-arrow-down"></i></a>
          </div>
          {
            selectedTaskForEmp.task_type == "done" && 
            <div className="file-download" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h5>{t("Tasks.Done task file")}:</h5>
              <a href={`${keys.ServerConnection}/Files/download${selectedTaskForEmp.doneFile}`} className="btn btn-success" download>{t("Tasks.Download File")} <i className="fa-solid fa-file-arrow-down"></i></a>
            </div>
          }
        </div>
        <div className="col-md-12" style={{textAlign: "right", marginTop: "40px", color: "#555"}}>
          <h6>{t("Tasks.Uploaded")}: <b style={{color: "black"}}>{selectedTaskForEmp.uploadDate}</b></h6>
          <h6>{t("Tasks.Deadline")}: <b style={{color: "red"}}>{selectedTaskForEmp.deadLineDate}</b></h6>
        </div>
        <div className="col-md-12">
          <button className="btn btn-danger" style={{width: "100%"}} onClick={confirmDeletionHandler}>{t("Tasks.Delete")}</button>
        </div>
      </div>
      </ModalWindow>

      <ModalWindow
        title={t("Tasks.Task editing")}
        show={showTaskUpdateModal} 
        handleClose={() => setShowTaskUpdateModal(false)} 
        handleConfirm={updateTaskHandler}
        confirmText={t("Tasks.Update")}
        cancelText={t("Tasks.Cancel")}
        headerBackgroundColor={selectedTaskForEmp.headerBackColor}>
      <div id="modal-update-task-details">
        <form>
          <div className="row">
            <div className="col-md-3" style={{display: "flex", alignItems: "center", marginBottom: "0"}}>
              <label>{t("Tasks.Header")}</label>
            </div>
            <div className="col-md-9">
              <input type="text" className="form-control" required={true} id="update-task-header" maxLength={50}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 mt-1">
              <label>{t("Tasks.Cover")}</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_covers" id="update-task-cover" setFile={setCoverFilePath} accept="image/png, image/gif, image/jpeg"/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 mb-2" style={{display: "flex", alignItems: "center", marginBottom: "0"}}>
              <label>{t("Tasks.Description")}</label>
            </div>
            <div className="col-md-12">
              <textarea type="text" rows={3} className="form-control" required={true}  id="update-task-text" maxLength={250}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 mb-2">
              <label>{t("Tasks.Project")}</label>
            </div>
            <div className="col-md-6 mb-2">
              <label style={{marginLeft: "18px"}}>{t("Tasks.Employee for")}</label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <SelectSearch options={projects.map(p => p.projectName)} id="update-task-project" value={tempProjectName}/>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <SelectSearch options={currentDepEmployees.map(employee => employee.lastName + " " + employee.firstName)} id="update-task-employeeFor" value={tempEmployeeName}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 mt-1">
              <label>{t("Tasks.Task file")}</label>
            </div>
            <div className="col-md-9  ">
              <FileUpload folder="tasks/task_files" id="update-task-file" setFile={setTaskFilePath}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3 d-flex align-items-center mt-2">
              <label>{t("Tasks.Deadline")}</label>
            </div>
            <div className="col-md-9">
              <input type="date" className="form-control" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} id="update-task-deadline"/>
            </div>
          </div>
        </form>
      </div>
      </ModalWindow>

      <ModalWindow
        title={t("Tasks.Confirm deletion")}
        show={showTaskDeleteModal} 
        handleClose={() => setShowTaskDeleteModal(false)} 
        handleConfirm={onDeleteTaskHandler}
        confirmText={t("Tasks.Yes")} 
        cancelText={t("Tasks.Cancel")} >
        <p>{t("Tasks.Are you sure that you want to delete that task?")}</p>
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
        <h1 className="text-center mb-4">{t("Tasks.Tasks")}</h1>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="all-tasks-tab" data-toggle="pill" href="#all-tasks" role="tab" aria-controls="all-tasks" aria-selected="true">{t("Tasks.All tasks")}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="obligatory-tab" data-toggle="pill" href="#obligatory" role="tab" aria-controls="obligatory" aria-selected="false">{t("Tasks.Obligatory")}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="optional-tab" data-toggle="pill" href="#optional" role="tab" aria-controls="optional" aria-selected="false">{t("Tasks.Optional")}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="done-tab" data-toggle="pill" href="#done" role="tab" aria-controls="done" aria-selected="false">{t("Tasks.Done")}</a>
            </li>
            {
              currentEmployee && currentDepEmployees.length > 0 &&
              <li className="nav-item">
                <a className="nav-link" id="manage-tasks-tab" data-toggle="pill" href="#manage-tasks" role="tab" aria-controls="manage-tasks" aria-selected="false">{t("Tasks.Manage tasks")}</a>
              </li>
            }
        </ul>
        <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="all-tasks" role="tabpanel" aria-labelledby="all-tasks-tab">
                <div className="row">
                    <div className="col-12 my-3">
                      <h3>{t("Tasks.Obligatory")}</h3>
                    </div>
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (obligatoryTasks.length == 0? <h4 className="noTasks">{t("Tasks.No obligatory tasks yet")}</h4> 
                      :
                        obligatoryTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("obligatory", index)}>
                          <div className="task-container task-obligatory">
                              <div className="task-cover">
                                  <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    {
                      !isTasksLoading && expiredTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>{t("Tasks.Overdue")}</h3>
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
                                  <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              </div>
                              <div style={{position: "absolute", bottom: "3px", right: "13px"}}>
                                <h6>{t("Tasks.Expired")}</h6>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    {
                      !isTasksLoading && optionalTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>{t("Tasks.Optional")}</h3>
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
                                <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              </div>
                          </div>
                        </div>
                        ))
                      )
                    }
                    <div className="col-12 my-3">
                        <h3>{t("Tasks.Done")}</h3>
                    </div>
                    {
                      isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                      :
                      (doneTasks.length == 0? <h4 className="noTasks">{t("Tasks.No done tasks yet")}</h4>
                      :
                      doneTasks.map((task, index) => (
                        <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("done", index)}>
                          <div className="task-container task-done">
                              <div className="task-cover">
                                <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                                <p className="task-done-date">{t("Tasks.Done Date")}: {task.doneDate}</p>
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
                    <h3>{t("Tasks.Obligatory")}</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (obligatoryTasks.length == 0? <h4 className="noTasks">{t("Tasks.No obligatory tasks yet")}</h4> 
                    :
                      obligatoryTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("obligatory", index)}>
                        <div className="task-container task-obligatory">
                            <div className="task-cover">
                                <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                                <h5 className="task-title">{task.header}</h5>
                                <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                            </div>
                        </div>
                      </div>
                      ))
                    )
                  }
                  {
                      !isTasksLoading && expiredTasks.length != 0 &&
                      <div className="col-12 my-3">
                        <h3>{t("Tasks.Overdue")}</h3>
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
                                  <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                              </div>
                              <div className="task-content">
                                  <h5 className="task-title">{task.header}</h5>
                                  <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              </div>
                              <div style={{position: "absolute", bottom: "3px", right: "13px"}}>
                                <h6>{t("Tasks.Expired")}</h6>
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
                    <h3>{t("Tasks.Optional")}</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (optionalTasks.length == 0? <h4 className="noTasks">{t("Tasks.No optional tasks yet")}</h4>
                    :
                    optionalTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("optional", index)}>
                        <div className="task-container task-optional">
                            <div className="task-cover">
                              <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
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
                    <h3>{t("Tasks.Done")}</h3>
                  </div>
                  {
                    isTasksLoading ? <h4 className="noTasks">Loading ....</h4> 
                    :
                    (doneTasks.length == 0? <h4 className="noTasks">{t("Tasks.No done tasks yet")}</h4>
                    :
                    doneTasks.map((task, index) => (
                      <div className="col-md-3" key={index} onClick={() => openDetailsModalWindow("done", index)}>
                        <div className="task-container task-done">
                            <div className="task-cover">
                              <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              <p className="task-done-date">{t("Tasks.Done Date")}: {task.doneDate}</p>
                            </div>
                        </div>
                      </div>
                      ))
                    )
                  }
                </div>
            </div>
            {
              currentEmployee && currentDepEmployees.length > 0 &&
              <div className="tab-pane fade" id="manage-tasks" role="tabpanel" aria-labelledby="manage-tasks-tab">
              <div className="row" style={{marginTop: "30px"}}>
                {
                  currentDepEmployees.length > 0 && 
                  <div className="col-md-4">
                    <h4>{t("Tasks.Choose employee")}</h4>
                    <br />
                    <input type="text" className="form-control mb-3" placeholder="Search users by name" id="seach-users-in-tasks" value={empsSeachInput} onChange={(event) => setEmpsSeachInput(event.target.value)}/>
                    <div className="user-list list-group" id="tasks-employees-by-department">
                      {
                        (empsSeachInput.length > 0 ? currentDepEmployees.filter(e => 
                          e.lastName.toLowerCase().startsWith(empsSeachInput.toLowerCase()) 
                          || 
                          e.firstName.toLowerCase().startsWith(empsSeachInput.toLowerCase()) 
                          ||
                          (e.lastName + " " + e.firstName).toLowerCase().startsWith(empsSeachInput.toLowerCase())
                        ): currentDepEmployees).map((emp, index) => (
                          <div className="list-group-item list-group-item-action" key={index} onClick={(event) => chooseUserHandler(event, index)} style={{cursor: "pointer"}}>{emp.lastName + " " + emp.firstName}</div>
                        ))
                      }
                    </div>
                  </div>
                }
                { 
                !selectedEmp.id ? <h4 style={{margin: "60px 20px"}}>{t("Tasks.Choose employee to manage his tasks")}</h4> 
                :
                obligatoryTasksForEmp.length == 0 && expiredTasksForEmp.length == 0 && optionalTasksForEmp.length == 0 && doneTasksForEmp.length == 0 ? <h3 style={{margin: "60px 20px"}}>{t("Tasks.That employee has no tasks")}, <span style={{color: "#007BFF", cursor: "pointer", fontWeight: "450"}} onClick={() => setShowTaskCreateModal(true)}><i>{t("Tasks.create new one")}</i></span></h3>
                :
                <div className="col-md-8">
                  <h4 style={{marginBottom: "15px"}}>{t("Tasks.Obligatory")}</h4>
                  <div className="row">
                  {
                    obligatoryTasksForEmp.length == 0? <h4 className="noTasks">{t("Tasks.No obligatory tasks for")} {selectedEmp.lastName + " " + selectedEmp.firstName}, <span style={{color: "#007BFF", cursor: "pointer", fontWeight: "450"}} onClick={() => setShowTaskCreateModal(true)}><i>{t("Tasks.create new one")}</i></span></h4> 
                    :
                    obligatoryTasksForEmp.map((task, index) => (
                      <div className="col-md-4" key={index} onClick={() => openDetailsInManageModalWindow("obligatory", index)}>
                        <div className="task-container task-obligatory">
                          <div className="task-cover">
                            <img src={`${keys.ServerConnection}/Files/download${task.cover}`} alt="cover" className="img-fluid" />
                          </div>
                          <div className="task-content">
                            <h5 className="task-title">{task.header}</h5>
                            <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  {
                    obligatoryTasksForEmp.length > 0 
                    &&
                    <div className="col-md-4">
                      <div className="task-container task-obligatory-add" onClick={() => setShowTaskCreateModal(true)}>
                        <p>+</p>
                      </div>
                    </div>
                  }
                  </div>
                  { expiredTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>{t("Tasks.Overdue")}</h4> }
                  {
                    expiredTasksForEmp.length > 0 && 
                    <div className="row">
                    {
                      expiredTasksForEmp.map((task, index) => (
                        <div className="col-md-4" key={index} onClick={() => openDetailsInManageModalWindow("expired", index)}>
                          <div className="task-container task-overdue">
                            <div className="task-cover">
                              <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  }

                  { optionalTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>{t("Tasks.Optional")}</h4> }
                  {
                    optionalTasksForEmp.length > 0 && 
                    <div className="row">
                    {
                      optionalTasksForEmp.map((task, index) => (
                        <div className="col-md-4" key={index} onClick={() => openDetailsInManageModalWindow("optional", index)}>
                          <div className="task-container task-optional">
                            <div className="task-cover">
                              <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  }

                  { doneTasksForEmp.length > 0 && <h4 style={{marginBottom: "15px"}}>{t("Tasks.Done")}</h4> }
                  {
                    doneTasksForEmp.length > 0 && 
                    <div className="row">
                    {
                      doneTasksForEmp.map((task, index) => (
                        <div className="col-md-4" key={index} onClick={() => openDetailsInManageModalWindow("done", index)}>
                          <div className="task-container task-done">
                            <div className="task-cover">
                              <img src={`${keys.ServerConnection}/Files/download${task.cover}`}  alt="cover" className="img-fluid" />
                            </div>
                            <div className="task-content">
                              <h5 className="task-title">{task.header}</h5>
                              <p className="task-deadline mt-2">{t("Tasks.Deadline")}: {task.deadLineDate}</p>
                              <p className="task-deadline">{t("Tasks.Done")}: {task.doneDate}</p>
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