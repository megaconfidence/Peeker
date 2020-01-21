import './Account.css';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const Account = ({
  userData,
  resetGlobalAppState,
  handleAccountModalDisalay
}) => {
  const accountModal = useRef(null);
  const { _id, name, email, profileImageURL } = userData;

  const handleSignout = () => {
    resetGlobalAppState();
    handleAccountModalDisalay();
    localStorage.removeItem('PEEKER_TOKEN');
  };
  return (
    <div
      ref={accountModal}
      className='account__wrapper'
      onClick={handleAccountModalDisalay}
    >
      <div className='account' onClick={e => e.stopPropagation()}>
        <div className='account__image'>
          {profileImageURL === undefined || profileImageURL === 'no_image' ? (
            <div data-img data-imgname='profile' />
          ) : (
            <img src={profileImageURL} alt='profile_image' />
          )}
        </div>
        <div className='account__body'>
          <div className='account__body__name'>{name}</div>
          <div className='account__body__email'>{email}</div>
        </div>
        <div className='account__signout'>
          <Link
            to='/signin'
            className='account__signout__button'
            onClick={handleSignout}
          >
            {_id ? 'Sign out' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
