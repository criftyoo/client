import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import SwapRequestForm from './SwapRequestForm';
import SentReceivedSwaps from './SentReceivedSwaps';
import PreferenceForm from './PreferenceForm';
import ManageLeaveRequests from './ManageLeaveRequests';
import ClientProdcastViewer from './ClientProdcastViewer'; // Import the ClientProdcastViewer component

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
          <Route path="prodcasts" element={<ClientProdcastViewer />} /> {/* Add the route for ClientProdcastViewer */}
          <Route path="prodcast/:id" element={<ClientProdcastViewer />} /> {/* Add the route for viewing a single prodcast */}
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;