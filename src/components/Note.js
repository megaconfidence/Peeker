import './Note.css';
import './Notes.css';
import moment from 'moment';
import request from '../helpers';
import { useSnackbar } from 'notistack';
// import { Button } from '@material-ui/core';
import React, { useRef, useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import LabelModal from './LabelModal';
import isEqual from '../helpers/isEual';

const NewNote = ({
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
  const [titleTextState, setTitleTextState] = useState(title);
  const [contentTextState, setContentTextState] = useState(content);
  // holds all labels from db
  // Holds only labels for this individual note
  const [noteLabel, setNoteLabel] = useState({
    data: oldNoteLabel
  });

  const [reminderDate, setReminderDate] = useState(due);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLabelUpdated, setIsLabelUpdated] = useState(false);

  const createLabelOverlay = useRef(null);

  const noteRef = useRef(null);
  const dpwrapper = useRef(null);
  const pinimgRef = useRef(null);
  const titleTextRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const contentTextRef = useRef(null);

  const headTextContainer = useRef(null);
  const headTextBackdrop = useRef(null);
  const headTextHighlights = useRef(null);

  const bodyTextContainer = useRef(null);
  const bodyTextBackdrop = useRef(null);
  const bodyTextHighlights = useRef(null);

  const autoGrowAfterPopulate = target => {
    target.style.boxSizing = 'border-box';
    const offset = target.offsetHeight - target.clientHeight;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + offset + 'px';

    // target.style.height = `${target.scrollHeight}px`;
    // if (!target.value) {
    //   target.style.height = '45px';
    // }
  };

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

  const openNote = () => {
    if (isSearch) {
      autoGrowAfterPopulate(titleTextRef.current);
      autoGrowAfterPopulate(headTextHighlights.current);
      autoGrowAfterPopulate(headTextContainer.current);

      autoGrowAfterPopulate(bodyTextHighlights.current);
      autoGrowAfterPopulate(bodyTextBackdrop.current);
      autoGrowAfterPopulate(bodyTextContainer.current);
    }
  };

  const uploadChanges = async () => {
    if (status === 'note' || status === 'archive') {
      const originalData = {
        title,
        pinned,
        content
      };
      const isPinned = pinimgRef.current
        .getAttribute('data-imgname')
        .includes('pin_fill');

      let payload = {
        pinned: isPinned,
        title: titleTextRef.current.textContent,
        content: contentTextRef.current.textContent
      };

      // Make update is data has changed
      if (!isEqual(originalData, payload) || isLabelUpdated) {
        console.log('## uploading changes');
        const noteId = noteRef.current.getAttribute('data-note-id');
        const subscription =
          JSON.parse(localStorage.getItem('PEEKER_SUBSCRIPTION')) || '';

        payload = {
          ...payload,
          subscription,
          label: noteLabel.data,
          clientNow: moment().format()
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

  const pinNote = ({ target }) => {
    const src = target.getAttribute('data-imgname');
    if (src.includes('pin_fill')) {
      target.setAttribute('data-imgname', src.split('pin_fill').join('pin'));
    } else {
      target.setAttribute('data-imgname', src.split('pin').join('pin_fill'));
    }
  };

  const updateNoteStatus = async (noteId, status) => {
    const payload = {
      status
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

  const applyHighlights = text => {
    const regex = new RegExp(text, 'gi');

    headTextHighlights.current.innerHTML = titleTextState
      .replace(/\n$/g, '\n\n')
      .replace(regex, '<mark>$&</mark>');

    bodyTextHighlights.current.innerHTML = contentTextState
      .replace(/\n$/g, '\n\n')
      .replace(regex, '<mark>$&</mark>');
  };

  const handleTextareaInput = ({ target }) => {
    if (target.classList.contains('note__head__titletext')) {
      setTitleTextState(target.value);
    }
    if (target.classList.contains('note__body__content__textarea')) {
      setContentTextState(target.value);
    }
  };

  const handleTextareaScroll = ({ target }) => {
    if (target.classList.contains('note__head__titletext')) {
      const scrollTop = target.scrollTop;
      headTextBackdrop.current.scrollTop = scrollTop;
    }

    if (target.classList.contains('note__body__content__textarea')) {
      const scrollTop = target.scrollTop;
      bodyTextHighlights.current.scrollTop = scrollTop;
    }
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
    createLabelOverlay.current.classList.toggle('hide');
  };

  const handleReminderDate = value => {
    const newDate = moment(value).format();
    const noteId = noteRef.current.getAttribute('data-note-id');

    setReminderDate(newDate);
    const payload = {
      due: newDate
    };

    request('put', `api/note/${noteId}`, payload);
  };

  const handleAlarmiconClick = () => {
    dpwrapper.current.classList.toggle('hide');
  };

  const handleDeleteReminder = e => {
    e.stopPropagation();
    setReminderDate('');
  };
  useEffect(() => {
    // (async () => {
    //   // Autogrow notes after filling in content
    //   await autoGrowAfterPopulate(titleTextRef.current);
    //   await autoGrowAfterPopulate(contentTextRef.current);

    //   if (isSearch) {
    //     autoGrowAfterPopulate(headTextHighlights.current);
    //     // autoGrowAfterPopulate(headTextBackdrop.current);
    //     autoGrowAfterPopulate(headTextContainer.current);

    //     autoGrowAfterPopulate(bodyTextHighlights.current);
    //     // autoGrowAfterPopulate(bodyTextBackdrop.current);
    //     autoGrowAfterPopulate(bodyTextContainer.current);
    //   }
    // })();
    // Autogrow notes after filling in content
    autoGrowAfterPopulate(titleTextRef.current);
    autoGrowAfterPopulate(contentTextRef.current);

    if (isSearch) {
      autoGrowAfterPopulate(headTextHighlights.current);
      autoGrowAfterPopulate(headTextContainer.current);

      autoGrowAfterPopulate(bodyTextHighlights.current);
      autoGrowAfterPopulate(bodyTextBackdrop.current);
      autoGrowAfterPopulate(bodyTextContainer.current);

      applyHighlights(searchText);
    }
    return () => {};
  });

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
          {isSearch ? (
            <div className='note__head__container' ref={headTextContainer}>
              <div className='note__head__backdrop' ref={headTextBackdrop}>
                <div
                  className='note__head__highlights'
                  ref={headTextHighlights}
                ></div>
              </div>
              <textarea
                data-autoresize
                spellCheck='false'
                ref={titleTextRef}
                placeholder='Title'
                maxLength='100'
                value={titleTextState}
                onChange={handleTextareaInput}
                onScroll={handleTextareaScroll}
                className='note__head__titletext search textarea--mod'
              />
            </div>
          ) : (
            <textarea
              data-autoresize
              spellCheck='false'
              ref={titleTextRef}
              placeholder='Title'
              maxLength='100'
              value={titleTextState}
              onChange={handleTextareaInput}
              className='note__head__titletext textarea--mod'
            />
          )}

          <div
            data-img
            ref={pinimgRef}
            onClick={pinNote}
            className='note__head__pin'
            data-imgname={`pin${pinned ? '_fill' : ''}`}
          />
        </div>
        <div className='note__body'>
          <div className='note__body__content'>
            {isSearch ? (
              <div className='note__body__container' ref={bodyTextContainer}>
                <div className='note__body__backdrop' ref={bodyTextBackdrop}>
                  <div
                    className='note__body__highlights'
                    ref={bodyTextHighlights}
                  ></div>
                </div>
                <textarea
                  data-autoresize
                  spellCheck='false'
                  placeholder='Note'
                  ref={contentTextRef}
                  value={contentTextState}
                  onScroll={handleTextareaScroll}
                  onChange={handleTextareaInput}
                  className='note__body__content__textarea search textarea--mod'
                />
              </div>
            ) : (
              <textarea
                data-autoresize
                spellCheck='false'
                placeholder='Note'
                ref={contentTextRef}
                value={contentTextState}
                onChange={handleTextareaInput}
                className='note__body__content__textarea textarea--mod'
              />
            )}

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
              Edited {moment(updatedAt).fromNow()}
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
                  oldNoteLabel={oldNoteLabel}
                  labelModalOpenCLose={labelModalOpenCLose}
                  ref={createLabelOverlay}
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
          <DatePicker value={handleReminderDate} due={due} ref={dpwrapper} />
        </div>
        <div className='note__footer'>
          {status === 'trash' ? (
            <button
              className='note__footer__closebtn'
              data-note-id={id}
              onClick={deleteNote}
            >
              Delete
            </button>
          ) : (
            undefined
          )}
          <button
            data-note-id={id}
            className='note__footer__closebtn'
            onClick={({ target }) => {
              restoreNote(target.getAttribute('data-note-id'), `${status}`);
            }}
          >
            Restore
          </button>
          <button
            className='note__footer__closebtn'
            onClick={e => {
              e.stopPropagation();
              toggleNoteOpenClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewNote;
