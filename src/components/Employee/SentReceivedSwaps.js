
import React from 'react';
import ReceivedSwapRequests from './ReceivedSwapRequests';
import SentSwapRequests from './SentSwapRequests';

const SentReceivedSwaps = () => {
  return (
    <div className='main'>
      <ReceivedSwapRequests />
      <SentSwapRequests />
    </div>
  );
};

export default SentReceivedSwaps;