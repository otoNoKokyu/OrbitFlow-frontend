import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import {Dashboard} from './features/Dashboard';
import AuthRoutes from './features/Authentication/auth.routes';
import { Fragment } from 'react/jsx-runtime';
import Navbar from './common/component/Navbar';
function App() {

  const {pathname} = useLocation();
  const excludedPaths = ['/login', '/register'];
  const showNavbar = !excludedPaths.includes(pathname);
  return (
    <Fragment>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/*' element={<AuthRoutes />} />     
      </Routes>
    </Fragment>

  )
}

export default App
