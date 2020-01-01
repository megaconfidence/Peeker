import React, { useState, useEffect } from 'react';
import './Account.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import config from 'environment';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}


const Account = ({ fetchData }) => {
  const [redirectTo, setRedirectTo] = useState(null);
  useEffect(() => {
    if (localStorage.getItem('PEEK_TOKEN')) {
      setRedirectTo('/');
    }
    return () => {};
  }, []);
  const responseGoogle = async res => {
    const access_token = res.accessToken;
    const response = await axios.post(`${config.api}/signin/google`, {
      access_token: access_token
    });
    localStorage.setItem('PEEK_TOKEN', response.data.token);
    setRedirectTo('/');
    fetchData();
  };
  const responseFacebook = async res => {
    const access_token = res.accessToken;
    const response = await axios.post(`${config.api}/signin/facebook`, {
      access_token: access_token
    });
    localStorage.setItem('PEEK_TOKEN', response.data.token);
    setRedirectTo('/');
    fetchData();
  };

  return (
    <>
      <div className='signin'>
        <div className='signin__header'>Signin With</div>
        <div className='signin__action'>
          <GoogleLogin
            render={renderProps => (
              <div
                className='signin__action__btn signin__action__btn--google'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Google
              </div>
            )}
            clientId={process.env.google_client_id}
            buttonText='Google'
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            className='signin__action__btn signin__action__btn--google'
          />

          <FacebookLogin
            appId={process.env.facebook_client_id}
            autoLoad={false}
            callback={responseFacebook}
            disableMobileRedirect={true}
            fields='name,email,picture'
            render={renderProps => (
              <button
                className='signin__action__btn signin__action__btn--facebook'
                onClick={renderProps.onClick}
              >
                Facebook
              </button>
            )}
          />
          {redirectTo ? <Redirect to={redirectTo} /> : null}
        </div>
      </div>
    </>
  );
};

export default Account;
