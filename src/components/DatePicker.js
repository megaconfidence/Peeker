import React, { useState, forwardRef } from 'react';
import './DatePicker.css';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useSnackbar } from 'notistack';
import colorLog from '../helpers/colorLog';

const DatePicker = forwardRef(({ value, due, allowNotifSBKey }, ref) => {
  const [selectedDate, handleDateChange] = useState(due || new Date());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const closeModal = async calledFrom => {
    ref.current.classList.toggle('hide');
    if (allowNotifSBKey) {
      closeSnackbar(allowNotifSBKey);
    }
    if (calledFrom === 'save') {
      if (moment(selectedDate).isSameOrAfter(moment().format())) {
        const isPermitted = await enableNotifications();
        if (isPermitted) {
          enqueueSnackbar('Reminder set');
          value(selectedDate);
        } else {
          enqueueSnackbar('Reminder not set. Please allow notifications');
        }
      } else {
        ref.current.classList.toggle('hide');
        enqueueSnackbar('Invalid time');
      }
    }
  };

  const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const enableNotifications = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'denied') {
        return false;
      } else {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.REACT_APP_webPush_publicKey
            )
          });

          localStorage.setItem(
            'PEEKER_SUBSCRIPTION',
            JSON.stringify(subscription)
          );
          colorLog('Subscription registered', 'success');
        } catch (e) {
          colorLog('Subscription registration failed', 'error');
        }

        if (Notification.permission === 'granted') {
          localStorage.setItem('PEEKER_NOTIFICATION_ISPERMITTED', true);

          return true;
        } else {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            localStorage.setItem('PEEKER_NOTIFICATION_ISPERMITTED', true);
            colorLog('Notificaiton granted', 'success');
            return true;
          } else {
            return false;
          }
        }
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
