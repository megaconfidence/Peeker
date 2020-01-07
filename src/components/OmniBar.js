import './OmniBar.css';
import { useSnackbar } from 'notistack';
import React, { forwardRef } from 'react';
import { withRouter } from 'react-router-dom';

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
    {
      onClick,
      location,
      fetchData,
      fetchUser,
      profileImageURL,
      handleAccountModalDisalay
    },
    ref
  ) => {
    let currPath = location.pathname.split('/').pop();
    const { enqueueSnackbar } = useSnackbar();

    const handleRefresh = async ({ target }) => {
      target.classList.add('spin-animation');
      setTimeout(() => {
        target.classList.remove('spin-animation');
      }, 500);
      await fetchUser();
      await fetchData();
      enqueueSnackbar('Updated');
    };

    return (
      <div className='omnibar' ref={ref}>
        <div className='omnibar__left'>
          <div
            data-img
            data-imgname='hamburger'
            onClick={currPath !== 'signin' ? onClick : undefined}
            className='omnibar__left__icon omnibar__left__icon--menutriger'
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
            onClick={handleRefresh}
            className='omnibar__icon'
          />
          {profileImageURL === undefined || profileImageURL === 'no_image' ? (
            <div
              data-img
              data-imgname='profile'
              className='omnibar__right__profile'
              onClick={handleAccountModalDisalay}
            />
          ) : (
            <img
              alt=''
              src={profileImageURL}
              className='omnibar__right__profile'
              onClick={handleAccountModalDisalay}
            />
          )}
        </div>
      </div>
    );
  }
);

export default withRouterAndRef(OmniBar);
