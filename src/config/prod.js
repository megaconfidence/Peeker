import environment from './index';
const baseApi = 'https://peeker-api.herokuapp.com';
const env = environment(baseApi);
export default {
  ...env
};
