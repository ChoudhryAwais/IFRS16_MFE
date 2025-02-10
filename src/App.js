import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './middlewares/ProtectedRoute/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Leases from './pages/Leases';
import IFRS16Accounting from './pages/IFRS16Accounting';
import Login from './pages/Login';
import Register from './pages/Registration';
import BulkImport from './pages/BulkImport';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={Login} />
          <Route path='/Registration' element={Register} />
          <Route path='/Dashboard' element={<ProtectedRoute Component={Dashboard} />} />
          <Route path='/Leases' element={<ProtectedRoute Component={Leases} />} />
          <Route path='/IFRS16Accounting' element={<ProtectedRoute Component={IFRS16Accounting} />} />
          <Route path='/BulkImport' element={<ProtectedRoute Component={BulkImport} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
