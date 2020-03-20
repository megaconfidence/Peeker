import './Login.css';
import request from '../helpers';
import { useSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import React, { useState, useEffect, useRef } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Login = ({ fetchData, fetchUser }) => {
  const loaderIcon = useRef(null);
  const loginButtons = useRef(null);
  const signinHeader = useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('PEEKER_TOKEN')) {
      setRedirectTo('/');
    }
    return () => {};
  }, []);

  const saveToken = async (access_token, provider) => {
    try {
      signinHeader.current.textContent = 'Signing In';
      loginButtons.current.classList.add('hide');
      loaderIcon.current.classList.remove('hide');
      const payload = {
        access_token
      };
      const {
        data: { token }
      } = await request('post', `signin/${provider}`, payload);

      localStorage.setItem('PEEKER_TOKEN', token);
      setRedirectTo('/');
      fetchUser();
      fetchData();
      enqueueSnackbar('Welcome 😜');
    } catch (err) {
      enqueueSnackbar('Something went wrong 😢');
      signinHeader.current.textContent = 'Signin With';
      loginButtons.current.classList.remove('hide');
      loaderIcon.current.classList.add('hide');
    }
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
        <div className='signin__header' ref={signinHeader}>
          Signin With
        </div>
        <div className='signin__action' ref={loginButtons}>
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
        <div className='signin__loader hide' ref={loaderIcon}>
          <div className='loadingio-spinner-dual-ring-9kvr8hw5b1'>
            <div className='ldio-hyhtxra63xn'>
              <div></div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
