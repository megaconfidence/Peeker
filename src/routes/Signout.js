import React from 'react';
import { Redirect } from 'react-router-dom';

const Signout = () => {
  localStorage.removeItem('PEEKER_TOKEN');
  return <Redirect to='/signin' />;
};

export default Signout;
