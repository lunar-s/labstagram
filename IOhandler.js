const yauzl = require("yauzl-promise"),
  fs = require("fs"),
  { pipeline } = require("stream/promises");
const path = require("path");
// const pathUnzipped = path.join(__dirname, "unzipped");
// const pathProcessed = path.join(__dirname, "processed_images");

async function unzip(zipFilePath, pathUnzipped) {
  const zip = await yauzl.open(zipFilePath);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.promises.mkdir(`${pathUnzipped}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathUnzipped}/${entry.filename}`
        );
        await pipeline(readStream, writeStream);
      }
    }
  } catch (err) {
    if (err.code == "EEXIST") {
      console.log("Some folders already unzipped! Skipping...");
    }
  } finally {
    await zip.close();
    console.log("Unzipping successful!");
  }
}

function readDir(pathUnzipped) {
  photos = [];
  return new Promise((res, rej) => {
    fs.readdir(pathUnzipped, (err, files) => {
      if (err) {
        rej(err);
      } else
        for (let f in files) {
          if (path.extname(files[f]) === ".png") {
            photos.push(files[f]);
          }
        }
      res(photos);
    });
  });
}

async function makeDir(pathUnzipped, pathProcessed) {
  fs.promises
    .mkdir(pathUnzipped)
    .then(function () {
      console.log(`Directory "unzipped" created!`);
    })
    .catch(function () {
      console.log(
        `Failed to create directory "unzipped" or already exists!`
      );
    });
  fs.promises
    .mkdir(pathProcessed)
    .then(function () {
      console.log(`Directories "processed_images" created!`);
    })
    .catch(function () {
      console.log(
        `Failed to create directory "processed_images" or already exists!`
      );
    });
}

module.exports = {
  unzip,
  readDir,
  makeDir,
};
