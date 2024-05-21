import { useEffect, useState } from "react";
import "./Employees.css";
import { useAuth } from '../../hooks/useAuth';
import axios from "axios";
import keys from "../../config/keys";
import { Link } from "react-router-dom";
const Employees = () => {
    const { token } = useAuth();
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeRes = await axios.get(`${keys.ServerConnection}/Employee`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const employeesData = employeeRes.data;

                const employeesWithJobs = await Promise.all(employeesData.map(async (employee) => {
                    try {
                        const jobRes = await axios.get(`${keys.ServerConnection}/Job/${employee.jobId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        return { ...employee, jobName: jobRes.data.jobName };
                    } catch (error) {
                        console.error(`Error fetching job title for employee ${employee.id}`, error);
                        return { ...employee, jobName: 'No job' };
                    }
                }));
                setEmployees(employeesWithJobs);
            } catch (error) {
                console.error("Error fetching employees", error);
            }
        };

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

    return (
        <div className="employeesContainer">
            <h1>Employees</h1>
            <hr />
            <div class="container mt-5">
            <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search employees"
                        value={searchEmployee}
                        onChange={searchHandler}
                       
                    />
                <table class="table table-striped">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Surname</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Email</th>
                            <th scope="col">Position</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredEmployees.map((employee) => {
                                return (
                                    <tr>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.phoneNumber}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.jobName}</td>
                                        <td>
                                            <Link to={`/employee/details/${employee.id}`}> <button class="btn btn-info btn-sm">View</button></Link>
                                            <button class="btn btn-danger btn-sm">Ban</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }


                    </tbody>
                </table>
                <div> <Link to={`/employee/create`}> <button class="btn btn-success ">Create</button></Link></div>
            </div>
            
        </div>
    )
};

export { Employees };