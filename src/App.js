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

  const label = [];
  const labelTemps = DataJSON.data.map(i => i.label).filter(i => i !== '');
  labelTemps.forEach(i => (!label.includes(i) ? label.push(i) : undefined));

  const handleNavClick = e => {
    e.stopPropagation();
    if (e.target.classList.contains('omnibar__left__icon--menutriger')) {
      nav.current.classList.add('nav--active');
    } else if (nav.current.classList.contains('nav--active')) {
      nav.current.classList.remove('nav--active');
    }
  };
  const handleScroll = e => {
    if (window.pageYOffset > 0) {
      omniBarRef.current.classList.add('omnibar__scrolling');
    } else {
      omniBarRef.current.classList.remove('omnibar__scrolling');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <Router>
      <div onClick={handleNavClick} className='App' onScroll={handleScroll}>
        <OmniBar ref={omniBarRef} />
        <NavBar labels={label} ref={nav}  />

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
        <p>
          Curabitur urna augue, varius in eros vel, gravida congue eros. Etiam
          elit nisl, consectetur vel feugiat eget, vulputate eu nisi. Aliquam
          eget dictum erat. In a vulputate lorem. Fusce aliquet ex turpis. Duis
          luctus at ante ut lacinia. In elementum, ante a imperdiet dignissim,
          urna orci commodo ex, at varius sem lectus auctor sem. Pellentesque
          quis nulla vitae libero scelerisque posuere eget sed mi. Fusce sed
          consectetur arcu, id pharetra diam. Vivamus elit libero, maximus vitae
          elit lacinia, dignissim mattis odio. Integer cursus, dolor ac auctor
          interdum, leo tortor efficitur neque, eu facilisis nisi mauris nec
          elit. Praesent semper vestibulum quam, ut egestas enim porta non. Nunc
          egestas tortor in tortor porttitor convallis. Curabitur lacus ex,
          maximus vel ultricies vitae, convallis et enim. Vestibulum nec dolor
          viverra, euismod odio at, pharetra nulla.
        </p>
        <p>
          Curabitur urna augue, varius in eros vel, gravida congue eros. Etiam
          elit nisl, consectetur vel feugiat eget, vulputate eu nisi. Aliquam
          eget dictum erat. In a vulputate lorem. Fusce aliquet ex turpis. Duis
          luctus at ante ut lacinia. In elementum, ante a imperdiet dignissim,
          urna orci commodo ex, at varius sem lectus auctor sem. Pellentesque
          quis nulla vitae libero scelerisque posuere eget sed mi. Fusce sed
          consectetur arcu, id pharetra diam. Vivamus elit libero, maximus vitae
          elit lacinia, dignissim mattis odio. Integer cursus, dolor ac auctor
          interdum, leo tortor efficitur neque, eu facilisis nisi mauris nec
          elit. Praesent semper vestibulum quam, ut egestas enim porta non. Nunc
          egestas tortor in tortor porttitor convallis. Curabitur lacus ex,
          maximus vel ultricies vitae, convallis et enim. Vestibulum nec dolor
          viverra, euismod odio at, pharetra nulla.
        </p>
        <p>
          Curabitur urna augue, varius in eros vel, gravida congue eros. Etiam
          elit nisl, consectetur vel feugiat eget, vulputate eu nisi. Aliquam
          eget dictum erat. In a vulputate lorem. Fusce aliquet ex turpis. Duis
          luctus at ante ut lacinia. In elementum, ante a imperdiet dignissim,
          urna orci commodo ex, at varius sem lectus auctor sem. Pellentesque
          quis nulla vitae libero scelerisque posuere eget sed mi. Fusce sed
          consectetur arcu, id pharetra diam. Vivamus elit libero, maximus vitae
          elit lacinia, dignissim mattis odio. Integer cursus, dolor ac auctor
          interdum, leo tortor efficitur neque, eu facilisis nisi mauris nec
          elit. Praesent semper vestibulum quam, ut egestas enim porta non. Nunc
          egestas tortor in tortor porttitor convallis. Curabitur lacus ex,
          maximus vel ultricies vitae, convallis et enim. Vestibulum nec dolor
          viverra, euismod odio at, pharetra nulla.
        </p>
      </div>
    </Router>
  );
};

export default App;
