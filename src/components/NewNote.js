import './Notes.css';
import './NewNote.css';
import response from '../helpers';
import React, { useRef, useState, useEffect } from 'react';
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

  const createLabelOverlay = useRef(null);
  const createNewLabel = useRef(null);
  useEffect(() => {
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

  const openNote = () => {
    noteRef.current.classList.remove('nwnote--closed');
  };
  const closeNote = async () => {
    noteRef.current.classList.add('nwnote--closed');
    const noteTitle = titleTextRef.current.value;
    const noteContent = contentTextRef.current.value;
    const pinned = pinimgRef.current
      .getAttribute('data-imgname')
      .includes('pin_fill');
    const labels = noteLabelArr.data;

    if (!createLabelOverlay.current.classList.contains('hide')) {
      createLabelOverlay.current.classList.add('hide');
    }

    // Reset the fields
    titleTextRef.current.value = '';
    contentTextRef.current.value = '';
    setNoteLabelArr({
      data: []
    });
    titleTextRef.current.style.height = '45px';
    contentTextRef.current.style.height = '45px';
    if (pinned) {
      pinimgRef.current.setAttribute('data-imgname', 'pin');
    }

    if (noteTitle || noteContent || labels.length) {
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
    const src = target.getAttribute('data-imgname');
    if (src.includes('pin_fill')) {
      target.setAttribute('data-imgname', src.split('pin_fill').join('pin'));
    } else {
      target.setAttribute('data-imgname', src.split('pin').join('pin_fill'));
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
    createLabelOverlay.current.classList.toggle('hide');
  };
  const handleCreateLabelOverlayClick = e => {
    createLabelOverlay.current.classList.toggle('hide');
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
          data-autoresize
          ref={titleTextRef}
        ></textarea>
        <div
          data-img
          data-imgname='pin'
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
            data-autoresize
            onFocus={openNote}
            ref={contentTextRef}
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
        </div>
        <div className='note__body__controls'>
          <div className='note__body__controls__item'>
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
                    Create &nbsp;
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
