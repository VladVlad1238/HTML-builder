const fs = require('fs');
const path = require('path');

const destinationFolder = path.join(__dirname, 'project-dist');
const newAssetsFolder = path.join(__dirname, 'project-dist', 'assets');
const assetsSourceFolder = path.join(__dirname, 'assets');
const componentsFolder = path.join(__dirname, 'components');
const styleFolder = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const indexHTMLFile = path.join(destinationFolder, 'index.html');
const styleCssFile = path.join(destinationFolder, 'style.css');

function buildPage() {
  fs.mkdir(destinationFolder, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readFile(templatePath, { encoding: 'utf-8' }, (err, template) => {
      if (err) throw err;

      const regex = /{{\s*(\w+)\s*}}/g;
      const matches = [...template.matchAll(regex)];
      let numberOfReplacement = matches.length;

      if (numberOfReplacement === 0) {
        fs.writeFile(indexHTMLFile, template, (err) => {
          if (err) throw err;
          console.log('Nothing to change');
        });
        return;
      }

      matches.forEach((match) => {
        const tagName = match[1];
        const componentPath = path.join(componentsFolder, `${tagName}.html`);

        fs.readFile(componentPath, { encoding: 'utf-8' }, (err, content) => {
          if (err) {
            console.error(`Component does not exist ${err.message}`);
            content = '';
            console.log(content);
          }

          template = template.replace(match[0], content);
          numberOfReplacement -= 1;

          if (numberOfReplacement === 0) {
            fs.writeFile(indexHTMLFile, template, (err) => {
              if (err) throw err;
              console.log('Index.html is created');
            });
          }
        });
      });
    });
  });

  addStyles();
}

function addStyles() {
  fs.readdir(styleFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    const filteredCssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const ws = fs.createWriteStream(styleCssFile);

    filteredCssFiles.forEach((file, index) => {
      const filePath = path.join(styleFolder, file.name);

      const rs = fs.createReadStream(filePath, 'utf-8');
      rs.pipe(ws, { end: false });

      rs.on('end', () => {
        if (index === filteredCssFiles.length - 1) {
          ws.end();
        }
      });
      rs.on('error', (err) => console.error(err.message));
    });
    console.log('Style.css was created');
  });
}

function createAssetsFolder(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(src, { withFileTypes: true }, (err, entries) => {
      if (err) throw err;

      entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          createAssetsFolder(srcPath, destPath);
        } else if (entry.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) throw err;
            console.log('Files was copied');
          });
        }
      });
    });
  });
}
createAssetsFolder(assetsSourceFolder, newAssetsFolder);

buildPage();
