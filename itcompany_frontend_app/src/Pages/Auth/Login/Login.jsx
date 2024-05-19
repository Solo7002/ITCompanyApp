import { useAuth } from "../../../hooks/useAuth";
import "./Login.css";

const Login=()=>{
    const {signIn}=useAuth();

    const submitHandler=(event)=>{
      event.preventDefault();
      const form=event.target;
      const username=form.username.value;
      const password=form.password.value;
      signIn({login:username,password:password})
    }
    return(
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header"> Log in </div>
                <div class="card-body">
                  <form onSubmit={submitHandler}>
                    <div class="form-group">
                      <label for="username">Username:</label>
                      <input type="text" required class="form-control" id="username" name="username" />
                    </div>
                    <div class="form-group">
                      <label for="password">Password:</label>
                      <input type="password" required class="form-control" id="password" name="password" />
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