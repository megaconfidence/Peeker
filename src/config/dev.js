import environment from './index';
const baseApi = 'http://localhost:3000';
const cloudinaryUploadPreset = 'peeker_dev';
const env = environment(baseApi, cloudinaryUploadPreset);
export default {
  ...env,
  isProduction: false,
  isDevelopment: true
};
