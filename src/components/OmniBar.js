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
      history,
      onClick,
      location,
      fetchData,
      fetchUser,
      handleSearch,
      profileImageURL,
      handleAccountModalDisalay
    },
    ref
  ) => {
    const searchBar = useRef(null);
    const searchReset = useRef(null);
    const searchInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [searchInput, setSearchInput] = useState('');
    const currPath = location.pathname.split('/').pop();

    const toggleSearch = () => {
      searchBar.current.classList.toggle('hide');
      if (!searchBar.current.classList.contains('hide')) {
        searchInputRef.current.focus();
      }
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

    const handleSearchReset = () => {
      setSearchInput('');
      searchReset.current.classList.add('disabled');
    };

    const handleRefresh = async ({ target }) => {
      target.classList.add('spin-animation');
      setTimeout(() => {
        target.classList.remove('spin-animation');
      }, 500);

      try {
        const isFetch = await fetchUser();
        await fetchData();
        if (isFetch === false) {
          enqueueSnackbar("You're offline");
        } else {
          enqueueSnackbar('Updated');
        }
      } catch (err) {
        enqueueSnackbar("Couldn't refresh notes");
      }
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
            onClick={onClick}
            data-imgname='hamburger'
            className={`omnibar__left__icon omnibar__left__icon--menutriger ${
              currPath === 'signin' ? 'disabled' : ''
            }`}
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
            value={searchInput}
            placeholder='Search'
            ref={searchInputRef}
            onChange={handleSearchChange}
            className='omnibar__search__input'
          />
          <div
            data-img
            ref={searchReset}
            data-imgname='close'
            onClick={handleSearchReset}
            className='omnibar__search__reset disabled'
          />
        </div>
        <div className='omnibar__right'>
          <Link to='/search' className='no-select'>
            <div
              data-img
              data-imgname='search'
              className={`omnibar__icon  ${
                currPath === 'signin' ? 'disabled' : ''
              }`}
              onClick={toggleSearch}
            />
          </Link>
          <div
            data-img
            data-imgname='refresh'
            onClick={handleRefresh}
            className={`omnibar__icon ${
              currPath === 'signin' ? 'disabled' : ''
            }`}
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
