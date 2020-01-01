import environment from './index';
const baseApi = 'https://peek-db.herokuapp.com';
const env = environment(baseApi);
export default {
  ...env
};
