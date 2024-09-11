import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const GlobalSpinner = () => {
  const loading = useSelector((state) => state.loading);

  if (!loading) {
    return null;
  }

  return (
    <div style={spinnerOverlayStyle}>
      <Spinner />
    </div>
  );
};

const spinnerOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

export default GlobalSpinner;