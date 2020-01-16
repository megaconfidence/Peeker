import React, { useState, forwardRef, useRef } from 'react';
import './DatePicker.css';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const DatePicker = forwardRef(({ value, due }, ref) => {
  const [selectedDate, handleDateChange] = useState(due || new Date());


  const closeModal = calledFrom => {
    ref.current.classList.toggle('hide');
    if (calledFrom === 'save') {
      value(selectedDate);
    }
  };
  return (
    <div className='dpwrapper hide' ref={ref} onClick={closeModal}>
      <div
        className='dpwrapper__modal'
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className='dpwrapper__modal__head'>Pick date & time</div>
        <div className='dpwrapper__modal__body'>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker value={selectedDate} onChange={handleDateChange} />
          </MuiPickersUtilsProvider>
        </div>
        <div className='dpwrapper__modal__footer'>
          <div className='dpwrapper__modal__btn' onClick={closeModal}>
            Cancel
          </div>
          <div
            className='dpwrapper__modal__btn'
            onClick={() => {
              closeModal('save');
            }}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
});

export default DatePicker;
