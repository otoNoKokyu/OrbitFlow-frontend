import './App.css'
import { Routes, Route } from "react-router-dom";
import {Navigation} from './features/Navigation';
import AuthRoutes from './features/Authentication/auth.routes';
import { Fragment } from 'react/jsx-runtime';
import { Toaster } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import DnDKitBoard from './features/Dashboard/components';
function App() {

  return (
    <Fragment>
    <Routes>
      <Route path='/' element={<Navigation />} />
      <Route path='/*' element={<AuthRoutes />} />     
      <Route path='/dashboard' element={<DnDKitBoard />} />     
    </Routes>
    <Toaster 
      position='bottom-right'
      icons={{
        success: <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize:'large', color: "#1adba1",}} />,
        error: <FontAwesomeIcon icon={faTriangleExclamation}  style={{color: "#e14337",fontSize:'large'}} />
      }}
    />
    </Fragment>

  )
}

export default App
