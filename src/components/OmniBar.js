import React from 'react';
import './OmniBar.css';
import { withRouter } from 'react-router-dom';

const OmniBar = withRouter((props, { pagename, onClick }) => {
  let currPath = props.location.pathname.split('/').pop();
  return (
    <div className='omnibar'>
      <div className='omnibar__left'>
        <img
          src='/image/icon/hamburger.svg'
          alt='menue'
          className='omnibar__left__icon omnibar__icon'
          onClick={onClick}
        />
        <div className='omnibar__left__pagename'>{currPath?currPath:'Peek'}</div>
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

export default OmniBar;
