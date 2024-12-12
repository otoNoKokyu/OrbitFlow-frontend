import './App.css'
import { Routes, Route } from "react-router-dom";
import {Dashboard} from './features/Dashboard';
import AuthRoutes from './features/Authentication/auth.routes';
import { Fragment } from 'react/jsx-runtime';
function App() {

  return (
    <Fragment>
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/*' element={<AuthRoutes />} />     
    </Routes>
    </Fragment>

  )
}

export default App
