import React from 'react';
import './NewNote.css';

const NewNote = () => {
  const autoGrow = e => {
    const textarea = e.target;
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (!textarea.value) {
      textarea.style.height = '20px';
    }
  };
  return (
    <div className='note nwnote'>
      <div className='note__head'>
        <textarea
          className='note__head__titletext textarea--mod'
          placeholder='Title'
          spellCheck='false'
          onInput={autoGrow}
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
          ></textarea>
        </div>
        <div className='note__body__controls'>
            <div className='note__body__controls__item'>
                <img  src='/image/icon/alarm.svg' alt='alarm'className='note__body__controls__item__image' />
                <img  src='/image/icon/add_contact.svg' alt='add_contact' className='note__body__controls__item__image' />
                <img  src='/image/icon/palate.svg' alt='pick_color' className='note__body__controls__item__image' />
                <img  src='/image/icon/picture.svg' alt='add_picture' className='note__body__controls__item__image' />
                <img  src='/image/icon/archive.svg' alt='archive' className='note__body__controls__item__image' />
                <img  src='/image/icon/options.svg' alt='options' className='note__body__controls__item__image' />
                <img  src='/image/icon/undo.svg' alt='undo' className='note__body__controls__item__image control--disabled' />
                <img  src='/image/icon/redo.svg' alt='redo' className='note__body__controls__item__image control--disabled' />
            </div>
        </div>
      </div>
      <div className='note__footer'>
          <button className='note__footer__closebtn'>Close</button>
      </div>
    </div>
  );
};

export default NewNote;
