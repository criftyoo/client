import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import SwapRequestForm from './SwapRequestForm';
import SentReceivedSwaps from './SentReceivedSwaps';
import PreferenceForm from './PreferenceForm';
import ManageLeaveRequests from './ManageLeaveRequests';

const EmployeeDashboard = () => {
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='main-content'>
        
        <Routes>
          <Route path="swap-request-form" element={<SwapRequestForm />} />
          <Route path="employee-swap-requests" element={<SentReceivedSwaps />} />
          <Route path="preferences" element={<PreferenceForm />} />
          <Route path="employee-leave-requests" element={<ManageLeaveRequests />} />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;