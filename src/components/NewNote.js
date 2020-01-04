import './Notes.css';
import './NewNote.css';
import response from '../helpers';
import React, { useRef, useState } from 'react';
import ObjectID from 'bson-objectid';
import _ from 'lodash';

const NewNote = ({ fetchData, labelForNewNote, addLocal, allLabels }) => {
  const noteRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);
  const pinimgRef = useRef(null);

  const [labelSearchbox, setLabelSearchbox] = useState('');

  // holds all labels from db
  const [labelArr, setLabelArr] = useState(allLabels);
  // Holds only labels for this individual note
  const [noteLabelArr, setNoteLabelArr] = useState({
    data: []
  });
  const [allNoteLabels, setAllNoteLabels] = useState(labelArr);

  const labelModalRef = useRef(null);
  const createNewLabel = useRef(null);

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
    const labels = noteLabelArr.data;

    if (!labelModalRef.current.classList.contains('hide')) {
      labelModalRef.current.classList.add('hide');
    }

    // Reset the fields
    titleTextRef.current.value = '';
    contentTextRef.current.value = '';
    setNoteLabelArr({
      data: []
    });
    if (pinned) {
      pinimgRef.current.src = pinimgRef.current.src
        .split('pin_fill')
        .join('pin');
    }

    if (noteTitle || noteContent || labels) {
      const payload = {
        title: noteTitle || '',
        content: noteContent || '',
        pinned,
        label: labels
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

    setLabelSearchbox('');
  };
  const handleDeleteLabelClick = ({ target }) => {
    const data = noteLabelArr.data;
    const value = target.getAttribute('data-value');

    const index = data.findIndex(d => d === value);
    data.splice(index, 1);
    setNoteLabelArr({
      data
    });
  };
  const handleLabelModalOpenCLose = () => {
    labelModalRef.current.classList.toggle('hide');
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
          <div className='note__body__content__label'>
            {noteLabelArr.data.map((d, i) =>
              d ? (
                <div key={i} className='note__body__content__label__tag'>
                  <span className='text'>{d}</span>
                  <span className='close'>
                    <img
                      src='/image/icon/close.svg'
                      alt='delete_label'
                      onClick={handleDeleteLabelClick}
                      data-value={d}
                    />
                  </span>
                </div>
              ) : (
                undefined
              )
            )}
          </div>
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
            <div className='note__body__controls__item__withmodal'>
              <img
                src='/image/icon/badge.svg'
                alt='badge'
                className='note__body__controls__item__image'
                onClick={handleLabelModalOpenCLose}
              />
              <div className='label__modal hide' ref={labelModalRef}>
                <div className='body'>
                  <div className='label__modal__head'>Label note</div>
                  <div className='label__modal__search'>
                    <input
                      type='text'
                      className='label__modal__search__input'
                      value={labelSearchbox}
                      onChange={handleLabelSearchbox}
                      placeholder='Enter label name'
                    />
                    <img
                      src='/image/icon/search.svg'
                      className='label__modal__search__icon'
                      alt='search'
                    />
                  </div>
                  <div className='label__modal__labels'>
                    <ul>{labelModalListItems}</ul>
                  </div>
                </div>

                <div
                  className='label__modal__createlabel hide'
                  ref={createNewLabel}
                  onClick={handleCreateNewLabel}
                >
                  <img
                    src='/image/icon/plus.svg'
                    alt='plus'
                    className='label__modal__createlabel__icon'
                  />
                  Create &nbsp;
                  <span className='label__modal__createlabel__text'>
                    "{labelSearchbox}"
                  </span>
                </div>
              </div>
            </div>

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
