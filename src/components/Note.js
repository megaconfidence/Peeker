import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import './Notes.css';
import './Note.css';
import request from '../helpers';
import _ from 'lodash';

const NewNote = ({
  title,
  content,
  updatedAt,
  pinned,
  id,
  fetchData,
  updateLocal,
  deleteLocal,
  allLabels,
  noteLabels
}) => {
  const [titleTextState, setTitleTextState] = useState(title);
  const [contentTextState, setContentTextState] = useState(content);
  const [labelSearchbox, setLabelSearchbox] = useState('');

  // holds all labels from db
  const [labelArr, setLabelArr] = useState(allLabels);
  // Holds only labels for this individual note
  const [noteLabelArr, setNoteLabelArr] = useState({
    data: noteLabels
  });
  const [allNoteLabels, setAllNoteLabels] = useState(labelArr);

  const noteRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);
  const pinimgRef = useRef(null);
  const createNewLabel = useRef(null);

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
  const closeNote = async e => {
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

      // Get note data to update
      const noteId = noteRef.current.getAttribute('data-note-id');
      const noteTitle = titleTextRef.current.textContent;
      const noteContent = contentTextRef.current.textContent;
      const pinned = pinimgRef.current.src.includes('pin_fill');

      const payload = {
        title: noteTitle,
        content: noteContent,
        pinned,
        label: noteLabelArr.data
      };

      updateLocal(noteId, payload);

      // Make the update
      await request('put', `api/note/${noteId}`, payload);
    }
  };

  const deleteNote = async () => {
    const noteId = noteRef.current.getAttribute('data-note-id');
    deleteLocal(noteId);
    await request('delete', `api/note/${noteId}`);
    fetchData();
  };

  const pinNote = ({ target }) => {
    if (target.src.includes('pin_fill')) {
      target.src = target.src.split('pin_fill').join('pin');
    } else {
      target.src = target.src.split('pin').join('pin_fill');
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
  const handleLabelSearchbox = ({ target: { value } }) => {
    let isAnyMatch = false;
    setLabelSearchbox(value);

    if (value) {
      createNewLabel.current.classList.remove('hide');

      allNoteLabels.forEach(d => {
        if (d.includes(value)) {
          isAnyMatch = true;
          setAllNoteLabels([d]);
        }
      });

      if (!isAnyMatch) {
        setAllNoteLabels([]);
        labelArr.forEach(d => {
          if (d.includes(value)) {
            setAllNoteLabels([d]);
          }
        });
      }
    } else {
      createNewLabel.current.classList.add('hide');
      setAllNoteLabels(labelArr);
    }
  };

  const handleLabelModalListItemClick = ({ target }) => {
    const checkbox = target.children[0];
    checkbox.classList.toggle('checked');
    const value = checkbox.getAttribute('value');

    if (checkbox.classList.contains('checked')) {
      const data = noteLabelArr.data;
      data.push(value);
      setNoteLabelArr({
        data
      });
    } else {
      const data = noteLabelArr.data;
      data.forEach((d, i) => {
        if (d === value) {
          data.splice(i, 1);
          setNoteLabelArr({
            data
          });
        }
      });
    }
  };

  const handleCreateNewLabel = () => {
    createNewLabel.current.classList.add('hide');
    let data = noteLabelArr.data;
    data.push(labelSearchbox);
    setNoteLabelArr({
      data
    });

    data = labelArr;
    data.push(labelSearchbox);

    setLabelArr(data);
    setAllNoteLabels(labelArr);
  };
  //   note--focused note--closed

  const labelModalListItems = allNoteLabels.map((d, i) => {
    // This function add checked class to the checkbox if the note has that label
    const m = _.find(noteLabelArr.data, i => (i === d ? d : undefined));
    if (m) {
      return (
        <li key={i}>
          <div className='label' onClick={handleLabelModalListItemClick}>
            <div className='checkbox checked' value={d}></div>

            {d}
          </div>
        </li>
      );
    } else {
      return (
        <li key={i}>
          <div className='label' onClick={handleLabelModalListItemClick}>
            <div className='checkbox' value={d}></div>
            {d}
          </div>
        </li>
      );
    }
  });
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
            ref={pinimgRef}
            onClick={pinNote}
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
            <div className='note__body__content__flex'>
              <div className='note__body__content__label'>
                {noteLabelArr.data.map((d, i) =>
                  d ? (
                    <div key={i} className='note__body__content__label__tag'>
                      {d}
                    </div>
                  ) : (
                    undefined
                  )
                )}
              </div>
              <div className='note__body__content__edited'>
                Edited {findEditedDate()}
              </div>
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
              <div className='note__body__controls__item__withmodal'>
                <img
                  src='/image/icon/badge.svg'
                  alt='badge'
                  className='note__body__controls__item__image'
                />
                <div className='label_modal'>
                  <div className='body'>
                    <div className='label_modal_head'>Label note</div>
                    <div className='label_modal_search'>
                      <input
                        type='text'
                        className='label_modal_search_input'
                        value={labelSearchbox}
                        onChange={handleLabelSearchbox}
                        placeholder='Enter label name'
                      />
                      <img
                        src='/image/icon/search.svg'
                        className='label_modal_search_icon'
                        alt='search'
                      />
                    </div>
                    <div className='label_modal_labels'>
                      <ul>{labelModalListItems}</ul>
                    </div>
                  </div>

                  <div
                    className='label_modal_createlabel hide'
                    ref={createNewLabel}
                    onClick={handleCreateNewLabel}
                  >
                    <img
                      src='/image/icon/plus.svg'
                      alt='plus'
                      className='label_modal_createlabel_icon'
                    />
                    Create &nbsp;
                    <span className='label_modal_createlabel_text'>
                      "{labelSearchbox}"
                    </span>
                  </div>
                </div>
              </div>
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
                src='/image/icon/trash.svg'
                alt='delete'
                className='note__body__controls__item__image'
                onClick={deleteNote}
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
