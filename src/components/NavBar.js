import React, { forwardRef, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = forwardRef(({ labels, onClick, handleInstallBtnClick }, ref) => {
  const isInstallPromptRespondedTo = useRef();
  useEffect(() => {
    isInstallPromptRespondedTo.current = localStorage.getItem(
      'isInstallPromptRespondedTo'
    );
    return () => {};
  });
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
          <div
            className={`nav__install ${
              isInstallPromptRespondedTo.current === 'true' ? 'hide' : ''
            }`}
          >
            <div className='nav__install__head'>
              <div
                data-img
                data-imgname='peeker'
                className='nav__install__head__img'
              />
            </div>
            <div className='nav__install__body'>
              <div className='nav__install__body__text'>
                Take notes faster with our free app!
              </div>
              <div className='nav__install__body__buttons'>
                <div
                  className='nav__install__body__buttons__reject reject'
                  onClick={handleInstallBtnClick}
                >
                  Not now
                </div>
                <div
                  className='nav__install__body__buttons__accept accept'
                  onClick={handleInstallBtnClick}
                >
                  Install
                </div>
              </div>
            </div>
          </div>

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
                  className='nav__list__item__link disabled'
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
                  className='nav__list__item__link disabled'
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
