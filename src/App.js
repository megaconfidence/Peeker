import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';
import _ from 'lodash';
import request from './helpers';
import Notes from './routes/Notes';
import Label from './routes/Label';
import Signin from './routes/Signin';
import Settings from './routes/Settings';
import NavBar from './components/NavBar';
import Reminders from './routes/Reminders';
import OmniBar from './components/OmniBar';
import Account from './components/Account';
import React, { useRef, useEffect, useState } from 'react';

const NoMatchPage = () => {
  return (
    <>
      <h3 className='notfound'>404 -Page not found</h3>
      <div className='notfound__button'>
        <Link to='/' className='account__signout__button'>
          Back to App
        </Link>
      </div>
    </>
  );
};

const App = () => {
  const nav = useRef(null);
  const omniBarRef = useRef(null);
  const [app, setApp] = useState({
    data: []
  });
  const [userData, setUserData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const [search, setSearch] = useState({ data: [] });
  const [accountModalDisplay, setAccountModalDisplay] = useState(false);

  let labels;
  labels = app.data.map(i => (i.status === 'note' ? i.label : undefined));
  labels = _.reduce(labels, (acc, curr) => _.concat(acc, curr));
  labels = _.compact(labels);
  labels = _.uniq(labels);

  const resetGlobalAppState = () => {
    setUserData({});
    setApp({ data: [] });
  };

  const addLocal = payload => {
    const { data } = app;
    data.push(payload);
    setApp({ data });
  };

  const deleteLocal = id => {
    const { data } = app;
    const i = _.findIndex(data, { _id: id });
    data.splice(i, 1);
    setApp({ data });
  };

  const updateLocal = (id, payload) => {
    const { data } = app;
    const oldData = _.find(data, { _id: id });
    const newData = {
      ...oldData,
      ...payload
    };
    const i = _.findIndex(data, { _id: id });
    data.splice(i, 1, newData);
    setApp({ data });
  };

  const handleScroll = () => {
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

  const handleAccountModalDisalay = () => {
    if (accountModalDisplay) {
      setAccountModalDisplay(false);
    } else {
      setAccountModalDisplay(true);
    }
  };

  const fetchUser = async () => {
    if (localStorage.getItem('PEEKER_TOKEN')) {
      const {
        data: { data }
      } = await request('get', 'api/user');

      if (!_.isEqual(userData, data)) {
        console.log('## updating user data');
        setUserData(data);
      }
    }
  };

  const fetchData = async () => {
    if (!localStorage.getItem('PEEKER_TOKEN')) {
      return setRedirectTo('/signin');
    }
    const {
      data: { data }
    } = await request('get', 'api/note');

    // Makes update if there are any changes
    if (!_.isEqual(app.data, data)) {
      console.log('## app data is updated');
      setApp({ data });
    }
  };

  function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function(element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      document.addEventListener('input', function(event) {
        // const highlights = element.parentElement.children[0].children[0];
        // if (highlights) {
        //   // console.log(highlights)
        //   if (highlights.classList.contains('note__head__highlights')) {
        //     element.parentElement.style.height = 'auto';
        //     element.parentElement.style.height =
        //       element.parentElement.scrollHeight + offset + 'px';

        //     highlights.style.height = 'auto';
        //     highlights.style.height = highlights.scrollHeight + offset + 'px';
        //   }
        // }
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
  }

  useEffect(() => {
    fetchUser();
    fetchData();
    addAutoResize();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleSearch = value => {
    if (value) {
      const search = app.data.map((d, i) => {
        if (
          d.title.toLowerCase().includes(value) ||
          d.content.toLowerCase().includes(value)
        ) {
          return d;
        }
      });
      setSearchText(value);
      setSearch({ data: _.compact(search) });
    } else {
      setSearchText('');
      setSearch({ data: [] });
    }
  };

  return (
    <Router>
      <div className='app'>
        {redirectTo ? <Redirect to={redirectTo} /> : null}
        {accountModalDisplay ? (
          <Account
            userData={userData}
            resetGlobalAppState={resetGlobalAppState}
            handleAccountModalDisalay={handleAccountModalDisalay}
          />
        ) : (
          undefined
        )}
        <OmniBar
          ref={omniBarRef}
          fetchData={fetchData}
          fetchUser={fetchUser}
          onClick={handleNavClick}
          handleSearch={handleSearch}
          profileImageURL={userData.profileImageURL}
          handleAccountModalDisalay={handleAccountModalDisalay}
        />
        <NavBar labels={labels} ref={nav} onClick={handleNavClick} />
        <div className='app__content'>
          <Switch>
            <Route
              exact
              path='/'
              render={props => (
                <Notes
                  {...props}
                  noteType='note'
                  data={app.data}
                  allLabels={labels}
                  withNewNote={true}
                  addLocal={addLocal}
                  labelForNewNote={[]}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                />
              )}
            />
            <Route
              exact
              path='/search'
              render={props => (
                <Notes
                  {...props}
                  noteType=''
                  isSearch={true}
                  allLabels={labels}
                  withNewNote={false}
                  addLocal={addLocal}
                  labelForNewNote={[]}
                  fetchData={fetchData}
                  data={search.data}
                  searchText={searchText}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
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
                  allLabels={labels}
                  addLocal={addLocal}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                />
              )}
            />
            <Route
              exact
              path='/archive'
              render={props => (
                <Notes
                  {...props}
                  data={app.data}
                  allLabels={labels}
                  noteType='archive'
                  addLocal={addLocal}
                  withNewNote={false}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                />
              )}
            />
            <Route
              exact
              path='/trash'
              render={props => (
                <Notes
                  {...props}
                  data={app.data}
                  allLabels={labels}
                  noteType='trash'
                  addLocal={addLocal}
                  withNewNote={false}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                />
              )}
            />
            <Route
              exact
              path='/settings'
              render={props => <Settings {...props} />}
            />
            <Route
              exact
              path='/signin'
              render={props => (
                <Signin
                  {...props}
                  fetchData={fetchData}
                  fetchUser={fetchUser}
                />
              )}
            />
            <Route component={NoMatchPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
