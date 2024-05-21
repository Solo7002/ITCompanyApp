import './App.css';
import { MainLayout } from './Pages/Layouts/MainLayout/MainLayout.jsx';
import { Home } from './Pages/Home/Home.jsx';
import { Profile } from './Pages/Profile/Profile.jsx';
import { Tasks } from './Pages/Tasks/Tasks.jsx';
import { Projects } from './Pages/Projects/Projects.jsx';
import { Employees } from './Pages/Employees/Employees.jsx';
import { DepsJobs } from './Pages/DepsJobs/DepsJobs.jsx';
import { Finances } from './Pages/Finances/Finances.jsx';
import { Feedbacks } from './Pages/Feedbacks/Feedbacks.jsx';
import { Settings } from './Pages/Settings/Settings.jsx';
import { Route, Routes } from 'react-router-dom';
import { Login } from './Pages/Auth/Login/Login.jsx'
import { RequireAuth } from './RequireAuth/RequireAuth.js';
import { AuthProvider } from './RequireAuth/AuthProvider.js';
function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Routes>
        <Route path='/' element={<RequireAuth><MainLayout/></RequireAuth>}>
          <Route index element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/tasks' element={<Tasks/>}/>
          <Route path='/projects' element={<Projects/>}/>
          <Route path='/employees' element={<Employees/>}/>
          <Route path='/depsJobs' element={<DepsJobs/>}/>
          <Route path='/financies' element={<Finances/>}/>
          <Route path='/feedbacks' element={<Feedbacks/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;
