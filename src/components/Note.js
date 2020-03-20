import './Note.css';
import './Notes.css';
import moment from 'moment';
import request from '../helpers';
import config from 'environment';
import DatePicker from './DatePicker';
import LabelModal from './LabelModal';
import PalateModal from './PalateModal';
import { useSnackbar } from 'notistack';
import isEqual from '../helpers/isEual';
import colorLog from '../helpers/colorLog';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ContentEditable from 'react-contenteditable';

const Note = ({
  id,
  due,
  title,
  color,
  status,
  pinned,
  images,
  content,
  updatedAt,
  fetchData,
  allLabels,
  oldNoteLabel,
  updateLocal,
  deleteLocal,
  showViewImage,
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
  const [noteColor, setNoteColor] = useState({ value: color });
  const [noteImages, setNoteImages] = useState({ value: images || [] });

  const createLabelOverlay = useRef(null);

  const noteRef = useRef(null);
  const noteHead = useRef(null);
  const dpwrapper = useRef(null);
  const titleTextRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const contentTextRef = useRef(null);
  const palateModalRef = useRef(null);

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
        color,
        pinned,
        content
      };

      let payload = {
        pinned: pinState.value,
        color: noteColor.value,
        title: titleText.value.replace(/<\/?mark>/gi, ''),
        content: contentText.value.replace(/<\/?mark>/gi, '')
      };

      // Make update if data has changed
      if (!isEqual(originalData, payload) || isLabelUpdated) {
        colorLog('Uploading changes', 'success');
        const noteId = noteRef.current.getAttribute('data-note-id');

        payload = {
          ...payload,
          label: noteLabel.data,
          image: noteImages.value
        };

        updateLocal(noteId, payload);
        await request('put', `api/note/${noteId}`, payload);
        setIsLabelUpdated(false);
      }
    }
  };

  const deleteNote = async () => {
    const noteId = noteRef.current.getAttribute('data-note-id');
    deleteLocal(noteId);
    await request('delete', `api/note/${noteId}`);
    fetchData();

    if (images.length) {
      if (!navigator.onLine) {
        const deleteImage =
          JSON.parse(localStorage.getItem('PEEKER_DELETE_IMAGE')) || [];
        images.forEach(image => {
          deleteImage.push(image.id);
        });
        localStorage.setItem(
          'PEEKER_DELETE_IMAGE',
          JSON.stringify(deleteImage)
        );
      } else {
        images.forEach(image => {
          request('delete', 'api/image', {
            public_id: image.id
          });
        });
      }
    }
  };

  const pinNote = () => {
    setPinState(() => ({ value: !pinState.value }));
  };

  const updateNoteStatus = async (noteId, status) => {
    const payload = {
      status,
      label: noteLabel.data,
      pinned: pinState.value,
      color: noteColor.value,
      image: noteImages.value,
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

  const handleContentScroll = ({ target }) => {
    if (target.scrollTop > 0) {
      noteHead.current.classList.add('content__scrolling');
    } else {
      noteHead.current.classList.remove('content__scrolling');
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
      image: noteImages.value,
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

  const changeBackgroundColor = color => {
    setNoteColor({ value: color });
  };

  const handlePalateClick = () => {
    if (!palateModalRef.current.classList.contains('open')) {
      setTimeout(() => {
        palateModalRef.current.focus();
      }, 100);
    }
    palateModalRef.current.classList.toggle('open');
  };

  useEffect(() => {
    if (isSearch) {
      applySearch();
    }
  }, [applySearch, isSearch]);

  const handleNoteImageClick = ({ target }) => {
    const noteData = {
      status,
      label: noteLabel.data,
      pinned: pinState.value,
      color: noteColor.value,
      image: noteImages.value,
      startIndex: Number(target.getAttribute('data-index')),
      title: titleText.value.replace(/<\/?mark>/gi, ''),
      noteId: noteRef.current.getAttribute('data-note-id'),
      content: contentText.value.replace(/<\/?mark>/gi, '')
    };

    showViewImage(noteData);
  };

  const handleImageUpload = async ({ target }) => {
    const key = enqueueSnackbar('Uploading image...', {
      persist: true
    });

    const formData = new FormData();
    formData.append('upload_preset', config.cloudinaryUploadPreset);
    formData.append('file', target.files[0]);

    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_cloudinary_cloud_name}/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then(response => response.json())
      .then(async result => {
        const { public_id, secure_url } = result;
        const data = noteImages.value;
        data.push({
          id: public_id,
          url: secure_url.split('upload/').join('upload/q_auto/')
        });
        setNoteImages({ value: data });

        const payload = {
          image: noteImages.value
        };

        const noteId = noteRef.current.getAttribute('data-note-id');
        updateLocal(noteId, payload);
        await request('put', `api/note/${noteId}`, payload);

        closeSnackbar(key);
        enqueueSnackbar('Image Uploaded');
      })
      .catch(error => {
        closeSnackbar(key);
        enqueueSnackbar('Error uploading image');
      });
  };

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
        style={{
          background: noteColor.value,
          border:
            noteColor.value === '#fff' || !noteColor.value
              ? '1px solid #e0e0e0'
              : ''
        }}
        className='note note--closed'
        onClick={noteOvrlayCheck}
      >
        <div className='note__image'>
          {noteImages.value.length
            ? noteImages.value.map((img, i) => (
                <img
                  alt=''
                  key={img.id}
                  src={img.url}
                  data-index={i}
                  onClick={handleNoteImageClick}
                  style={{
                    pointerEvents: status === 'trash' ? 'none' : 'unset',
                    width: `calc(${100 / noteImages.value.length}% - 1px)`
                  }}
                />
              ))
            : undefined}
        </div>
        <div className='note__head' ref={noteHead}>
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
              onScroll={handleContentScroll}
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
              <div className='note__body__controls__item__withmodal'>
                <div
                  data-img
                  data-imgname='palate'
                  onClick={handlePalateClick}
                  className='note__body__controls__item__image'
                />
                <PalateModal
                  ref={palateModalRef}
                  currentColor={noteColor.value}
                  changeBackgroundColor={changeBackgroundColor}
                />
              </div>
              <label>
                <div
                  data-img
                  data-imgname='picture'
                  className='note__body__controls__item__image'
                />
                <input
                  type='file'
                  name='myImage'
                  accept='image/*'
                  className='note__body__controls__item__image__upload'
                  onChange={handleImageUpload}
                />
              </label>
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
