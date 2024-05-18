import "./Profile.css";

const Profile=()=>{
    return(
        <div>
            <div className="container rounded bg-white mt-5 mb-5 main-cont">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <div id="image-container" className="mt-5">
                                <input type="file" name="employeePhoto" id="employeePhoto" style={{display: "none"}}/>
                                <label for="employeePhoto">
                                    <img id="image" className="rounded-circle" width="150px" height="150px" src="https://img.freepik.com/premium-vector/user-icon-man-business-suit_454641-453.jpg" />
                                    <div id="overlay">
                                        <span id="plus">+</span>
                                    </div>
                                </label>
                            </div>
                            <span className="font-weight-bold">Solod Ihor</span>
                            <span className="text-black-50">solod7002@mail.com</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div class="col-md-6">
                                    <label className="labels">Name</label>
                                    <input type="text" className="form-control" placeholder="first name" value="Ihor" readOnly="true"  />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Surname</label>
                                    <input type="text" className="form-control" value="Solod" placeholder="surname" readOnly="true"  />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">Birth date</label>
                                    <input type="text" className="form-control" placeholder="Enter you email" value="26.12.2007" readOnly="true"  />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Email</label>
                                    <input type="email" className="form-control" placeholder="Enter you email" value="solod7002@gmail.com" />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Phone</label>
                                    <input type="phone" className="form-control" placeholder="Enter you phone" value="+(380) 50-524-09-34" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Country</label>
                                    <input type="text" className="form-control" placeholder="Enter your country" value="Ukraine" />
                                </div>
                                <div class="col-md-6">
                                    <label className="labels">City</label>
                                    <input type="text" className="form-control" value="Kharkiv" placeholder="Enter your city" />
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">User information</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Login</label>
                                    <input type="text" className="form-control" placeholder="Enter your login" value="solo_789" />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Password</label>
                                    <input type="password" className="form-control" value="12345678" placeholder="Enter your password" />
                                </div>
                            </div>
                            <div class="mt-5 text-center">
                                <button className="btn btn-success" type="button">Save changes</button>
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
                                    <input type="text" className="form-control" value="Developers" readOnly="true"  />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Job</label>
                                    <input type="text" className="form-control" value="Backend Asp.net developer" readOnly="true"  />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Hire date</label>
                                    <input type="text" className="form-control" value="20.06.2022" readOnly="true" />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Salary</label>
                                    <input type="text" className="form-control" value="1250 $" readOnly="true" />
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