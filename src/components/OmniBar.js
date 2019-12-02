import React from 'react';

const OmniBar = ({pagename}) => {
  return (
    <div className='omnibar'>
      <div className='omnibar__left'>
        <img src='/image/icon/hamburger.svg' alt='menue' className='omnibar__left__icon' />
        <div className='omnibar__left__pagename'>pagename</div>
      </div>
      <div className='omnibar__middle'>
        <img src='/image/icon/search.svg' alt='search' className='omnibar__middle__search' />
        <img src='/image/icon/refresh.svg' alt='refresh' className='omnibar__middle__refresh' />
        <img src='/image/icon/settings.svg' alt='settings' className='omnibar__middle__settings' />

      </div>
      <div className='omnibar__right'></div>
    </div>
  );
};

export default OmniBar;
