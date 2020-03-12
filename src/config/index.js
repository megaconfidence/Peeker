export default function(baseApi, cloudinaryUploadPreset) {
  return {
    api: `${baseApi}`,
    isProduction: true,
    isDevelopment: false,
    cloudinaryUploadPreset
  };
}
