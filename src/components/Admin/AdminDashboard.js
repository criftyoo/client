import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadSchedule from '../Admin/UploadSchedule';
import AllSchedules from './AllSchedules';
import Sidebar from '../common/Sidebar';
import AllSwapRequests from './AllSwapRequests';
import AllPreferences from './AllPreferences';
import LeaveRequests from './LeaveRequests';
import AdminProdcastManager from './AdminProdcastManager'; // Import the AdminProdcastManager component

const AdminDashboard = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='main-content'>
        <Routes>
          <Route path="upload-schedule" element={<UploadSchedule />} />
          <Route path="swap-request" element={<AllSwapRequests />} />
          <Route path="all-schedules" element={<AllSchedules />} />
          <Route path="all-preferences" element={<AllPreferences />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="prodcast-manager" element={<AdminProdcastManager />} /> {/* Add the route for AdminProdcastManager */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;