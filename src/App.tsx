import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './features/Authentication/Components/Login';
import Dashboard from './features/Dashboard';
function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
