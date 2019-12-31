import environment from './index';
const baseApi = 'https://cors-anywhere.herokuapp.com/https://peek-db.herokuapp.com';
const env = environment(baseApi);
export default {
  ...env
};
