import "./DepsJobs.css";

const DepsJobs=()=>{
    return(
        <div className="DepsJobscontainer">
            <div className="container mt-4">
                <h1 className="text-center mb-4">Departments/Jobs</h1>
                <ul className="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="departments-tab" data-toggle="tab" href="#departments" role="tab" aria-controls="departments" aria-selected="true">Departments</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="jobs-tab" data-toggle="tab" href="#jobs" role="tab" aria-controls="jobs" aria-selected="false">Jobs</a>
                    </li>
                </ul>
                <div className="tab-content mt-4" id="myTabContent">
                    <div className="tab-pane fade show active" id="departments" role="tabpanel" aria-labelledby="departments-tab">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Seach department by name</label>
                                    <input type="text" className="form-control" id="search-department" placeholder="Search Departments" />
                                </div>
                                <div className="depjobs-table-container">
                                  <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Choose department</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>HR</td>
                                        </tr>
                                        <tr>
                                            <td>IT</td>
                                        </tr>
                                        <tr>
                                          <td>HR</td>
                                      </tr>
                                      <tr>
                                          <td>IT</td>
                                      </tr>
                                      <tr>
                                        <td>HR</td>
                                    </tr>
                                    <tr>
                                        <td>IT</td>
                                    </tr>
                                    <tr>
                                      <td>HR</td>
                                  </tr>
                                  <tr>
                                      <td>IT</td>
                                  </tr>
                                  <tr>
                                    <td>HR</td>
                                </tr>
                                <tr>
                                    <td>IT</td>
                                </tr>
                                <tr>
                                  <td>HR</td>
                              </tr>
                              <tr>
                                  <td>IT</td>
                              </tr>
                              <tr>
                                <td>HR</td>
                            </tr>
                            <tr>
                                <td>IT</td>
                            </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <form>
                                    <div className="form-group">
                                        <label>Department Name</label>
                                        <input type="text" className="form-control readonly-input" id="department-name" readonly />
                                    </div>
                                    <div className="form-group">
                                        <label>Department Head</label>
                                        <input type="text" className="form-control readonly-input" id="department-head" readonly />
                                    </div>
                                    <div className="form-group">
                                        <label>Staff Count</label>
                                        <input type="number" className="form-control readonly-input" id="department-staff-count" readonly />
                                    </div>
                                    <div className="form-group">
                                        <label>Staff List</label>
                                        <div className="table-responsive limited-height">
                                          <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                  <th>Name</th>
                                                  <th>Job</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>John Doe</td>
                                                    <td>Manager</td>
                                                </tr>
                                                <tr>
                                                    <td>Jane Smith</td>
                                                    <td>Developer</td>
                                                </tr>
                                                <tr>
                                                  <td>John Doe</td>
                                                  <td>Manager</td>
                                              </tr>
                                              <tr>
                                                  <td>Jane Smith</td>
                                                  <td>Developer</td>
                                              </tr>
                                              <tr>
                                                <td>John Doe</td>
                                                <td>Manager</td>
                                            </tr>
                                            <tr>
                                                <td>Jane Smith</td>
                                                <td>Developer</td>
                                            </tr>

                                            <tr>
                                              <td>John Doe</td>
                                              <td>Manager</td>
                                          </tr>
                                          <tr>
                                              <td>Jane Smith</td>
                                              <td>Developer</td>
                                          </tr>
                                            </tbody>
                                        </table> 
                                        </div>
                                    </div>
                                    <div className="form-group depjobs-buttons">
                                        <button type="button" className="btn btn-success">Add Department</button>
                                        <button type="button" className="btn btn-warning">Edit Department</button>
                                        <button type="button" className="btn btn-danger">Delete Department</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="jobs" role="tabpanel" aria-labelledby="jobs-tab">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" className="form-control" id="search-job" placeholder="Search Jobs" />
                                </div>
                                <div className="depjobs-table-container">
                                  <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Software Developer</td>
                                        </tr>
                                        <tr>
                                            <td>Marketing Specialist</td>
                                        </tr>
                                        <tr>
                                          <td>Software Developer</td>
                                      </tr>
                                      <tr>
                                          <td>Marketing Specialist</td>
                                      </tr>
                                      <tr>
                                        <td>Software Developer</td>
                                    </tr>
                                    <tr>
                                        <td>Marketing Specialist</td>
                                    </tr>
                                    <tr>
                                      <td>Software Developer</td>
                                  </tr>
                                  <tr>
                                      <td>Marketing Specialist</td>
                                  </tr>
                                  <tr>
                                    <td>Software Developer</td>
                                </tr>
                                <tr>
                                    <td>Marketing Specialist</td>
                                </tr>
                                <tr>
                                  <td>Software Developer</td>
                              </tr>
                              <tr>
                                  <td>Marketing Specialist</td>
                              </tr>
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <form>
                                    <div className="form-group">
                                        <label>Job Title</label>
                                        <input type="text" className="form-control readonly-input" id="job-title" readonly />
                                    </div>
                                    <div className="form-group">
                                        <label>Staff Count</label>
                                        <input type="number" className="form-control readonly-input" id="job-staff-count" readonly />
                                    </div>
                                    <div className="form-group">
                                        <label>Staff List</label>
                                        <div className="table-responsive limited-height" style={{maxHeight: "248px"}}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Salary</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>John Doe</td>
                                                        <td>2000 $</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jane Smith</td>
                                                        <td>2000 $</td>
                                                    </tr>
                                                    <tr>
                                                      <td>John Doe</td>
                                                      <td>2000 $</td>
                                                  </tr>
                                                  <tr>
                                                      <td>Jane Smith</td>
                                                      <td>2000 $</td>
                                                  </tr>
                                                  <tr>
                                                    <td>John Doe</td>
                                                    <td>2000 $</td>
                                                </tr>
                                                <tr>
                                                    <td>Jane Smith</td>
                                                    <td>2000 $</td>
                                                </tr>

                                                <tr>
                                                  <td>John Doe</td>
                                                  <td>2000 $</td>
                                              </tr>
                                              <tr>
                                                  <td>Jane Smith</td>
                                                  <td>2000 $</td>
                                              </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="form-group depjobs-buttons">
                                        <button type="button" className="btn btn-success">Add Job</button>
                                        <button type="button" className="btn btn-warning">Edit Job</button>
                                        <button type="button" className="btn btn-danger">Delete Job</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{DepsJobs};