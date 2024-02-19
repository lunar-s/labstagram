const path = require("path");
const { userInput } = require("./userInput");
const { unzip, readDir, makeDir } = require("./IOhandler");
const { applyFilter } = require("./CPUhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "processed_images");

async function main() {
  await makeDir(pathUnzipped, pathProcessed);
  await unzip(zipFilePath, pathUnzipped);
  await readDir(pathUnzipped);
  let choice = await userInput();
  await applyFilter(choice).catch((err) => console.error(err));
}

main();
