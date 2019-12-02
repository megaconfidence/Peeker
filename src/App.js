import React, { useRef } from 'react';
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

  const label = [];
  const labelTemps = DataJSON.data.map(i => i.label).filter(i => i !== '');
  labelTemps.forEach(i => (!label.includes(i) ? label.push(i) : undefined));

  const handleNavClick = e => {
    e.stopPropagation();
    if (e.target.tagName === 'IMG') {
      nav.current.classList.add('nav--active');
    } else if (nav.current.classList.contains('nav--active')) {
      nav.current.classList.remove('nav--active');
    }
  };

  return (
    <Router>
      <div onClick={handleNavClick} className='App'>
        <OmniBar />
        <NavBar labels={label} ref={nav} onClick={handleNavClick} />

        <Switch>
          <Route exact path='/' render={props => <Notes {...props} />} />
          <Route
            exact
            path='/reminders'
            render={props => <Reminders {...props} />}
          />
          <Route
            exact
            path='/label/:labelId'
            render={props => <Label {...props} />}
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
        <p>Default text</p>
      </div>
    </Router>
  );
};

export default App;
