import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadSchedule from './UploadSchedule';
import AllSchedules from './AllSchedules';
import Sidebar from '../common/Sidebar';
import AllSwapRequests from './AllSwapRequests';
import AllPreferences from './AllPreferences';
import LeaveRequests from './LeaveRequests';
import AdminNewsPage from './AdminNewsPage'; // Import AdminNewsPage

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
          <Route path="BreakingNews-manager" element={<AdminNewsPage />} /> {/* Update route to use AdminNewsPage */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;