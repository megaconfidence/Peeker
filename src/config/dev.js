import environment from './index';
const baseApi = 'http://localhost:3000';
const env = environment(baseApi);
export default {
  ...env,
  isProduction: false,
  isDevelopment: true
};
