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

const OmniBar = forwardRef(({ onClick, location, fetchData }, ref) => {
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
        <img
          src='/image/icon/hamburger.svg'
          alt='menue'
          className='omnibar__left__icon omnibar__left__icon--menutriger  omnibar__icon'
          onClick={onClick}
        />
        <div className='omnibar__left__pagename'>
          {currPath ? currPath : 'Peek'}
        </div>
      </div>

      <div className='omnibar__right'>
        <img
          src='/image/icon/search.svg'
          alt='search'
          className='omnibar__right__search omnibar__icon'
        />
        <img
          src='/image/icon/refresh.svg'
          alt='refresh'
          className='omnibar__right__refresh omnibar__icon'
          onClick={handleRefresh}
        />
        <img
          src='/image/icon/settings.svg'
          alt='settings'
          className='omnibar__right__settings omnibar__icon'
        />
        <img
          src='/image/icon/profile.svg'
          alt='profile_image'
          className='omnibar__right__profile'
        />
      </div>
    </div>
  );
});

export default withRouterAndRef(OmniBar);
