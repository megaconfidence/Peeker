import React, { useRef } from 'react';
import './Notes.css';
import './NewNote.css';
import axios from 'axios';

const NewNote = ({ fetchData }) => {
  const noteRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);

  const autoGrow = e => {
    const textarea = e.target;
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (!textarea.value) {
      textarea.style.height = '45px';
    }
  };

  const openNote = () => {
    noteRef.current.classList.remove('nwnote--closed');
  };
  const closeNote = async () => {
    noteRef.current.classList.add('nwnote--closed');
    const noteTitle = titleTextRef.current.value;
    const noteContent = contentTextRef.current.value;
    if (noteTitle || noteContent) {
      const data = {
        title: noteTitle ? noteTitle : '',
        content: noteContent ? noteContent : ''
      };

      await axios({
        method: 'post',
        url: `http://localhost:3000/api/note`,
        headers: {
          authorization: localStorage.getItem('PEEK_TOKEN')
        },
        data
      });

      titleTextRef.current.value = '';
      contentTextRef.current.value = '';
      fetchData();
    }
  };

  return (
    <div className='note nwnote nwnote--closed' ref={noteRef}>
      <div className='note__head'>
        <textarea
          className='note__head__titletext textarea--mod'
          placeholder='Title'
          spellCheck='false'
          onInput={autoGrow}
          ref={titleTextRef}
        ></textarea>
        <img
          src='/image/icon/pin.svg'
          alt='pin_note'
          className='note__head__pin'
        />
      </div>
      <div className='note__body'>
        <div className='note__body__content'>
          <textarea
            className='note__body__content__textarea textarea--mod'
            placeholder='Take a note...'
            spellCheck='false'
            onInput={autoGrow}
            onFocus={openNote}
            ref={contentTextRef}
          ></textarea>
          <div className='note__body__content__hiddencontrols'>
            <img
              src='/image/icon/checkbox.svg'
              alt='checkbox'
              className='note__body__content__hiddencontrols__image'
            />
            <img
              src='/image/icon/draw.svg'
              alt='draw'
              className='note__body__content__hiddencontrols__image'
            />
            <img
              src='/image/icon/picture.svg'
              alt='add_picture'
              className='note__body__content__hiddencontrols__image'
            />
          </div>
        </div>
        <div className='note__body__controls'>
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
          Save
        </button>
      </div>
    </div>
  );
};

export default NewNote;
