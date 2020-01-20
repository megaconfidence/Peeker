import './Notes.css';
import './NewNote.css';
import _ from 'lodash';
import request from '../helpers';
import ObjectID from 'bson-objectid';
import React, { useRef, useState } from 'react';
import DatePicker from './DatePicker';
import moment from 'moment';

const NewNote = ({ addLocal, allLabels, fetchData, labelForNewNote }) => {
  const noteRef = useRef(null);
  const pinimgRef = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);
  const createNewLabel = useRef(null);
  const createLabelOverlay = useRef(null);

  const [titleTextState, setTitleTextState] = useState('');
  const [contentTextState, setContentTextState] = useState('');

  const dpwrapper = useRef(null);
  const [reminderDate, setReminderDate] = useState('');

  // holds all labels from db
  const [labels, setLabels] = useState(allLabels);
  const [labelSearchbox, setLabelSearchbox] = useState('');
  // Holds only labels for this individual note
  const [noteLabel, setNoteLabel] = useState({
    data: []
  });
  const [allNoteLabels, setAllNoteLabels] = useState(labels);

  const openNote = () => {
    noteRef.current.classList.remove('nwnote--closed');
  };

  const uploadChanges = async () => {
    noteRef.current.classList.add('nwnote--closed');

    const noteTitle = titleTextRef.current.value;
    const noteContent = contentTextRef.current.value;
    const pinned = pinimgRef.current
      .getAttribute('data-imgname')
      .includes('pin_fill');
    const labels = _.concat(noteLabel.data, labelForNewNote);

    // Reset the fields
    setNoteLabel({
      data: []
    });
    setReminderDate('');
    setTitleTextState('');
    setContentTextState('');
    titleTextRef.current.value = '';
    contentTextRef.current.value = '';
    titleTextRef.current.style.height = '45px';
    contentTextRef.current.style.height = '45px';
    if (pinned) {
      pinimgRef.current.setAttribute('data-imgname', 'pin');
    }

    if (noteTitle || noteContent || labels.length) {
      const payload = {
        pinned,
        label: labels,
        status: 'note',
        title: noteTitle || '',
        due: reminderDate || '',
        content: noteContent || ''
      };

      let date = new Date();
      date = date.toISOString();

      // Creates a local copy of payload to update app state
      const fakePayload = {
        ...payload,
        updatedAt: date,
        _id: ObjectID.generate()
      };

      console.log('## saving note');
      // Updates state with local payload
      addLocal(fakePayload);
      await request('post', 'api/note', payload);
    }
  };
  const handleTextareaInput = ({ target }) => {
    if (target.classList.contains('note__head__titletext')) {
      setTitleTextState(target.value);
    }
    if (target.classList.contains('note__body__content__textarea')) {
      setContentTextState(target.value);
    }
  };
  const pinNote = ({ target }) => {
    const src = target.getAttribute('data-imgname');
    if (src.includes('pin_fill')) {
      target.setAttribute('data-imgname', src.split('pin_fill').join('pin'));
    } else {
      target.setAttribute('data-imgname', src.split('pin').join('pin_fill'));
    }
  };

  const handleLabelSearchboxChange = ({ target: { value } }) => {
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
        labels.forEach(d => {
          if (d.includes(value)) {
            setAllNoteLabels([d]);
          }
        });
      }
    } else {
      createNewLabel.current.classList.add('hide');
      setAllNoteLabels(labels);
    }
  };

  const handleLabelModalListItemClick = ({ target }) => {
    const checkbox = target.children[0];
    checkbox.classList.toggle('checked');
    const value = checkbox.getAttribute('value');

    if (checkbox.classList.contains('checked')) {
      const { data } = noteLabel;
      data.push(value);
      setNoteLabel({
        data
      });
    } else {
      const { data } = noteLabel;
      data.forEach((d, i) => {
        if (d === value) {
          data.splice(i, 1);
          setNoteLabel({
            data
          });
        }
      });
    }
  };

  const handleCreateNewLabel = () => {
    createNewLabel.current.classList.add('hide');
    let { data } = noteLabel;
    data.push(labelSearchbox);
    setNoteLabel({
      data
    });

    data = labels;
    data.push(labelSearchbox);

    setLabels(data);
    setLabelSearchbox('');
    setAllNoteLabels(labels);
  };

  const handleDeleteLabelClick = ({ target }) => {
    const { data } = noteLabel;
    const value = target.getAttribute('data-value');
    const i = data.findIndex(d => d === value);
    data.splice(i, 1);
    setNoteLabel({
      data
    });
  };

  const handleLabelModalOpenCLose = () => {
    createLabelOverlay.current.classList.toggle('hide');
  };

  const handleReminderDate = value => {
    const newDate = moment(value).format();
    setReminderDate(newDate);
  };

  const handleDeleteReminder = e => {
    e.stopPropagation();
    setReminderDate('');
  };

  const handleAlarmiconClick = () => {
    dpwrapper.current.classList.toggle('hide');
  };

  const labelModalListItems = allNoteLabels.map((d, i) => {
    // This function add checked class to the checkbox if the note has that label
    const m = _.find(noteLabel.data, i => (i === d ? d : undefined));
    return (
      <li key={i}>
        <div className='label' onClick={handleLabelModalListItemClick}>
          <div value={d} className={`checkbox ${m ? 'checked' : ''}`}></div>
          <span className='text'>{d}</span>
        </div>
      </li>
    );
  });
  return (
    <div className='note nwnote nwnote--closed' ref={noteRef}>
      <div className='note__head'>
        <textarea
          data-autoresize
          spellCheck='false'
          ref={titleTextRef}
          placeholder='Title'
          value={titleTextState}
          onChange={handleTextareaInput}
          className='note__head__titletext textarea--mod'
        />
        <div
          data-img
          ref={pinimgRef}
          onClick={pinNote}
          data-imgname='pin'
          className='note__head__pin'
        />
      </div>
      <div className='note__body'>
        <div className='note__body__content'>
          <textarea
            data-autoresize
            spellCheck='false'
            onFocus={openNote}
            ref={contentTextRef}
            placeholder='Take a note...'
            value={contentTextState}
            onChange={handleTextareaInput}
            className='note__body__content__textarea textarea--mod'
          />
          <div className='note__body__content__label'>
            {reminderDate ? (
              <div
                className='note__body__content__label__tag note__body__content__label__tag--reminder'
                onClick={handleAlarmiconClick}
              >
                <div data-img data-imgname='alarm' />
                <span className='text'>
                  {moment(reminderDate).format('MMMM Do YYYY, h:mm a')}
                </span>
                <div
                  data-img
                  data-imgname='close'
                  onClick={handleDeleteReminder}
                />
              </div>
            ) : (
              undefined
            )}
            {noteLabel.data.map((d, i) =>
              d ? (
                <div key={i} className='note__body__content__label__tag'>
                  <span className='text'>{d}</span>
                  <div
                    data-img
                    data-value={d}
                    data-imgname='close'
                    onClick={handleDeleteLabelClick}
                  />
                </div>
              ) : (
                undefined
              )
            )}
          </div>
        </div>
        <div className='note__body__controls'>
          <div className='note__body__controls__item'>
            <div
              data-img
              data-imgname='alarm'
              className='note__body__controls__item__image'
              onClick={handleAlarmiconClick}
            />
            <div className='note__body__controls__item__withmodal'>
              <div
                data-img
                data-imgname='badge'
                onClick={handleLabelModalOpenCLose}
                className='note__body__controls__item__image'
              />
              <div
                ref={createLabelOverlay}
                onClick={handleLabelModalOpenCLose}
                className='label__modal__wrapper hide'
              >
                <div
                  className='label__modal '
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <div className='body'>
                    <div className='label__modal__head'>Note label</div>
                    <div className='label__modal__search'>
                      <input
                        type='text'
                        value={labelSearchbox}
                        placeholder='Enter label name'
                        onChange={handleLabelSearchboxChange}
                        className='label__modal__search__input'
                      />
                      <div
                        data-img
                        data-imgname='search'
                        className='label__modal__search__icon'
                      />
                    </div>
                    <div className='label__modal__labels'>
                      <ul>{labelModalListItems}</ul>
                    </div>
                  </div>

                  <div
                    ref={createNewLabel}
                    onClick={handleCreateNewLabel}
                    className='label__modal__createlabel hide'
                  >
                    <div
                      data-img
                      data-imgname='plus'
                      className='label__modal__createlabel__icon'
                    />
                    <span>Create &nbsp;</span>
                    <span className='label__modal__createlabel__text'>
                      "{labelSearchbox}"
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-img
              data-imgname='add_contact'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='palate'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='picture'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='archive'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='options'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='undo'
              className='note__body__controls__item__image disabled'
            />
            <div
              data-img
              data-imgname='redo'
              className='note__body__controls__item__image disabled'
            />
          </div>
        </div>
        <DatePicker value={handleReminderDate} ref={dpwrapper} />
      </div>
      <div className='note__footer'>
        <button className='note__footer__closebtn' onClick={uploadChanges}>
          Save
        </button>
      </div>
    </div>
  );
};

export default NewNote;
