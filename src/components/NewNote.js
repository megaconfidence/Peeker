import './Notes.css';
import './NewNote.css';
import response from '../helpers';
import React, { useRef } from 'react';
import ObjectID from 'bson-objectid';

const NewNote = ({ fetchData, labelForNewNote, addLocal }) => {
  const noteRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);
  const pinimgRef = useRef(null);

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
    const pinned = pinimgRef.current.src.includes('pin_fill');

    // Reset the fields
    titleTextRef.current.value = '';
    contentTextRef.current.value = '';
    if (pinned) {
      pinimgRef.current.src = pinimgRef.current.src
        .split('pin_fill')
        .join('pin');
    }

    if (noteTitle || noteContent) {
      const payload = {
        title: noteTitle || '',
        label: labelForNewNote,
        content: noteContent || '',
        pinned
      };

      let date = new Date();
      date = date.toISOString();

      // Creates a local copy of payload to update app state
      const fakePayload = {
        ...payload,
        _id: ObjectID.generate(),
        updatedAt: date
      };

      // Updates state with local payload
      addLocal(fakePayload);

      await response('post', 'api/note', payload);
      fetchData();
    }
  };

  const pinNote = ({ target }) => {
    if (target.src.includes('pin_fill')) {
      target.src = target.src.split('pin_fill').join('pin');
    } else {
      target.src = target.src.split('pin').join('pin_fill');
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
          ref={pinimgRef}
          onClick={pinNote}
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
