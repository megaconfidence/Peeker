const testFolder = './';
const fs = require('fs');

const arr = [];
(async () => {
  fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      arr.push('/image/' + file);
    });
    console.log(arr);
  });
})();
