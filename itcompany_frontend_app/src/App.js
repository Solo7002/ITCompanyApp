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
import { Bootstrap452Helmet, Bootstrap530Helmet } from './Components/UI/Helmet/HelmetLinks.js';
import { CreateEmployee } from './Pages/Employees/CreateEmployee/CreateEmployee.jsx';
import { DetailsEmployee } from './Pages/Employees/DetailsEmployee/DetailsEmployee.jsx';
import { CreateProject } from './Pages/Projects/CreateProject/CreateProject.jsx';
import { DetailsProject } from './Pages/Projects/DetailsProject/DetailsProject.jsx';
import { UpdateEmployee } from './Pages/Employees/UpdateEmployee/UpdateEmployee.jsx';
import { UpdateProject } from './Pages/Projects/UpdateProject/UpdateProject.jsx';
import { Suspense } from 'react';

function App() {
  return (
    <AuthProvider>
    <div className="App">
      
      <Routes>
        
        <Route path='/' element={<RequireAuth><MainLayout/></RequireAuth>}>
          <Route index element={ <Bootstrap452Helmet><Home/></Bootstrap452Helmet>}/>
          <Route path='/profile' element={<Bootstrap452Helmet><Profile/></Bootstrap452Helmet>}/>
          <Route path='/tasks' element={<Bootstrap452Helmet><Tasks/></Bootstrap452Helmet>}/>
          <Route path='/projects' element={<Bootstrap530Helmet><Projects/></Bootstrap530Helmet>}/>
          <Route path='/projects/create' element={<Bootstrap530Helmet><CreateProject/> </Bootstrap530Helmet>}/>
          <Route path='/projects/details/:id' element={<Bootstrap530Helmet><DetailsProject/></Bootstrap530Helmet>}/>
          <Route path='/projects/update/:id' element={<Bootstrap530Helmet><UpdateProject/></Bootstrap530Helmet>}/>
          <Route path='/employees' element={<Bootstrap452Helmet><Employees/></Bootstrap452Helmet>}/>
          <Route path='/depsJobs' element={<Bootstrap452Helmet><DepsJobs/></Bootstrap452Helmet>}/>
          <Route path='/financies' element={<Bootstrap530Helmet><Finances/></Bootstrap530Helmet>}/>
          <Route path='/feedbacks' element={<Bootstrap452Helmet><Feedbacks/></Bootstrap452Helmet>}/>
          <Route path='/settings' element={<Bootstrap452Helmet><Settings/></Bootstrap452Helmet>}/>
          <Route path='/employee/create' element={<Bootstrap530Helmet><CreateEmployee/></Bootstrap530Helmet>}/>
          <Route path='/employee/details/:id' element={<Bootstrap452Helmet><DetailsEmployee/></Bootstrap452Helmet>}/>
          <Route path='/employee/update/:id' element={<Bootstrap530Helmet><UpdateEmployee/></Bootstrap530Helmet>}/>
        </Route>
        <Route path='/login' element={<Bootstrap452Helmet><Login/></Bootstrap452Helmet> }/>
      </Routes>
    </div>
    
    </AuthProvider>
  );
}

export default App;
