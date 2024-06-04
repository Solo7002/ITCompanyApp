import { useEffect, useState } from "react";
import "./Employees.css";
import { useAuth } from '../../hooks/useAuth';
import axios from "axios";
import keys from "../../config/keys";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Employees = () => {

    const{t}=useTranslation();
   
    const { token } = useAuth();
    const{signOut}=useAuth();
    const [employees, setEmployees] = useState([]);
    const fetchEmployees = async () => {
        try {
            const employeeRes = await axios.get(`${keys.ServerConnection}/Employee`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
            });
            const employeesData = employeeRes.data;

            const employeesWithJobs = await Promise.all(employeesData.map(async (employee) => {
                try {
                    if(employee.jobId)
                    {const jobRes = await axios.get(`${keys.ServerConnection}/Job/${employee.jobId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return { ...employee, jobName: jobRes.data.jobName };
                }
                else{
                    return { ...employee, jobName: t("employees.index.NoJob") };
                }
                } catch (error) {
                   console.log(error);
                   
                }
            }));
            setEmployees(employeesWithJobs);
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };
    useEffect(() => {
        fetchEmployees();
        
    }, [token]);
    const [searchEmployee, setSearchEmployee] = useState('');
    const searchHandler = (event) => {
        setSearchEmployee(event.target.value);
    };
    const filteredEmployees=employees.filter(employee=>
        employee.firstName.toLowerCase().includes(searchEmployee.toLowerCase())||
        employee.lastName.toLowerCase().includes(searchEmployee.toLowerCase())||
        employee.phoneNumber.toLowerCase().includes(searchEmployee.toLowerCase())||
        employee.email.toLowerCase().includes(searchEmployee.toLowerCase())||
        employee.jobName.toLowerCase().includes(searchEmployee.toLowerCase())
    )
    const fireClick=(id)=>{
        console.log(id);
        if(id!=null){
            axios.post(`${keys.ServerConnection}/Employee/fire/${id}`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res=>{
                fetchEmployees();
            }).catch(err=>{
                if(err.response.status===401)
                    signOut();
                
            })
        }
    }
    const appointClick=(id)=>{
        console.log(id);
        if(id!=null){
            axios.post(`${keys.ServerConnection}/Employee/appoint/${id}`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res=>{
                fetchEmployees();
            }).catch(err=>{
            if(err.response.status===401)
                signOut();
        })
        }
    }

    return (
        <div className="employeesContainer">
            <h1 className="text-center my-4">{t("employees.index.Title")}</h1>
            <hr />
            <div className="container mt-5">
            <input
                        type="text"
                        className="form-control mb-2"
                        placeholder={t("employees.index.searchEmployee")}
                        value={searchEmployee}
                        onChange={searchHandler}
                       
                    />
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">{t("employees.index.Name")}</th>
                            <th scope="col">{t("employees.index.Surname")}</th>
                            <th scope="col">{t("employees.index.PhoneNumber")}</th>
                            <th scope="col">Email</th>
                            <th scope="col">{t("employees.index.Position")}</th>
                            <th scope="col">{t("employees.index.Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredEmployees.map((employee,index) => {
                                
                                return (
                                   employee.fireDate!=null? <tr className="tr-fired" key={index}>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.phoneNumber}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.jobName}</td>
                                        <td>
                                            <Link to={`/employee/details/${employee.id}`}> <button className="btn btn-info btn-sm">{t("employees.index.btnView")}</button></Link>
                                            <button className="btn btn-warning btn-sm" type="submit"  onClick={()=>appointClick(employee.id)}>{t("employees.index.btnAppoint")}</button>
                                        </td>
                                    </tr>:
                                    <tr className="tr-notFired"   key={index}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.phoneNumber}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.jobName}</td>
                                    <td>
                                        <Link to={`/employee/details/${employee.id}`}> <button className="btn btn-info btn-sm">{t("employees.index.btnView")}</button></Link>
                                        <button className="btn btn-danger btn-sm" type="submit"  onClick={()=>fireClick(employee.id)}>{t("employees.index.btnFire")}</button>
                                    </td>
                                </tr>
                                );
                            })
                        }


                    </tbody>
                </table>
                <div> <Link to={`/employee/create`}> <button className="btn btn-success ">{t("employees.index.btnCreate")}</button></Link></div>
            </div>
            
        </div>
    )
};

export { Employees };