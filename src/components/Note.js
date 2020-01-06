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
  noteLabels,
  status
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
  const createLabelOverlay = useRef(null);
  const createLabelCheckbox = useRef(null);

  useEffect(() => {
    // Autogrow notes after filling in content
    autoGrowAfterPopulate(contentTextRef.current);
    autoGrowAfterPopulate(titleTextRef.current);
    addAutoResize();
    return () => {};
  });
  function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function(element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      document.addEventListener('input', function(event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
  }

  const autoGrowAfterPopulate = e => {
    // Sym autogrow after filling in notes
    if (!e.target) {
      e.style.height = `${e.scrollHeight}px`;
      if (!e.value) {
        e.style.height = '45px';
      }
    }
  };

  const openNote = async () => {
    const note = noteRef.current.classList;
    if (note.contains('note--closed')) {
      note.remove('note--closed');
      note.add('note--opened');
      noteOverlayRef.current.classList.remove('note__overlay--close');
    }
  };
  const closeNote = async ({ target }) => {
    if (
      target.classList.contains('note__overlay') ||
      target.classList.contains('note__footer__closebtn')
    ) {
      if (!createLabelOverlay.current.classList.contains('hide')) {
        createLabelOverlay.current.classList.add('hide');
      }
      noteRef.current.classList.remove('note--opened');
      noteRef.current.classList.add('note--closed');
      noteOverlayRef.current.classList.add('note__overlay--close');

      if (status === 'note' || status === 'archive') {
        // Get note data to update
        const noteId = noteRef.current.getAttribute('data-note-id');
        const noteTitle = titleTextRef.current.textContent;
        const noteContent = contentTextRef.current.textContent;
        const pinned = pinimgRef.current
          .getAttribute('data-imgname')
          .includes('pin_fill');

        const originalData = {
          title,
          content,
          pinned,
          label: noteLabels
        };

        const payload = {
          title: noteTitle,
          content: noteContent,
          pinned,
          label: noteLabelArr.data
        };

        if (
          !_.isEqual(originalData, payload) ||
          _.isEqual(noteLabels, noteLabelArr.data)
        ) {
          // Make the update
          updateLocal(noteId, payload);
          await request('put', `api/note/${noteId}`, payload);
        }
      }
    }
  };

  const permanentDelete = async () => {
    const noteId = noteRef.current.getAttribute('data-note-id');
    deleteLocal(noteId);
    await request('delete', `api/note/${noteId}`);
    fetchData();
  };
  const deleteNote = async () => {
    // Get note data to update
    const noteId = noteRef.current.getAttribute('data-note-id');
    const payload = {
      status: 'trash'
    };

    // Make the update
    updateLocal(noteId, payload);
    request('put', `api/note/${noteId}`, payload);
  };

  const pinNote = ({ target }) => {
    const src = target.getAttribute('data-imgname');
    if (src.includes('pin_fill')) {
      target.setAttribute('data-imgname', src.split('pin_fill').join('pin'));
    } else {
      target.setAttribute('data-imgname', src.split('pin').join('pin_fill'));
    }
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
    const checkbox = createLabelCheckbox.current;
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
  const handleLabelModalOpenCLose = async () => {
    await createLabelOverlay.current.classList.toggle('hide');
    createLabelOverlay.current.scrollTop = 155;
  };
  const handleCreateLabelOverlayClick = e => {
    createLabelOverlay.current.classList.toggle('hide');
  };

  const restoreNote = e => {
    // Get note data to update
    const noteId = noteRef.current.getAttribute('data-note-id');
    const payload = {
      status: 'note'
    };

    // Make the update
    updateLocal(noteId, payload);
    request('put', `api/note/${noteId}`, payload);
  };
  const archiveNote = e => {
    // Get note data to update
    const noteId = noteRef.current.getAttribute('data-note-id');
    const payload = {
      status: 'archive'
    };
    // Make the update
    updateLocal(noteId, payload);
    request('put', `api/note/${noteId}`, payload);
  };
  //   note--focused note--closed

  const labelModalListItems = allNoteLabels.map((d, i) => {
    // This function add checked class to the checkbox if the note has that label
    const m = _.find(noteLabelArr.data, i => (i === d ? d : undefined));
    if (m) {
      return (
        <li key={i}>
          <div className='label' onClick={handleLabelModalListItemClick}>
            <div
              className='checkbox checked'
              value={d}
              ref={createLabelCheckbox}
            ></div>
            <span className='text'>{d}</span>
          </div>
        </li>
      );
    } else {
      return (
        <li key={i}>
          <div className='label' onClick={handleLabelModalListItemClick}>
            <div className='checkbox' value={d} ref={createLabelCheckbox}></div>
            <span className='text'>{d}</span>
          </div>
        </li>
      );
    }
  });
  return (
    <div
      className={`note__overlay note__overlay--close ${
        status === 'trash'
          ? 'trash'
          : status === 'archive'
          ? 'archive'
          : undefined
      }`}
      ref={noteOverlayRef}
      onClick={closeNote}
    >
      <div
        className='note note--closed'
        ref={noteRef}
        data-note-id={id}
        onClick={openNote}
      >
        <div className='note__head'>
          <textarea
            className='note__head__titletext textarea--mod'
            spellCheck='false'
            data-autoresize
            onFocus={openNote}
            onChange={handleTextareaChange}
            value={titleTextState}
            ref={titleTextRef}
            placeholder='Title'
          ></textarea>
          <div
            data-img
            data-imgname={`pin${pinned ? '_fill' : ''}`}
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
              data-autoresize
              onFocus={openNote}
              onChange={handleTextareaChange}
              value={contentTextState}
              ref={contentTextRef}
              placeholder='Note'
            ></textarea>
            <div className='note__body__content__label'>
              {noteLabelArr.data.map((d, i) =>
                d ? (
                  <div key={i} className='note__body__content__label__tag'>
                    <span className='text'>{d}</span>
                    <div
                      data-img
                      data-imgname='close'
                      onClick={handleDeleteLabelClick}
                      data-value={d}
                    />
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
          <div className='note__body__controls' tabIndex='0'>
            <div className='note__body__controls__item '>
              <div
                data-img
                data-imgname='alarm'
                className='note__body__controls__item__image disabled'
              />
              <div className='note__body__controls__item__withmodal'>
                <div
                  data-img
                  data-imgname='badge'
                  className='note__body__controls__item__image'
                  onClick={handleLabelModalOpenCLose}
                />
                <div
                  className='label__modal__wrapper hide'
                  ref={createLabelOverlay}
                  onClick={handleCreateLabelOverlayClick}
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
                          className='label__modal__search__input'
                          value={labelSearchbox}
                          onChange={handleLabelSearchbox}
                          placeholder='Enter label name'
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
                      className='label__modal__createlabel hide'
                      ref={createNewLabel}
                      onClick={handleCreateNewLabel}
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
                  data-imgname='archive'
                  className='note__body__controls__item__image'
                  onClick={archiveNote}
                />
              ) : (
                undefined
              )}
              <div
                data-img
                data-imgname='trash'
                className='note__body__controls__item__image'
                onClick={deleteNote}
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
        </div>
        <div className='note__footer'>
          {status === 'trash' ? (
            <button
              className='note__footer__closebtn'
              onClick={permanentDelete}
            >
              Delete
            </button>
          ) : (
            undefined
          )}
          {status === 'trash' || status === 'archive' ? (
            <button className='note__footer__closebtn' onClick={restoreNote}>
              Restore
            </button>
          ) : (
            undefined
          )}
          <button className='note__footer__closebtn' onClick={closeNote}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewNote;
