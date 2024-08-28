import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../App.css';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const userRole = useSelector((state) => state.users?.user?.role);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        &#9776; {/* Hamburger icon */}
      </button>
      <ul>
        {userRole === 'admin' && (
          <>
            <li><Link to="upload-schedule">{isExpanded && 'Upload Schedule'}</Link></li>
            <li><Link to="swap-request">{isExpanded && 'Swap Requests'}</Link></li>
            <li><Link to="all-schedules">{isExpanded && 'View Schedules'}</Link></li>
            <li><Link to="all-preferences">{isExpanded && 'View Preferences'}</Link></li>
          </>
        )}
        {userRole === 'employee' && (
          <>
            <li><Link to="swap-request-form">{isExpanded && 'Swap Requester'}</Link></li>
            <li><Link to="employee-swap-requests">{isExpanded && 'Sent Received Swaps'}</Link></li>
            <li><Link to="preferences">{isExpanded && 'Preferences'}</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;