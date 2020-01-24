import './Note.css';
import './Notes.css';
import moment from 'moment';
import request from '../helpers';
import DatePicker from './DatePicker';
import LabelModal from './LabelModal';
import { useSnackbar } from 'notistack';
import isEqual from '../helpers/isEual';
import colorLog from '../helpers/colorLog';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ContentEditable from 'react-contenteditable';

const Note = ({
  id,
  due,
  title,
  status,
  pinned,
  content,
  updatedAt,
  fetchData,
  allLabels,
  oldNoteLabel,
  updateLocal,
  deleteLocal,
  searchText,
  isSearch
}) => {
  const [titleText, setTitleText] = useState({ value: title });
  const [contentText, setContentText] = useState({ value: content });

  const applySearch = useCallback(async () => {
    const regex = new RegExp(searchText, 'gi');
    const titleMark = title
      .replace(/\n$/g, '\n\n')
      .replace(regex, '<mark>$&</mark>');
    setTitleText({ value: titleMark });

    const contentMark = content
      .replace(/\n$/g, '\n\n')
      .replace(regex, '<mark>$&</mark>');
    setContentText({ value: contentMark });
  }, [content, searchText, title]);

  // holds all labels from db
  // Holds only labels for this individual note
  const [noteLabel, setNoteLabel] = useState({
    data: oldNoteLabel
  });

  const [reminderDate, setReminderDate] = useState(due);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLabelUpdated, setIsLabelUpdated] = useState(false);
  const [pinState, setPinState] = useState({ value: pinned });
  const [allowNotifSBKey, setAllowNotifSBKey] = useState(null);

  const createLabelOverlay = useRef(null);

  const noteRef = useRef(null);
  const dpwrapper = useRef(null);
  const titleTextRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const contentTextRef = useRef(null);

  const toggleNoteOpenClose = () => {
    if (noteRef.current.classList.contains('note--opened')) {
      uploadChanges();
    }
    noteRef.current.classList.toggle('note--closed');
    noteRef.current.classList.toggle('note--opened');
    noteOverlayRef.current.classList.toggle('note__overlay--close');
  };

  const noteOvrlayCheck = e => {
    if (!noteOverlayRef.current.classList.contains('note__overlay--close')) {
      e.stopPropagation();
    }
  };

  const uploadChanges = async () => {
    if (status === 'note' || status === 'archive') {
      const originalData = {
        title,
        pinned,
        content
      };

      let payload = {
        pinned: pinState.value,
        title: titleText.value.replace(/<\/?mark>/gi, ''),
        content: contentText.value.replace(/<\/?mark>/gi, '')
      };

      // Make update is data has changed
      if (!isEqual(originalData, payload) || isLabelUpdated) {
        colorLog('Uploading changes', 'success');
        const noteId = noteRef.current.getAttribute('data-note-id');

        payload = {
          ...payload,
          label: noteLabel.data
        };

        updateLocal(noteId, payload);
        await request('put', `api/note/${noteId}`, payload);
      }
    }
  };

  const deleteNote = async () => {
    const noteId = noteRef.current.getAttribute('data-note-id');
    deleteLocal(noteId);
    await request('delete', `api/note/${noteId}`);
    fetchData();
  };

  const pinNote = () => {
    setPinState(() => ({ value: !pinState.value }));
  };

  const updateNoteStatus = async (noteId, status) => {
    const payload = {
      status,
      label: noteLabel.data,
      pinned: pinState.value,
      title: titleText.value.replace(/<\/?mark>/gi, ''),
      content: contentText.value.replace(/<\/?mark>/gi, '')
    };

    updateLocal(noteId, payload);
    await request('put', `api/note/${noteId}`, payload);
    fetchData();
  };
  const restoreNote = (noteId, initSatus) => {
    updateNoteStatus(noteId, 'note');
    undo(noteId, initSatus, 'Note restored');
  };
  const archiveNote = noteId => {
    updateNoteStatus(noteId, 'archive');
    undo(noteId, 'note', 'Note archived');
  };
  const trashNote = (noteId, initSatus) => {
    updateNoteStatus(noteId, 'trash');
    undo(noteId, initSatus, 'Note trashed');
  };

  const undo = (noteId, status, msg) => {
    enqueueSnackbar(msg, {
      action: key => (
        <div
          style={{ color: '#ffeb3b', marginRight: '8px' }}
          onClick={() => {
            updateNoteStatus(noteId, status);
            closeSnackbar(key);
          }}
        >
          UNDO
        </div>
      )
    });
  };

  const handleTitleInput = ({ target: { value } }) => {
    if (value.length < 70) {
      setTitleText({ value });
    } else {
      setTitleText({ value: value.substring(0, 70) });
    }
  };

  const handleContentInput = ({ target: { value } }) => {
    setContentText({ value });
  };

  const updateNoteLabelAndStatus = (data, bool) => {
    setNoteLabel({ data });
    setIsLabelUpdated(bool);
  };

  const handleDeleteLabelClick = ({ target }) => {
    const { data } = noteLabel;
    const value = target.getAttribute('data-value');

    const i = data.findIndex(d => d === value);
    data.splice(i, 1);
    setNoteLabel({
      data
    });
    setIsLabelUpdated(true);
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
    const noteId = noteRef.current.getAttribute('data-note-id');
    const subscription =
      JSON.parse(localStorage.getItem('PEEKER_SUBSCRIPTION')) || '';

    setReminderDate(newDate);

    const payload = {
      status,
      due: newDate,
      subscription,
      label: noteLabel.data,
      pinned: pinState.value,
      clientNow: moment().format(),
      title: titleText.value.replace(/<\/?mark>/gi, ''),
      content: contentText.value.replace(/<\/?mark>/gi, '')
    };

    updateLocal(noteId, payload);
    request('put', `api/note/${noteId}`, payload);
  };

  const handleAlarmiconClick = () => {
    dpwrapper.current.classList.toggle('hide');
    if (
      !dpwrapper.current.classList.contains('hide') &&
      !localStorage.getItem('PEEKER_NOTIFICATION_ISPERMITTED')
    ) {
      const snackbarKey = enqueueSnackbar(
        'Please allow notifications to use this feature',
        {
          persist: true
        }
      );
      setAllowNotifSBKey(snackbarKey);
    }
  };

  const handleDeleteReminder = e => {
    e.stopPropagation();
    setReminderDate('');
  };

  useEffect(() => {
    if (isSearch) {
      applySearch();
    }
  }, [applySearch, isSearch]);

  return (
    <div
      className={`note__overlay note__overlay--close ${
        status === 'trash' ? 'trash' : status === 'archive' ? 'archive' : ''
      }`}
      onClick={toggleNoteOpenClose}
      ref={noteOverlayRef}
    >
      <div
        ref={noteRef}
        data-note-id={id}
        className='note note--closed'
        onClick={noteOvrlayCheck}
      >
        <div className='note__head'>
          <ContentEditable
            placeholder='Title'
            spellCheck='false'
            html={titleText.value}
            innerRef={titleTextRef}
            onChange={handleTitleInput}
            className='note__head__titletext textarea--mod'
          />
          <div
            data-img
            onClick={pinNote}
            className='note__head__pin'
            data-imgname={`pin${pinState.value ? '_fill' : ''}`}
          />
        </div>
        <div className='note__body'>
          <div className='note__body__content'>
            <ContentEditable
              spellCheck='false'
              placeholder='Note'
              html={contentText.value}
              innerRef={contentTextRef}
              onChange={handleContentInput}
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
              {noteLabel.data.map((d, i) => (
                <div key={i} className='note__body__content__label__tag'>
                  <span className='text'>{d}</span>
                  <div
                    data-img
                    data-value={d}
                    data-imgname='close'
                    onClick={handleDeleteLabelClick}
                  />
                </div>
              ))}
            </div>
            <div className='note__body__content__edited'>
              {status === 'trash' ? 'Note in Trash •' : ''} Edited{' '}
              {moment(updatedAt).fromNow()}
            </div>
          </div>
          <div className='note__body__controls' tabIndex='0'>
            <div className='note__body__controls__item '>
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
                  ref={createLabelOverlay}
                  oldNoteLabel={oldNoteLabel}
                  labelModalOpenCLose={labelModalOpenCLose}
                  updateNoteLabelAndStatus={updateNoteLabelAndStatus}
                />
              </div>
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
              {status !== 'archive' ? (
                <div
                  data-img
                  data-note-id={id}
                  data-imgname='archive'
                  onClick={({ target }) => {
                    archiveNote(target.getAttribute('data-note-id'));
                  }}
                  className='note__body__controls__item__image'
                />
              ) : (
                undefined
              )}
              <div
                data-img
                data-note-id={id}
                data-imgname='trash'
                onClick={({ target }) => {
                  trashNote(target.getAttribute('data-note-id'), `${status}`);
                }}
                className='note__body__controls__item__image'
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
          <DatePicker
            due={due}
            ref={dpwrapper}
            value={handleReminderDate}
            allowNotifSBKey={allowNotifSBKey}
          />
        </div>
        <div className='note__footer'>
          <button
            className='note__footer__closebtn'
            onClick={e => {
              e.stopPropagation();
              toggleNoteOpenClose();
            }}
          >
            Close
          </button>

          {status === 'trash' || status === 'archive' ? (
            <button
              data-note-id={id}
              className='note__footer__closebtn'
              onClick={({ target }) => {
                restoreNote(target.getAttribute('data-note-id'), `${status}`);
              }}
            >
              Restore
            </button>
          ) : (
            undefined
          )}

          {status === 'trash' ? (
            <button
              data-note-id={id}
              onClick={deleteNote}
              className='note__footer__closebtn'
              style={{ color: 'rgba(255, 0, 0, 0.75)' }}
            >
              Delete
            </button>
          ) : (
            undefined
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
