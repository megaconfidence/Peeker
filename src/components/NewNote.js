import './Notes.css';
import './NewNote.css';
import moment from 'moment';
import request from '../helpers';
import ObjectID from 'bson-objectid';
import DatePicker from './DatePicker';
import LabelModal from './LabelModal';
import colorLog from '../helpers/colorLog';
import React, { useRef, useState } from 'react';

const NewNote = ({ addLocal, allLabels, labelForNewNote }) => {
  const noteRef = useRef(null);
  const pinimgRef = useRef(null);
  const dpwrapper = useRef(null);
  const titleTextRef = useRef(null);
  const contentTextRef = useRef(null);
  const createLabelOverlay = useRef(null);

  const [noteLabel, setNoteLabel] = useState({
    data: []
  });
  const [reminderDate, setReminderDate] = useState('');
  const [titleTextState, setTitleTextState] = useState('');
  const [contentTextState, setContentTextState] = useState('');

  // holds all labels from db
  // Holds only labels for this individual note

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
    const labels = labelForNewNote.concat(noteLabel.data);

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
      const subscription =
        JSON.parse(localStorage.getItem('PEEKER_SUBSCRIPTION')) || '';
      const payload = {
        pinned,
        subscription,
        label: labels,
        status: 'note',
        title: noteTitle || '',
        due: reminderDate || '',
        content: noteContent || '',
        clientNow: moment().format()
      };

      let date = new Date();
      date = date.toISOString();

      // Creates a local copy of payload to update app state
      const fakePayload = {
        ...payload,
        updatedAt: date,
        _id: ObjectID.generate()
      };

      colorLog('Saving note', 'success');

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

  const updateNoteLabelAndStatus = (data, bool) => {
    setNoteLabel({ data });
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

  const labelModalOpenCLose = () => {
    const labelOverlay = createLabelOverlay.current;
    labelOverlay.classList.toggle('hide');
    if (!labelOverlay.classList.contains('hide')) {
      const labelSearchbox = labelOverlay.querySelector('input');
      labelSearchbox.focus();
    }
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
                onClick={labelModalOpenCLose}
                className='note__body__controls__item__image'
              />

              <LabelModal
                allLabels={allLabels}
                oldNoteLabel={[]}
                labelModalOpenCLose={labelModalOpenCLose}
                ref={createLabelOverlay}
                updateNoteLabelAndStatus={updateNoteLabelAndStatus}
              />
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
