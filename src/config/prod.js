import environment from './index';
const baseApi = 'https://peeker-api.herokuapp.com';
const cloudinaryUploadPreset = 'peeker';
const env = environment(baseApi, cloudinaryUploadPreset);
export default {
  ...env
};
