import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import './Notes.css';
import './Note.css';
import axios from 'axios';
import config from 'environment';


const NewNote = ({ title, content, updatedAt, pinned, id }) => {
  const [titleTextState, setTitleTextState] = useState(title);
  const [contentTextState, setContentTextState] = useState(content);
  const noteRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);

  useEffect(() => {
    /*
     * Autogrow notes after filling in content
     */
    autoGrow(contentTextRef.current);
    autoGrow(titleTextRef.current);
    return () => {};
  });

  const autoGrow = elem => {
    const textarea = elem.target;

    if (textarea) {
      textarea.style.height = `${textarea.scrollHeight}px`;
      if (!textarea.value) {
        textarea.style.height = '45px';
      }
    }
    /*
     * Sym autogrow after filling in notes
     */
    if (!elem.target) {
      elem.style.height = `${elem.scrollHeight}px`;
      if (!elem.value) {
        elem.style.height = '45px';
      }
    }
  };

  const openNote = () => {
    /*
     * The setTimeout makes sure that the openNote function runs last
     */
    setTimeout(() => {
      noteRef.current.classList.remove('note--closed');
      noteRef.current.classList.add('note--opened');
      noteOverlayRef.current.classList.remove('note__overlay--close');
    }, 0);
  };
  const closeNote = e => {
    e.stopPropagation();
    e.stopPropagation();
    const elem = e.target;
    if (
      elem.classList.contains('note__overlay') ||
      elem.classList.contains('note__footer__closebtn')
    ) {
      noteRef.current.classList.remove('note--opened');
      noteRef.current.classList.add('note--closed');
      noteOverlayRef.current.classList.add('note__overlay--close');
      const noteId = noteRef.current.getAttribute('data-note-id');
      const noteTitle = titleTextRef.current.textContent;
      const noteContent = contentTextRef.current.textContent;
      (async () => {
        await axios({
          method: 'put',
          url: `${config.api}/api/note/${noteId}`,
          headers: {
            authorization: localStorage.getItem('PEEKER_TOKEN')
          },
          data: {
            title: noteTitle,
            content: noteContent
          }
        });
      })();
    }
  };

  const giveFocus = () => {
    noteRef.current.classList.add('note--focused');
  };
  const loseFocus = () => {
    noteRef.current.classList.remove('note--focused');
  };
  const handleTextareaChange = e => {
    const txtArea = e.target;
    if (txtArea.classList.contains('note__head__titletext')) {
      setTitleTextState(txtArea.value);
    }
    if (txtArea.classList.contains('note__body__content__textarea')) {
      setContentTextState(txtArea.value);
    }
  };
  const findEditedDate = () => {
    let str = updatedAt.split('T');
    const date = str[0];
    str = str[1].split('.');
    const time = str[0];
    const utc = str[1];
    return moment(`${date} ${time} ${utc}`, 'YYYY-MM-DD HH:mm:ss Z').fromNow();
  };
  //   note--focused note--closed

  return (
    <div
      className='note__overlay note__overlay--close'
      ref={noteOverlayRef}
      onClick={closeNote}
    >
      <div className='note note--closed' ref={noteRef} data-note-id={id}>
        <div className='note__head'>
          <textarea
            className='note__head__titletext textarea--mod'
            spellCheck='false'
            onInput={autoGrow}
            onFocus={openNote}
            onChange={handleTextareaChange}
            value={titleTextState}
            ref={titleTextRef}
          ></textarea>
          <img
            src={`/image/icon/pin${pinned ? '_fill' : ''}.svg`}
            alt='pin_note'
            className='note__head__pin'
          />
        </div>
        <div className='note__body'>
          <div className='note__body__content'>
            <textarea
              className='note__body__content__textarea textarea--mod'
              spellCheck='false'
              onInput={autoGrow}
              onFocus={openNote}
              onChange={handleTextareaChange}
              value={contentTextState}
              ref={contentTextRef}
            ></textarea>
            <div className='note__body__content__edited'>
              Edited {findEditedDate()}
            </div>
          </div>
          <div
            className='note__body__controls'
            tabIndex='0'
            onBlur={loseFocus}
            onFocus={giveFocus}
          >
            <div className='note__body__controls__item'>
              <img
                src='/image/icon/alarm.svg'
                alt='alarm'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/add_contact.svg'
                alt='add_contact'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/palate.svg'
                alt='pick_color'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/picture.svg'
                alt='add_picture'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/archive.svg'
                alt='archive'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/options.svg'
                alt='options'
                className='note__body__controls__item__image'
              />
              <img
                src='/image/icon/undo.svg'
                alt='undo'
                className='note__body__controls__item__image control--disabled'
              />
              <img
                src='/image/icon/redo.svg'
                alt='redo'
                className='note__body__controls__item__image control--disabled'
              />
            </div>
          </div>
        </div>
        <div className='note__footer'>
          <button className='note__footer__closebtn' onClick={closeNote}>
            Close
          </button>
        </div>
      </div>
      <div className='note__overlay__offset'>flex offset</div>
    </div>
  );
};

export default NewNote;
