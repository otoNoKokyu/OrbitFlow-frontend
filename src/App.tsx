import './App.css'
import { Routes, Route } from "react-router-dom";
import { Navigation } from './features/Navigation';
import AuthRoutes from './features/Authentication/auth.routes';
import { Fragment } from 'react/jsx-runtime';
import { Toaster } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import DnDKitBoard from './features/Dashboard/components';
import { useSelector } from 'react-redux';
import { RootState } from './store';
// import { FullscreenSpinner } from './components/ui/spinner';
import Header from './features/Issues/components/Header';

import IssueDetail from './features/Issues/components/IssueView';
function App() {
  const loading = useSelector((state: RootState) => state.loading.count > 0);
  // if (loading) return <FullscreenSpinner />
  return (
    <Fragment>
      <Routes>
        <Route path='' element={<Navigation />}>
          <Route path='dashboard' element={<DnDKitBoard />} />
          <Route path="issues" element={<Header />} />
          <Route path="issues/:id" element={<IssueDetail />} />
          {/* <Route path='issue' element={<CreateIssueDemo />} /> */}
        </Route>
        <Route path='/*' element={<AuthRoutes />} />
      </Routes>
      <Toaster
        position='bottom-right'
        icons={{
          success: <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 'large', color: "#1adba1", }} />,
          error: <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "#e14337", fontSize: 'large' }} />
        }}
      />
    </Fragment>

  )
}

export default App
