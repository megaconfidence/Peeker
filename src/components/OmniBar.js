import './OmniBar.css';
import { useSnackbar } from 'notistack';
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';

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
      history,
      fetchData,
      fetchUser,
      handleSearch,
      profileImageURL,
      handleAccountModalDisalay
    },
    ref
  ) => {
    let currPath = location.pathname.split('/').pop();
    const { enqueueSnackbar } = useSnackbar();
    const [searchInput, setSearchInput] = useState('');
    const searchBar = useRef(null);
    const searchReset = useRef(null);
    const searchInputRef = useRef(null);

    const handleRefresh = async ({ target }) => {
      target.classList.add('spin-animation');
      setTimeout(() => {
        target.classList.remove('spin-animation');
      }, 500);
      await fetchUser();
      await fetchData();
      enqueueSnackbar('Updated');
    };

    const handleSearchChange = ({ target: { value } }) => {
      setSearchInput(value);
      handleSearch(value.toLowerCase());
      if (value) {
        searchReset.current.classList.remove('disabled');
      } else {
        searchReset.current.classList.add('disabled');
      }
    };

    const toggleSearch = () => {
      console.log('running');
      searchBar.current.classList.toggle('hide');
      if (!searchBar.current.classList.contains('hide')) {
        searchInputRef.current.focus();
      }
    };

    const handleSearchReset = () => {
      setSearchInput('');
      searchReset.current.classList.add('disabled');
    };

    useEffect(() => {
      if (currPath === 'search') {
        searchBar.current.classList.remove('hide');
        searchInputRef.current.focus();
      }
      return () => {};
    });

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
        <div className='omnibar__search hide' ref={searchBar}>
          <div
            data-img
            data-imgname='left_arrow'
            className='omnibar__search__back'
            onClick={() => {
              toggleSearch();
              history.goBack();
            }}
          />
          <input
            type='text'
            ref={searchInputRef}
            className='omnibar__search__input'
            placeholder='Search'
            value={searchInput}
            onChange={handleSearchChange}
          />
          <div
            data-img
            data-imgname='close'
            className='omnibar__search__reset disabled'
            ref={searchReset}
            onClick={handleSearchReset}
          />
        </div>
        <div className='omnibar__right'>
          <Link to='/search' className='no-select'>
            <div
              data-img
              data-imgname='search'
              className='omnibar__icon'
              onClick={toggleSearch}
            />
          </Link>
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
