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
import { Login } from './Pages/Auth/Login/Login.jsx';
import { PasswordRecover } from './Pages/Auth/PasswordRecover/PasswordRecover.jsx'
import { RequireAuth } from './RequireAuth/RequireAuth.js';
import { AuthProvider } from './RequireAuth/AuthProvider.js';
import { Bootstrap452Helmet, Bootstrap530Helmet } from './Components/UI/Helmet/HelmetLinks.js';
import { CreateEmployee } from './Pages/Employees/CreateEmployee/CreateEmployee.jsx';
import { DetailsEmployee } from './Pages/Employees/DetailsEmployee/DetailsEmployee.jsx';
import { CreateProject } from './Pages/Projects/CreateProject/CreateProject.jsx';
import { DetailsProject } from './Pages/Projects/DetailsProject/DetailsProject.jsx';
import { UpdateEmployee } from './Pages/Employees/UpdateEmployee/UpdateEmployee.jsx';
import { UpdateProject } from './Pages/Projects/UpdateProject/UpdateProject.jsx';
import { Suspense } from 'react';
import { roleConfig } from './RequireAuth/roleConfig.js';
import { Error404 } from './Pages/Errors/Error404/Error404.jsx';


function App() {

 
  return (
    <AuthProvider>
    <div className="App">
      
      <Routes>
        
        <Route path='/' element={<RequireAuth allowedRoles={['Admin', 'Standard', 'Manager', 'Human Resource', 'Financial Resource']}><MainLayout/></RequireAuth>}>
          <Route index element={ <Bootstrap452Helmet><Home/></Bootstrap452Helmet>}/>
          <Route path='/profile' element={<Bootstrap452Helmet><Profile/></Bootstrap452Helmet>}/>
          <Route path='/tasks' element={<Bootstrap452Helmet><Tasks/></Bootstrap452Helmet>}/>
          <Route path='/projects' element={<RequireAuth allowedRoles={roleConfig['/projects']}><Bootstrap530Helmet><Projects/></Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/projects/create' element={<RequireAuth allowedRoles={roleConfig['/projects/create']}><Bootstrap530Helmet><CreateProject/> </Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/projects/details/:id' element={<RequireAuth allowedRoles={roleConfig['/projects/details/:id']}><Bootstrap530Helmet><DetailsProject/></Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/projects/update/:id' element={<RequireAuth allowedRoles={roleConfig['/projects/update/:id']}><Bootstrap530Helmet><UpdateProject/></Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/employees' element={<RequireAuth allowedRoles={roleConfig['/employees']}><Bootstrap452Helmet><Employees/></Bootstrap452Helmet></RequireAuth>}/>
          <Route path='/depsJobs' element={<RequireAuth allowedRoles={roleConfig['/depsJobs']}><Bootstrap452Helmet><DepsJobs/></Bootstrap452Helmet></RequireAuth>}/>
          <Route path='/financies' element={<RequireAuth allowedRoles={roleConfig['/finances']}><Bootstrap530Helmet><Finances/></Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/feedbacks' element={<Bootstrap452Helmet><Feedbacks/></Bootstrap452Helmet>}/>
          <Route path='/settings' element={<Bootstrap452Helmet><Settings/></Bootstrap452Helmet>}/>
          <Route path='/employee/create' element={<RequireAuth allowedRoles={roleConfig['/employee/create']}><Bootstrap530Helmet><CreateEmployee/></Bootstrap530Helmet></RequireAuth>}/>
          <Route path='/employee/details/:id' element={<RequireAuth allowedRoles={roleConfig['/employee/details/:id']}><Bootstrap452Helmet><DetailsEmployee/></Bootstrap452Helmet></RequireAuth>}/>
          <Route path='/employee/update/:id' element={<RequireAuth allowedRoles={roleConfig['/employee/update/:id']}><Bootstrap530Helmet><UpdateEmployee/></Bootstrap530Helmet></RequireAuth>}/>
        </Route>
        <Route path='*' element={<Bootstrap452Helmet><Error404/></Bootstrap452Helmet>}/>
      
        <Route path='/login' element={<Bootstrap452Helmet><Login/></Bootstrap452Helmet> }/>
        <Route path='/recoverPassword' element={<Bootstrap452Helmet><PasswordRecover/></Bootstrap452Helmet> }/>
      </Routes>
    </div>
    
    </AuthProvider>
  );
}

export default App;
