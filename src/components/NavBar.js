import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = forwardRef(({ labels, onClick }, ref) => {
  const getLabel = () => (
    <div className='nav__group nav__group--middle'>
      <ul className='nav__list'>
        {labels.map((l, k) => (
          <li className='nav__list__item' key={k}>
            <NavLink
              exact
              to={`/label/${l}`}
              activeClassName='selected'
              className='nav__list__item__link'
            >
              <img
                src='/image/icon/badge.svg'
                alt='icon'
                className='nav__list__item__link__icon'
              />
              <span className='nav__list__item__link__text'>{l}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <div className='slidein' ref={ref} onClick={onClick}>
        <nav className=' nav no-select'>
          <div className='nav__name'>Peeker</div>
          <div className='nav__group'>
            <ul className='nav__list'>
              <li className='nav__list__item'>
                <NavLink
                  exact
                  to='/'
                  activeClassName='selected'
                  className='nav__list__item__link'
                >
                  <div
                    data-img
                    data-imgname='bulb'
                    className='nav__list__item__link__icon'
                  />
                  <span className='nav__list__item__link__text'>Note</span>
                </NavLink>
              </li>
              <li className='nav__list__item'>
                <NavLink
                  exact
                  to='/reminders'
                  activeClassName='selected'
                  className='nav__list__item__link'
                >
                  <div
                    data-img
                    data-imgname='bell'
                    className='nav__list__item__link__icon'
                  />
                  <span className='nav__list__item__link__text'>Reminders</span>
                </NavLink>
              </li>
            </ul>
          </div>
          {labels.length ? (
            getLabel()
          ) : (
            <div className='nav__group__separator'></div>
          )}

          <div className='nav__group'>
            <ul className='nav__list'>
              <li className='nav__list__item'>
                <NavLink
                  exact
                  to='/archive'
                  activeClassName='selected'
                  className='nav__list__item__link'
                >
                  <div
                    data-img
                    data-imgname='archive'
                    className='nav__list__item__link__icon'
                  />

                  <span className='nav__list__item__link__text'>Archive</span>
                </NavLink>
              </li>
              <li className='nav__list__item'>
                <NavLink
                  exact
                  to='/trash'
                  activeClassName='selected'
                  className='nav__list__item__link'
                >
                  <div
                    data-img
                    data-imgname='trash'
                    className='nav__list__item__link__icon'
                  />
                  <span className='nav__list__item__link__text'>Trash</span>
                </NavLink>
              </li>
              <li className='nav__list__item'>
                <NavLink
                  exact
                  to='/settings'
                  activeClassName='selected'
                  className='nav__list__item__link'
                >
                  <div
                    data-img
                    data-imgname='settings'
                    className='nav__list__item__link__icon'
                  />
                  <span className='nav__list__item__link__text'>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
});

export default NavBar;
