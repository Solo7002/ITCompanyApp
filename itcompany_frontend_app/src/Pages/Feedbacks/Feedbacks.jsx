import { useEffect, useState, useTransition } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import SelectSearch from "../../Components/UI/SelectSearch/SelectSearch";
import ModalWindow from "../../Components/Other/ModalWindow/ModalWindow.js";
import Notification from "../../Components/Other/Notification/Notification.js";

import "./Feedbacks.css";
import { useTranslation } from "react-i18next";

const Feedbacks=()=>{
    const {token} = useAuth();
    const [reload, setReload] = useState(false);

    const [nowEmployeeName, setNowEmployeeName] = useState("");
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [byMeFeedbacks, setByMeFeedbacks] = useState([]);
    const [employeeFeedbacks, setEmployeeFeedbacks] = useState([]);
    const [isMyFeedbacksLoading, setIsMyFeedbacksLoading] = useState(true);
    const [isByMeFeedbacksLoading, setIsByMeFeedbacksLoading] = useState(true);
    const [isEmployeeFeedbacksLoading, setIsEmployeeFeedbacksLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [displayForError, setDisplayForError] = useState("none");
    const [displayForErrorCreate, setDisplayForErrorCreate] = useState("none");
    const [displayForErrorCreate2, setDisplayForErrorCreate2] = useState("none");
    const [showModalWindow, setShowModalWindow] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [tempDelIndex, setTempDelIndex] = useState(0);
    const {signOut}=useAuth()
    const [feedbackForCreate, setFeedbackForCreate] = useState({
        feedBackText: "",
        feedBackMark: 1,
        employeeForName: "",
        employeeFromName: ""
    });
    const [tempMark, setTempMark] = useState(1);


    useEffect(()=>{
        if(token){
            try {
                const decoded = jwtDecode(token);

                axios.get(`${keys.ServerConnection}/Employee/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    setNowEmployeeName(res.data.lastName + " " + res.data.firstName);
                })
                .then(() => {
                    setIsMyFeedbacksLoading(false);
                }).catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });

                axios.get(`${keys.ServerConnection}/Feedback/EmployeeFor/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    console.log("for: ", res.data);
                    setMyFeedbacks(res.data);
                })
                .then(() => {
                    setIsMyFeedbacksLoading(false);
                })
                .catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });

                axios.get(`${keys.ServerConnection}/Feedback/EmployeeFrom/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    console.log("from: ", res.data);
                    setByMeFeedbacks(res.data);
                })
                .then(() => {
                    setIsByMeFeedbacksLoading(false);
                })
                .catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });

                axios.get(`${keys.ServerConnection}/Employee`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    console.log("employees: ", res.data);
                    setEmployees(res.data);
                })
                .catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [token, reload]);

    const forceReload = () => {
        setReload(prev => !prev);
    };

    const btnClickHandler = () => {
        setIsEmployeeFeedbacksLoading(true);

        let empName = document.getElementById("employee-seach-input").value;
        let empId = -1;

        employees.map(employee => {
            console.log(employee.lastName + " " + employee.firstName, " == ", empName, " : ", employee.lastName + " " + employee.firstName == empName);
            if (employee.lastName + " " + employee.firstName == empName){
                empId = employee.id;
            }
        });

        axios.get(`${keys.ServerConnection}/Feedback/EmployeeFor/${empId}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            console.log("Seach: ", res.data);
            setEmployeeFeedbacks(res.data);
            setIsEmployeeFeedbacksLoading(false);
            setDisplayForError("none");
        })
        .catch(err => {
            if(err.response.status===401)
                signOut();
        
            if (err.response && err.response.status === 404){
                setEmployeeFeedbacks([]);
                setDisplayForError("block");
                setIsEmployeeFeedbacksLoading(false);
            }
            else
            {
                console.log("Seach error: ", err);
            }
        });
    }

    const onHoverStarHandler = (event) => {
        setFeedbackForCreate({
            ...feedbackForCreate,
            feedBackMark: event.target.getAttribute("value")
        });
    }

    const onMouseLeaveStarHandler = () => {
        setFeedbackForCreate({
            ...feedbackForCreate,
            feedBackMark: tempMark
        });
    }

    const onClickStarHandler = () => {
        setTempMark(feedbackForCreate.feedBackMark);
    }

    const createFormsSubmitHandler = (event) => {
        event.preventDefault();

        setFeedbackForCreate({
            ...feedbackForCreate,
            employeeFromName: nowEmployeeName
        });
        setFeedbackForCreate({
            ...feedbackForCreate,
            employeeForName: document.getElementById("userForInput").value
        });

        if (document.getElementById("userForInput").value == nowEmployeeName){
            setDisplayForErrorCreate2("block");
            console.log(feedbackForCreate.employeeForName);
            return;
        }

        axios.post(`${keys.ServerConnection}/Feedback`, { 
            employeeFromName: nowEmployeeName, 
            employeeForName: document.getElementById("userForInput").value,
            feedBackMark: feedbackForCreate.feedBackMark,
            feedBackText: feedbackForCreate.feedBackText
         }, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            forceReload();
            setDisplayForErrorCreate("none");
            setDisplayForErrorCreate2("none");
            
            setFeedbackForCreate({
                ...feedbackForCreate,
                feedBackText: "",
                feedBackMark: 1
            });

            setShowNotification(true);
        })
        .catch(err => {
            if(err.response.status===401)
                signOut();
            if (err.response && err.response.status === 404){
                setDisplayForErrorCreate("block");
            }
            else
            {
                console.log("Create error: ", err);
                console.log({ 
                    employeeFromName: nowEmployeeName, 
                    employeeForName: document.getElementById("userForInput").value,
                    feedBackMark: feedbackForCreate.feedBackMark,
                    feedBackText: feedbackForCreate.feedBackText
                 });
            }
        });
    }

    const onDeleteBeforeConfirm = (index) => {
        setTempDelIndex(index);
        setShowModalWindow(true);
    }

    const onDeleteFeedbackHandler = () => {
        axios.delete(`${keys.ServerConnection}/Feedback/${tempDelIndex}`, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            forceReload();
        })
        .catch(err => {
            if(err.response.status===401)
                signOut();
            console.log("Delete error: ", err);
        });

        setShowModalWindow(false);
    }
    const{t}=useTranslation();
    return(
        <div className="feedback-container">
        <div className="container my-5">
            <ModalWindow
                title={t("feedbacks.confirmDeletion")}
                show={showModalWindow} 
                handleClose={() => setShowModalWindow(false)} 
                handleConfirm={onDeleteFeedbackHandler}
                confirmText={t("feedbacks.yes")} 
                cancelText={t("feedbacks.cancel")}>
                <p>{t("feedbacks.deleteFeedbackPrompt")}</p>
            </ModalWindow>
            <Notification
                show={showNotification}
                setShow={setShowNotification}
                text={t("feedbacks.newFeedbackAdded")}
                color="success"
                icon="fa-regular fa-circle-check"
            />

            <h1 className="text-center mb-4">{t("feedbacks.feedbacks")}</h1>
            <ul className="nav nav-tabs" id="reviewsTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="user-reviews-tab" data-bs-toggle="tab" data-bs-target="#user-reviews" type="button" role="tab" aria-controls="user-reviews" aria-selected="true">{t("feedbacks.myFeedbacks")}</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="recent-reviews-tab" data-bs-toggle="tab" data-bs-target="#recent-reviews" type="button" role="tab" aria-controls="recent-reviews" aria-selected="false">{t("feedbacks.feedbacksByMe")}</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="search-reviews-tab" data-bs-toggle="tab" data-bs-target="#search-reviews" type="button" role="tab" aria-controls="search-reviews" aria-selected="false">{t("feedbacks.employeeFeedbacks")}</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="create-review-tab" data-bs-toggle="tab" data-bs-target="#create-review" type="button" role="tab" aria-controls="create-review" aria-selected="false">{t("feedbacks.create.createFeedback")}</button>
                </li>
            </ul>
            <div className="tab-content" id="reviewsTabContent">
                <div className="tab-pane fade show active" id="user-reviews" role="tabpanel" aria-labelledby="user-reviews-tab">
                    {
                        isMyFeedbacksLoading ?
                        <h3>Loading ...</h3> 
                        :
                        (myFeedbacks.length === 0 ?
                            <h3>{t("feedbacks.noFeedbacks")}</h3>
                            :
                            myFeedbacks.map((feedback) => {
                                return (<div className="list-group mt-3" key={feedback.feedBackId}>
                                    <div className="list-group-item">
                                        <h5>{t("feedbacks.from")}: <b><i>{feedback.employeeFromName}</i></b></h5>
                                        <div className="star-rating">
                                            {
                                                [...Array(feedback.feedBackMark)].map((_, i) => (
                                                    <i key={i} className="fa-solid fa-star"></i>
                                                ))
                                            }
                                            {
                                                [...Array(5 - feedback.feedBackMark)].map((_, i) => (
                                                    <i key={i + feedback.feedBackMark} className="fa-regular fa-star"></i>
                                                ))
                                            }
                                        </div>
                                        <p className="mt-2">{feedback.feedBackText}</p>
                                        <div className="review-date">{feedback.feedBackDate}</div>
                                    </div>
                                </div>)
                            })
                        )
                    }
                </div>
                <div className="tab-pane fade" id="recent-reviews" role="tabpanel" aria-labelledby="recent-reviews-tab">
                    {
                        isByMeFeedbacksLoading ?
                        <h3>Loading ...</h3> 
                        :
                        (byMeFeedbacks.length === 0 ?
                            <h3>{t("feedbacks.noFeedbacks")}</h3>
                            :
                            byMeFeedbacks.map((feedback, index) => {
                                return (<div className="list-group mt-3" key={feedback.feedBackId} onMouseEnter={() => {
                                    document.getElementById(`absoluteDeletebtn${index}`).setAttribute("style", "display: block !important");
                                }} onMouseLeave={() => {
                                    document.getElementById(`absoluteDeletebtn${index}`).setAttribute("style", "display: none !important");
                                }}>
                                    <div className="absoluteDeletebtn" id={`absoluteDeletebtn${index}`} onClick={() => onDeleteBeforeConfirm(feedback.feedBackId)} value={feedback.feedBackId}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </div>
                                    <div className="list-group-item">
                                        <h5>{t("feedbacks.for")}: <b><i>{feedback.employeeForName}</i></b></h5>
                                        <div className="star-rating">
                                            {
                                                [...Array(feedback.feedBackMark)].map((_, i) => (
                                                    <i key={i} className="fa-solid fa-star"></i>
                                                ))
                                            }
                                            {
                                                [...Array(5 - feedback.feedBackMark)].map((_, i) => (
                                                    <i key={i + feedback.feedBackMark} className="fa-regular fa-star"></i>
                                                ))
                                            }
                                        </div>
                                        <p className="mt-2">{feedback.feedBackText}</p>
                                        <div className="review-date">{feedback.feedBackDate}</div>
                                    </div>
                                </div>)
                            }))}
                        
                    </div>
                    <div className="tab-pane fade" id="search-reviews" role="tabpanel" aria-labelledby="search-reviews-tab">
                        <div className="mt-4">
                            <h4>{t("feedbacks.searchFeedbacks")}</h4>
                            <div className="mb-4">
                                <div className="mb-3" style={{display: "flex", margin: "20px 0"}}>
                                    <SelectSearch options={employees.map(employee => employee.lastName + " " + employee.firstName)} id="employee-seach-input" placeholder={t("feedbacks.enterEmployeeName")} />
                                    <button type="button" className="btn btn-primary" style={{marginLeft: "20px"}} onClick={btnClickHandler}>{t("feedbacks.search")}</button>
                                    
                                </div>
                            </div>
                            <h5 style={{color: "red", marginLeft: "5px", display: displayForError}}>{t("feedbacks.noUsersWithName")}</h5>
                            {
                                isEmployeeFeedbacksLoading ?
                                <h3>Loading ...</h3> 
                                :
                                (employeeFeedbacks.length === 0 ?
                                    <h3>{t("feedbacks.employeeHasNoFeedbacks")}</h3>
                                    :
                                    employeeFeedbacks.map((feedback) => {
                                        return (<div className="list-group mt-3" key={feedback.feedBackId}>
                                            <div className="list-group-item">
                                                <h5>{t("feedbacks.for")}: <b><i>{feedback.employeeForName}</i></b></h5>
                                                <h5>{t("feedbacks.from")}: <b><i>{feedback.employeeFromName}</i></b></h5>
                                                <div className="star-rating">
                                                    {
                                                        [...Array(feedback.feedBackMark)].map((_, i) => (
                                                            <i key={i} className="fa-solid fa-star"></i>
                                                        ))
                                                    }
                                                    {
                                                        [...Array(5 - feedback.feedBackMark)].map((_, i) => (
                                                            <i key={i + feedback.feedBackMark} className="fa-regular fa-star"></i>
                                                        ))
                                                    }
                                                </div>
                                                <p className="mt-2">{feedback.feedBackText}</p>
                                                <div className="review-date">{feedback.feedBackDate}</div>
                                            </div>
                                        </div>)
                                    })
                                )
                            }
                        </div>
                    </div>
                    <div className="tab-pane fade" id="create-review" role="tabpanel" aria-labelledby="create-review-tab">
                        <div className="mt-4">
                            <div className="container my-5">
                                <h2>{t("feedbacks.create.createFeedback")}</h2>
                                <form onSubmit={createFormsSubmitHandler}>
                                    <div style={{width: "900px", display: "flex", justifyContent: "space-between",  alignItems: "center"}} id="create-feedback-flex-cont">
                                        <div>
                                            <div className="create-feedback-input-employee mb-3">
                                                <label htmlFor="fromUser" className="form-label">{t("feedbacks.create.fromWhom")}</label>
                                                <SelectSearch options={[]} disabled="true" id="user-from" placeholder={nowEmployeeName}/>
                                            </div>
                                            <div className="create-feedback-input-employee mb-3">
                                                <label htmlFor="fromUser" className="form-label">{t("feedbacks.create.forWhom")}</label>
                                                <SelectSearch options={employees.map(employee => employee.lastName + " " + employee.firstName)} id="userForInput" required/> 
                                            </div>
                                            <h5 style={{width: "320px", color: "red", textAlign: "right", display: displayForErrorCreate}}>{t("feedbacks.noUsersWithName")}</h5>
                                            <div className="create-feedback-input-employee mb-5">
                                                <label className="form-label">{t("feedbacks.create.mark")}</label>
                                                <div className="star-rating" onMouseLeave={onMouseLeaveStarHandler}>
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <i key={value} value={value} className={`fa-star ${value <= feedbackForCreate.feedBackMark ? "fa-solid" : "fa-regular"}`} onMouseEnter={onHoverStarHandler} onClick={onClickStarHandler}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="reviewText" className="form-label mb-3">{t("feedbacks.create.feedbackText")}</label>
                                            <textarea className="form-control" id="reviewText" rows="5" style={{width: "400px"}} required minLength={10} maxLength={500} value={feedbackForCreate.feedBackText} onChange={event => setFeedbackForCreate({...feedbackForCreate, feedBackText: event.target.value})}></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">{t("feedbacks.create.sendFeedback")}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{Feedbacks};