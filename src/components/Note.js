import './Note.css';
import './Notes.css';
import _ from 'lodash';
import moment from 'moment';
import request from '../helpers';
import React, { useRef, useState, useEffect } from 'react';

const NewNote = ({
  id,
  title,
  status,
  pinned,
  content,
  updatedAt,
  fetchData,
  allLabels,
  noteLabels,
  updateLocal,
  deleteLocal
}) => {
  const [labelSearchbox, setLabelSearchbox] = useState('');
  const [titleTextState, setTitleTextState] = useState(title);
  const [contentTextState, setContentTextState] = useState(content);
  // holds all labels from db
  const [labels, setLabels] = useState(allLabels);
  // Holds only labels for this individual note
  const [noteLabel, setNoteLabel] = useState({
    data: noteLabels
  });
  const [allNoteLabels, setAllNoteLabels] = useState(labels);

  const noteRef = useRef(null);
  const pinimgRef = useRef(null);
  const titleTextRef = useRef(null);
  const noteOverlayRef = useRef(null);
  const contentTextRef = useRef(null);
  const createNewLabel = useRef(null);
  const createLabelOverlay = useRef(null);
  const createLabelCheckbox = useRef(null);

  const autoGrowAfterPopulate = target => {
    target.style.height = `${target.scrollHeight}px`;
    if (!target.value) {
      target.style.height = '45px';
    }
  };

  const openNote = () => {
    const note = noteRef.current.classList;
    if (note.contains('note--closed')) {
      note.add('note--opened');
      note.remove('note--closed');
      noteOverlayRef.current.classList.remove('note__overlay--close');
    }
  };
  const closeNote = async ({ target }) => {
    if (
      target.classList.contains('note__overlay') ||
      target.classList.contains('note__footer__closebtn')
    ) {
      noteRef.current.classList.add('note--closed');
      noteRef.current.classList.remove('note--opened');
      noteOverlayRef.current.classList.add('note__overlay--close');

      if (status === 'note' || status === 'archive') {
        const originalData = {
          title,
          pinned,
          content,
          label: noteLabels
        };
        // Get note data to update
        const noteId = noteRef.current.getAttribute('data-note-id');

        const payload = {
          label: noteLabel.data,
          pinned: pinimgRef.current
            .getAttribute('data-imgname')
            .includes('pin_fill'),
          title: titleTextRef.current.textContent,
          content: contentTextRef.current.textContent
        };

        if (!_.isEqual(originalData, payload)) {
          // Make the update
          updateLocal(noteId, payload);
          await request('put', `api/note/${noteId}`, payload);
        }
      }
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

  const updateNoteStatus = async status => {
    const noteId = noteRef.current.getAttribute('data-note-id');
    const payload = {
      status
    };
    updateLocal(noteId, payload);
    await request('put', `api/note/${noteId}`, payload);
    fetchData();
  };
  const restoreNote = () => {
    updateNoteStatus('note');
  };
  const archiveNote = () => {
    updateNoteStatus('archive');
  };
  const trashNote = () => {
    updateNoteStatus('trash');
  };

  const handleTextareaChange = ({ target }) => {
    if (target.classList.contains('note__head__titletext')) {
      setTitleTextState(target.value);
    }
    if (target.classList.contains('note__body__content__textarea')) {
      setContentTextState(target.value);
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

  const handleLabelModalListItemClick = () => {
    const checkbox = createLabelCheckbox.current;
    checkbox.classList.toggle('checked');
    const value = checkbox.getAttribute('value');
    const { data } = noteLabel;

    if (checkbox.classList.contains('checked')) {
      data.push(value);
      setNoteLabel({
        data
      });
    } else {
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

  useEffect(() => {
    // Autogrow notes after filling in content
    autoGrowAfterPopulate(titleTextRef.current);
    autoGrowAfterPopulate(contentTextRef.current);
    return () => {};
  });

  const labelModalListItems = allNoteLabels.map((d, i) => {
    // This function add checked class to the checkbox if the note has that label
    const m = _.find(noteLabel.data, i => (i === d ? d : undefined));
    if (m) {
      return (
        <li key={i}>
          <div className='label' onClick={handleLabelModalListItemClick}>
            <div
              value={d}
              ref={createLabelCheckbox}
              className='checkbox checked'
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
      onClick={closeNote}
      ref={noteOverlayRef}
    >
      <div
        ref={noteRef}
        data-note-id={id}
        onClick={openNote}
        className='note note--closed'
      >
        <div className='note__head'>
          <textarea
            data-autoresize
            spellCheck='false'
            onFocus={openNote}
            ref={titleTextRef}
            placeholder='Title'
            value={titleTextState}
            onChange={handleTextareaChange}
            className='note__head__titletext textarea--mod'
          ></textarea>
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
            <textarea
              data-autoresize
              spellCheck='false'
              onFocus={openNote}
              placeholder='Note'
              ref={contentTextRef}
              value={contentTextState}
              onChange={handleTextareaChange}
              className='note__body__content__textarea textarea--mod'
            ></textarea>
            <div className='note__body__content__label'>
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
                  onClick={archiveNote}
                  className='note__body__controls__item__image'
                />
              ) : (
                undefined
              )}
              <div
                data-img
                data-imgname='trash'
                onClick={trashNote}
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
        </div>
        <div className='note__footer'>
          {status === 'trash' ? (
            <button className='note__footer__closebtn' onClick={deleteNote}>
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
