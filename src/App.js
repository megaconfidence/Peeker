import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Notes from './routes/Notes';
import Reminders from './routes/Reminders';
import Archive from './routes/Archive';
import Trash from './routes/Trash';
import Settings from './routes/Settings';
import Signin from './routes/Signin';
import Label from './routes/Label';
import NavBar from './components/NavBar';
import OmniBar from './components/OmniBar';
import axios from 'axios';
import { isEqual } from 'lodash';

const NoMatchPage = () => {
  return <h3>404 - Not found</h3>;
};

const App = () => {
  const nav = useRef(null);
  const omniBarRef = useRef(null);
  const [app, setApp] = useState({
    data: []
  });
  const [redirectTo, setRedirectTo] = useState(null);

  async function fetchData() {
    if (!localStorage.getItem('PEEK_TOKEN')) {
      return setRedirectTo('/signin');
    }
    const response = await axios.get('http://localhost:3000/api/note', {
      headers: {
        authorization: localStorage.getItem('PEEK_TOKEN')
      }
    });
    if (!isEqual(app.data, response.data.data)) {
      console.log('## app data is updated');
      setApp({
        data: response.data.data
      });
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    fetchData();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const label = [];
  const labelTemps = app.data.map(i => i.label).filter(i => i !== '');
  labelTemps.forEach(i => (!label.includes(i) ? label.push(i) : undefined));

  const handleScroll = e => {
    if (window.pageYOffset > 0) {
      omniBarRef.current.classList.add('omnibar__scrolling');
    } else {
      omniBarRef.current.classList.remove('omnibar__scrolling');
    }
  };

  const handleNavClick = e => {
    if (e.target.classList.contains('omnibar__left__icon--menutriger')) {
      nav.current.classList.add('slidein--active');
    }
    if (
      e.target.classList.contains('slidein--active') ||
      e.target.classList.contains('nav__list__item__link') ||
      e.target.classList.contains('nav__list__item__link__text') ||
      e.target.classList.contains('nav__list__item__link__icon')
    ) {
      nav.current.classList.remove('slidein--active');
    }
  };

  return (
    <Router>
      <div className='app'>
        {redirectTo ? <Redirect to={redirectTo} /> : null}
        <OmniBar
          ref={omniBarRef}
          onClick={handleNavClick}
          fetchData={fetchData}
        />
        <NavBar labels={label} ref={nav} onClick={handleNavClick} />
        <div className='app__content'>
          <Switch>
            <Route
              exact
              path='/'
              render={props => (
                <Notes {...props} data={app.data} fetchData={fetchData} />
              )}
            />
            <Route
              exact
              path='/reminders'
              render={props => <Reminders {...props} />}
            />
            <Route
              exact
              path='/label/:labelId'
              render={props => <Label {...props} data={app.data} />}
            />
            <Route
              exact
              path='/archive'
              render={props => <Archive {...props} />}
            />
            <Route exact path='/trash' render={props => <Trash {...props} />} />
            <Route
              exact
              path='/settings'
              render={props => <Settings {...props} />}
            />
            <Route
              exact
              path='/signin'
              render={props => <Signin {...props} fetchData={fetchData} />}
            />
            <Route component={NoMatchPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
