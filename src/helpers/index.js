import axios from 'axios';
import config from 'environment';
import colorLog from './colorLog'
export default async (method, url, payload) => {
  const token = localStorage.getItem('PEEKER_TOKEN');

  try {
    const res = await axios({
      method,
      url: `${config.api}/${url}`,
      headers: {
        authorization: token
      },
      data: payload
    });

    return res;
  } catch (err) {
    colorLog('Request not successful', 'error');

  }
};
