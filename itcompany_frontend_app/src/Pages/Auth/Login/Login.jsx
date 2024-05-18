import "./Login.css";

const Login=()=>{
    return(
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header"> Log in </div>
                <div class="card-body">
                  <form>
                    <div class="form-group">
                      <label for="username">Username:</label>
                      <input type="text" class="form-control" id="username" name="username" />
                    </div>
                    <div class="form-group">
                      <label for="password">Password:</label>
                      <input type="password" class="form-control" id="password" name="password" />
                    </div>
                    <div class="form-group form-check">
                      <input type="checkbox" class="form-check-input" id="rememberMe" />
                      <label class="form-check-label" for="rememberMe">Remember me</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                    <a href="#" class="float-right">Forgot password?</a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
};

export{Login};