
import React from 'react';
import ReceivedSwapRequests from './ReceivedSwapRequests';
import SentSwapRequests from './SentSwapRequests';

const SentReceivedSwaps = () => {
  return (
    <div className='main'>
      <h2>Received Swap Requests</h2>
      <ReceivedSwapRequests />
      <h2>Sent Swap Requests</h2>
      <SentSwapRequests />
    </div>
  );
};

export default SentReceivedSwaps;