import React, { useRef, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Notes from './routes/Notes';
import Reminders from './routes/Reminders';
import Archive from './routes/Archive';
import Trash from './routes/Trash';
import Settings from './routes/Settings';
import DataJSON from './data.json';
import Label from './routes/Label';
import NavBar from './components/NavBar';
import OmniBar from './components/OmniBar';

const NoMatchPage = () => {
  return <h3>404 - Not found</h3>;
};

const App = () => {
  const nav = useRef(null);
  const omniBarRef = useRef(null);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const label = [];
  const labelTemps = DataJSON.data.map(i => i.label).filter(i => i !== '');
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
  const toDay = new Date();
  const toDayObj = {
    year: Number(toDay.getFullYear()),
    month: Number(toDay.getMonth()),
    date: Number(toDay.getDate()),
    dayOfWeek: Number(toDay.getDay())
  };

  return (
    <Router>
      <div className='app'>
        <OmniBar ref={omniBarRef} onClick={handleNavClick} />
        <NavBar labels={label} ref={nav} onClick={handleNavClick} />
        <div className='app__content'>
          <Switch>
            <Route exact path='/' render={props => <Notes {...props} data={DataJSON.data} toDayObj={toDayObj} />} />
            <Route
              exact
              path='/reminders'
              render={props => <Reminders {...props} />}
            />
            <Route
              exact
              path='/label/:labelId'
              render={props => <Label {...props} data={DataJSON.data} toDayObj={toDayObj} />}
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
            <Route component={NoMatchPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
