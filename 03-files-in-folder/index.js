const fs = require('fs');
const path = require('path');

async function listOfFiles() {
  // absolute path
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    // read data from the folder
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    // files = arr of obj
    for (const file of files) {
      // check if each object is file
      if (file.isFile()) {
        //create absolute path to each file
        const filePath = path.join(folderPath, file.name);
        // get data about each file
        const stats = await fs.promises.stat(filePath);
        // get name and ext from file name
        const { name, ext } = path.parse(file.name);
        const fileSize = stats.size;
        // convert size to kb
        const fileSizeInKb = (fileSize / 1024).toFixed(3);
        console.log(`${name} - ${ext.slice(1)} - ${fileSizeInKb}kb`);
      }
    }
  } catch (error) {
    console.error('Error while reading directory');
  }
}
listOfFiles();
