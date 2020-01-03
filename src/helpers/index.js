import axios from 'axios';
import config from 'environment';
export default async (method, url, payload) => {
  const res = await axios({
    method,
    url: `${config.api}/${url}`,
    headers: {
      authorization: localStorage.getItem('PEEKER_TOKEN')
    },
    data: payload
  });

  return res;
};
