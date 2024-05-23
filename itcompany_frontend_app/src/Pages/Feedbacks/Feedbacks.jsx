import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";
import SelectSearch from "../../Components/UI/SelectSearch/SelectSearch";

import "./Feedbacks.css";

const Feedbacks=()=>{
    const {token} = useAuth();

    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [byMeFeedbacks, setByMeFeedbacks] = useState([]);
    const [employeeFeedbacks, setEmployeeFeedbacks] = useState([]);

    const [isMyFeedbacksLoading, setIsMyFeedbacksLoading] = useState(true);
    const [isByMeFeedbacksLoading, setIsByMeFeedbacksLoading] = useState(true);
    const [isEmployeeFeedbacksLoading, setIsEmployeeFeedbacksLoading] = useState(false);

    const [employees, setEmployees] = useState([]);

    const [displayForError, setDisplayForError] = useState("none");

    useEffect(()=>{
        if(token){
            try {
                const decoded = jwtDecode(token);

                axios.get(`${keys.ServerConnection}/Feedback/EmployeeFor/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    console.log("for: ", res.data);
                    setMyFeedbacks(res.data);
                })
                .then(() => {
                    setIsMyFeedbacksLoading(false);
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
                });

                axios.get(`${keys.ServerConnection}/Employee`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    console.log("employees: ", res.data);
                    setEmployees(res.data);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [token]);

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

    return(
        <div className="container my-5">
            <h1 className="text-center mb-4">Feedbacks</h1>
            <ul className="nav nav-tabs" id="reviewsTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="user-reviews-tab" data-bs-toggle="tab"      data-bs-target="#user-reviews" type="button" role="tab" aria-controls="user-reviews"        aria-selected="true">My feedbacks</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="recent-reviews-tab" data-bs-toggle="tab"       data-bs-target="#recent-reviews" type="button" role="tab" aria-controls="recent-reviews"    aria-selected="false">Feedbacks left by me</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="search-reviews-tab" data-bs-toggle="tab"       data-bs-target="#search-reviews" type="button" role="tab" aria-controls="search-reviews"    aria-selected="false">Employees feedbacks</button>
                </li>
            </ul>
            <div className="tab-content" id="reviewsTabContent">
                { /*Reviews about the current user*/ }
                <div className="tab-pane fade show active" id="user-reviews" role="tabpanel"        aria-labelledby="user-reviews-tab">
                    {
                        isMyFeedbacksLoading ?
                        <h3>Loading ...</h3> 
                        :
                        (myFeedbacks.lenght == 0?
                            <h3>No feedbacks yet</h3>
                            :
                            myFeedbacks.map((feedback) => {
                                return (<div className="list-group mt-3">
                                    <div className="list-group-item">
                                        <h5>From: <b><i>{feedback.employeeFromName}</i></b></h5>
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
                                    </div></div>
                                )
                            })
                        )
                    }
                </div>
                <div className="tab-pane fade" id="recent-reviews" role="tabpanel" aria-labelledby="recent-reviews-tab">
                {
                        isByMeFeedbacksLoading ?
                        <h3>Loading ...</h3> 
                        :
                        (byMeFeedbacks.lenght == 0?
                            <h3>No feedbacks yet</h3>
                            :
                            byMeFeedbacks.map((feedback) => {
                                return (<div className="list-group mt-3">
                                    <div className="list-group-item">
                                        <h5>For: <b><i>{feedback.employeeForName}</i></b></h5>
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
                                    </div></div>
                                )
                            })
                        )
                    }
                    <div className="mt-4 text-center">
                        <button className="btn btn-primary">Add feedback</button>
                    </div>
                </div>
                <div className="tab-pane fade" id="search-reviews" role="tabpanel" aria-labelledby="search-reviews-tab">
                    <div className="mt-4">
                        <h4>Seach feedbacks</h4>
                        <div className="mb-4">
                            <div className="mb-3" style={{display: "flex", margin: "20px 0"}}>
                                <SelectSearch options={employees.map(employee => employee.lastName + " " + employee.firstName)} id="employee-seach-input" placeholder="Enter employee name" />
                                <button type="button" className="btn btn-primary" style={{marginLeft: "20px"}} onClick={btnClickHandler}>seach</button>
                                
                            </div>
                        </div>
                        <h5 style={{color: "red", marginLeft: "5px", display: displayForError}}>* No users with such name</h5>
                        {
                            isEmployeeFeedbacksLoading ?
                            <h3>Loading ...</h3> 
                            :
                            (employeeFeedbacks.lenght == 0?
                                <h3>That employee has no feedbacks</h3>
                                :
                                employeeFeedbacks.map((feedback) => {
                                    return (<div className="list-group mt-3">
                                        <div className="list-group-item">
                                            <h5>For: <b><i>{feedback.employeeForName}</i></b></h5>
                                            <h5>From: <b><i>{feedback.employeeFromName}</i></b></h5>
                                            <div className="star-rating">
                                                {
                                                    [...Array(feedback.feedBackMark)].map((_, i) => (
                                                        <i key={i} className="fa-solid fa-star"></i>
                                                    ))
                                                }
                                                {
                                                    [...Array(5 - feedback.feedBackMark)].map((_, i) => (
                                                        <i key={i + feedback.feedBackMark} className="fa-regular    fa-star"></i>
                                                    ))
                                                }
                                            </div>
                                            <p className="mt-2">{feedback.feedBackText}</p>
                                            <div className="review-date">{feedback.feedBackDate}</div>
                                        </div></div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export{Feedbacks};