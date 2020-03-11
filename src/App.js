import './App.css';
import {
  Link,
  Route,
  Switch,
  Redirect,
  HashRouter as Router
} from 'react-router-dom';
import request from './helpers';
import Notes from './routes/Notes';
import Label from './routes/Label';
import Signin from './routes/Signin';
import Settings from './routes/Settings';
import NavBar from './components/NavBar';
import colorLog from './helpers/colorLog';
import OmniBar from './components/OmniBar';
import Account from './components/Account';
import { useSnackbar } from 'notistack';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ImageViewer from './components/ImageViewer';

const NoMatchPage = () => {
  return (
    <>
      <h3 className='notfound'>404 - Page not found</h3>
      <div className='notfound__button'>
        <Link to='/' className='account__signout__button'>
          Back to App
        </Link>
      </div>
    </>
  );
};

window.addEventListener('online', () => {
  try {
    const data = JSON.parse(localStorage.getItem('PEEKER_DATA'));
    if (data) {
      data.forEach(d => {
        request('put', `api/note/${d._id}`, d);
      });
      localStorage.removeItem('PEEKER_DATA');
      colorLog('Sync successful', 'success');
    }
  } catch (err) {
    colorLog('Could not sync', 'error');
  }
});

const App = () => {
  const nav = useRef(null);
  const omniBarRef = useRef(null);
  const [app, setApp] = useState({
    data: []
  });
  const deferredPrompt = useRef();
  const ImageViewerRef = useRef(null);
  const [viewImageData, setViewImageData] = useState({
    value: { image: [{ url: '' }], startIndex: 0 }
  });
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const [search, setSearch] = useState({ data: [] });
  const [showAccountModal, setShowAccountModal] = useState(false);

  const getLabels = () => {
    return [
      ...new Set(
        [].concat.apply(
          [],
          app.data
            .map(i => (i.status === 'note' ? i.label : undefined))
            .filter(function(n) {
              return n != null;
            })
        )
      )
    ];
  };
  const labels = getLabels();

  const resetGlobalAppState = () => {
    setUserData({});
    setApp({ data: [] });
    localStorage.removeItem('PEEKER_DATA');
    localStorage.removeItem('PEEKER_USER');
    localStorage.removeItem('PEEKER_TOKEN');
    localStorage.removeItem('PEEKER_SUBSCRIPTION');
    localStorage.removeItem('PEEKER_ISINSTALL_RESPONDED');
    localStorage.removeItem('PEEKER_NOTIFICATION_ISPERMITTED');
  };

  const addLocal = payload => {
    const { data } = app;
    data.unshift(payload);
    setApp({ data });
    localStorage.setItem('PEEKER_DATA', JSON.stringify(data));
  };

  const deleteLocal = id => {
    const { data } = app;
    const i = data.findIndex(({ _id }) => _id === id);
    data.splice(i, 1);
    setApp({ data });
    localStorage.setItem('PEEKER_DATA', JSON.stringify(data));
  };

  const updateLocal = (id, payload) => {
    const { data } = app;
    const i = data.findIndex(({ _id }) => _id === id);
    const oldData = data[i];

    const newData = {
      ...oldData,
      ...payload
    };
    data.splice(i, 1, newData);
    setApp({ data });
    localStorage.setItem('PEEKER_DATA', JSON.stringify(data));
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
    if (showAccountModal) {
      setShowAccountModal(false);
    } else {
      setShowAccountModal(true);
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      if (!localStorage.getItem('PEEKER_TOKEN')) {
        setRedirectTo('/signin');
      }
      const {
        data: { data }
      } = await request('get', 'api/user');

      colorLog('Updating user data', 'success');
      setUserData(data);
      const { name, email } = data;
      const tempUser = {
        _id: 1,
        name,
        email
      };
      localStorage.setItem('PEEKER_USER', JSON.stringify(tempUser));
    } catch (err) {
      const data = JSON.parse(localStorage.getItem('PEEKER_USER'));
      if (data) {
        setUserData(data);
      }
      colorLog('Could not get user data', 'error');
      return false;
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (!localStorage.getItem('PEEKER_TOKEN')) {
        setRedirectTo('/signin');
      }
      const {
        data: { data }
      } = await request('get', 'api/note');

      colorLog('App data is updated', 'success');
      setApp({ data });
      localStorage.setItem('PEEKER_DATA', JSON.stringify(data));
    } catch (err) {
      const data = JSON.parse(localStorage.getItem('PEEKER_DATA'));
      if (data) {
        setApp({ data });
      }
      colorLog('Could not get app data', 'error');
    }
  }, []);

  const handleInstallBtnClick = ({ target }) => {
    if (target.classList.contains('accept')) {
      if (deferredPrompt.current) {
        deferredPrompt.current.prompt();
        deferredPrompt.current.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            enqueueSnackbar('Awesome! Peeker is being installed');
          } else {
            enqueueSnackbar('Peeker is not installed 😢');
          }
          deferredPrompt.current = null;
        });
      }
    }
    const installBanner = target.parentNode.parentNode.parentNode;
    installBanner.classList.add('hide');
    localStorage.setItem('PEEKER_ISINSTALL_RESPONDED', true);
  };

  const handleSearch = value => {
    if (value) {
      const search = app.data.map((d, i) =>
        d.title.toLowerCase().includes(value) ||
        d.content.toLowerCase().includes(value)
          ? d
          : ''
      );
      setSearchText(value);
      setSearch({
        data: search.filter(function(n) {
          return n != null;
        })
      });
    } else {
      setSearchText('');
      setSearch({ data: [] });
    }
  };

  const resetViewImageData = () => {
    setViewImageData({ value: { image: [{ url: '' }], startIndex: 0 } });
  };
  const showViewImage = noteData => {
    setViewImageData({ value: noteData });
    ImageViewerRef.current.classList.toggle('hide');
    setTimeout(() => {
      ImageViewerRef.current.querySelector('.viewer__preview img').src =
        noteData.image[noteData.startIndex].url;
    }, 500);
  };

  const checkIfLoggedIn = () => {
    if (!localStorage.getItem('PEEKER_TOKEN')) {
      return (window.location.hash = '/signin');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt.current = e;
    });
    window.addEventListener('appinstalled', () => {
      enqueueSnackbar('Peeker is installed, Check your homescreen!');
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <Router>
      <div className='app'>
        {redirectTo ? <Redirect to={redirectTo} /> : null}
        {showAccountModal ? (
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
        <NavBar
          labels={labels}
          ref={nav}
          onClick={handleNavClick}
          handleInstallBtnClick={handleInstallBtnClick}
        />
        <ImageViewer
          noteData={viewImageData.value}
          ref={ImageViewerRef}
          resetViewImageData={resetViewImageData}
          updateLocal={updateLocal}
          fetchData={fetchData}
        />
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
                  showViewImage={showViewImage}
                  checkIfLoggedIn={checkIfLoggedIn}
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
                  data={search.data}
                  allLabels={labels}
                  withNewNote={false}
                  addLocal={addLocal}
                  labelForNewNote={[]}
                  fetchData={fetchData}
                  searchText={searchText}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                  showViewImage={showViewImage}
                  checkIfLoggedIn={checkIfLoggedIn}
                />
              )}
            />
            <Route
              exact
              path='/reminders'
              render={props => (
                <Notes
                  {...props}
                  noteType='due'
                  data={app.data}
                  allLabels={labels}
                  withNewNote={false}
                  addLocal={addLocal}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                  showViewImage={showViewImage}
                  checkIfLoggedIn={checkIfLoggedIn}
                />
              )}
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
                  checkIfLoggedIn={checkIfLoggedIn}
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
                  noteType='archive'
                  allLabels={labels}
                  addLocal={addLocal}
                  withNewNote={false}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                  showViewImage={showViewImage}
                  checkIfLoggedIn={checkIfLoggedIn}
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
                  noteType='trash'
                  allLabels={labels}
                  addLocal={addLocal}
                  withNewNote={false}
                  fetchData={fetchData}
                  updateLocal={updateLocal}
                  deleteLocal={deleteLocal}
                  showViewImage={showViewImage}
                  checkIfLoggedIn={checkIfLoggedIn}
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
