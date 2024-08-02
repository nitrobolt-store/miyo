const { XMLDoc, XMLNode } = require('./xml.js');
const fs = require('fs').promises;
const path = require('path');

const xmlFile = 'files.txt';
const xmlPath = `./site/${xmlFile}`;

async function walk(dir) {
    let files = await fs.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

walk('./site').then(async (files) => {
  let file = true;
  const map = new XMLDoc();
  while (file = files.shift()) {
    const node = new XMLNode('x-file');
    node.attrs['path'] = file.replace('site/', '');
    map.appendChild(node);
  }
  try {
    await (fs.stat(xmlPath).catch((err) => {}).then((stats) => {
    fs.unlink(xmlPath).catch((err) => {}).then(() => console.log(`Deleted existing ${xmlFile} succesfully.`)).finally();
    }));
  } catch {
  } finally {
    fs.writeFile(xmlPath, map.toString(), 'utf8').catch((err) => console.error(`Failed to write ${xmlFile}\n`, err)).then(() => console.log(`Wrote ${xmlFile}`));
  }
});
