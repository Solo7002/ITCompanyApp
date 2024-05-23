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

function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Routes>
        <Route path='/' element={<RequireAuth><MainLayout/></RequireAuth>}>
          <Route index element={ <Bootstrap452Helmet><Home/></Bootstrap452Helmet>}/>
          <Route path='/profile' element={<Bootstrap452Helmet><Profile/></Bootstrap452Helmet>}/>
          <Route path='/tasks' element={<Bootstrap530Helmet><Tasks/></Bootstrap530Helmet>}/>
          <Route path='/projects' element={<Projects/>}/>
          <Route path='/employees' element={<Bootstrap452Helmet><Employees/></Bootstrap452Helmet>}/>
          <Route path='/depsJobs' element={<DepsJobs/>}/>
          <Route path='/financies' element={<Finances/>}/>
          <Route path='/feedbacks' element={<Bootstrap530Helmet><Feedbacks/></Bootstrap530Helmet>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Route>
        <Route path='/login' element={<Bootstrap452Helmet><Login/></Bootstrap452Helmet> }/>
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;
