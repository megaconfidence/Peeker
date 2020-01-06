import React from 'react';
import Login from '../components/Login';

const Signin = ({fetchData, fetchUser}) => {
  return <Login fetchData={fetchData} fetchUser={fetchUser} />;
};

export default Signin;
