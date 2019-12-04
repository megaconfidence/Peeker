import React, { useRef, useState, useEffect } from 'react';
import './Notes.css';
import './Note.css';

const NewNote = ({ title, content, editedDay, toDayObj }) => {
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
      if(noteRef.current.classList.contains('note--closed')) {
        console.log(noteRef.current.classList)
        noteRef.current.classList = ''
        //   noteRef.current.classList.remove('note--closed');
        //   noteRef.current.classList.add('note--opened');
      }
    noteOverlayRef.current.classList.remove('note__overlay--close');
  };
  const closeNote = e => {
    const elem = e.target;
    if (
      elem.classList.contains('note__overlay') ||
      elem.classList.contains('note__footer__closebtn')
    ) {
      noteRef.current.classList.remove('note--opened');
      noteRef.current.classList.add('note--closed');
      noteOverlayRef.current.classList.add('note__overlay--close');
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
    if (editedDay) {
      if (editedDay.year < toDayObj.year) {
        return `${editedDay.monthText} ${editedDay.day}, ${editedDay.year}`;
      } else if (editedDay.month < toDayObj.month) {
        return `${editedDay.monthText} ${editedDay.day}`;
      } else if (editedDay.day < toDayObj.date) {
        return `${editedDay.monthText} ${editedDay.day}`;
      } else {
        return `${editedDay.time}`;
      }
    }
    return '';
  };
  //   note--focused note--closed

  return (
    <div
      className='note__overlay note__overlay--close'
      ref={noteOverlayRef}
      onClick={closeNote}
    >
      <div className='note note--closed' ref={noteRef}>
        <div className='note__head'>
          <textarea
            className='note__head__titletext textarea--mod'
            placeholder='Title'
            spellCheck='false'
            onInput={autoGrow}
            onFocus={openNote}
            onChange={handleTextareaChange}
            value={titleTextState}
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
