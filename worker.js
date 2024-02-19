const { workerData, parentPort } = require("worker_threads");
const fs = require("fs").promises;
const { createReadStream, createWriteStream } = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "processed_images");

createReadStream(`${pathUnzipped}/${workerData.file}`)
  .pipe(
    new PNG({
      // colorType: 0,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        if (workerData.choice == "1") {
          const grey =
            0.299 * this.data[idx] +
            0.587 * this.data[idx + 1] +
            0.114 * this.data[idx + 2];
          this.data[idx] = grey;
          this.data[idx + 1] = grey;
          this.data[idx + 2] = grey;
        } else if (workerData.choice == "2") {
          let sepiaRed =
            0.393 * this.data[idx] +
            0.769 * this.data[idx + 1] +
            0.189 * this.data[idx + 2];
          if (sepiaRed > 255) {
            sepiaRed = 255;
          }
          let sepiaGreen =
            0.349 * this.data[idx] +
            0.686 * this.data[idx + 1] +
            0.168 * this.data[idx + 2];
          if (sepiaGreen > 255) {
            sepiaGreen = 255;
          }
          let sepiaBlue =
            0.272 * this.data[idx] +
            0.534 * this.data[idx + 1] +
            0.131 * this.data[idx + 2];
          if (sepiaBlue > 255) {
            sepiaBlue = 255;
          }
          this.data[idx] = sepiaRed;
          this.data[idx + 1] = sepiaGreen;
          this.data[idx + 2] = sepiaBlue;
        }
      }
    }
    this.pack().pipe(
      createWriteStream(`${pathProcessed}/${workerData.file}`)
    );
  });

parentPort.postMessage("Filters applied successfully!");
