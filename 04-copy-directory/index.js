const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.rm(destinationFolder, { recursive: true, force: true });
    console.log('Directory removed');

    await fs.mkdir(destinationFolder, { recursive: true });
    console.log('Directory created:', destinationFolder);

    const files = await fs.readdir(folderPath);
    console.log('List of files:', files);

    for (let file of files) {
      const sourcePath = path.join('./files', file);
      const destinationPath = path.join('./files-copy', file);

      await fs.copyFile(sourcePath, destinationPath);
      console.log(`File copied: ${file}`);
    }
  } catch (error) {
    console.error('Error', error.message);
  }
}

copyDirectory();
