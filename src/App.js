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
import Signout from './routes/Signout';
import Label from './routes/Label';
import NavBar from './components/NavBar';
import OmniBar from './components/OmniBar';
import _ from 'lodash';
import request from './helpers';

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

  const addLocal = payload => {
    const data = app.data;
    data.push(payload);
    setApp({ data });
  };

  const deleteLocal = id => {
    const data = app.data;
    const index = _.findIndex(data, { _id: id });
    data.splice(index, 1);
    setApp({ data });
  };

  const updateLocal = (id, payload) => {
    const data = app.data;
    const obj = _.find(data, { _id: id });
    const update = {
      ...obj,
      ...payload
    };
    const index = _.findIndex(data, { _id: id });
    data.splice(index, 1, update);
    setApp({ data });
  };

  const fetchData = async () => {
    if (!localStorage.getItem('PEEKER_TOKEN')) {
      return setRedirectTo('/signin');
    }
    // Get all notes
    const {
      data: { data }
    } = await request('get', 'api/note');

    // Makes update if there are any changes
    if (!_.isEqual(app.data, data)) {
      console.log('## app data is updated');
      setApp({ data });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    fetchData();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  let label = app.data.map(i => i.label);
  label = _.reduce(label, (acc, curr) => _.concat(acc, curr));
  label = _.compact(label);
  label = _.uniq(label);

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

  if (!app.data.length) {
    // Retrun empty tag if no app data
    return <></>;
  }
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
                <Notes
                  {...props}
                  data={app.data}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  addLocal={addLocal}
                  deleteLocal={deleteLocal}
                  labelForNewNote={[]}
                  allLabels={label}
                />
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
              render={props => (
                <Label
                  {...props}
                  data={app.data}
                  fetchData={fetchData}
                  allLabels={label}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                  addLocal={addLocal}
                />
              )}
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
            <Route exact path='/signout' render={props => <Signout />} />
            <Route component={NoMatchPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
