const { Worker } = require("worker_threads");

function runService(workerData, choice) {
  return new Promise((resolve, reject) => {
    const workers = [];
    workerData.forEach((file) => {
      const worker = new Worker("./worker.js", {
        workerData: { file, choice },
      });
      // console.log(`Creating worker for file: ${file}`);
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
        // else console.log(`Worker exited with code ${code}.`);
      });
      workers.push(worker);
    });
  });
}

async function applyFilter(choice) {
  const result = await runService(photos, choice);
  console.log(result);
}

module.exports = {
  applyFilter,
};
