// Projects.js
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../hooks/useAuth";
import "./Projects.css";
import axios from "axios";
import keys from "../../config/keys";
import { Link } from "react-router-dom";
import DateReduction from "../../Function/DateReduction";
import { jwtDecode } from "jwt-decode";

const Projects = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const { signOut } = useAuth();
    const [projects, setProjects] = useState([]);
    const user=jwtDecode(token);
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
                    status: project.isDone ? t('projects.index.completed') : t('projects.index.pending'), 
                    startProjectDate: DateReduction(project.startProjectDate),
                    deadLineProjectDate: DateReduction(project.deadLineProjectDate)
                }));

                setProjects(transformedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [token, t]);

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
            <h1 className="text-center my-4">{t('projects.index.title')}</h1>
            <hr />
            <div className="container mt-5 myCon">
                { user.actort=='Admin'||user.actort=='Manager'?
                    <Link to={`/projects/create`}>
                    <button className="btn btn-success ">{t('projects.index.createButton')}</button>
                </Link>:null
                }
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={t('projects.index.searchPlaceholder')}
                    value={searchProject}
                    onChange={searchProjectHandler}
                /> 
                {
                projects.length > 0
                ?
                filteredProjects.map((project, index) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={index}>
                        <div className="card">
                            <img src={`${keys.ServerConnection}/Files/download${project.file}`} className="card-img-top" alt="Project Alpha" />
                            <div className="card-body">
                                <h5 className="card-title">{project.projectName}</h5>
                                <p className="project-dates">
                                    <div><strong>{t('projects.index.startDate')}</strong> {project.startProjectDate}</div>
                                    <div><strong>{t('projects.index.deadline')}</strong> {project.deadLineProjectDate}</div>
                                </p>
                                <span className={`badge ${project.status === t('projects.index.pending') ? 'badge-pending' : 'badge-done'}`}>
                                    {project.status}
                                </span>
                            </div>
                          
                            <Link className="alignBtn" to={`/projects/details/${project.projectId}`}>
                                <button className="btn btn-info">{t('projects.index.infoButton')}</button>
                            </Link>
                            
                        </div>
                    </div>
                    
                ))
                :
                <div>{t('projects.index.noProjects')}</div>
            }
            </div>
        </div>
    );
};

export { Projects };
