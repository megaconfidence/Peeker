import React from 'react';
import './Account.css';
import axios from 'axios';

const Account = () => {
  const handleFBookBtn = async () => {
    // try {
    //   const response = await axios.get('http://localhost:3000/signin/facebook');
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  const handleGoogleBtn = async () => {
    // try {
    //   const response = await axios.get('http://localhost:3000/signin/google');
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <>
      <div className='signin'>
        <div className='signin__header'>Signin With</div>
        <div className='signin__action'>
          <div
            className='signin__action__btn signin__action__btn--google'
            onClick={handleGoogleBtn}
          >
            Google
          </div>
          <div
            className='signin__action__btn signin__action__btn--facebook'
            onClick={handleFBookBtn}
          >
            Facebook
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
