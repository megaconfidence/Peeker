import React from 'react';

const Settings = () => {
  return (
    <div>
      <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
        Hey there!{' '}
        <span role='img' aria-label='waving hand'>
          👋
        </span>
        <br /> Settings will live here soon.
      </p>
      <p style={{ wordBreak: 'break-all' }}>
        Why not take a moment to drop your thoughts on the app email: &nbsp;
        <a
          href='mailto:confidenceboi@gmail.com'
          rel='noopener noreferrer'
          target='_blank'
        >
          confidenceboi@gmail.com
        </a>
        &nbsp; twitter: &nbsp;
        <a
          href='https://twitter.com/COkoghenun/with_replies'
          rel='noopener noreferrer'
          target='_blank'
        >
          @cokoghenun
        </a>
      </p>
    </div>
  );
};

export default Settings;
