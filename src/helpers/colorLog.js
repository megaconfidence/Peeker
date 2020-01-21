export default (message, color) => {
  color = color || 'black';

  switch (color) {
    case 'success':
      color = 'Green';
      break;
    case 'info':
      color = 'DodgerBlue';
      break;
    case 'error':
      color = 'Red';
      break;
    case 'warning':
      color = 'Orange';
      break;
    default:
      color = 'black'
  }

  console.log(
    `%cpeeker%c  ${message}`,
    'background: #2b2d2f; color: #fff; padding: 2px 3px 2px 4px; border-radius: 5px; font-weight: bold;',
    `color: ${color}; font-weight: bold;`
  );
};
