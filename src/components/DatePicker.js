import React, { useState, forwardRef } from 'react';
import './DatePicker.css';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useSnackbar } from 'notistack';

const DatePicker = forwardRef(({ value, due }, ref) => {
  const [selectedDate, handleDateChange] = useState(due || new Date());
  const { enqueueSnackbar } = useSnackbar();

  const closeModal = calledFrom => {
    ref.current.classList.toggle('hide');
    if (calledFrom === 'save') {
      if (moment(selectedDate).isSameOrAfter(moment().format())) {
        enqueueSnackbar('Reminder set')
        value(selectedDate);
      } else {
        ref.current.classList.toggle('hide');
        enqueueSnackbar('Invalid time');
      }
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
            <DateTimePicker
              disablePast
              value={selectedDate}
              onChange={handleDateChange}
            />
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
