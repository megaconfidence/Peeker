import React, { useState, useRef, forwardRef } from 'react';
import './LabelModal.css';

const LabelModal = forwardRef(
  (
    {
      allLabels,
      oldNoteLabel,
      fromNewNote,
      labelModalOpenCLose,
      updateNoteLabelAndStatus
    },
    ref
  ) => {
    const createNewLabel = useRef(null);
    const [noteLabel, setNoteLabel] = useState({
      data: oldNoteLabel
    });
    const [labels, setLabels] = useState(allLabels);
    const [labelSearchbox, setLabelSearchbox] = useState('');
    const [tempLabels, setTempLabels] = useState({ data: labels });

    if (fromNewNote) {
      tempLabels.data = allLabels;
    }

    const handleLabelSearchboxChange = ({ target: { value } }) => {
      const matchArr = [];
      let isAnyMatch = false;
      setLabelSearchbox(value);

      if (value) {
        tempLabels.data.forEach(d => {
          if (d.includes(value)) {
            isAnyMatch = true;
            matchArr.push(d);
            setTempLabels({ data: matchArr });
          }
        });

        if (!isAnyMatch) {
          setTempLabels({ data: [] });
          labels.forEach(d => {
            if (d.includes(value)) {
              setTempLabels({ data: [d] });
            }
          });
        }

        if (!isAnyMatch) {
          createNewLabel.current.classList.remove('hide');
        }
      } else {
        createNewLabel.current.classList.add('hide');
        setTempLabels({ data: allLabels });
      }
    };

    const handleLabelModalListItemClick = ({ target }) => {
      let checkbox;
      if (target.classList.contains('text')) {
        checkbox = target.parentElement.childNodes[0];
      } else if (target.classList.contains('checkbox')) {
        checkbox = target;
      } else if (target.classList.contains('label')) {
        checkbox = target.childNodes[0];
      }

      checkbox.classList.toggle('checked');
      const value = checkbox.getAttribute('value');
      const { data } = noteLabel;

      if (checkbox.classList.contains('checked')) {
        data.push(value);
        setNoteLabel({
          data
        });
        updateNoteLabelAndStatus(data, true);
      } else {
        const i = data.findIndex(d => d === value);
        data.splice(i, 1);
        setNoteLabel({
          data
        });
        updateNoteLabelAndStatus(data, true);
      }
    };

    const handleCreateNewLabel = () => {
      createNewLabel.current.classList.add('hide');
      let { data } = noteLabel;

      data.push(labelSearchbox);
      setNoteLabel({
        data
      });
      updateNoteLabelAndStatus(data, true);

      data = labels;
      data.push(labelSearchbox);

      setLabels(data);
      setLabelSearchbox('');
      // remove duplicates
      data = [...new Set(allLabels.concat(data))];
      setTempLabels({ data });
    };

    return (
      <div
        ref={ref}
        onClick={labelModalOpenCLose}
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
              <ul>
                {tempLabels.data.map((d, i) => {
                  return (
                    <li key={i}>
                      <div
                        className='label'
                        onClick={handleLabelModalListItemClick}
                      >
                        <div
                          value={d}
                          className={`checkbox ${
                            noteLabel.data.indexOf(d) > -1 ? 'checked' : ''
                          }`}
                        ></div>
                        <span className='text'>{d}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
            <span>Create</span>
            <span className='label__modal__createlabel__text'>
              "{labelSearchbox}"
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default LabelModal;
