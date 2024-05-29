import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import keys from "../../config/keys";

import "./Profile.css";

const Profile=()=>{
    const {token} = useAuth();
    const {signOut}=useAuth();
    const [employee, setEmployee] = useState({});
    const [user, setUser] = useState({});
    const [department, setDepartment] = useState({});
    const [job, setJob] = useState({});
    
    useEffect(()=>{
        if(token){
            try {
                const decoded = jwtDecode(token);

                axios.get(`${keys.ServerConnection}/User/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    res.data.password = '';
                    setUser(res.data);
                }).catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });

                axios.get(`${keys.ServerConnection}/Employee/${decoded.nameid}`, {headers: {
                    Authorization:`Bearer ${token}`
                }})
                .then(res => {
                    res.data.birthDate = res.data.birthDate.substring(0, res.data.birthDate.indexOf('T'));
                    res.data.hireDate = res.data.hireDate.substring(0, res.data.hireDate.indexOf('T'));
                    console.log("employee: ", res.data);
                    setEmployee(res.data);

                    axios.get(`${keys.ServerConnection}/Department/${res.data.departmentId}`, {headers: {
                        Authorization:`Bearer ${token}`
                    }})
                    .then(res1 => {
                        setDepartment(res1.data);
                    }).catch(err=>{
                        if(err.response.status===401)
                            signOut();
                    });
        

                    axios.get(`${keys.ServerConnection}/Job/${res.data.jobId}`, {headers: {
                        Authorization:`Bearer ${token}`
                    }})
                    .then(res1 => {
                        setJob(res1.data);
                    }).catch(err=>{
                        if(err.response.status===401)
                            signOut();
                    });
        
                }).catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });
    

            } catch (error) {
                console.log(error);
            }
        }
    }, [token])


    const inputUserChangeHandler = (event) => {
        const { name, value } = event.target;
        console.log(name);
        setUser({
          ...user,
          [name]: value
        });
    };

    const inputEmployeeChangeHandler = (event) => {
        const { name, value } = event.target;
        setEmployee({
          ...employee,
          [name]: value
        });
    };

    const btnClickHandler = async () => {
        const decoded = jwtDecode(token);

        console.log("Employee data: ", employee);

        axios.put(
            `${keys.ServerConnection}/Employee/${decoded.nameid}`, employee,
            { headers: { Authorization: `Bearer ${token}`}})
        .then((res) => {
            console.log("resEmployee: ", res.data);
        })
        .catch((err) => {
            if(err.response.status===401)
                signOut();
            console.log("Error in put: ", err);
        });
        
        axios.put(
            `${keys.ServerConnection}/User/${decoded.nameid}`, user,
            { headers: { Authorization: `Bearer ${token}`}})
        .then((res) => {
            console.log("resEmployee: ", res.data);
        })
        .catch((err) => {
            if(err.response.status===401)
                signOut();
            console.log("Error in put: ", err);
        });
    }

    return(
        <div>
            <div className="container rounded bg-white mt-5 mb-5 main-cont">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <div id="image-container" className="mt-5">
                                <input type="file" name="employeePhoto" id="employeePhoto" style={{display: "none"}}/>
                                <label>
                                    <img id="image" className="rounded-circle" width="150px" height="150px" src="https://img.freepik.com/premium-vector/user-icon-man-business-suit_454641-453.jpg"  alt="user"/>
                                    <div id="overlay">
                                        <span id="plus">+</span>
                                    </div>
                                </label>
                            </div>
                            <span className="font-weight-bold">{employee.lastName + " " + employee.firstName}</span>
                            <span className="text-black-50">{employee.email}</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Name</label>
                                    <input className="form-control" value={employee.firstName} readOnly={true}/>
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Surname</label>
                                    <input className="form-control" value={employee.lastName} readOnly={true}  />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">Birth date</label>
                                    <input className="form-control" value={employee.birthDate} readOnly={true}  />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Email</label>
                                    <input type="email" className="form-control" placeholder="Enter you email" name="email" maxLength="24" value={employee.email} onChange={inputEmployeeChangeHandler}/>
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Phone</label>
                                    <input type="tel" className="form-control" placeholder="Enter you phone" value={employee.phoneNumber} name="phoneNumber" onChange={inputEmployeeChangeHandler}/>
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">User information</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Login</label>
                                    <input type="text" className="form-control" name="login" value={user.login} onChange={inputUserChangeHandler}/>
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Password</label>
                                    <input type="password" className="form-control" placeholder="enter password" name="password" value={user.password} onChange={inputUserChangeHandler}/>
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <button className="btn btn-success" type="button" onClick={btnClickHandler}>Save changes</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Work info</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">Department</label>
                                    <input type="text" className="form-control" value={department.departmentName} readOnly={true}  />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Job</label>
                                    <input className="form-control" value={job.jobName} readOnly={true}  />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Hire date</label>
                                    <input className="form-control" value={employee.hireDate} readOnly={true} />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Salary</label>
                                    <input className="form-control" value={employee.salary + " $"} readOnly={true} />
                                </div>
                            </div>
                            <hr />
                            <div className="row mt-3">
                                <img src="https://codyshop.ru/wp-content/uploads/2019/06/grafik.jpg" style = {{width: "100%"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{Profile};