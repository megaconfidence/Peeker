import './Account.css';
import request from '../helpers';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Account = ({ fetchData }) => {
  const [redirectTo, setRedirectTo] = useState(null);
  useEffect(() => {
    if (localStorage.getItem('PEEKER_TOKEN')) {
      setRedirectTo('/');
    }
    return () => {};
  }, []);
  const saveToken = async (access_token, provider) => {
    const payload = {
      access_token
    };
    const {
      data: { token }
    } = await request('post', `signin/${provider}`, payload);

    localStorage.setItem('PEEKER_TOKEN', token);
    setRedirectTo('/');
    fetchData();
  };
  const responseGoogle = ({ accessToken }) => {
    saveToken(accessToken, 'google');
  };
  const responseFacebook = ({ accessToken }) => {
    saveToken(accessToken, 'facebook');
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
            clientId={process.env.REACT_APP_google_client_id}
            buttonText='Google'
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            className='signin__action__btn signin__action__btn--google'
          />

          <FacebookLogin
            appId={process.env.REACT_APP_facebook_client_id}
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
