import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='landing'>
      <div className='hero'>
        <div className='hero__top'>Peeker</div>
        <div className='hero__bottom'>
          <div className='hero__text'>
            <div className='hero__text__content'>
              Save your thoughts, wherever you are
            </div>
            <Link to='/signin'>
              <div className='try_btn'>Try Peeker</div>
            </Link>
          </div>
          <div>{/* clear-fix-div */}</div>
        </div>
      </div>
      <div className='capture'>
        <div className='capture__heading'> Capture what’s on your mind </div>
        <div className='capture__sub'>
          Add notes, lists, photos, and audio to Keep.
        </div>
        <div className='capture__grid'>
          <img src='/image/notes.jpg' alt='' />
          <img src='/image/lists.jpg' alt='' />
          <img src='/image/audio.jpg' alt='' />
          <img src='/image/photos.jpg' alt='' />
        </div>
      </div>
      <div className='info'>
        <div className='info__left'>
          <div className='info__left__head'>When and where you need it </div>
          <div className='info__left__body'>
            Need to remember to pick up some groceries? Set a location-based
            reminder to pull up your grocery list right when you get to the
            store. Need to finish a to-do? Set a time-based reminder to make
            sure you never miss a thing.
          </div>
        </div>
        <div className='info__right'>
          <img src='/image/reminder.gif' alt='' />
        </div>
      </div>{' '}
      <div className='info'>
        <div className='info__left'>
          <div className='info__left__head'>Find what you need, fast</div>
          <div className='info__left__body'>
            Quickly filter and search for notes by color and other attributes
            like lists with images, audio notes with reminders or just see
            shared notes. Find what you're looking for even faster, and let Keep
            do the remembering for you.
          </div>
        </div>
        <div className='info__right'>
          <img src='/image/search.gif' alt='' />
        </div>
      </div>
      <div className='zero'>
        <div className='zero__text'>Save every thought</div>
        <Link to='/signin'>
          <div className='try_btn'>Try Peeker</div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
