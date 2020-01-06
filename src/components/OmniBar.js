import React, { forwardRef } from 'react';
import { withRouter } from 'react-router-dom';
import './OmniBar.css';

const withRouterAndRef = Wrapped => {
  const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef = forwardRef((props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  ));
  const name = Wrapped.displayName || Wrapped.name;
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
};

const OmniBar = forwardRef(
  (
    { onClick, location, fetchData, handleAccountDisalay, profileImageURL },
    ref
  ) => {
    let currPath = location.pathname.split('/').pop();
    const handleRefresh = e => {
      const btn = e.target;
      btn.classList.add('spin-animation');
      setTimeout(() => {
        btn.classList.remove('spin-animation');
      }, 500);
      fetchData();
    };
    return (
      <div className='omnibar' ref={ref}>
        <div className='omnibar__left'>
          <div
            data-img
            data-imgname='hamburger'
            className='omnibar__left__icon omnibar__left__icon--menutriger '
            onClick={currPath !== 'signin' ? onClick : undefined}
          />
          <div className='omnibar__left__pagename'>
            {currPath ? currPath : 'Peeker'}
          </div>
        </div>

        <div className='omnibar__right'>
          <div
            data-img
            data-imgname='search'
            className='omnibar__icon disabled'
          />
          <div
            data-img
            data-imgname='refresh'
            className='omnibar__icon '
            onClick={handleRefresh}
          />
          <div
            data-img
            data-imgname='settings'
            className='omnibar__icon disabled'
          />
          {profileImageURL === undefined || profileImageURL === 'no_image' ? (
            <div
              data-img
              data-imgname='profile'
              className='omnibar__right__profile'
              onClick={handleAccountDisalay}
            />
          ) : (
            <img
              src={profileImageURL}
              alt='profile_image'
              className='omnibar__right__profile'
              onClick={handleAccountDisalay}
            />
          )}
        </div>
      </div>
    );
  }
);

export default withRouterAndRef(OmniBar);
