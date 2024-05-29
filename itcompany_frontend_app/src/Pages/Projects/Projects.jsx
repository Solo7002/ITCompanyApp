import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Projects.css";
import axios from "axios";
import keys from "../../config/keys";
import { Link } from "react-router-dom";
import DateReduction from "../../Function/DateReduction";
const Projects = () => {
    const { token } = useAuth();
    const { signOut } = useAuth();
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${keys.ServerConnection}/Project/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(err=>{
                    if(err.response.status===401)
                        signOut();
                });
    
              
                const transformedProjects = response.data.map(project => ({
                    ...project,
                    status: project.isDone ? 'Completed' : 'Pending', 
                    startProjectDate:DateReduction(project.startProjectDate),
                    deadLineProjectDate:DateReduction(project.deadLineProjectDate)
                    }));

                setProjects(transformedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [token]);

    const [searchProject, setSearchProject] = useState('');

    const searchProjectHandler = (event) => {
        setSearchProject(event.target.value);
    };

    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchProject.toLowerCase()) ||
        project.description.toLowerCase().includes(searchProject.toLowerCase()) ||
        project.status.toLowerCase().includes(searchProject.toLowerCase()) ||
        project.startProjectDate.toLowerCase().includes(searchProject.toLowerCase()) ||
        project.deadLineProjectDate.toLowerCase().includes(searchProject.toLowerCase())
    );

    return (
        <div className="projectsContainer">
            <h1>Projects</h1>
            <hr />
            <div className="container mt-5 myCon">
            <Link to={`/projects/create`}> <button className="btn btn-success ">Create</button></Link>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search projects"
                    value={searchProject}
                    onChange={searchProjectHandler}
                /> 
                {filteredProjects.map((project, index) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={index}>
                        <div className="card">
                            <img src="https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="card-img-top" alt="Project Alpha" />
                            <div className="card-body">
                                <h5 className="card-title">{project.projectName}</h5>
                                <p className="card-text">{project.description}</p>
                                <p className="project-dates">
                                    <div><strong>Start Date:</strong> {project.startProjectDate}</div>
                                    <div><strong>Deadline:</strong> {project.deadLineProjectDate}</div>
                                </p>
                                <span className={`badge ${project.status === 'Pending' ? 'badge-pending' : 'badge-done'}`}>
                                    {project.status}
                                </span>
                            </div>
                          
                            <Link className="alignBtn" to={`/projects/details/${project.projectId}`}><button className="btn btn-info">Info</button></Link>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Projects };
